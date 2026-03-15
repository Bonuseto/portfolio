/* ══════ TRANSLATIONS ══════ */
const T = window.T;

/* ══════ LANG SWITCHER ══════ */
let currentLang = 'en';

function setLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute('data-lang', lang);
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent.toLowerCase() === lang));
  const t = T[lang];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });

  document.querySelectorAll('[data-ph]').forEach(el => {
    const k = el.getAttribute('data-ph');
    if (t[k] !== undefined) el.placeholder = t[k];
  });

  const feat = document.querySelector('.pricing-card.featured');
  if (feat && t['pricing.popular']) feat.setAttribute('data-popular', t['pricing.popular']);
}

/* ══════ THEME TOGGLE ══════ */
let isDark = true;
function toggleTheme() {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  document.getElementById('themeToggle').textContent = isDark ? '☀' : '☾';
}

/* ══════ CURSOR ══════ */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
(function anim(){cursor.style.left=mx+'px';cursor.style.top=my+'px';rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim);})();

/* ══════ SCROLLED NAV ══════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40));

/* ══════ REVEAL ══════ */
const io = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ══════ MISC ══════ */
function setService(el){document.querySelectorAll('.service-option').forEach(o=>o.classList.remove('active'));el.classList.add('active');}
function handleSubmit(){document.getElementById('contactForm').style.display='none';document.getElementById('form-success').style.display='block';}
