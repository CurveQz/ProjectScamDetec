import { useState } from "react";
import { reportSms } from "../api.js";
import { GROUPS, SUB_GROUPS } from "../labels.js";

// หน้าส่งข้อความเข้าระบบ: ผู้ใช้วางข้อความ + เลือกหมวดที่ถูกต้อง -> บันทึกลง Firebase ผ่าน /report
export default function ReportPage() {
  const [text, setText] = useState("");
  const [group, setGroup] = useState("");
  const [subGroup, setSubGroup] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // เปลี่ยน group แล้วต้องล้าง sub_group เพราะรายการหมวดย่อยเปลี่ยนตาม
  function handleGroupChange(value) {
    setGroup(value);
    setSubGroup("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await reportSms({ text, group, sub_group: subGroup });
      setSuccess(res.message);
      setText("");
      setGroup("");
      setSubGroup("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const canSubmit = text.trim() && group && subGroup && !loading;

  return (
    <div className="page">
      <h1>ส่งข้อความเข้าระบบ</h1>
      <p className="muted">ช่วยส่ง SMS ที่คุณได้รับ พร้อมบอกว่าเป็นข้อความประเภทไหน ทีมจะตรวจสอบก่อนนำไปพัฒนาโมเดล</p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          ข้อความ SMS
          <textarea
            className="textarea"
            rows={5}
            maxLength={2000}
            placeholder="วางข้อความ SMS ที่นี่"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>

        <label className="label">
          ประเภทข้อความ
          <select className="select" value={group} onChange={(e) => handleGroupChange(e.target.value)}>
            <option value="">-- เลือก --</option>
            {GROUPS.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </label>

        <label className="label">
          หมวดย่อย
          <select className="select" value={subGroup} disabled={!group} onChange={(e) => setSubGroup(e.target.value)}>
            <option value="">-- เลือก --</option>
            {(SUB_GROUPS[group] || []).map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </label>

        <button className="button" type="submit" disabled={!canSubmit}>
          {loading ? "กำลังส่ง..." : "ส่งข้อความ"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
    </div>
  );
}
