# ระบบตรวจจับ SMS มิจฉาชีพ

**NLP 2026 Mini Project**

- 🌐 เว็บใช้งานจริง: [message-scam-detector.vercel.app](https://message-scam-detector.vercel.app)
- 💻 GitHub: [github.com/CurveQz/ProjectScamDetec](https://github.com/CurveQz/ProjectScamDetec)

---

## 1. Idea

### Pain point
SMS หลอกลวงมีจำนวนมาก เช่น ชวนเล่นพนัน ส่งลิงก์ปลอม หรือข่มขู่ และแยกออกจาก SMS จริงได้ยาก

### User (กลุ่มเป้าหมาย)
ผู้ใช้มือถือทั่วไป โดยเฉพาะผู้สูงอายุและคนที่ไม่คุ้นเคยกับเทคโนโลยี

### Idea
ระบบตรวจข้อความ SMS ว่าเป็นข้อความหลอกลวงหรือไม่ พร้อมระบุประเภท (พนัน / ลิงก์ปลอม / ข่มขู่) และเหตุผล เพื่อให้ผู้ใช้ตัดสินใจได้ง่ายขึ้น

- **เป้าหมายระยะยาว:** ทำเป็นปลั๊กอินที่ใช้ในแอป SMS ได้โดยตรง
- **ตอนนี้:** เวลามีจำกัด จึงนำเสนอ concept ในรูปแบบเว็บไซต์

### Solution: ดีกว่าเดิมยังไง
- **สิ่งที่ดีกว่าเดิม:** ผู้ใช้มีตัวช่วยวิเคราะห์ข้อความ ไม่ต้องเดาเองและเสี่ยงถูกมิจฉาชีพหลอก
- **ทำไมต้องใช้ NLP:** การวิเคราะห์ภาษาทำด้วย if-else ไม่ได้ เพราะคำเดียวกันมีความหมายต่างกันได้ในแต่ละประโยค
- **บอกได้ว่าเป็น SMS หลอกลวงหรือไม่** และจำแนกได้ละเอียดถึง 8 กลุ่มย่อย

| group | sub_group | ความหมาย |
| :--- | :--- | :--- |
| positive (ข้อความปกติ) | `promotion` | โปรโมชันสินค้า สิทธิพิเศษ พอยท์ |
| | `carrier_vas` | บริการเสริมของค่ายมือถือ (ดูดวง ริงโทน กด `*...#`) |
| | `otp` | รหัส OTP / รหัสยืนยันตัวตน |
| | `service_notice` | แจ้งเตือนบริการ สถานะพัสดุ ระบบโทรศัพท์ ประกาศภาครัฐ |
| | `payment_alert` | แจ้งชำระเงิน เงินเข้า-ออก ธุรกรรมการเงิน |
| negative (มิจฉาชีพ) | `invite` | ชวนเล่นเว็บพนัน แจกเครดิตฟรี รางวัลปลอม กู้เงินนอกระบบ งานออนไลน์ |
| | `phishing_link` | ลิงก์ฟิชชิ่งที่ปลอมเป็นธนาคาร ขนส่ง หรือหน่วยงานรัฐ |
| | `threat` | ข่มขู่หรือแจ้งเตือนเท็จ เช่น พัสดุถูกอายัด ตัดไฟ หมายเรียก |

### ภาพรวมระบบ
```
ผู้ใช้กรอกข้อความ (เว็บ React)
        │  JSON
        ▼
   FastAPI ──► Normalize ► Lookalikes ► Tokenize ► TF-IDF
        │                                            ├► Model ชั้นที่ 1: group (positive / negative)
        │                                            └► Model ชั้นที่ 2: sub_group (8 กลุ่มย่อย)
        ▼
แสดงผลบนหน้าเว็บ
```

---

## 2. How to use / How to run / How to customize

### How to use
**1) ผ่านหน้าเว็บ (ผู้ใช้ทั่วไป):** เข้า [message-scam-detector.vercel.app](https://message-scam-detector.vercel.app)
- หน้า **ตรวจข้อความ** (`/`): วางข้อความ SMS แล้วกดตรวจ ระบบจะแสดงว่าเป็นข้อความปกติหรือมิจฉาชีพ, กลุ่มย่อย, ค่าความมั่นใจ และคำแนะนำ
- หน้า **ส่งข้อความเข้าระบบ** (`/report`): ส่งข้อความใหม่พร้อมระบุกลุ่ม ระบบเก็บไว้ใน Firebase เพื่อรอทีมคัดกรองก่อนนำไปเทรนเพิ่ม

> เซิร์ฟเวอร์ฟรีจะหลับเมื่อไม่มีคนใช้ 15 นาที ครั้งแรกอาจต้องรอ 1-2 นาทีให้ API ตื่น

**2) ผ่าน API:** [projectscamdetec.onrender.com/docs](https://projectscamdetec.onrender.com/docs)
```bash
curl -X POST https://projectscamdetec.onrender.com/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "รับเครดิตฟรี 300 สมัครวันนี้ ไลน์ @bet789"}'
```
```json
{
  "group": "negative", "group_th": "ข้อความมิจฉาชีพ", "group_confidence": 0.9991,
  "sub_group": "invite", "sub_group_th": "ชักชวน (พนัน / เครดิตฟรี / กู้เงิน / งานออนไลน์)",
  "sub_group_confidence": 0.753, "risk_level": "เสี่ยง",
  "advice": "อย่ากดลิงก์หรือแอดไลน์ตามข้อความ และอย่าโอนเงินเพื่อรับรางวัลหรือเงินกู้"
}
```

### How to run
โครงสร้างไฟล์
```
ProjectScamDetec/
├── main.ipynb          # NLP + ML: เตรียมข้อมูล → เทรน → วัดผล → export โมเดล
├── sms_model.joblib    # โมเดลที่เทรนแล้ว (vectorizer + models) export จาก main.ipynb
├── sms_pipeline.py     # ฟังก์ชันเตรียมข้อความ (normalize / lookalikes / tokenize) ที่ API ใช้
├── data_set.csv        # ชุดข้อมูลรวมที่ใช้เทรน (1,323 ข้อความ)
├── api/                # FastAPI: /predict, /report, /health (รายละเอียดใน api/README.md)
├── web/                # หน้าเว็บ React + Vite (รายละเอียดใน web/README.md)
├── row_data/           # ข้อมูลดิบที่สมาชิกแต่ละคนรวบรวม (แยกโฟลเดอร์ตามชื่อ)
└── QUICKSTART.md       # คู่มือสั้นสำหรับสมาชิกในทีม
```

**โมเดล (Notebook)**: ใช้ Python 3.11 ขึ้นไป
```bash
pip install pandas numpy scipy pythainlp scikit-learn matplotlib joblib jupyter
jupyter notebook main.ipynb     # แล้วกด Run All
```
Notebook จะทำงานตามลำดับ: โหลด `data_set.csv` → normalize → ตัดคำ → แบ่ง Train/Test → TF-IDF → เทรน → วัดผลและจูน → บันทึก `sms_model.joblib` และ `sms_pipeline.py`

**API (FastAPI)**: ใช้ Python 3.11 ขึ้นไป
```bash
py -3.11 -m pip install -r api/requirements.txt
py -3.11 -m uvicorn api.main:app --reload     # → http://127.0.0.1:8000/docs
```
`/predict` ใช้ได้ทันที ส่วน `/report` ต้องมี key ของ Firebase (ถ้าไม่มีจะตอบ 503)

**หน้าเว็บ (React)**: ใช้ Node.js 20.19 ขึ้นไป
```bash
cd web
echo VITE_API_URL=https://projectscamdetec.onrender.com > .env.local
npm install
npm run dev     # → http://localhost:5173
```

**Deploy:** push เข้า `main` แล้ว GitHub Actions จะ deploy ให้อัตโนมัติ: `web/` ไป Vercel และ `api/`, `sms_model.joblib`, `sms_pipeline.py` ไป Render

### ขั้นตอน Normalization ภายในระบบ
| ขั้นตอน | ทำอะไร | ตัวอย่าง |
| :--- | :--- | :--- |
| **`<tag>`** | หาข้อมูลที่มีรูปแบบตายตัวแล้วแปลงเป็น tag (`<URL>`, `<AMOUNT>`, `<OTP>`, `<PHONE>`, `<LINE_ID>`, `<USSD>`, `<DATE>`) | `OTP ของคุณคือ 674820` → `OTP ของคุณคือ <OTP>` |
| **Lookalikes** | แปลงตัวอักษรที่ใช้แทนตัวไทยเพื่อหลบการตรวจ กลับเป็นตัวไทยตามที่ map ไว้ | `โoนไว` → `โอนไว` |
| **Tokenization** | ตัดคำไทยที่พิมพ์ติดกันด้วย `word_tokenize` ของ PyThaiNLP โดยไม่ตัด tag | `สมัครใหม่รับฟรี` → `['สมัคร', 'ใหม่', 'รับ', 'ฟรี']` |
| **Stopword** | ตัดคำที่ไม่มีความสำคัญออก | `['สมัคร', 'ใหม่', 'รับ', 'ฟรี']` → `['สมัคร', 'ฟรี']` |

### How to customize
| ต้องการ | แก้ที่ |
| :--- | :--- |
| เพิ่มข้อมูล | เพิ่มแถวใน `data_set.csv` (คอลัมน์ `id, sentence_raw, group, sub_group, source`) หรือเพิ่มโฟลเดอร์ของตัวเองใน `row_data/` แล้วส่ง Pull Request (ห้ามแก้หรือลบข้อมูลของคนอื่น) |
| เพิ่ม/เปลี่ยน tag | regex ในเซลล์ "Normalize data" (`URL_RE`, `AMOUNT_RE`, …) และฟังก์ชัน `normalize_sms` |
| เพิ่มคู่ตัวอักษรที่ใช้หลบการตรวจ | dict `LOOKALIKES` ในเซลล์ Tokenization |
| ปรับการแปลงข้อความเป็น vector | `BASE_CFG` → `ngram_range`, `min_df`, `max_df`, `max_features`, `char_ngram` |
| ปรับความเข้มของโมเดล | `C_group`, `C_sub_pos`, `C_sub_neg` ใน `BASE_CFG` หรือขยาย `C_GRID` ตอนจูน |
| เพิ่ม sub_group ใหม่ | ใส่ label ใหม่ใน `data_set.csv` ได้เลย โมเดลชั้นที่ 2 จะเรียนรู้กลุ่มใหม่เอง (ควรมีอย่างน้อยประมาณ 30 ข้อความ) |
| เปลี่ยนสัดส่วน Train/Test | `split_data(df, test_size=0.2)` |
| เปลี่ยนชื่อไทย / คำแนะนำของแต่ละกลุ่ม | `api/labels.py` และ `web/src/labels.js` (ต้องแก้ให้ตรงกันทั้ง 2 ไฟล์) |
| ปรับหน้าตาเว็บ | `web/src/index.css`, `web/src/pages/`, `web/src/components/` |
| ใช้โมเดลใหม่ใน API | รัน `main.ipynb` จนจบเพื่อ export `sms_model.joblib` + `sms_pipeline.py` ใหม่ แล้ว push |

---

## 3. Data + Results

### Data
**ทั้งหมด 1,323 ข้อความ**
- **ข้อความปกติ (Positive) 861 ข้อความ:** promotion 532, carrier_vas 151, otp 70, service_notice 63, payment_alert 45
- **มิจฉาชีพ (Negative) 462 ข้อความ:** invite 293, phishing_link 129, threat 40

| แหล่งข้อมูล | จำนวน |
| :--- | ---: |
| BeeBuzz dataset (GitHub, มจธ.) | 694 |
| SMS จริงจากมือถือสมาชิก | 607 |
| ข่าวและประกาศเตือนภัย (ตำรวจ, ธนาคาร, Thai PBS Verify ฯลฯ) | 22 |

**การเตรียมข้อมูล:** รวมข้อมูลจาก `row_data/` → ปรับ label ให้เป็นมาตรฐานเดียวกัน → Normalization → แบ่ง Train 80% (1,058 ข้อความ) / Test 20% (265 ข้อความ) แบบ stratify ตาม `sub_group`

### Model
- **Feature:** TF-IDF ระดับคำ (1-2 gram) รวมกับ TF-IDF ระดับตัวอักษร (2-4 gram) ซึ่งช่วยกับคำที่สะกดเลี่ยงหรือพิมพ์ผิด
- **ชั้นที่ 1 (`group`):** `LinearSVC` + `CalibratedClassifierCV`, `class_weight="balanced"`
- **ชั้นที่ 2 (`sub_group`):** `LogisticRegression` 2 ตัว แยกกันระหว่างกลุ่ม positive (5 กลุ่มย่อย) และ negative (3 กลุ่มย่อย)
- **การจูน:** Cross-validation แบบ 5-Fold บน Train Set ค่าที่เลือกคือ `word(1,2) + char(2,4)`, `C_group=3.0`, `C_sub_pos=10.0`, `C_sub_neg=0.3`

### Results
**Cross-validation 5-Fold × 3 รอบ เทียบก่อน/หลังจูน**

| Metric | Baseline | Tuned | Diff |
| :--- | ---: | ---: | ---: |
| group F1 (macro) | 0.9532 | **0.9572** | +0.0040 |
| Scam recall (สัดส่วนข้อความมิจฉาชีพที่จับได้) | 0.9221 | **0.9286** | +0.0065 |
| sub_group F1 (positive) | 0.8879 | **0.8890** | +0.0011 |
| sub_group F1 (negative) | 0.7052 | **0.7390** | +0.0338 |
| sub_group F1 (รวม) | 0.7804 | **0.7975** | +0.0171 |
| เวลาเทรนต่อรอบ (วินาที) | 0.25 | 0.62 | +0.38 |

**Test Set (265 ข้อความ) ของโมเดล baseline**

| ระดับ | Accuracy | F1-macro |
| :--- | ---: | ---: |
| group (positive / negative) | **95.85%** | 95.41% |
| sub_group (8 กลุ่มย่อย) | 84.53% | 76.92% |

| sub_group | Precision | Recall | F1 |
| :--- | ---: | ---: | ---: |
| otp | 1.00 | 1.00 | 1.00 |
| carrier_vas | 0.94 | 1.00 | 0.97 |
| promotion | 0.92 | 0.96 | 0.94 |
| payment_alert | 0.80 | 0.89 | 0.84 |
| invite | 0.80 | 0.83 | 0.82 |
| threat | 0.60 | 0.75 | 0.67 |
| service_notice | 0.63 | 0.38 | 0.48 |
| phishing_link | 0.53 | 0.38 | 0.44 |

**วิเคราะห์ผล**
- โมเดลแยกข้อความปกติกับข้อความมิจฉาชีพได้แม่นประมาณ 96% และผลแต่ละ fold ค่อนข้างนิ่ง (std ของ group F1 ≈ 0.014)
- ข้อความมิจฉาชีพหลุดเป็น positive 7 จาก 93 ข้อความ ส่วนใหญ่เขียนเลียนแบบโปรโมชันของค่ายมือถือ (เช่น ดูดวง, เพิ่มเงินค่าโทร)
- คู่ที่สับสนมากที่สุดคือ `phishing_link` ↔ `invite` (18 ข้อความ) เพราะทั้งสองกลุ่มมักแนบลิงก์เหมือนกัน
- การเพิ่ม char n-gram ทำให้ sub_group ฝั่ง negative ดีขึ้นชัดที่สุด (+3.4%)

### Limitation
- ชุดข้อมูลยังมีจำนวนน้อย อาจมีบางกรณีที่โมเดลยังไม่ครอบคลุม
- ตรวจเฉพาะตัวข้อความ ไม่ได้ตรวจลิงก์ปลายทาง
- มิจฉาชีพเปลี่ยนรูปแบบอยู่ตลอด จึงต้องเทรนโมเดลใหม่เป็นระยะ

### Reference
- PyThaiNLP · scikit-learn · FastAPI · React
- BeeBuzz: Fraud-SMS-Detection-Application โปรเจกต์จบ มจธ. ([github.com/Zoleir](https://github.com/Zoleir)) ใช้เพื่อการศึกษา
- ThaiScamBench (สจล.) · Thai PBS Verify

---

## 4. Team members + Role

| ชื่อ - นามสกุล | รหัสนักศึกษา | บทบาท |
| :--- | :--- | :--- |
| นางสาวรุจิรัตน์ แสงชัย | 6752300739 | รวบรวมข้อมูล, Normalize data |
| นายศนุชา สอนเดช | 6752300542 | รวบรวมข้อมูล, สร้าง Model AI |
| นายก้องภพ สุขทรัพย์ | 6752300534 | รวบรวมข้อมูล, สร้าง Model AI |
| นายกษิดิ์เดช คู่คิด | 6752300712 | รวบรวมข้อมูล, สร้าง Model AI |
| นายอาณัติ หลีเกี๊ยะ | 6752300666 | รวบรวมข้อมูล, FastAPI, Use page |
| นางสาวธนัชพร ช่วยนาค | 6752300861 | รวบรวมข้อมูล, ออกแบบเว็บทั้ง 2 หน้า, Landing page, Use page |
| นายนัธทวัฒน์ อุ้มญาติ | 6752300364 | รวบรวมข้อมูล, Landing page |
