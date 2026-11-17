# 🚀 Quick Start — อ่านไฟล์นี้ก่อนทำต่อ

## 🔗 ลิงก์

| อะไร | ลิงก์ |
|---|---|
| หน้าเว็บ (ส่งให้คนอื่นใช้) | https://message-scam-detector.vercel.app |
| API + หน้าลองยิง API | https://projectscamdetec.onrender.com/docs |
| GitHub | https://github.com/CurveQz/ProjectScamDetec |
| Firebase (ดูข้อความที่ผู้ใช้ส่งมา) | https://console.firebase.google.com → โปรเจค **NLP-ML** → Firestore → `reports` |
| Render (เซิร์ฟเวอร์ API) | https://dashboard.render.com → `ProjectScamDetec` |
| Vercel (เซิร์ฟเวอร์หน้าเว็บ) | https://vercel.com → `message-scam-detector` |

> บัญชี Render / Vercel / Firebase เป็นของ **ต้นกล้า** — ถ้าต้อง deploy หรือแก้ค่าบนเว็บพวกนี้ ให้บอกต้นกล้า

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
