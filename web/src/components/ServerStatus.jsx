import { useEffect, useState } from "react";
import { checkHealth } from "../api.js";

// แถบแจ้งสถานะ API ด้านบน
// API บน Render (แผนฟรี) จะหลับเมื่อไม่มีคนใช้ 15 นาที ครั้งแรกที่เปิดเว็บต้องรอให้ตื่นประมาณ 1 นาที
export default function ServerStatus() {
  const [status, setStatus] = useState("checking"); // checking | ready | error

  useEffect(() => {
    let cancelled = false;
    let tries = 0;

    async function ping() {
      try {
        await checkHealth();
        if (!cancelled) setStatus("ready");
      } catch {
        tries += 1;
        if (cancelled) return;
        if (tries < 12) setTimeout(ping, 10000); // ลองใหม่ทุก 10 วินาที สูงสุด 2 นาที
        else setStatus("error");
      }
    }
    ping();
    return () => { cancelled = true; };
  }, []);

  if (status === "ready") return null;
  return (
    <div className={`server-status server-status--${status}`}>
      {status === "checking"
        ? "กำลังเชื่อมต่อเซิร์ฟเวอร์... (ครั้งแรกอาจใช้เวลาประมาณ 1 นาที)"
        : "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณารีเฟรชหน้าเว็บ"}
    </div>
  );
}
