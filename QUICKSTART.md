# 🚀 Quick Start — อ่านไฟล์นี้ก่อนทำต่อ

## 🔗 ลิงก์

**เปิดได้ทุกคน**

| อะไร | ลิงก์ |
|---|---|
| หน้าเว็บ (ส่งให้คนอื่นใช้) | https://message-scam-detector.vercel.app |
| API + หน้าลองยิง API | https://projectscamdetec.onrender.com/docs |
| GitHub (โค้ด + แท็บ Actions ดูสถานะ deploy) | https://github.com/CurveQz/ProjectScamDetec |

**เฉพาะต้นกล้า** (บัญชีส่วนตัว — คนอื่นกดเข้าไปจะเจอหน้า login หรือหน้าบัญชีของตัวเองที่ว่างเปล่า)

| อะไร | ลิงก์ |
|---|---|
| Firebase (ข้อความที่ผู้ใช้ส่งมา) | https://console.firebase.google.com → โปรเจค **NLP-ML** → Firestore → `reports` |
| Render (เซิร์ฟเวอร์ API) | https://dashboard.render.com → `ProjectScamDetec` |
| Vercel (เซิร์ฟเวอร์หน้าเว็บ) | https://vercel.com → `message-scam-detector` |

> ไม่ต้องเข้า 3 เว็บนี้เพื่อ deploy — push ขึ้น GitHub แล้วระบบ deploy ให้เอง
> ถ้าอยากดูข้อมูลใน Firebase ให้ต้นกล้าเพิ่มอีเมลให้ (Firebase → Project settings → Users and permissions)

## 📁 ใครแก้ตรงไหน

| โฟลเดอร์/ไฟล์ | คืออะไร |
|---|---|
| `main.ipynb`, `sms_model.joblib`, `sms_pipeline.py` | โมเดล (ทีมโมเดล) |
| `api/` | FastAPI |
| `web/` | หน้าเว็บ React — ทีม UX/UI แก้ที่ `web/src/index.css`, `web/src/pages/`, `web/src/components/` |
| `row_data/<ชื่อ>/` | ข้อมูลดิบของแต่ละคน |

## 💻 รันในเครื่อง

**ทีมหน้าเว็บ (UX/UI)** — ต้องมีแค่ **Node.js 20.19+** ไม่ต้องรัน Python ไม่ต้องมี key

1. สร้างไฟล์ `web/.env.local` (ใน VS Code: คลิกขวาโฟลเดอร์ `web` → New File) ใส่บรรทัดนี้ แล้ว Save
   ```
   VITE_API_URL=https://projectscamdetec.onrender.com
   ```
2. รัน
   ```bash
   cd web
   npm install
   npm run dev        # -> http://localhost:5173
   ```

> ⚠️ ปุ่ม "ส่งข้อความ" ในหน้า `/report` จะบันทึกลง Firebase ตัวจริง — ทดสอบได้ แต่ส่งข้อความทดสอบเท่าที่จำเป็น

**ทีมที่แก้ API / โมเดล** — ต้องมี **Python 3.11+**

```bash
py -3.11 -m pip install -r api/requirements.txt
py -3.11 -m uvicorn api.main:app --reload     # -> http://127.0.0.1:8000/docs
```

`/predict` ใช้ได้เลยโดยไม่ต้องมี key ส่วน `/report` ในเครื่องจะตอบ 503 (ไม่มี key Firebase) — ปกติ ไม่ต้องขอ key
ถ้าจำเป็นต้องทดสอบ `/report` ให้ทดสอบกับ API บน Render แทน

## ⬆️ อัปโหลดงาน — push แล้วเว็บอัปเดตเอง

```bash
git pull
git add <โฟลเดอร์ที่แก้>      # เช่น git add web  (อย่าใช้ git add . จะติด __pycache__)
git commit -m "อธิบายว่าแก้อะไร"
git push
```

push เข้า `main` แล้ว **GitHub Actions จะ deploy ให้อัตโนมัติ** (ดูสถานะที่แท็บ **Actions** บน GitHub)

| แก้อะไร | อะไรอัปเดต | รอประมาณ |
|---|---|---|
| `web/` | หน้าเว็บบน Vercel | 1 นาที |
| `api/`, `sms_model.joblib`, `sms_pipeline.py` | API บน Render | 3–5 นาที |
| อย่างอื่น (เช่น `row_data/`, `main.ipynb`) | ไม่ deploy | – |

ถ้าขึ้นกากบาทแดง ❌ ในแท็บ Actions → กดเข้าไปดู error แล้วบอกต้นกล้า
ไฟล์ workflow อยู่ที่ `.github/workflows/` (secret 4 ตัวตั้งไว้ใน GitHub → Settings → Secrets and variables → Actions)

## ⚠️ ต้องรู้

- เซิร์ฟเวอร์ฟรี **หลับถ้าไม่มีคนใช้ 15 นาที** → เปิดเว็บทิ้งไว้ 2–3 นาทีก่อนพรีเซนต์ (รอแถบสีเหลืองหาย)
- ถ้าเปลี่ยนชื่อหมวด (sub_group) ในโมเดล ต้องแก้ 2 ที่: `api/labels.py` และ `web/src/labels.js`
- รายละเอียดเพิ่ม: `api/README.md`, `web/README.md`
