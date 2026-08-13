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

})();
