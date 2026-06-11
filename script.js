'use strict';

/* =====================================================
   LOADER
   ===================================================== */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  let pct = 0;
  const tick = setInterval(() => {
    pct += Math.random() * 18 + 6;
    if (pct >= 100) {
      pct = 100;
      clearInterval(tick);
      progress.style.width = '100%';
      setTimeout(() => loader.classList.add('done'), 500);
    } else {
      progress.style.width = pct + '%';
    }
  }, 90);
})();

/* =====================================================
   CUSTOM CURSOR
   ===================================================== */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    tx = e.clientX; ty = e.clientY;
  });

  // Lerp trail
  let cx = 0, cy = 0;
  function lerp(a, b, t) { return a + (b - a) * t; }
  function animateTrail() {
    cx = lerp(cx, tx, 0.12);
    cy = lerp(cy, ty, 0.12);
    trail.style.left = cx + 'px';
    trail.style.top  = cy + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Hoverable elements
  const hoverEls = document.querySelectorAll('a, button, .tag, .proj-card, .svc-card, .skill-cat');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      trail.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      trail.classList.remove('hovering');
    });
  });
})();

/* =====================================================
   PARTICLE CANVAS — Neural Network
   ===================================================== */
(function initParticles() {
  const canvas = document.getElementById('particlesCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles;
  const COUNT = 80;
  const MAX_DIST = 150;

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * (W || window.innerWidth);
      this.y  = init ? Math.random() * (H || window.innerHeight) : (Math.random() < .5 ? -5 : H + 5);
      this.vx = (Math.random() - .5) * .5;
      this.vy = (Math.random() - .5) * .5;
      this.r  = Math.random() * 2 + 1;
      this.alpha = Math.random() * .5 + .2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
        this.reset(false);
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(129,140,248,${this.alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(129,140,248,${alpha})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); });

  // Mouse repulsion
  let mx = -9999, my = -9999;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function applyMouseForce() {
    if (particles) {
      particles.forEach(p => {
        const dx = p.x - mx;
        const dy = p.y - my;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 80) {
          p.vx += (dx / d) * .04;
          p.vy += (dy / d) * .04;
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > 1.5) { p.vx = (p.vx / speed) * 1.5; p.vy = (p.vy / speed) * 1.5; }
        }
      });
    }
    requestAnimationFrame(applyMouseForce);
  })();

  init();
  draw();
})();

/* =====================================================
   TYPEWRITER
   ===================================================== */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Full-Stack Development',
    'System Architecture',
    'Complex Problem Solving',
    'AI Integration',
    'Team Collaboration',
    'DevOps & CI/CD',
  ];
  let pi = 0, ci = 0, deleting = false;
  const typeSpeed  = 65;
  const deleteSpeed = 35;
  const pause = 2000;

  function tick() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; setTimeout(tick, pause); return; }
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
  }
  tick();
})();

/* =====================================================
   NAV — scroll class + mobile toggle + active links
   ===================================================== */
(function initNav() {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');
  const navLinkEls = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });

  // Close mobile nav on link click
  navLinkEls.forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.id;
    });
    navLinkEls.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  updateActiveLink();
})();

/* =====================================================
   SMOOTH SCROLL
   ===================================================== */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* =====================================================
   SCROLL REVEAL — Intersection Observer
   ===================================================== */
(function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
})();

/* =====================================================
   COUNTER ANIMATION
   ===================================================== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-n');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el  = en.target;
      const end = parseInt(el.dataset.target, 10);
      const dur = 1600;
      const start = performance.now();
      function step(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.floor(eased * end);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = end;
      }
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: .5 });

  counters.forEach(c => obs.observe(c));
})();

/* =====================================================
   CONTACT FORM
   ===================================================== */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.querySelector('span').textContent = 'Sending…';

    // Simulate async send
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Nachricht senden';
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
  });
})();
