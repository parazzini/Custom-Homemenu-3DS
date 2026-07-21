/* ---------- mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* ---------- active nav-link highlight on scroll ---------- */
const sections = document.querySelectorAll('main .section, .hero');
const navA = document.querySelectorAll('.nav-links a');
const byHref = id => document.querySelector('.nav-links a[href="#' + id + '"]');
if ('IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navA.forEach(a => a.classList.remove('active'));
        const link = byHref(entry.target.id);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => { if (s.id) obs.observe(s); });
}

/* ---------- lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
document.querySelectorAll('.shot').forEach(fig => {
  fig.addEventListener('click', () => {
    const img = fig.querySelector('img');
    if (fig.querySelector('.shot-img-wrap').classList.contains('broken')) return;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
  });
});
function closeLightbox() { lightbox.classList.remove('open'); lightboxImg.src = ''; }
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ---------- copy title IDs ---------- */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const old = btn.textContent;
      btn.textContent = 'Copied';
      btn.classList.add('copied');
      setTimeout(() => { btn.textContent = old; btn.classList.remove('copied'); }, 1400);
    } catch (err) { /* clipboard unavailable, ignore */ }
  });
});

/* ---------- image loading fallback ----------
   Each content image ships with a primary URL (raw.githubusercontent.com)
   and a data-fallback URL (github.com/.../?raw=true). If the primary 404s,
   try the fallback; if that also fails, swap in a clean placeholder instead
   of a broken-image icon. */
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', function onError() {
    if (img.dataset.fallback && img.src !== img.dataset.fallback) {
      img.src = img.dataset.fallback;
      return;
    }
    img.removeEventListener('error', onError);
    const wrap = img.closest('.shot-img-wrap, .screen');
    if (wrap) wrap.classList.add('broken');
  });
});

/* ---------- theme toggle ----------
   Defaults to the visitor's system preference, then remembers whatever
   they pick via localStorage so it stays put on their next visit. */
(function () {
  const STORAGE_KEY = 'homemenu-theme';
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const themeColorMeta = document.getElementById('themeColorMeta');
  const darkColor = '#15181D';
  const lightColor = '#EDEFF2';

  function getStoredTheme() {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return (v === 'dark' || v === 'light') ? v : null;
    } catch (e) { return null; }
  }

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function applyTheme(mode) {
    root.setAttribute('data-theme', mode);
    btn.setAttribute('aria-pressed', mode === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    if (themeColorMeta) themeColorMeta.setAttribute('content', mode === 'dark' ? darkColor : lightColor);
  }

  applyTheme(getStoredTheme() || (systemPrefersDark() ? 'dark' : 'light'));

  btn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage unavailable, theme still applies for this visit */ }
  });

  // Follow the system live, but only until the visitor makes their own choice
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light');
    });
  }
})();
