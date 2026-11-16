"""โมดูลเตรียมข้อความ SMS สำหรับ Backend API (สร้างอัตโนมัติจาก main.ipynb)"""
import re, math, unicodedata, itertools
from functools import lru_cache
import numpy as np
from pythainlp.tokenize import word_tokenize
from pythainlp.util import normalize as th_normalize
from pythainlp.corpus import thai_words
from pythainlp.corpus.tnc import word_freqs

LOOKALIKES = {'II': ['แ'], 'll': ['แ'], 'Il': ['แ'], 'lI': ['แ'], 'I': ['เ'], 'l': ['เ'], '|': ['เ'], 'o': ['อ'], 'O': ['อ'], '0': ['อ'], 'u': ['น', 'บ'], 'U': ['บ', 'น'], 'n': ['ก', 'ท'], 's': ['ร', 'ธ'], 'S': ['ร', 'ธ'], 'w': ['พ', 'ฟ', 'ฬ'], 'W': ['ฟ', 'พ', 'ฬ']}
_FREQ = dict(word_freqs())
_LOG_TOTAL = math.log(sum(_FREQ.values()))
_DICT = set(thai_words())

URL_RE = re.compile('(?:https?://[^\\s<>\\"\']+|(?:www\\.|lin\\.ee/|cutt\\.ly/|bit\\.ly/|shorturl\\.at/|urlzs\\.com/|m\\.ais\\.co\\.th/|s\\.true\\.th/)[A-Za-z0-9._~:/?#\\[\\]@!$&\'()*+,;=%-]+|\\b[A-Za-z0-9-]+\\.(?:com|net|org|me|vip|fun|xyz|club|cc|info|top|site|online|shop|bet|win|live|asia|co\\.th)(?:/[^\\s<>\\"\']*)?)', 34)
LINE_RE = re.compile('(?:(?:ไลน์|line|id|ไอดี)\\s*[:：]?\\s*)?@[A-Za-z0-9._-]{3,}', 34)
USSD_RE = re.compile('\\*\\d+(?:\\*\\d+)*#|\\b\\d{4,6}#', 32)
DATE_RE = re.compile('\\b\\d{1,2}/\\d{1,2}/\\d{2,4}\\b|\\d{1,2}\\s*(?:ม\\.ค\\.|ก\\.พ\\.|มี\\.ค\\.|เม\\.ย\\.|พ\\.ค\\.|มิ\\.ย\\.|ก\\.ค\\.|ส\\.ค\\.|ก\\.ย\\.|ต\\.ค\\.|พ\\.ย\\.|ธ\\.ค\\.)\\s*\\d{2,4}', 32)
TIME_RE = re.compile('\\b\\d{1,2}[:.]\\d{2}\\s*น\\.', 32)
OTP_RE = re.compile('<OTP\\s+\\d{4,8}>|\\bOTP\\s*(?:is|=|:)?\\s*\\d{4,8}\\b|\\b\\d{6}(?=\\s+is your\\b)', 34)
OTP_TH_RE = re.compile('(รหัส(?:ยืนยัน|ผ่านครั้งเดียว|รักษาความปลอดภัย)[^\\d\\n]{0,15})\\b\\d{4,8}\\b', 32)
REF_RE = re.compile('<Ref\\.[A-Za-z0-9]+>|\\bRef(?:erence)?(?:\\s*code)?\\s*[:.=]?\\s*[A-Za-z0-9]{3,8}\\b', 34)
REF_TH_RE = re.compile('(รหัสอ้างอิง[^\\dA-Za-z\\n]{0,10})[A-Za-z0-9]{4,8}', 32)
PHONE_RE = re.compile('\\b0\\d{1,2}[-\\s]?\\d{3,4}[-\\s]?\\d{3,4}\\b|\\b0\\d{2}-[xX]{3}-\\d{4}\\b', 32)
AMOUNT_RE = re.compile('\\d[\\d,]*(?:\\.\\d+)?\\s*(?:บาท|บ\\.|บ(?=\\s|/|$|\\))|\\.-)', 32)
_UNIT = re.compile('II|ll|Il|lI|I|l|\\||o|O|0|u|U|n|s|S|w|W', 32)
_CHUNK = re.compile('(?<![A-Za-z0-9])(?:[ก-๙]*(?:II|ll|Il|lI|I|l|\\||o|O|0|u|U|n|s|S|w|W))+[ก-๙]+(?![A-Za-z0-9])', 32)
_ZERO_WIDTH = re.compile('[\\u200b-\\u200d\\u2060\\ufeff]', 32)
_PAREN = re.compile('([\\(\\)])', 32)


