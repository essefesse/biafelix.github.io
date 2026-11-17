/* ───────────────────────────────────────────────
   BIA FÉLIX · PORTFOLIO · interactions
   Cinematic, hand-tuned vanilla JS.
   ─────────────────────────────────────────────── */

(() => {

  const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ─── 0. Mark hero loaded (subtle zoom-out into place) ─── */
  requestAnimationFrame(() => {
    document.querySelector('.hero')?.classList.add('is-loaded');
  });

  /* ─── 1. FLIP CARDS ─── */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('a')) return;
      card.classList.toggle('is-flipped');
    });
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.card')) {
      document.querySelectorAll('.card.is-flipped').forEach(c => c.classList.remove('is-flipped'));
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.card.is-flipped').forEach(c => c.classList.remove('is-flipped'));
    }
  });

  /* ─── 2. Scroll reveal ─── */
  if ('IntersectionObserver' in window) {

    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0', 10);
        setTimeout(() => el.classList.add('is-visible'), delay);
        revealIO.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('will-reveal');
      revealIO.observe(el);
    });

    const generalIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          generalIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('.card, .section-head, .card-showcase, .about__metrics').forEach(el => {
      if (!el.dataset.reveal) {
        el.classList.add('will-reveal');
        generalIO.observe(el);
      }
    });

    document.querySelectorAll('.card').forEach((card, i) => {
      card.style.transitionDelay = (i % 3) * 80 + 'ms';
    });

  }

  /* ─── 3. Topbar: scroll state ─── */
  const topbar = document.getElementById('topbar');
  const hero   = document.querySelector('.hero');
  if (topbar && hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([entry]) => { topbar.classList.toggle('is-scrolled', !entry.isIntersecting); },
      { threshold: 0.05 }
    );
    io.observe(hero);
  }
  // fallback for embedded viewers where the observer never fires
  if (topbar) {
    const onScroll = () => topbar.classList.toggle('is-scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── 4. Orbit hover: color shift to brand color, gentle star sparks ─── */
  const SPARK_COLORS = {
    yellow: '#FFC107', red: '#FF1D25', pink: '#F2A7C8', lilac: '#C4B5FD', green: '#22C55E',
  };

  function spawnStars(el) {
    if (prefersReducedMotion) return;
    const rect = el.getBoundingClientRect();
    const color = SPARK_COLORS[el.dataset.spark] || '#FFC107';
    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'spark-star';
      star.textContent = '★';
      star.style.color = color;
      star.style.left = (rect.left + Math.random() * rect.width) + 'px';
      star.style.top  = (rect.top  + Math.random() * rect.height) + 'px';
      star.style.fontSize = (11 + Math.random() * 11) + 'px';
      const angle = Math.random() * Math.PI * 2;
      const dist  = 45 + Math.random() * 60;
      star.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
      star.style.setProperty('--dy', (Math.sin(angle) * dist - 28) + 'px');
      star.style.setProperty('--dr', ((Math.random() - 0.5) * 720) + 'deg');
      document.body.appendChild(star);
      setTimeout(() => star.remove(), 1300);
    }
  }

  document.querySelectorAll('.orbit, .hover-spark').forEach(el => {
    // set custom hover color from data-color
    const c = el.dataset.color;
    if (c) el.style.setProperty('--hover-color', c);

    let cooling = false;
    el.addEventListener('mouseenter', () => {
      if (cooling) return;
      cooling = true;
      spawnStars(el);
      setTimeout(() => { cooling = false; }, 700);
    });
  });

  /* ─── 5. Smooth anchor scroll for nav chips ─── */
  const HEADER_H = 80;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - HEADER_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ─── 6. Contact video: pause when off-screen + show fallback if source missing ─── */
  const video = document.getElementById('contactVideo');
  const bgFallback = document.getElementById('contactBgFallback');
  if (video) {
    // If after 1.2s the video hasn't loaded any data, treat as missing → show fallback
    setTimeout(() => {
      const ready = video.readyState >= 2; // HAVE_CURRENT_DATA or more
      if (!ready) {
        video.style.display = 'none';
        if (bgFallback) bgFallback.classList.add('is-on');
      }
    }, 1200);

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) video.play().catch(() => {}); else video.pause(); },
        { threshold: 0.1 }
      );
      io.observe(video);
    }
  }

  /* ─── 7. Magnetic buttons (light pull toward cursor) ─── */
  const supportsHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover && !prefersReducedMotion) {
    document.querySelectorAll('.magnet').forEach(el => {
      const STRENGTH = 0.28;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) * STRENGTH;
        const dy = (e.clientY - (r.top  + r.height / 2)) * STRENGTH;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ─── 9. Parallax on hero portrait + hi label (subtle) ─── */
  const portrait = document.getElementById('heroPortrait');
  const hi = document.querySelector('.hero__hi');
  if (portrait && !prefersReducedMotion) {
    let ticking = false;
    const onMove = e => {
      if (ticking) return;
      ticking = true;
      const w = window.innerWidth, h = window.innerHeight;
      const nx = (e.clientX / w - 0.5);
      const ny = (e.clientY / h - 0.5);
      requestAnimationFrame(() => {
        portrait.style.transform = `translate3d(${nx * -14}px, ${ny * -14}px, 0)`;
        if (hi) hi.style.transform = `translate3d(${nx * 10}px, ${ny * 10}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener('mousemove', onMove);
  }

  /* ─── 10. Scroll-linked parallax on portrait ─── */
  if (portrait && !prefersReducedMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY);
        portrait.style.setProperty('--scroll-y', y);
        // soft drift on the portrait image itself
        const img = portrait.querySelector('img');
        if (img) img.style.transform = `scale(1.02) translate3d(0, ${y * 0.06}px, 0)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ─── 11. Case index: open one case at a time ─── */
  document.querySelectorAll('.case.is-collapsible').forEach(c => {
    const btn = c.querySelector('.case__toggle');
    const label = c.querySelector('.case__toggle-label');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const open = !c.classList.contains('is-open');
      document.querySelectorAll('.case.is-open').forEach(o => {
        if (o === c) return;
        o.classList.remove('is-open');
        const b = o.querySelector('.case__toggle'); if (b) b.setAttribute('aria-expanded', 'false');
        const l = o.querySelector('.case__toggle-label'); if (l) l.textContent = 'Read the full case';
      });
      c.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      if (label) label.textContent = open ? 'Close the case' : 'Read the full case';
      if (open) {
        const top = c.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ─── 12. Case carousel: side arrows, swipe, keys ─── */
  const carousel = document.querySelector('.cases');
  if (carousel) {
    const track = carousel.querySelector('.cases__track');
    const slides = Array.from(track.children).filter(el => el.classList.contains('case'));
    const prev = carousel.querySelector('.cases__arrow--prev');
    const next = carousel.querySelector('.cases__arrow--next');
    const counter = document.querySelector('.cases__current');
    const pad = n => String(n).padStart(2, '0');
    let index = 0;

    const placeArrows = () => {
      const media = slides[index] && slides[index].querySelector('.case__media');
      if (media) carousel.style.setProperty('--media-h', media.offsetHeight + 'px');
    };
    const closeAll = () => {
      slides.forEach(o => {
        if (!o.classList.contains('is-open')) return;
        o.classList.remove('is-open');
        const b = o.querySelector('.case__toggle'); if (b) b.setAttribute('aria-expanded', 'false');
        const l = o.querySelector('.case__toggle-label'); if (l) l.textContent = 'Read the full case';
      });
    };
    const update = () => {
      const base = slides[0].offsetLeft;
      let i = 0, best = Infinity;
      slides.forEach((sl, k) => { const d = Math.abs(sl.offsetLeft - base - track.scrollLeft); if (d < best) { best = d; i = k; } });
      if (i !== index) { index = i; closeAll(); }
      if (counter) counter.textContent = pad(index + 1);
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
      placeArrows();
    };
    const go = i => {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: slides[i].offsetLeft - slides[0].offsetLeft, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };
    prev.addEventListener('click', () => go(index - 1));
    next.addEventListener('click', () => go(index + 1));
    track.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); go(index - 1); }
    });
    window.addEventListener('resize', () => { go(index); placeArrows(); });
    slides.forEach(sl => { const img = sl.querySelector('.case__media img'); if (img) img.addEventListener('load', placeArrows); });
    update();
  }

  /* ─── 13. "Taste is the through line": the l of "line" becomes one line through the work ─── */
  (function throughLine() {
    const NS = 'http://www.w3.org/2000/svg';
    const L = document.querySelector('.tl-l');
    const contact = document.getElementById('contact');
    const work = document.getElementById('work');
    const talk = document.querySelector('.contact__big-em');
    const quote = document.querySelector('.about__aside-quote .line--c');
    if (!L || !contact || !work || !quote) return;

    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'through-line');
    svg.setAttribute('aria-hidden', 'true');
    const stem = document.createElementNS(NS, 'path');
    stem.setAttribute('class', 'through-line__stem');
    const path = document.createElementNS(NS, 'path');
    const defs = document.createElementNS(NS, 'defs');
    const mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', 'tl-gaps'); mask.setAttribute('maskUnits', 'userSpaceOnUse');
    const soft = document.createElementNS(NS, 'filter');
    soft.setAttribute('id', 'tl-soft'); soft.setAttribute('x', '-20%'); soft.setAttribute('y', '-20%'); soft.setAttribute('width', '140%'); soft.setAttribute('height', '140%');
    soft.innerHTML = '<feGaussianBlur stdDeviation="6"/>';
    defs.appendChild(soft);
    defs.appendChild(mask); svg.appendChild(defs);
    path.setAttribute('mask', 'url(#tl-gaps)');
    svg.appendChild(stem);
    svg.appendChild(path);
    document.body.appendChild(svg);

    // layout position, ignoring reveal transforms that are still animating
    const box = el => {
      let x = 0, y = 0, n = el;
      while (n) { x += n.offsetLeft || 0; y += n.offsetTop || 0; n = n.offsetParent; }
      const w = el.offsetWidth, h = el.offsetHeight;
      return { l: x, r: x + w, t: y, b: y + h, w, h };
    };
    const f = n => Math.round(n * 10) / 10;
    let length = 0, samples = [], stemAt = 0, bx = 0, baseY = 0, spineX = 0, gaps = [];

    // vertical S-curve: tangents stay vertical at both ends, so there are no kinks
    const down = (x1, y1, x2, y2) => { const m = (y2 - y1) * 0.5; return ` C ${f(x1)} ${f(y1 + m)}, ${f(x2)} ${f(y2 - m)}, ${f(x2)} ${f(y2)}`; };

    // straight runs joined by true quarter-circle corners: calm, drawn-by-hand-with-a-ruler
    const rounded = (pts, radii) => {
      const K = 0.5523;
      let d = `M ${f(pts[0][0])} ${f(pts[0][1])}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const P = pts[i - 1], C = pts[i], N = pts[i + 1];
        const l1 = Math.hypot(C[0] - P[0], C[1] - P[1]), l2 = Math.hypot(N[0] - C[0], N[1] - C[1]);
        const r = Math.min(radii[i] || 60, l1 * 0.5, l2 * 0.5);
        const a = [C[0] + (P[0] - C[0]) * r / l1, C[1] + (P[1] - C[1]) * r / l1];
        const b = [C[0] + (N[0] - C[0]) * r / l2, C[1] + (N[1] - C[1]) * r / l2];
        d += ` L ${f(a[0])} ${f(a[1])}`;
        d += ` C ${f(a[0] + (C[0] - a[0]) * K)} ${f(a[1] + (C[1] - a[1]) * K)}, ${f(b[0] + (C[0] - b[0]) * K)} ${f(b[1] + (C[1] - b[1]) * K)}, ${f(b[0])} ${f(b[1])}`;
      }
      const E = pts[pts.length - 1];
      return d + ` L ${f(E[0])} ${f(E[1])}`;
    };

    const build = () => {
      const W = document.documentElement.clientWidth;
      const H = document.documentElement.scrollHeight;
      svg.setAttribute('width', W); svg.setAttribute('height', H);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      const mobile = W < 700;
      const narrow = W <= 820;              // timeline in one column, spine on the left
      const g = mobile ? 8 : Math.max(24, Math.min(36, W * 0.022));
      const gl = g, gr = W - g;
      const R = mobile ? 36 : 72;
      const q = sel => document.querySelector(sel);
      const stats = q('.proofbar__stats'), aside = q('.about__split-aside');
      if (!stats || !aside) return;
      const ST = box(stats), AS = box(aside), CO = box(contact);

      // "Taste is the through line": the line takes the place of the rule beside the quote,
      // then runs underneath "through line." and on through the page. The letters stay letters.
      const rg = document.createRange(); rg.selectNodeContents(quote);
      const qr = rg.getBoundingClientRect();
      const uY = qr.bottom + scrollY + (mobile ? 6 : 8);
      const qL = qr.left + scrollX;
      const big = mobile ? 70 : 170;
      // the line comes down onto "A working belief", is interrupted by the words, and comes out under "through"
      const eyebrow = q('.about__aside-eyebrow');
      let EB = { l: qL, t: AS.t, b: AS.t + 14, r: qL + 120 };
      if (eyebrow) { const er = document.createRange(); er.selectNodeContents(eyebrow); const e = er.getBoundingClientRect(); EB = { l: e.left + scrollX, r: e.right + scrollX, t: e.top + scrollY, b: e.bottom + scrollY }; }
      const railX = (Math.min(EB.l, qL) + qr.right + scrollX) / 2;   // centred on the phrase
      const story = q('.about__split-story');
      const overY = mobile && story ? (box(story).b + EB.t) / 2 : EB.t - 90;   // never across the paragraph
      const tuck = mobile ? 30 : 44;
      const qTop = box(quote.closest('.about__aside-quote') || quote).t;
      gaps = [
        [qL - 40, qTop + 2, qr.right + scrollX - qL + 80, qr.bottom + scrollY - qTop - 4],
      ];
      bx = qL; baseY = uY;

      // a thread, not a pipe: one continuous centripetal Catmull-Rom curve through a few resting points
      const tlEl = q('.timeline');
      const TL = tlEl ? box(tlEl) : { l: 0, w: W, t: CO.t - 200, b: CO.t - 100 };
      spineX = narrow ? TL.l + 14 : TL.l + TL.w / 2;
      const firstCard = q('.tl-item .tl-card');
      const into = Math.min(TL.t - 10, (firstCard ? box(firstCard).t : TL.t) - 36);
      let T = null, ty = CO.b - 60, tL = gl;
      if (talk) {
        T = box(talk);
        const tr = document.createRange(); tr.selectNodeContents(talk);
        const tb = tr.getBoundingClientRect();
        ty = T.b + 6; tL = tb.left + scrollX; T.r = tb.right + scrollX;
      }
      const s = mobile ? 0.45 : 1;                          // scale of the gestures
      let headBottom = 0;
      const pts = [];
      const run = (x1, y1, x2, y2, step = 110) => {         // straight stretches stay straight, like a pulled thread
        const n = Math.max(1, Math.round(Math.hypot(x2 - x1, y2 - y1) / step));
        for (let i = 0; i <= n; i++) pts.push([x1 + (x2 - x1) * i / n, y1 + (y2 - y1) * i / n]);
      };
      const lastRect = el => { const r = document.createRange(); r.selectNodeContents(el); const rs = r.getClientRects(); return rs[rs.length - 1]; };

      // 1) it leaves from the full stop of "…AI systems I designed."
      const head = q('.proofbar__line');
      const hr = lastRect(head);
      const hx = hr.right + scrollX + (mobile ? 6 : 14), hy = hr.top + scrollY + hr.height * 0.58;
      const BR = q('.brands') ? box(q('.brands')) : { t: ST.b + 40, b: ST.b + 100 };
      const AB = box(q('#about'));

      // the eyebrow it lands on, and "through", which it comes out under
      const ax = EB.l + (EB.r - EB.l) * 0.6;
      const lineC = quote;
      const thRange = document.createRange();
      thRange.setStart(lineC, 0);
      thRange.setEndBefore(L);
      const thR = thRange.getBoundingClientRect();
      const thX = thR.left + scrollX + thR.width * 0.42;

      // it begins just under "A working belief", runs behind the words, comes out under "through"
      pts.push([ax - 6, EB.b + 10]);
      pts.push([(ax + thX) / 2, (qTop + uY) / 2]);
      pts.push([thX, uY + 10]);
      // 3) a slow S down to the middle of the work, where it becomes the timeline
      if (!narrow) {
        pts.push([thX - 10, uY + 75]);
        pts.push([spineX + (thX - spineX) * 0.42, uY + (into - uY) * 0.5]);
      } else {
        // straight down the left edge; "02 Work" sits to the right of the line
        const WH = box(q('#work .section-head'));
        headBottom = WH.t;
        pts.push([thX - 4, uY + 50]);
        pts.push([spineX + 6, WH.t - 30]);
      }
      run(spineX, narrow ? headBottom : into - 70, spineX, TL.b);
      // 4) and it ends under "talk."
      if (T) {
        // the thread ties a loop beside "Contact", then sweeps down and under "talk."
        const lab = q('.contact__section-label'), cta = q('.contact__cta');
        const LB = lab ? box(lab) : { t: CO.t + 80, b: CO.t + 110 };
        const CT = cta ? box(cta) : { t: ty + 60 };
        const rx = mobile ? 38 : 66, ry = mobile ? 24 : 40;
        const cx = T.r + (W - T.r) * (mobile ? 0.55 : 0.42);
        const cy = (LB.t + LB.b) / 2 + (mobile ? 4 : 10);
        pts.push([spineX + (cx - rx - spineX) * 0.5, (TL.b + cy) / 2 + 10]);
        pts.push([cx - rx * 0.9, cy - ry * 0.1]);          // enters the loop
        pts.push([cx - rx * 0.15, cy + ry * 0.85]);
        pts.push([cx + rx * 0.75, cy + ry * 0.6]);
        pts.push([cx + rx, cy - ry * 0.25]);
        pts.push([cx + rx * 0.35, cy - ry]);
        pts.push([cx - rx * 0.55, cy - ry * 0.55]);
        pts.push([cx - rx * 1.15, cy + ry * 0.5]);         // crosses itself and leaves
        const low = Math.min(ty + (mobile ? 16 : 26), CT.t - 12);
        const tw = T.r - tL;                                // width of the word itself
        pts.push([T.r + (cx - T.r) * 0.5, (cy + low) / 2 + ry * 0.6]);
        pts.push([T.r + (mobile ? 6 : 14), low]);
        pts.push([tL - 6, ty + (mobile ? 2 : 4)]);          // ends under "talk."
      }
      const thread = (P, alpha = 0.5) => {
        const dist = (u, v) => Math.hypot(v[0] - u[0], v[1] - u[1]);
        let out = `M ${f(P[0][0])} ${f(P[0][1])}`;
        for (let i = 0; i < P.length - 1; i++) {
          const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || P[i + 1];
          const d1 = Math.pow(dist(p0, p1), alpha), d2 = Math.pow(dist(p1, p2), alpha), d3 = Math.pow(dist(p2, p3), alpha);
          let c1 = p1, c2 = p2;
          if (d1 > 1e-6) c1 = [0, 1].map(k => (d1 * d1 * p2[k] - d2 * d2 * p0[k] + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1[k]) / (3 * d1 * (d1 + d2)));
          else c1 = [p1[0] + (p2[0] - p1[0]) / 3, p1[1] + (p2[1] - p1[1]) / 3];
          if (d3 > 1e-6) c2 = [0, 1].map(k => (d3 * d3 * p1[k] - d2 * d2 * p3[k] + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2[k]) / (3 * d3 * (d3 + d2)));
          else c2 = [p2[0] - (p2[0] - p1[0]) / 3, p2[1] - (p2[1] - p1[1]) / 3];
          out += ` C ${f(c1[0])} ${f(c1[1])}, ${f(c2[0])} ${f(c2[1])}, ${f(p2[0])} ${f(p2[1])}`;
        }
        return out;
      };
      const d = thread(pts);
      stem.setAttribute('d', '');
      document.documentElement.classList.toggle('tl-mobile', mobile);

      path.setAttribute('d', d);
      // where words sit on the line, the line gives way
      mask.innerHTML = '';
      const full = document.createElementNS(NS, 'rect');
      full.setAttribute('x', 0); full.setAttribute('y', 0); full.setAttribute('width', W); full.setAttribute('height', H); full.setAttribute('fill', '#fff');
      mask.appendChild(full);
      const holes = document.createElementNS(NS, 'g');
      mask.appendChild(holes);
      gaps.forEach(([x, y, w, h]) => {
        const r = document.createElementNS(NS, 'rect');
        r.setAttribute('x', x.toFixed(1)); r.setAttribute('y', y.toFixed(1)); r.setAttribute('width', w.toFixed(1)); r.setAttribute('height', h.toFixed(1)); r.setAttribute('fill', '#000');
        holes.appendChild(r);
      });
      length = path.getTotalLength();
      path.style.strokeDasharray = `${length} ${length}`;
      samples = [];
      stemAt = 0;
      { // length along the path where the l's stem is finished
        let best = Infinity;
        for (let i = 0; i <= 400; i++) { const sL = length * i / 400, pt = path.getPointAtLength(sL), dd = Math.hypot(pt.x - bx, pt.y - baseY); if (dd < best) { best = dd; stemAt = sL; } }
      }
      const n = 600;
      for (let i = 0; i <= n; i++) { const s = length * i / n; samples.push([s, path.getPointAtLength(s).y]); }
      document.documentElement.classList.add('has-through-line');
      placeStations();
      draw();
    };

    // ── stations: each block waits for the line, then arrives with it ──
    let stations = [];
    const placeStations = () => {
      stations.forEach(st => st.dot && st.dot.remove());
      stations = [];
      if (prefersReducedMotion) return;
      const mobile = document.documentElement.clientWidth < 700;
      document.querySelectorAll('.tl-item').forEach(el => {
        el.classList.add('tl-wait');
        const card = el.querySelector('.tl-card');
        const y = box(card).t + 28;
        let at = length;
        for (let i = 0; i < samples.length; i++) { if (samples[i][1] >= y - 1 && Math.abs(path.getPointAtLength(samples[i][0]).x - spineX) < 4) { at = samples[i][0]; break; } }
        const dot = document.createElementNS(NS, 'circle');
        dot.setAttribute('class', 'through-line__dot');
        dot.setAttribute('cx', spineX.toFixed(1)); dot.setAttribute('cy', y.toFixed(1)); dot.setAttribute('r', mobile ? '4' : '5');
        if (el.classList.contains('tl-lit')) dot.classList.add('is-on');
        svg.appendChild(dot);
        stations.push({ el, at, dot });
      });
    };

    // draw exactly as far as the reader has reached
    const draw = () => {
      if (!length) return;
      if (prefersReducedMotion) { path.style.strokeDashoffset = 0; return; }
      const target = scrollY + window.innerHeight * 0.82;
      let drawn = 0;
      for (let i = 0; i < samples.length; i++) { if (samples[i][1] > target && samples[i][0] > 60) break; drawn = samples[i][0]; }
      if (scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) drawn = length;
      path.style.strokeDashoffset = length - drawn;
      stem.style.opacity = drawn >= stemAt ? 1 : 0;
      stations.forEach(st => {
        const on = drawn >= st.at - 2;
        if (on) st.el.classList.add('tl-lit');             // once out, a block stays out
        if (on && st.dot) st.dot.classList.add('is-on');
      });
    };

    let raf = 0;
    const schedule = fn => () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fn); };
    window.addEventListener('scroll', schedule(draw), { passive: true });
    window.addEventListener('resize', schedule(build));
    window.addEventListener('load', build);
    if ('ResizeObserver' in window) new ResizeObserver(schedule(build)).observe(document.body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(build);
    build();
  })();

  /* ─── 14. Timeline cards: open the full case in place ─── */
  document.querySelectorAll('.tl-card__toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.tl-card');
      const body = document.getElementById(btn.getAttribute('aria-controls'));
      const open = body.hasAttribute('hidden');
      if (open) body.removeAttribute('hidden'); else body.setAttribute('hidden', '');
      card.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.querySelector('.tl-card__toggle-label').textContent = open ? 'Close the case' : 'Read the full case';
      if (!open) card.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
  });

})();
