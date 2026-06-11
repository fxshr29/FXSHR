'use strict';

/* =====================================================
   LOADER
   ===================================================== */
(function loader() {
  const el    = document.getElementById('loader');
  const fill  = document.getElementById('loaderFill');
  const count = document.getElementById('loaderCount');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 16 + 5;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      fill.style.width = '100%';
      count.textContent = '100';
      setTimeout(() => {
        el.classList.add('done');
        document.body.classList.add('loaded');
        kickHero();
      }, 550);
    } else {
      fill.style.width = p + '%';
      count.textContent = Math.floor(p);
    }
  }, 110);
})();

// Reveal hero lines once load completes
function kickHero() {
  document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 80 * i);
  });
}

/* =====================================================
   CUSTOM CURSOR  (lerp follow + state)
   ===================================================== */
(function cursor() {
  const c = document.getElementById('cursor');
  if (!c || matchMedia('(hover: none)').matches) return;
  let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;

  addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    c.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  document.querySelectorAll('[data-cursor]').forEach(el => {
    const type = el.dataset.cursor;
    el.addEventListener('mouseenter', () => c.classList.add(type === 'view' ? 'is-view' : 'is-hover'));
    el.addEventListener('mouseleave', () => c.classList.remove('is-hover', 'is-view'));
  });

  addEventListener('mouseout', e => { if (!e.relatedTarget) c.style.opacity = '0'; });
  addEventListener('mouseover', () => { c.style.opacity = '1'; });
})();

/* =====================================================
   MAGNETIC BUTTONS
   ===================================================== */
(function magnetic() {
  if (matchMedia('(hover: none)').matches) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    const strength = 0.35;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* =====================================================
   WORK MEDIA — follow cursor
   ===================================================== */
(function workMedia() {
  if (matchMedia('(hover: none)').matches) return;
  const items = document.querySelectorAll('.work-item');
  let tx = 0, ty = 0, mx = 0, my = 0, active = false;

  items.forEach(item => {
    const media = item.querySelector('.wi-media');
    if (!media) return;
    item.addEventListener('mouseenter', () => { active = true; item._media = media; });
    item.addEventListener('mouseleave', () => { active = false; });
    item.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  });

  (function loop() {
    tx += (mx - tx) * 0.12;
    ty += (my - ty) * 0.12;
    if (active) {
      items.forEach(i => {
        const m = i.querySelector('.wi-media');
        if (m) m.style.left = tx + 'px', m.style.top = ty + 'px';
      });
    }
    requestAnimationFrame(loop);
  })();
})();

/* =====================================================
   NAV — scroll state, active link, mobile menu
   ===================================================== */
(function nav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('navMenu');
  const links  = document.querySelectorAll('.nav-item');

  addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 30);
    let cur = '';
    document.querySelectorAll('section[id], main[id]').forEach(s => {
      if (scrollY >= s.offsetTop - 250) cur = s.id;
    });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
  }, { passive: true });

  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();

/* =====================================================
   SMOOTH ANCHORS
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =====================================================
   REVEAL ON SCROLL
   ===================================================== */
(function reveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  // skip hero (handled by loader)
  document.querySelectorAll('[data-reveal]:not(.hero [data-reveal])').forEach(el => {
    if (!el.closest('.hero')) io.observe(el);
  });
})();

/* =====================================================
   COUNTERS
   ===================================================== */
(function counters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const end = +el.dataset.count;
      const t0 = performance.now();
      (function step(now) {
        const k = Math.min((now - t0) / 1500, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - k, 3)) * end);
        if (k < 1) requestAnimationFrame(step); else el.textContent = end;
      })(t0);
      io.unobserve(el);
    });
  }, { threshold: .6 });
  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
})();

/* =====================================================
   LOCAL TIME (CET)
   ===================================================== */
(function clock() {
  const el = document.getElementById('localTime');
  if (!el) return;
  function tick() {
    const t = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin'
    });
    el.textContent = t;
  }
  tick();
  setInterval(tick, 1000 * 30);
})();

/* =====================================================
   CONTACT FORM
   ===================================================== */
(function form() {
  const f  = document.getElementById('contactForm');
  const ok = document.getElementById('cfSuccess');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = f.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const orig = span.textContent;
    btn.disabled = true; span.textContent = 'Senden…';
    setTimeout(() => {
      f.reset();
      btn.disabled = false; span.textContent = orig;
      ok.classList.add('show');
      setTimeout(() => ok.classList.remove('show'), 5000);
    }, 1100);
  });
})();
