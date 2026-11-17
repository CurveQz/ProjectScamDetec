// ฟังก์ชันเรียก FastAPI ทั้งหมดอยู่ที่ไฟล์นี้ไฟล์เดียว
// ที่อยู่ API อ่านจากตัวแปร VITE_API_URL (ดู .env.example)

const API_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

// เรียก API แล้วคืนค่า JSON ถ้า error จะ throw ข้อความที่อ่านเข้าใจได้
async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new Error("เชื่อมต่อ API ไม่ได้ (เซิร์ฟเวอร์อาจกำลังเริ่มทำงาน ลองใหม่อีกครั้งใน 1 นาที)");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // FastAPI ส่ง error มาใน field "detail" (เป็นข้อความ หรือเป็นรายการ error ตอนข้อมูลไม่ถูกต้อง)
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg).join(", ") : data.detail;
    throw new Error(detail || `เกิดข้อผิดพลาด (${res.status})`);
  }
  return data;
}

// ตรวจข้อความ SMS -> { group, group_th, group_confidence, sub_group, sub_group_th, sub_group_confidence, risk_level, advice }
export function predictSms(text) {
  return request("/predict", { method: "POST", body: JSON.stringify({ text }) });
}

// ส่งข้อความพร้อมหมวดที่ถูกต้องเข้าระบบ -> { id, message }
export function reportSms({ text, group, sub_group }) {
  return request("/report", { method: "POST", body: JSON.stringify({ text, group, sub_group }) });
}

// เช็กว่า API ตื่นอยู่ไหม (เซิร์ฟเวอร์ฟรีบน Render จะหลับเมื่อไม่มีคนใช้ 15 นาที)
export function checkHealth() {
  return request("/health");
}
