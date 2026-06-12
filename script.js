'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

/* =====================================================
   LOADER
   ===================================================== */
(function loader() {
  const el    = document.getElementById('loader');
  const fill  = document.getElementById('loaderFill');
  const count = document.getElementById('loaderCount');
  let p = 0;
  const iv = setInterval(() => {
    p += Math.random() * 28 + 22;
    if (p >= 100) {
      p = 100;
      clearInterval(iv);
      fill.style.width = '100%';
      count.textContent = '100';
      setTimeout(() => {
        el.classList.add('done');
        document.body.classList.add('loaded');
        kickHero();
      }, 200);
    } else {
      fill.style.width = p + '%';
      count.textContent = Math.floor(p);
    }
  }, 55);
})();

function kickHero() {
  $$('.hero [data-reveal]').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), 80 * i);
  });
}

/* =====================================================
   CMS — load content.json and hydrate the page.
   Falls back silently to the static HTML when offline.
   ===================================================== */
const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
const ICON_CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>';

async function loadContent() {
  try {
    const res = await fetch('content.json', { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

function hydrate(c) {
  /* HERO */
  if (c.hero) {
    const lines = $$('.ht-line > span');
    (c.hero.lines || []).forEach((html, i) => { if (lines[i]) lines[i].innerHTML = html; });
    if (c.hero.lead)    $('.hero-lead').innerHTML = c.hero.lead;
    if (c.hero.tagline) $('.hero-tag').innerHTML  = '<span class="tag-dot"></span>' + c.hero.tagline;
    const [cta1, cta2] = $$('.hero-actions .btn span');
    if (cta1 && c.hero.ctaPrimary)   cta1.textContent = c.hero.ctaPrimary;
    if (cta2 && c.hero.ctaSecondary) cta2.textContent = c.hero.ctaSecondary;
  }

  /* MARQUEE */
  if (c.marquee && c.marquee.length) {
    $('.marquee-track').innerHTML = [...c.marquee, ...c.marquee]
      .map(t => `<span>${t}</span><span class="m-sep">✦</span>`).join('');
  }

  /* WORK */
  if (c.work && c.work.length) {
    $('.work-list').innerHTML = c.work.map((w, i) => `
      <a href="#contact" class="work-item" data-cursor="view" data-reveal>
        <div class="wi-index">${String(i + 1).padStart(2, '0')}</div>
        <div class="wi-main">
          <h3 class="wi-title">${w.title}</h3>
          <p class="wi-desc">${w.desc || ''}</p>
        </div>
        <div class="wi-tags">${(w.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
        <div class="wi-year">${w.year || ''}</div>
        <div class="wi-media"><div class="wm-inner grad-${(i % 4) + 1}"></div></div>
      </a>`).join('');
  }

  /* ABOUT */
  if (c.about) {
    if (c.about.statement) $('.about-statement').innerHTML = c.about.statement;
    if (c.about.text)      $('.about-text').innerHTML      = c.about.text;
    if (c.about.facts) {
      $$('.fact').forEach((el, i) => {
        const f = c.about.facts[i];
        if (!f) return;
        el.querySelector('.fact-n').dataset.count = f.n;
        el.querySelector('.fact-l').textContent   = f.label;
      });
    }
    const cols = $$('.skill-col');
    if (c.about.design && cols[0])
      cols[0].querySelector('ul').innerHTML = c.about.design.map(s => `<li>${s}</li>`).join('');
    if (c.about.development && cols[1])
      cols[1].querySelector('ul').innerHTML = c.about.development.map(s => `<li>${s}</li>`).join('');
  }

  /* SERVICES */
  if (c.services && c.services.length) {
    $('.services-list').innerHTML = c.services.map((s, i) => `
      <article class="svc-row" data-reveal data-cursor="hover">
        <div class="svc-num">${String(i + 1).padStart(2, '0')}</div>
        <h3 class="svc-name">${s.name}</h3>
        <p class="svc-text">${s.text || ''}</p>
        <div class="svc-meta">${s.meta || ''}</div>
      </article>`).join('');
  }

  /* PRICING */
  if (c.pricing && c.pricing.plans && c.pricing.plans.length) {
    if (c.pricing.lead) $('.pricing-lead').innerHTML = c.pricing.lead;
    $('.pricing-grid').innerHTML = c.pricing.plans.map(p => `
      <div class="price-card${p.featured ? ' price-featured' : ''}" data-reveal>
        ${p.featured ? `<div class="pc-badge">${p.badge || 'Beliebteste Wahl'}</div>` : ''}
        <div class="pc-header">
          <span class="pc-tier">${p.tier}</span>
          <div class="pc-price">
            <span class="pc-currency">€</span>
            <span class="pc-amount">${p.price}${p.plus ? '<span class="pc-plus">+</span>' : ''}</span>
          </div>
          <p class="pc-tagline">${p.tagline || ''}</p>
        </div>
        <ul class="pc-features">
          ${(p.features || []).map(f => f.included
            ? `<li><span class="pc-check">✓</span> ${f.text}</li>`
            : `<li class="pc-muted"><span class="pc-dash">–</span> ${f.text}</li>`).join('')}
        </ul>
        <div class="pc-meta">
          <span class="pc-time">${ICON_CLOCK}${p.time || ''}</span>
          <span class="pc-best">${p.best || ''}</span>
        </div>
        <a href="#contact" class="btn ${p.featured ? 'btn-light magnetic' : 'btn-line'} pc-cta" data-cursor="hover">
          <span>${p.cta || 'Projekt starten'}</span>${ICON_ARROW}
        </a>
      </div>`).join('');
    const note = $('.pricing-note');
    if (note && c.pricing.note) {
      note.innerHTML = `${c.pricing.note} · <a href="#contact" data-cursor="hover">Lass uns reden →</a>`;
    }
  }

  /* CONTACT */
  if (c.contact) {
    if (c.contact.title) $('.contact-title').innerHTML = c.contact.title;
    if (c.contact.lead)  $('.contact-lead').innerHTML  = c.contact.lead;
    if (c.contact.email) {
      const alt = $('.contact-alt a');
      if (alt) { alt.href = 'mailto:' + c.contact.email; alt.textContent = c.contact.email; }
      const mfMail = $('.mf-mail');
      if (mfMail) { mfMail.href = 'mailto:' + c.contact.email; mfMail.textContent = c.contact.email; }
    }
  }

  /* FOOTER */
  if (c.footer) {
    if (c.footer.tagline) $('.footer-tagline').innerHTML = c.footer.tagline;
    if (c.footer.socials && c.footer.socials.length) {
      const col = $$('.footer-col')[1];
      if (col) {
        col.innerHTML = '<span class="fc-head">Social</span>' + c.footer.socials
          .map(s => `<a href="${s.url}" target="_blank" rel="noopener" data-cursor="hover">${s.label}</a>`)
          .join('');
      }
    }
  }
}

/* =====================================================
   INTERACTIONS — bound after hydration; everything that
   touches re-rendered DOM uses event delegation.
   ===================================================== */

/* Custom cursor (delegated hover states) */
function initCursor() {
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

  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor]');
    c.classList.toggle('is-view',  !!t && t.dataset.cursor === 'view');
    c.classList.toggle('is-hover', !!t && t.dataset.cursor !== 'view');
  });
  addEventListener('mouseout',  e => { if (!e.relatedTarget) c.style.opacity = '0'; });
  addEventListener('mouseover', () => { c.style.opacity = '1'; });
}

/* Magnetic buttons */
function bindMagnetic() {
  if (matchMedia('(hover: none)').matches) return;
  $$('.magnetic').forEach(el => {
    if (el.dataset.magBound) return;
    el.dataset.magBound = '1';
    const strength = 0.35;
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * strength}px, ${(e.clientY - r.top - r.height / 2) * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
}

/* Work media preview follows cursor — positions only the hovered
   item's preview, no permanent rAF loop. */
function initWorkMedia() {
  if (matchMedia('(hover: none)').matches) return;
  let raf = 0;
  document.addEventListener('mousemove', e => {
    const item = e.target.closest('.work-item');
    if (!item || raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const m = item.querySelector('.wi-media');
      if (m) { m.style.left = e.clientX + 'px'; m.style.top = e.clientY + 'px'; }
    });
  });
}

/* Nav: scroll state, active link, burger, progress bar */
function initNav() {
  const nav      = document.getElementById('nav');
  const burger   = document.getElementById('navBurger');
  const menu     = document.getElementById('navMenu');
  const progress = document.getElementById('progressBar');

  // Cache section offsets and nav items — querying + reading offsetTop on
  // every scroll event caused layout thrashing.
  const navItems = $$('.nav-item');
  let sections = [], maxScroll = 1;
  function measure() {
    sections = $$('section[id], main[id]').map(s => ({ id: s.id, top: s.offsetTop }));
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  }
  measure();
  addEventListener('resize', measure, { passive: true });
  addEventListener('load', measure);
  setTimeout(measure, 1200); // re-measure after CMS hydration settles

  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = scrollY;
      nav.classList.toggle('scrolled', y > 30);
      if (progress) progress.style.transform = `scaleX(${y / maxScroll})`;
      let cur = '';
      for (const s of sections) if (y >= s.top - 250) cur = s.id;
      navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
    });
  }, { passive: true });

  function closeMenu() {
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.addEventListener('click', e => { if (e.target.closest('.nav-item')) closeMenu(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* Smooth anchors (delegated) */
function initAnchors() {
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

/* Reveal on scroll */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  $$('[data-reveal]').forEach(el => { if (!el.closest('.hero')) io.observe(el); });
}

/* Animated counters */
function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el  = en.target;
      const end = +el.dataset.count;
      const t0  = performance.now();
      (function step(now) {
        const k = Math.min((now - t0) / 1500, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - k, 3)) * end);
        if (k < 1) requestAnimationFrame(step); else el.textContent = end;
      })(t0);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(el => io.observe(el));
}

/* Live CET clock */
function initClock() {
  const el = document.getElementById('localTime');
  if (!el) return;
  const tick = () => {
    el.textContent = new Date().toLocaleTimeString('de-DE', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin'
    });
  };
  tick();
  setInterval(tick, 30000);
}

