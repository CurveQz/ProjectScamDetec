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

1. สร้างไฟล์ `web/.env.local` ใส่บรรทัดนี้ (ใช้ API ตัวจริงบน Render ไม่ต้องรัน Python)
   ```
   VITE_API_URL=https://projectscamdetec.onrender.com
   ```
   ถ้าจะใช้ API ที่รันในเครื่องตัวเอง ให้ใส่ `http://127.0.0.1:8000` แทน
2. รัน
   ```bash
   cd web
   npm install
   npm run dev
   ```
3. เปิด http://localhost:5173

## ขึ้นเว็บจริง

push การแก้ใน `web/` เข้า `main` → GitHub Actions deploy ขึ้น https://message-scam-detector.vercel.app ให้เอง (ประมาณ 1 นาที)

ก่อน push ควรรัน `npm run build` ให้ผ่านก่อน ถ้าเวอร์ชันใหม่ขึ้นไปแล้วพัง เจ้าของบัญชี Vercel กด **Instant Rollback** ย้อนกลับได้
