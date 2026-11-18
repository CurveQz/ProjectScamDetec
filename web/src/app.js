try {
  if (localStorage.getItem("sd-theme") === "light") {
    document.documentElement.dataset.theme = "light";
  }
} catch {
  // Storage may be unavailable in privacy modes.
}

/* ใส่ URL หน้าตรวจข้อความจริงตรงนี้ เมื่อพร้อม — ถ้าเว้นว่าง ปุ่มจะเลื่อนไปที่ "ทำงานอย่างไร" */
const APP_URL='use.html';

const T={
th:{'nav.about':'รู้จักระบบ','nav.how':'ทำงานอย่างไร','nav.benefits':'ประโยชน์','nav.faq':'คำถามที่พบบ่อย','cta.check':'ลองตรวจข้อความ',
'aria.theme':'สลับโหมดมืด / สว่าง','aria.lang':'เปลี่ยนภาษาเป็นอังกฤษ','aria.menu':'เปิดเมนู',
'hero.title':'รู้ทัน<br>ก่อน<span style="white-space:nowrap">กด<em>ลิงก์.</em></span>','hero.copy':'SMS บางข้อความดูธรรมดา จนกว่าจะอ่านให้ดี <br>ให้ AI ช่วยคัดแยกข้อความทั่วไปกับข้อความน่าสงสัย เพื่อให้คุณพิจารณาก่อนตัดสินใจ',
'hero.chip1':'น่าสงสัย','hero.chip2':'ปกติ','hero.phoneLabel':'ภาพเคลื่อนไหว: SMS เด้งเข้ามาและถูกคัดแยกเป็นข้อความทั่วไปหรือน่าสงสัย',
'phone.inbox':'ข้อความ','phone.new':'ข้อความใหม่','phone.now':'ตอนนี้','phone.scan':'กำลังวิเคราะห์…','phone.good':'ข้อความทั่วไป','phone.bad':'ข้อความน่าสงสัย',
'about.p1':'ในโลกออนไลน์ที่ภัยจากการหลอกลวงมีรูปแบบหลากหลายและเปลี่ยนแปลงอยู่เสมอ การรู้เท่าทันก่อนคลิกจึงเป็นสิ่งสำคัญ',
'about.p2':'<strong>ScamDetec</strong> คือระบบที่มุ่งช่วยคัดแยกและวิเคราะห์ข้อความ SMS ภาษาไทยที่อาจมีความเสี่ยง เพื่อให้ผู้ใช้สามารถเข้าถึงข้อมูลประกอบการตัดสินใจได้ง่ายขึ้น ลดโอกาสในการตกเป็นเหยื่อของภัยออนไลน์ และใช้งานอินเทอร์เน็ตได้อย่างมั่นใจมากขึ้น',
'type.otp':'OTP / ยืนยันตัวตน','type.pay':'แจ้งชำระเงิน','type.service':'แจ้งเตือนบริการ','type.promo':'โปรโมชัน','type.invite':'เชิญชวน','type.phish':'ลิงก์ฟิชชิ่ง','type.threat':'ข่มขู่',
'how.h2':'ใช้งานง่าย ใน 3 ขั้นตอน','how.t1':'วางข้อความที่สงสัย','how.d1':'คัดลอก SMS ที่คุณไม่แน่ใจ แล้วนำมาวางในช่องข้อความ','how.t2':'กดประมวลผล','how.d2':'ระบบอ่านรูปแบบของคำและประโยคในข้อความ','how.t3':'ดูผลที่แสดงมา','how.d3':'เห็นกลุ่มหลักและประเภทของข้อความ เพื่อใช้ประกอบการตัดสินใจ',
'how.boxLabel':'ข้อความ SMS','how.btn':'ประมวลผล','how.typed':'พัสดุของคุณถูกระงับ กรุณายืนยันข้อมูลภายในวันนี้',
'res.goodT':'ปลอดภัย','res.goodS':'ข้อความทั่วไป · OTP / ยืนยันตัวตน','res.badT':'น่าสงสัย','res.badS':'ข้อความน่าสงสัย · ลิงก์ฟิชชิ่ง',
'ben.h2':'ประโยชน์ที่คุณจะได้รับ',
'ben.1':'ตรวจสอบข้อความก่อนกดลิงก์ ลดโอกาสเผชิญกับข้อความหลอกลวงโดยไม่รู้ตัว','ben.2':'ตรวจสอบได้ง่ายในไม่กี่ขั้นตอน ไม่ต้องมีความรู้ทางเทคนิค','ben.3':'รับข้อมูลประกอบการวิเคราะห์ที่ช่วยให้เข้าใจความเสี่ยงของข้อความ','ben.4':'เพิ่มความตระหนักรู้และช่วยให้ตัดสินใจรับมือกับ SMS ได้รอบคอบขึ้น',
'faq.h2':'คำถามที่พบบ่อย','foot.p':'โครงการคัดแยก SMS ภาษาไทย','foot.s':'แนวคิดต้นแบบ · 2026','title':'ScamDetec — รู้ทันก่อนกดลิงก์'},
en:{'nav.about':'About','nav.how':'How it works','nav.benefits':'Benefits','nav.faq':'FAQ','cta.check':'Check a message',
'aria.theme':'Toggle dark / light mode','aria.lang':'Switch language to Thai','aria.menu':'Open menu',
'hero.title':'Know before<br>you tap the <em>link.</em>','hero.copy':'Some SMS messages look ordinary — until you read them closely. <br>Let AI separate everyday messages from suspicious ones, so you can think it through before you act.',
'hero.chip1':'Suspicious','hero.chip2':'Normal','hero.phoneLabel':'Animation: SMS messages arrive and are classified as normal or suspicious',
'phone.inbox':'Messages','phone.new':'New message','phone.now':'now','phone.scan':'Analysing…','phone.good':'Normal message','phone.bad':'Suspicious message',
'about.p1':'In an online world where scams keep changing shape, knowing what you’re looking at before you click matters.',
'about.p2':'<strong>ScamDetec</strong> is a system that helps classify and analyse potentially risky Thai-language SMS messages, giving you clearer information to base your decisions on — reducing the chance of falling victim to online scams and helping you use the internet with more confidence.',
'type.otp':'OTP / Verification','type.pay':'Payment notice','type.service':'Service alert','type.promo':'Promotion','type.invite':'Enticement','type.phish':'Phishing link','type.threat':'Threat',
'how.h2':'Three simple steps','how.t1':'Paste the suspicious message','how.d1':'Copy the SMS you’re unsure about and paste it into the message box','how.t2':'Tap to analyse','how.d2':'The system reads the patterns of words and sentences in the message','how.t3':'See the result','how.d3':'Get the main group and message type to help you decide',
'how.boxLabel':'SMS MESSAGE','how.btn':'Analyse','how.typed':'Your parcel is on hold. Please confirm your details today.',
'res.goodT':'Looks safe','res.goodS':'Normal message · OTP / Verification','res.badT':'Suspicious','res.badS':'Suspicious message · Phishing link',
'ben.h2':'What you get',
'ben.1':'Check a message before tapping its link, and lower the chance of running into a scam without realising','ben.2':'Easy to check in just a few steps — no technical knowledge needed','ben.3':'Get supporting analysis that helps you understand a message’s risk','ben.4':'Build awareness and handle SMS messages more carefully',
'faq.h2':'Frequently asked questions','foot.p':'Thai SMS classification project','foot.s':'Concept prototype · 2026','title':'ScamDetec — Know before you tap'}};

