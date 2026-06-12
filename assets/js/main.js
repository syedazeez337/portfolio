(function () {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // theme toggle — delegated, since the nav is injected after load
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-theme-toggle]');
    if (!btn) return;
    const root = document.documentElement;
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (_) { /* private mode */ }
  });

  // typewriter tagline (home page only)
  function initTyping() {
    const el = document.querySelector('.t-thesis-text[data-text]');
    if (!el) return;
    const text = el.dataset.text;
    if (reducedMotion) { el.textContent = text; return; }
    let i = 0;
    setTimeout(function type() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 24);
    }, 350);
  }

  // colour the stack-tag dots by language name
  function initLangDots() {
    document.querySelectorAll('.t-project-stack span').forEach((s) => {
      if (!s.dataset.lang) s.dataset.lang = s.textContent.trim().toLowerCase();
    });
  }

  // fade-up sections as they scroll into view
  function initReveal() {
    if (reducedMotion || !('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll(
      '.t-hero, .t-divider, .t-contrib-repo-block, .t-project-card, .t-news-row, .t-misc-section'
    );
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -32px 0px' });

    targets.forEach((t) => {
      const siblings = t.parentElement ? [...t.parentElement.children] : [];
      const idx = Math.max(siblings.indexOf(t), 0);
      t.style.transitionDelay = `${Math.min(idx % 6, 4) * 55}ms`;
      t.classList.add('reveal');
      io.observe(t);
    });
  }

  function init() {
    initTyping();
    initLangDots();
    initReveal();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
