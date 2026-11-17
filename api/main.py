"""
FastAPI สำหรับโปรเจคคัดแยก SMS

Endpoint:
  POST /predict  รับข้อความ SMS -> คืนผลว่าเป็นข้อความปกติหรือมิจฉาชีพ + หมวดย่อย + คำแนะนำ
  POST /report   ผู้ใช้ส่งข้อความพร้อมบอกหมวดที่ถูกต้อง -> เก็บลง Firebase รอทีมคัดกรอง

วิธีรัน (อยู่ในโฟลเดอร์ ProjectScamDetec):
  uvicorn api.main:app --reload
แล้วเปิด http://127.0.0.1:8000/docs เพื่อลองยิง API ได้เลย
"""
import sys
from pathlib import Path

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from api.firebase_db import save_report
from api.labels import GROUPS, SUB_GROUPS

# ---------------------------------------------------------------------------
# 1) โหลดโมเดล (ทำครั้งเดียวตอนเปิด server)
#    sms_model.joblib และ sms_pipeline.py อยู่ที่โฟลเดอร์หลักของ repo (ทีมโมเดลสร้างจาก main.ipynb)
# ---------------------------------------------------------------------------
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))
from sms_pipeline import predict_sms  # noqa: E402  (ต้อง import หลังเพิ่ม path)

_bundle = joblib.load(ROOT / "sms_model.joblib")
VECTORIZER = _bundle["vectorizer"]
MODELS = _bundle["models"]

# ---------------------------------------------------------------------------
# 2) สร้างแอป + อนุญาตให้หน้าเว็บ React (localhost:3000) เรียก API ได้ (CORS)
# ---------------------------------------------------------------------------
app = FastAPI(title="SMS Scam Detector API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# 3) รูปแบบข้อมูลที่รับเข้า/ส่งออก (Pydantic จะตรวจให้อัตโนมัติ ถ้าผิดจะตอบ error 422)
# ---------------------------------------------------------------------------
class PredictRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=2000, examples=["รับเครดิตฟรี 300 สมัครวันนี้ ไลน์ @bet789"])

    @field_validator("text")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("ข้อความต้องไม่ว่าง")
        return v


class PredictResponse(BaseModel):
    text: str
    group: str                    # positive / negative
    group_th: str                 # ข้อความปกติ / ข้อความมิจฉาชีพ
    group_confidence: float       # 0-1
    sub_group: str                # เช่น invite, otp
    sub_group_th: str             # ชื่อหมวดภาษาไทย
    sub_group_confidence: float   # 0-1
    risk_level: str               # ปลอดภัย / เสี่ยง
    advice: str                   # คำแนะนำสำหรับผู้ใช้


class ReportRequest(PredictRequest):
    group: str = Field(..., examples=["negative"])
    sub_group: str = Field(..., examples=["invite"])


class ReportResponse(BaseModel):
    id: str           # id ของเอกสารใน Firestore
    message: str


# ---------------------------------------------------------------------------
# 4) Endpoint
# ---------------------------------------------------------------------------
def run_model(text: str) -> PredictResponse:
    """เรียกโมเดลแล้วเติมชื่อไทย / ระดับความเสี่ยง / คำแนะนำ"""
    result = predict_sms(text, VECTORIZER, MODELS)
    grp = GROUPS[result["group"]]
    sub = SUB_GROUPS.get(result["sub_group"], {"name_th": result["sub_group"], "advice": ""})
    return PredictResponse(
        text=text,
        group=result["group"],
        group_th=grp["name_th"],
        group_confidence=result["group_confidence"],
        sub_group=result["sub_group"],
        sub_group_th=sub["name_th"],
        sub_group_confidence=result["sub_group_confidence"],
        risk_level=grp["risk_level"],   # คิดจาก group อย่างเดียว
        advice=sub["advice"],
    )


@app.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    """ตรวจข้อความ SMS 1 ข้อความ"""
    return run_model(req.text)


@app.post("/report", response_model=ReportResponse, status_code=201)
def report(req: ReportRequest):
    """ผู้ใช้ส่งข้อความพร้อม group/sub_group ที่ถูกต้อง -> เก็บลง Firebase รอทีมคัดกรอง"""
    # ตรวจว่า group และ sub_group ถูกต้องและเข้าคู่กัน
    if req.group not in GROUPS:
        raise HTTPException(400, f"group ต้องเป็น {list(GROUPS)}")
    if SUB_GROUPS.get(req.sub_group, {}).get("group") != req.group:
        allowed = [k for k, v in SUB_GROUPS.items() if v["group"] == req.group]
        raise HTTPException(400, f"sub_group ของ {req.group} ต้องเป็น {allowed}")

    # เก็บผลที่โมเดลทายไว้ด้วย ทีมจะได้เห็นว่าโมเดลทายผิดตรงไหน
    pred = run_model(req.text)
    try:
        doc_id = save_report({
            "text": req.text,
            "group": req.group,
            "sub_group": req.sub_group,
            "predicted_group": pred.group,
            "predicted_sub_group": pred.sub_group,
            "predicted_confidence": pred.group_confidence,
        })
    except Exception as e:  # เช่น ไม่มีไฟล์ key หรือไม่มีอินเทอร์เน็ต
        raise HTTPException(503, f"บันทึกลง Firebase ไม่สำเร็จ: {e}")

    return ReportResponse(id=doc_id, message="ขอบคุณที่ช่วยส่งข้อความ ทีมจะตรวจสอบก่อนนำไปใช้")