const FAQ={th:[['ข้อความที่มีลิงก์ เป็นมิจฉาชีพทุกข้อความไหม?','ไม่เสมอไป ข้อความโปรโมชันหรือการแจ้งเตือนจากบริการจริงก็อาจมีลิงก์ ระบบจึงต้องพิจารณาเนื้อหาและบริบท ไม่ใช่แค่การมีลิงก์เพียงอย่างเดียว'],['ระบบยืนยันได้ไหมว่าปลอดภัยแน่นอน?','ผลคัดแยกเป็นข้อมูลประกอบการพิจารณา อาจเกิดความผิดพลาดได้ และไม่ได้เป็นการยืนยันตัวตนผู้ส่งหรือตรวจความปลอดภัยของเว็บไซต์ หากไม่แน่ใจควรติดต่อหน่วยงานผ่านช่องทางที่ทราบว่าเป็นทางการ'],['ต้องให้อ่าน SMS ทั้งเครื่องหรือเปล่า?','เส้นทางใช้งานที่ออกแบบไว้ให้คุณคัดลอกข้อความที่ต้องการตรวจมาวางเอง ไม่ได้ขอเข้าถึงกล่อง SMS ทั้งเครื่อง ก่อนใช้งานจริงควรปิดบัง OTP และข้อมูลส่วนตัว'],['ช่วยเพิ่มข้อความให้โครงการได้อย่างไร?','โครงการมีแผนทำหน้าส่งตัวอย่างข้อความเพิ่มเติม โดยข้อมูลจะรอการคัดกรองก่อนนำไปใช้ ปุ่มในแบบร่างนี้แสดงแนวทางเท่านั้น ยังไม่มีการรับหรือบันทึกข้อมูล']],
en:[['Is every message with a link a scam?','Not always. Promotions and alerts from real services can include links too, so the system looks at the content and context — not just whether a link is there.'],['Can the system confirm a message is definitely safe?','Classification results are information to help you decide and can be wrong. They don’t verify who the sender is or check whether a website is safe. If you’re unsure, contact the organisation through a channel you know is official.'],['Do I have to let it read every SMS on my phone?','The planned flow has you copy and paste only the message you want to check. It doesn’t ask for access to your whole SMS inbox. Before using it for real, hide any OTP codes and personal details.'],['How can I contribute messages to the project?','The project plans a page for submitting more sample messages; submissions will be screened before use. The button in this draft only shows the idea — nothing is collected or stored yet.']]};

