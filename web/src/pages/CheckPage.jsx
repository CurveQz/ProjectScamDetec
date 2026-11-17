import { useState } from "react";
import { predictSms } from "../api.js";
import ResultCard from "../components/ResultCard.jsx";

// ข้อความตัวอย่างให้กดลองตอนพรีเซนต์ (ลบออกได้)
const EXAMPLES = [
  "รหัส OTP ของคุณคือ 482913 ห้ามบอกรหัสนี้กับผู้อื่น",
  "รับเครดิตฟรี 300 สมัครวันนี้ ถอนได้ไม่อั้น ไลน์ @bet789",
  "บัญชีของท่านถูกระงับ กรุณายืนยันตัวตนที่ http://kbank-verify.xyz",
];

// หน้าตรวจข้อความ: วาง SMS -> กดตรวจ -> แสดงผล
export default function CheckPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await predictSms(text));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>ตรวจข้อความ SMS</h1>
      <p className="muted">วางข้อความที่ได้รับ ระบบจะบอกว่าเป็นข้อความปกติหรือมิจฉาชีพ</p>

      <form className="form" onSubmit={handleSubmit}>
        <textarea
          className="textarea"
          rows={5}
          maxLength={2000}
          placeholder="วางข้อความที่นี่"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="examples">
          <span className="muted">ลองตัวอย่าง:</span>
          {EXAMPLES.map((ex) => (
            <button type="button" key={ex} className="chip" onClick={() => setText(ex)}>
              {ex.slice(0, 24)}…
            </button>
          ))}
        </div>

        <button className="button" type="submit" disabled={loading || !text.trim()}>
          {loading ? "กำลังตรวจ..." : "ตรวจข้อความ"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {result && <ResultCard result={result} />}
    </div>
  );
}
