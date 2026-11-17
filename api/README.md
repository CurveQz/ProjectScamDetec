# SMS Scam Detector — FastAPI

API สำหรับหน้าเว็บ React ใช้ตรวจข้อความ SMS และรับข้อความที่ผู้ใช้ช่วยส่งมาเพิ่ม

| Endpoint | หน้าที่ |
|---|---|
| `GET /health` | เช็กว่า API ทำงานอยู่ (หน้าเว็บใช้ปลุกเซิร์ฟเวอร์บน Render) |
| `POST /predict` | ตรวจข้อความ 1 ข้อความ → ข้อความปกติหรือมิจฉาชีพ + หมวดย่อย + คำแนะนำ |
| `POST /report` | ผู้ใช้ส่งข้อความพร้อมบอก group / sub_group → เก็บลง Firebase (collection `reports`) รอทีมคัดกรอง |

API โหลด `sms_model.joblib` และ `sms_pipeline.py` จากโฟลเดอร์หลักของ repo ถ้าทีมโมเดลอัปเดตไฟล์สองตัวนี้ ให้ `git pull` แล้วรัน API ใหม่ ไม่ต้องแก้โค้ดในโฟลเดอร์นี้

## วิธีรัน

ต้องใช้ **Python 3.11 ขึ้นไป** เพราะ `sms_model.joblib` สร้างด้วย scikit-learn 1.9.1 (ใช้กับ Python 3.10 ไม่ได้)

```bash
cd ProjectScamDetec
py -3.11 -m pip install -r api/requirements.txt
py -3.11 -m uvicorn api.main:app --reload
```

เปิด http://127.0.0.1:8000/docs จะมีหน้าให้ลองยิง API ได้เลย

## ตั้งค่า Firebase (ต้องทำก่อนใช้ `/report`)

1. เข้า [Firebase Console](https://console.firebase.google.com) → สร้างโปรเจค (หรือใช้โปรเจคของทีม)
2. เมนู **Build → Firestore Database** → กด **Create database**
3. ไปที่ ⚙️ **Project settings → Service accounts** → กด **Generate new private key**
4. เปลี่ยนชื่อไฟล์ที่ได้เป็น `serviceAccountKey.json` แล้ววางไว้ในโฟลเดอร์ `api/`

> ⚠️ **ห้าม push ไฟล์ key ขึ้น GitHub** — ใส่ไว้ใน `api/.gitignore` แล้ว ถ้าเพื่อนต้องการ ให้ส่งไฟล์กันทางแชทส่วนตัว

ถ้ายังไม่มีไฟล์ key: `/predict` ใช้ได้ตามปกติ ส่วน `/report` จะตอบ error 503

## ตัวอย่างการเรียกจาก React

### ตรวจข้อความ

```js
const res = await fetch("http://127.0.0.1:8000/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: "รับเครดิตฟรี 300 สมัครวันนี้ ไลน์ @bet789" }),
});
const data = await res.json();
```

ผลลัพธ์:

```json
{
  "text": "รับเครดิตฟรี 300 สมัครวันนี้ ไลน์ @bet789",
  "group": "negative",
  "group_th": "ข้อความมิจฉาชีพ",
  "group_confidence": 0.9991,
  "sub_group": "invite",
  "sub_group_th": "ชักชวน (พนัน / เครดิตฟรี / กู้เงิน / งานออนไลน์)",
  "sub_group_confidence": 0.753,
  "risk_level": "เสี่ยง",
  "advice": "อย่ากดลิงก์หรือแอดไลน์ตามข้อความ และอย่าโอนเงินเพื่อรับรางวัลหรือเงินกู้"
}
```

- `risk_level` คิดจาก group อย่างเดียว: `negative` = เสี่ยง, `positive` = ปลอดภัย
- ค่า confidence อยู่ระหว่าง 0–1 (คูณ 100 ถ้าจะแสดงเป็น %)

### ส่งข้อความเข้าระบบ

```js
const res = await fetch("http://127.0.0.1:8000/report", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "พัสดุของท่านถึงจุดรับสินค้าแล้ว",
    group: "positive",
    sub_group: "service_notice",
  }),
});
// สำเร็จ = status 201 → { "id": "...", "message": "ขอบคุณที่ช่วยส่งข้อความ ..." }
```

ค่าที่เลือกได้ (ใช้ทำ dropdown ในหน้าเว็บ):

| group | sub_group | ชื่อไทย |
|---|---|---|
| `positive` | `promotion` | โปรโมชันและสิทธิพิเศษ |
| `positive` | `carrier_vas` | บริการเสริมค่ายมือถือ |
| `positive` | `otp` | รหัส OTP / รหัสยืนยัน |
| `positive` | `service_notice` | แจ้งเตือนบริการ |
| `positive` | `payment_alert` | แจ้งเตือนการเงิน |
| `negative` | `invite` | ชักชวน (พนัน / เครดิตฟรี / กู้เงิน / งานออนไลน์) |
| `negative` | `phishing_link` | ลิงก์หลอกขโมยข้อมูล |
| `negative` | `threat` | ข่มขู่ / แจ้งเตือนเท็จ |

ข้อมูลที่เก็บใน Firestore แต่ละรายการ: `text`, `group`, `sub_group`, `predicted_group`, `predicted_sub_group`, `predicted_confidence`, `status` (= `pending`), `created_at`

## Error ที่อาจเจอ

| status | สาเหตุ |
|---|---|
| 422 | ไม่ได้ส่ง `text` มา หรือส่งข้อความว่าง |
| 400 | `group` / `sub_group` ไม่ถูกต้อง หรือไม่เข้าคู่กัน (เช่น positive + invite) |
| 503 | บันทึกลง Firebase ไม่ได้ (ไม่มีไฟล์ key หรือไม่มีอินเทอร์เน็ต) |

## CORS

อนุญาตให้หน้าเว็บที่ `localhost:5173` (Vite) และ `localhost:3000` เรียก API ได้อยู่แล้ว ถ้าเว็บอยู่ที่อื่น (เช่น Vercel) ให้ตั้งตัวแปร `ALLOWED_ORIGINS` เป็น URL ของเว็บ (หลายอันคั่นด้วย `,`)

## ขึ้นเซิร์ฟเวอร์จริง

ดู `DEPLOY.md` ที่โฟลเดอร์หลักของ repo (API บน Render ฟรี) — บน Render ใช้ตัวแปร `FIREBASE_KEY_JSON` แทนไฟล์ key

## ไฟล์ในโฟลเดอร์นี้

| ไฟล์ | หน้าที่ |
|---|---|
| `main.py` | ตัว API (endpoint, ตรวจข้อมูลที่รับเข้า, เรียกโมเดล) |
| `labels.py` | ชื่อหมวดภาษาไทย ระดับความเสี่ยง และคำแนะนำ — ถ้าทีมเปลี่ยน sub_group ต้องแก้ไฟล์นี้ด้วย |
| `firebase_db.py` | เชื่อมต่อ Firestore และบันทึกข้อความ |
| `requirements.txt` | library ที่ต้องติดตั้ง |