const SAMPLES=[
{bad:1,th:'พัสดุของคุณถูกระงับ กรุณายืนยันข้อมูลภายในวันนี้ เพื่อหลีกเลี่ยงการตีกลับ',en:'Your parcel is on hold. Please confirm your details today to avoid it being returned.',link:'parcel.example.invalid/verify',tTh:'ข่มขู่ / แจ้งเตือนเท็จ',tEn:'Threat / false alert'},
{bad:0,th:'รหัสยืนยันของคุณคือ [OTP] กรุณาอย่าเปิดเผยรหัสนี้กับผู้อื่น',en:'Your verification code is [OTP]. Do not share this code with anyone.',tTh:'OTP / ยืนยันตัวตน',tEn:'OTP / Verification'},
{bad:1,th:'ยินดีด้วย! คุณได้รับสิทธิ์รับเงินคืนพิเศษ กดรับสิทธิ์ก่อนหมดเวลา',en:'Congratulations! You’ve qualified for a special cashback. Claim it before time runs out.',link:'bonus.example.invalid/claim',tTh:'เชิญชวน',tEn:'Enticement'},
{bad:0,th:'แพ็กเกจเน็ตพิเศษสำหรับลูกค้า ตรวจสอบรายละเอียดได้ในแอปของผู้ให้บริการ',en:'Special data package for customers. See details in your provider’s app.',tTh:'โปรโมชัน',tEn:'Promotion'},
{bad:1,th:'บัญชีของคุณมีการเข้าสู่ระบบผิดปกติ ยืนยันตัวตนที่ลิงก์นี้ทันที',en:'Unusual sign-in detected on your account. Verify your identity at this link now.',link:'secure-login.example.invalid',tTh:'ลิงก์ฟิชชิ่ง',tEn:'Phishing link'},
{bad:0,th:'ชำระค่าบริการเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ',en:'Your payment has been received. Thank you for using our service.',tTh:'แจ้งชำระเงิน',tEn:'Payment notice'}];

const icon={chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 15a3 3 0 0 1-3 3H9l-5 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3z"/></svg>',alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3L2 21h20zM12 9v5M12 17v1"/></svg>',ok:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l4 4L19 6"/></svg>',
orbOk:'<span class="orb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>',
orbBad:'<span class="orb bad"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M12 6v8M12 18v.5"/></svg></span>'};

const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
const root=document.documentElement;let lang=store.get('sd-lang')==='en'?'en':'th';
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