@lru_cache(maxsize=200_000)
def _word_cost(word: str) -> float:
    return _LOG_TOTAL - math.log(_FREQ.get(word, 1 if word in _DICT else 0.01))


def _cost(text: str) -> float:
    return sum(_word_cost(w) for w in word_tokenize(text, keep_whitespace=False))


@lru_cache(maxsize=None)
def _fix_chunk(chunk: str, max_units: int = 3, min_gain: float = 5.0) -> str:
    parts, units = _UNIT.split(chunk), _UNIT.findall(chunk)
    if len(units) > max_units:
        return chunk
    best, best_cost = chunk, _cost(chunk) - min_gain
    for choice in itertools.product(*(LOOKALIKES[u] for u in units)):
        cand = parts[0] + "".join(c + p for c, p in zip(choice, parts[1:]))
        if (c := _cost(cand)) < best_cost:
            best, best_cost = cand, c
    return best


def normalize_sms(text: str) -> str:
    s = re.sub(r"\s+", " ", str(text).replace("\xa0", " ")).strip()
    s = URL_RE.sub("<URL>", s)
    s = LINE_RE.sub("<LINE_ID>", s)
    s = USSD_RE.sub("<USSD>", s)
    s = DATE_RE.sub("<DATE>", s)
    s = TIME_RE.sub("<TIME>", s)
    s = OTP_RE.sub("<OTP>", s)
    s = OTP_TH_RE.sub(r"\1<OTP>", s)
    s = REF_RE.sub("<REF>", s)
    s = REF_TH_RE.sub(r"\1<REF>", s)
    s = PHONE_RE.sub("<PHONE>", s)
    s = AMOUNT_RE.sub(" <AMOUNT> ", s)
    s = re.sub(r"\s*(<[A-Z_]+>)\s*", r" \1 ", s)
    return re.sub(r"\s+", " ", s).strip()


def preprocess(text: str) -> tuple[str, bool]:
    t = unicodedata.normalize("NFKC", str(text)).replace("\u0e4d\u0e32", "\u0e33")
    t = _ZERO_WIDTH.sub("", t)
    fixed          = _CHUNK.sub(lambda m: _fix_chunk(m.group()), t)
    was_obfuscated = fixed != t
    fixed          = re.sub(r"\s+", " ", _PAREN.sub(r" \1 ", fixed)).strip()
    return th_normalize(fixed), was_obfuscated


def tokenize(text: str, engine: str = "newmm") -> list[str]:
    return word_tokenize(text, engine=engine, keep_whitespace=False)


def predict_sms(raw_text: str, vectorizer, models: dict) -> dict:
    """ฟังก์ชันพร้อมใช้สำหรับ FastAPI: รับข้อความดิบ 1 ข้อความ -> คืนผลทำนายแบบ JSON dict"""
    tagged = normalize_sms(raw_text)
    cleaned, _ = preprocess(tagged)
    tokens = tokenize(cleaned)
    X_vec = vectorizer.transform([" ".join(tokens)])

    # ทำนาย group พร้อมความมั่นใจ
    grp_probs = models["group"].predict_proba(X_vec)[0]
    grp_idx = int(np.argmax(grp_probs))
    group = str(models["group"].classes_[grp_idx])

    # เลือกโมเดลย่อยตาม group ที่ทายได้
    sub_model = models["sub_pos"] if group == "positive" else models["sub_neg"]
    sub_probs = sub_model.predict_proba(X_vec)[0]
    sub_idx = int(np.argmax(sub_probs))

    return {
        "group": group,
        "group_confidence": round(float(grp_probs[grp_idx]), 4),
        "sub_group": str(sub_model.classes_[sub_idx]),
        "sub_group_confidence": round(float(sub_probs[sub_idx]), 4),
    }

