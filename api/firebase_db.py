"""
เชื่อมต่อ Firebase (Firestore) สำหรับเก็บข้อความที่ผู้ใช้ส่งมาผ่าน /report

ต้องมีไฟล์ key ของ Firebase (Service Account) ก่อน:
  Firebase Console -> Project settings -> Service accounts -> Generate new private key
  แล้วบันทึกเป็น api/serviceAccountKey.json
  (หรือตั้งตัวแปร FIREBASE_KEY_PATH ให้ชี้ไปที่ไฟล์ key)

⚠️ ห้าม push ไฟล์ key ขึ้น GitHub — ใครได้ไฟล์นี้ไปจะแก้/ลบข้อมูลใน Firebase ได้ทั้งหมด
"""
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore

KEY_PATH = Path(os.getenv("FIREBASE_KEY_PATH", Path(__file__).parent / "serviceAccountKey.json"))
COLLECTION = "reports"  # ชื่อ collection ใน Firestore ที่ใช้เก็บข้อความ

_db = None  # เก็บตัวเชื่อมต่อไว้ จะได้ไม่ต้องเชื่อมใหม่ทุกครั้ง


def get_db():
    """คืนตัวเชื่อมต่อ Firestore (เชื่อมต่อครั้งแรกตอนถูกเรียก)"""
    global _db
    if _db is None:
        if not KEY_PATH.exists():
            raise RuntimeError(f"ไม่พบไฟล์ key ของ Firebase ที่ {KEY_PATH}")
        if not firebase_admin._apps:  # กัน error "app already exists" ตอน uvicorn --reload
            firebase_admin.initialize_app(credentials.Certificate(str(KEY_PATH)))
        _db = firestore.client()
    return _db


def save_report(data: dict) -> str:
    """บันทึกข้อความ 1 รายการลง Firestore แล้วคืน id ของเอกสาร"""
    data = {**data, "status": "pending", "created_at": firestore.SERVER_TIMESTAMP}
    _, doc_ref = get_db().collection(COLLECTION).add(data)
    return doc_ref.id