function applyLang(){
 const d=T[lang];root.lang=lang;document.title=d.title;
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=d[el.dataset.i18n]);
 document.querySelectorAll('[data-i18n-html]').forEach(el=>el.innerHTML=d[el.dataset.i18nHtml]);
 document.querySelectorAll('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',d[el.dataset.i18nAria]));
 const ls=document.querySelector('#langSwitch');ls.setAttribute('aria-checked',String(lang==='en'));ls.setAttribute('aria-label',lang==='en'?'Switch language to Thai':'เปลี่ยนภาษาเป็นอังกฤษ');
 document.querySelector('#faqList').innerHTML=FAQ[lang].map(([q,a])=>`<details class="glass holo"><summary>${q}</summary><p>${a}</p></details>`).join('');
 restartFeed();restartTyping();renderResult(false);
}
function setTheme(t){root.dataset.theme=t;document.querySelector('#themeSwitch').setAttribute('aria-checked',String(t==='dark'));store.set('sd-theme',t);}
setTheme(store.get('sd-theme')==='light'?'light':'dark');
document.querySelector('#themeSwitch').addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
document.querySelector('#langSwitch').addEventListener('click',()=>{lang=lang==='th'?'en':'th';store.set('sd-lang',lang);applyLang();});
if(APP_URL)document.querySelectorAll('[data-app-link]').forEach(a=>a.href=APP_URL);

const nav=document.querySelector('.site-nav'),mt=document.querySelector('.menu-toggle');
mt.addEventListener('click',()=>{const o=nav.classList.toggle('open');mt.setAttribute('aria-expanded',String(o));});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');mt.setAttribute('aria-expanded','false');}));

/* hero feed */
const feed=document.querySelector('#feed');let fi=0,timer=null,pending=[];
function verdictHTML(s){const d=T[lang];return `${s.bad?icon.alert:icon.ok}<span>${s.bad?d['phone.bad']:d['phone.good']} · ${lang==='en'?s.tEn:s.tTh}</span>`;}
function makeNote(s,instant){
 const d=T[lang],n=document.createElement('div');n.className='note';
 n.innerHTML=`<div class="note-top"><i>${icon.chat}</i><b>${d['phone.new']}</b><time>${d['phone.now']}</time></div><p>${s[lang]}${s.link?`<span class="link">${s.link}</span>`:''}</p><div class="verdict"></div>`;
 const v=n.querySelector('.verdict'),done=()=>{v.className='verdict '+(s.bad?'bad':'good');v.innerHTML=verdictHTML(s);};
 if(instant)done();else{v.className='verdict pending';v.textContent=d['phone.scan'];pending.push(setTimeout(done,1300));}
 return n;
}
function push(){const s=SAMPLES[fi++%SAMPLES.length];feed.prepend(makeNote(s,false));[...feed.querySelectorAll('.note:not(.leaving)')].slice(3).forEach(n=>{n.classList.add('leaving');setTimeout(()=>n.remove(),420);});}
function restartFeed(){clearInterval(timer);pending.forEach(clearTimeout);pending=[];feed.innerHTML='';
 if(reduced){[2,1,0].forEach(i=>feed.prepend(makeNote(SAMPLES[i],true)));return;}fi=0;push();timer=setInterval(push,3400);}

/* card 1: typing */
const typed=document.querySelector('#typed');let typeTimer=null;
function graphemes(t){if(window.Intl&&Intl.Segmenter)return [...new Intl.Segmenter(lang,{granularity:'grapheme'}).segment(t)].map(x=>x.segment);return [...t];}
function restartTyping(){clearTimeout(typeTimer);const g=graphemes(T[lang]['how.typed']);
 if(reduced){typed.textContent=g.join('');return;}let i=0;typed.textContent='';
 const step=()=>{if(i<=g.length){typed.textContent=g.slice(0,i++).join('');typeTimer=setTimeout(step,i<g.length?70:0);}else typeTimer=setTimeout(()=>{i=0;step();},2200);};step();}

/* card 3: result toggle */
const res=document.querySelector('#result');let resBad=false;
function renderResult(flip){const d=T[lang];res.className='result '+(resBad?'bad':'good')+(flip?' flip':'');
 res.innerHTML=`${resBad?icon.orbBad:icon.orbOk}<div><strong>${resBad?d['res.badT']:d['res.goodT']}</strong><span>${resBad?d['res.badS']:d['res.goodS']}</span></div>`;}
if(!reduced)setInterval(()=>{resBad=!resBad;renderResult(true);},2800);

/* benefits pop-in */
const bl=document.querySelector('#benList');
if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){bl.classList.add('show');io.disconnect();}}),{threshold:.25});io.observe(bl);}else bl.classList.add('show');

applyLang();
