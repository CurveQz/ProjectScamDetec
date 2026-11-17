// การ์ดแสดงผลตรวจข้อความ (รับ result จาก /predict)
export default function ResultCard({ result }) {
  const isScam = result.group === "negative";
  const percent = (n) => `${Math.round(n * 100)}%`;

  return (
    <section className={`result ${isScam ? "result--danger" : "result--safe"}`}>
      <p className="result__risk">{result.risk_level}</p>
      <h2 className="result__title">{result.group_th}</h2>
      <p className="result__confidence">ความมั่นใจ {percent(result.group_confidence)}</p>

      <dl className="result__details">
        <dt>หมวด</dt>
        <dd>
          {result.sub_group_th} <span className="muted">({percent(result.sub_group_confidence)})</span>
        </dd>
        <dt>คำแนะนำ</dt>
        <dd>{result.advice}</dd>
      </dl>
    </section>
  );
}
