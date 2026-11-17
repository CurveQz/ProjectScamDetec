# SMS Scam Detector — หน้าเว็บ (React + Vite)

โครงหน้าเว็บสำหรับเรียก FastAPI ในโฟลเดอร์ `api/` — ทีม UX/UI ปรับหน้าตาต่อได้เลย

| หน้า | path | เรียก API |
|---|---|---|
| ตรวจข้อความ | `/` | `POST /predict` |
| ส่งข้อความเข้าระบบ | `/report` | `POST /report` |

## โครงสร้างไฟล์

```
web/
├─ index.html
├─ vercel.json              ให้ Vercel เปิด /report ได้ตรง ๆ (ไม่ขึ้น 404)
├─ .env.example             ตัวอย่างตั้งค่าที่อยู่ API
└─ src/
   ├─ main.jsx              จุดเริ่มต้นของแอป
   ├─ App.jsx               แถบเมนู + กำหนดว่า path ไหนแสดงหน้าไหน
   ├─ api.js                ฟังก์ชันเรียก API ทั้งหมด (predictSms, reportSms, checkHealth)
   ├─ labels.js             รายชื่อหมวดสำหรับ dropdown (ต้องตรงกับ api/labels.py)
   ├─ index.css             สไตล์แบบโครงเปล่า — ทีม UX/UI แทนที่ได้ทั้งไฟล์
   ├─ components/
   │  ├─ ResultCard.jsx     การ์ดแสดงผลตรวจ
   │  └─ ServerStatus.jsx   แถบ "กำลังเชื่อมต่อเซิร์ฟเวอร์" (ระหว่างรอ API ตื่น)
   └─ pages/
      ├─ CheckPage.jsx      หน้าตรวจข้อความ
      └─ ReportPage.jsx     หน้าส่งข้อความเข้าระบบ
```

**สำหรับทีม UX/UI:** แก้หน้าตาได้ที่ `index.css` และ JSX ในโฟลเดอร์ `pages/` และ `components/` ได้เลย แต่อย่าแก้ `api.js` และส่วนที่เรียก `predictSms` / `reportSms` ถ้ายังไม่ได้คุยกับคนทำ API

## รันในเครื่อง

ต้องมี **Node.js 20.19 ขึ้นไป** (เช็กด้วย `node -v`)

```bash
# 1) เปิด API ไว้ก่อน (Terminal แรก ที่โฟลเดอร์ ProjectScamDetec)
py -3.11 -m uvicorn api.main:app --reload

# 2) เปิดเว็บ (Terminal ที่สอง)
cd web
npm install
npm run dev
```

เปิด http://localhost:5173

ค่าเริ่มต้นเว็บจะเรียก API ที่ `http://127.0.0.1:8000` ถ้าจะเปลี่ยน ให้คัดลอก `.env.example` เป็น `.env.local` แล้วแก้ `VITE_API_URL`

## ขึ้น Vercel

ดูขั้นตอนเต็มใน `DEPLOY.md` ที่โฟลเดอร์หลักของ repo
