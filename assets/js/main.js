/* ══════ TRANSLATIONS ══════ */
const T = window.T;

/* ══════ ANALYTICS (GA4) ══════ */
function trackEvent(name, params) {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

function getClickableTarget(evTarget) {
  if (!(evTarget instanceof Element)) return null;
  return evTarget.closest('a, button, [role="button"], [data-track], .work-card, .pricing-btn, .btn-primary, .btn-ghost, .nav-cta');
}

function describeClickable(el) {
  const text = (el.getAttribute('aria-label') || el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 80);
  const id = el.id ? `#${el.id}` : '';
  const cls = el.classList && el.classList.length ? `.${Array.from(el.classList).slice(0, 3).join('.')}` : '';
  const tag = el.tagName ? el.tagName.toLowerCase() : 'element';
  const href = el instanceof HTMLAnchorElement ? el.href : '';
  return {
    text,
    element: `${tag}${id}${cls}`,
    href
  };
}

document.addEventListener('click', (e) => {
  const target = getClickableTarget(e.target);
  if (!target) return;

  const d = describeClickable(target);
  const isOutbound = !!(d.href && !d.href.startsWith(location.origin));

  trackEvent('click', {
    event_category: 'engagement',
    event_label: d.text || d.element,
    link_url: d.href || undefined,
    outbound: isOutbound ? true : undefined
  });
});

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

/* ══════ CURSOR (desktop only) ══════ */
const isTouch = matchMedia('(hover:none)').matches || 'ontouchstart' in window;
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
if (!isTouch) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
  (function anim(){cursor.style.left=mx+'px';cursor.style.top=my+'px';rx+=(mx-rx)*.12;ry+=(my-ry)*.12;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(anim);})();
}

/* ══════ SCROLLED NAV ══════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>40));

/* ══════ REVEAL ══════ */
const io = new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible');}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ══════ MISC ══════ */
function setService(el){document.querySelectorAll('.service-option').forEach(o=>o.classList.remove('active'));el.classList.add('active');}
/* ══════ EMAILJS CONFIG ══════ */
// Replace these with your actual EmailJS credentials:
const EMAILJS_PUBLIC_KEY = 'WkSa8hFrWHDcfqxP5';
const EMAILJS_SERVICE_ID = 'service_yz1mpel';
const EMAILJS_TEMPLATE_ID = 'template_ozysen6';

emailjs.init(EMAILJS_PUBLIC_KEY);

function handleSubmit() {
  const form = document.getElementById('contactForm');
  const btn = form.querySelector('.submit-btn');
  const originalText = btn.textContent;

  // Gather form data
  const fromName = form.querySelector('[name="from_name"]').value;
  const fromEmail = form.querySelector('[name="from_email"]').value;
  const msg = form.querySelector('[name="message"]').value;
  const params = {
    from_name: fromName,
    name: fromName,
    from_email: fromEmail,
    email: fromEmail,
    company: form.querySelector('[name="company"]').value,
    service: form.querySelector('.service-option.active .service-name').textContent,
    message: msg,
    title: msg
  };

  // Basic validation
  if (!params.from_name || !params.from_email || !params.message) {
    btn.textContent = 'Please fill required fields';
    setTimeout(() => { btn.textContent = originalText; }, 2000);
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
    .then(() => {
      form.style.display = 'none';
      document.getElementById('form-success').style.display = 'block';
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      btn.textContent = 'Error, try again';
      btn.disabled = false;
      setTimeout(() => { btn.textContent = originalText; }, 3000);
    });
}