/* Contact form */
function initForm() {
  const f  = document.getElementById('contactForm');
  const ok = document.getElementById('cfSuccess');
  if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = f.querySelector('button[type="submit"]');
    const span = btn.querySelector('span');
    const orig = span.textContent;
    btn.disabled = true;
    span.textContent = 'Senden…';
    setTimeout(() => {
      f.reset();
      btn.disabled = false;
      span.textContent = orig;
      ok.classList.add('show');
      setTimeout(() => ok.classList.remove('show'), 5000);
    }, 1100);
  });
}

let _content = null;

/* =====================================================
   BOOT
   ===================================================== */
(async function boot() {
  const content = await loadContent();
  if (content) { _content = content; hydrate(content); }

  initCursor();
  bindMagnetic();
  initWorkMedia();
  initNav();
  initAnchors();
  initReveal();
  initCounters();
  initClock();
  initForm();
  initChat();
})();

/* =====================================================
   AI CHAT WIDGET
   ===================================================== */
function initChat() {
  const widget  = document.getElementById('chatWidget');
  const toggle  = document.getElementById('chatToggle');
  const msgs    = document.getElementById('chatMessages');
  const input   = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const noKey   = document.getElementById('chatNoKey');
  if (!widget) return;

  let open    = false;
  let history = [];
  const apiKey = () => localStorage.getItem('cms_groq_key') || '';

  function buildSystem() {
    const c = _content || {};
    const h = c.hero     || {};
    const a = c.about    || {};
    const s = c.services || [];
    const p = (c.pricing || {}).plans || [];
    return [
      'Du bist der Assistent von Felix, einem freiberuflichen Designer und Developer aus Deutschland.',
      'Antworte immer auf Deutsch, freundlich, professionell und prägnant (max. 3 Sätze).',
      '',
      'Über Felix:',
      '- ' + (h.lead || 'Designer & Developer an der Schnittstelle von Ästhetik und Technik.'),
      '- Design-Skills: ' + (a.design || []).join(', '),
      '- Dev-Skills: ' + (a.development || []).join(', '),
      '- ' + (a.facts || []).map(f => f.n + '+ ' + f.label).join(', '),
      '',
      'Services: ' + s.map(sv => sv.name).join(', '),
      'Pakete: ' + p.map(pl => pl.tier + ' ab €' + pl.price).join(', '),
      'Kontakt: fxshr@yahoo.com',
      '',
      'Verweise bei konkreten Projektanfragen auf das Kontaktformular.',
    ].join('\n');
  }

  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

  function addMsg(role, text) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-' + (role === 'user' ? 'user' : 'bot');
    const p = document.createElement('p');
    p.textContent = text;
    div.appendChild(p);
    msgs.appendChild(div);
    scrollDown();
  }

  function setLoading(on) {
    const existing = msgs.querySelector('.chat-typing');
    if (on && !existing) {
      const t = document.createElement('div');
      t.className = 'chat-msg chat-msg-bot chat-typing';
      t.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(t);
      scrollDown();
    } else if (!on && existing) {
      existing.remove();
    }
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    const key = apiKey();
    if (!key) { noKey.style.display = 'block'; return; }
    noKey.style.display = 'none';
    input.value = '';
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    setLoading(true);
    sendBtn.disabled = true;
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'system', content: buildSystem() }, ...history.slice(-10)],
          max_tokens: 300,
          temperature: 0.7
        })
      });
      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || 'Entschuldigung, da ist etwas schiefgelaufen.';
      setLoading(false);
      history.push({ role: 'assistant', content: reply });
      addMsg('bot', reply);
    } catch {
      setLoading(false);
      addMsg('bot', 'Verbindungsfehler. Bitte versuche es erneut.');
    }
    sendBtn.disabled = false;
    input.focus();
  }

  toggle.addEventListener('click', () => {
    open = !open;
    widget.classList.toggle('chat-open', open);
    if (open) setTimeout(() => input.focus(), 300);
  });
  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
}
