# SMS Scam Detector - Landing Page

หน้าเว็บใช้ Vite เป็น static landing page พร้อมระบบสลับภาษาและโหมดแสง

## โครงสร้างไฟล์

```text
web/
├─ index.html
├─ use.html
├─ src/
│  ├─ app.js
│  └─ styles.css
├─ public/
│  └─ favicon.svg
└─ package.json
```

| ไฟล์ | หน้าที่ |
|---|---|
| `index.html` | โครงสร้างหน้าและ metadata |
| `use.html` | หน้าใช้งานตรวจข้อความ |
| `src/styles.css` | สไตล์และฟอนต์ฝังตัว |
| `src/app.js` | ข้อความภาษาไทย/อังกฤษ และการโต้ตอบ |
| `public/favicon.svg` | ไอคอนเว็บไซต์ |

## รันในเครื่อง

ต้องใช้ Node.js 20.19 หรือใหม่กว่า

```bash
cd web
npm install
npm run dev
```

เปิด http://localhost:5173

## ตรวจ build

```bash
npm run build
npm run preview
```
