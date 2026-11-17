// รายชื่อหมวด ใช้ทำ dropdown ในหน้าส่งข้อความ
// ⚠️ ต้องตรงกับ api/labels.py ถ้าทีมโมเดลเปลี่ยน sub_group ต้องแก้ทั้งสองที่

export const GROUPS = [
  { value: "positive", label: "ข้อความปกติ" },
  { value: "negative", label: "ข้อความมิจฉาชีพ" },
];

export const SUB_GROUPS = {
  positive: [
    { value: "promotion", label: "โปรโมชันและสิทธิพิเศษ" },
    { value: "carrier_vas", label: "บริการเสริมค่ายมือถือ" },
    { value: "otp", label: "รหัส OTP / รหัสยืนยัน" },
    { value: "service_notice", label: "แจ้งเตือนบริการ" },
    { value: "payment_alert", label: "แจ้งเตือนการเงิน" },
  ],
  negative: [
    { value: "invite", label: "ชักชวน (พนัน / เครดิตฟรี / กู้เงิน / งานออนไลน์)" },
    { value: "phishing_link", label: "ลิงก์หลอกขโมยข้อมูล" },
    { value: "threat", label: "ข่มขู่ / แจ้งเตือนเท็จ" },
  ],
};
