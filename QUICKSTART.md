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

ต้องมี **Python 3.11+** และ **Node.js 20.19+**

```bash
# ติดตั้ง (ครั้งแรกครั้งเดียว)
py -3.11 -m pip install -r api/requirements.txt
cd web && npm install && cd ..

# Terminal 1: API  -> http://127.0.0.1:8000/docs
py -3.11 -m uvicorn api.main:app --reload

# Terminal 2: หน้าเว็บ -> http://localhost:5173
cd web
npm run dev
```

`/report` ในเครื่องต้องมีไฟล์ `api/serviceAccountKey.json` — ขอจากต้นกล้าทางแชทส่วนตัว (**ห้ามขึ้น GitHub**)

## เช็กในเครื่องก่อน push

```bash
cd web
npm run dev      # เปิด http://localhost:5173 ดูหน้าตา
npm run build    # ถ้าผ่านไม่มี error ค่อย push
```

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
- รายละเอียดเพิ่ม: `api/README.md`, `web/README.md`, `DEPLOY.md`
