# ขึ้นเว็บจริง (ฟรี): API บน Render + หน้าเว็บบน Vercel

```
ผู้ใช้ ──> หน้าเว็บ (Vercel) ──> API + โมเดล (Render) ──> Firebase (Firestore)
```

ทำตามลำดับนี้ เพราะแต่ละขั้นต้องใช้ URL จากขั้นก่อนหน้า

1. ขึ้น API บน Render → ได้ URL ของ API
2. ขึ้นหน้าเว็บบน Vercel (ใส่ URL ของ API) → ได้ URL ของเว็บ
3. กลับไปบอก Render ว่าเว็บนี้เรียก API ได้ (CORS)

> ก่อนเริ่ม: push โค้ดล่าสุด (`api/` และ `web/`) ขึ้น GitHub ให้เรียบร้อย

---

## 1. API บน Render (ฟรี)

1. สมัคร/เข้าสู่ระบบ https://render.com
2. กด **+ New → Web Service**
3. เลือกแท็บ **Public Git Repository** แล้วใส่ `https://github.com/CurveQz/ProjectScamDetec` → **Connect**
4. ตั้งค่าตามนี้

   | ช่อง | ค่า |
   |---|---|
   | Name | `sms-scam-api` (ตั้งเองได้ จะกลายเป็นส่วนหนึ่งของ URL) |
   | Language / Runtime | `Python 3` |
   | Branch | `main` |
   | Root Directory | (เว้นว่าง) |
   | Build Command | `pip install -r api/requirements.txt` |
   | Start Command | `uvicorn api.main:app --host 0.0.0.0 --port $PORT` |
   | Instance Type | **Free** |

5. เลื่อนลงไปที่ **Environment Variables** แล้วเพิ่ม 2 ตัว

   | Key | Value |
   |---|---|
   | `PYTHON_VERSION` | `3.11.11` |
   | `FIREBASE_KEY_JSON` | เปิดไฟล์ `api/serviceAccountKey.json` ด้วย Notepad → คัดลอก**ทั้งหมด**มาวาง |

6. (ถ้ามีช่อง Advanced → Health Check Path) ใส่ `/health`
7. กด **Deploy Web Service** แล้วรอ 5–10 นาที จนขึ้น **Live**
8. คัดลอก URL ด้านบน เช่น `https://sms-scam-api.onrender.com` แล้วเปิด `.../docs` ลองยิง `/predict` ดู

**ข้อจำกัดของแผนฟรี**

- ถ้าไม่มีคนใช้ 15 นาที เซิร์ฟเวอร์จะหลับ ครั้งต่อไปต้องรอให้ตื่นประมาณ 1 นาที — **เปิดเว็บทิ้งไว้ก่อนพรีเซนต์สัก 2 นาที**
- เพราะเชื่อมแบบ Public Git Repository เวลา push โค้ดใหม่ ต้องกด **Manual Deploy → Deploy latest commit** เอง

---

## 2. หน้าเว็บบน Vercel (ฟรี)

ใช้ Vercel CLI deploy จากเครื่อง (ไม่ต้องให้เจ้าของ repo ไปผูก GitHub กับ Vercel)

```bash
cd web
npm install
npx vercel login          # เลือก Continue with GitHub หรือ Email
npx vercel                # ตอบคำถามตามด้านล่าง
```

ตอบคำถามของ `npx vercel`:

- Set up and deploy? → `Y`
- Which scope? → เลือกชื่อบัญชีของคุณ
- Link to existing project? → `N`
- Project name? → เช่น `sms-scam-detector`
- In which directory is your code located? → `./` (กด Enter)
- ระบบจะเจอว่าเป็น **Vite** เอง → Want to modify these settings? → `N`

จากนั้นตั้งที่อยู่ API แล้ว deploy จริง:

```bash
npx vercel env add VITE_API_URL production
# วาง URL ของ Render เช่น https://sms-scam-api.onrender.com (ไม่ต้องมี / ท้าย)

npx vercel --prod
```

จะได้ URL ของเว็บ เช่น `https://sms-scam-detector.vercel.app`

> ครั้งต่อไปที่แก้หน้าเว็บ แค่รัน `npx vercel --prod` ในโฟลเดอร์ `web` อีกครั้ง

---

## 3. อนุญาตให้เว็บเรียก API (CORS)

1. กลับไปที่ Render → service `sms-scam-api` → **Environment**
2. เพิ่ม `ALLOWED_ORIGINS` = URL ของเว็บบน Vercel เช่น `https://sms-scam-detector.vercel.app` (ไม่ต้องมี / ท้าย)
3. กด **Save, rebuild, and deploy**

เสร็จแล้ว เปิด URL ของ Vercel → ลองตรวจข้อความ และลองส่งข้อความเข้าระบบ แล้วดูใน Firebase ว่ามีข้อมูลเข้า

---

## ปัญหาที่อาจเจอ

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| เว็บขึ้น "เชื่อมต่อ API ไม่ได้" ตลอด | ยังไม่ได้ตั้ง `ALLOWED_ORIGINS` บน Render หรือใส่ URL ผิด (มี `/` ท้าย, ใช้ http แทน https) |
| เว็บขึ้น "กำลังเชื่อมต่อเซิร์ฟเวอร์..." นาน | Render กำลังตื่นจากการหลับ รอ 1 นาที |
| เว็บเรียก `127.0.0.1:8000` แทน Render | ตั้ง `VITE_API_URL` หลัง deploy → รัน `npx vercel --prod` ใหม่ |
| `/report` ตอบ 503 บน Render | `FIREBASE_KEY_JSON` ไม่ครบ ต้องคัดลอกทั้งไฟล์ตั้งแต่ `{` จนถึง `}` |
| Render build ไม่ผ่านที่ scikit-learn | ยังไม่ได้ตั้ง `PYTHON_VERSION` = `3.11.11` |

⚠️ ห้าม commit ไฟล์ `serviceAccountKey.json` หรือวาง key ในไฟล์ใด ๆ ใน repo — ใส่เป็น Environment Variable บน Render เท่านั้น
