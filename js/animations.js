// ======================================
// SCROLL-TRIGGERED ANIMATIONS (GSAP ScrollTrigger)
// ======================================

(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  if (prefersReduced) {
    // Make everything visible immediately
    document.querySelectorAll('.anim-fade-up, .anim-fade-in, .anim-scale-in, .anim-step-1, .anim-step-2, .anim-step-3')
      .forEach(el => el.classList.add('anim-done'));
    return;
  }

  const dist = isMobile ? 24 : 40;
  const dur  = isMobile ? 0.5 : 0.7;

  // ---- Services cards ----
  gsap.from('.services-grid .service-card', {
    scrollTrigger: {
      trigger: '.services-grid',
      start: 'top 82%',
    },
    opacity: 0,
    y: dist,
    duration: dur,
    stagger: 0.08,
    ease: 'power3.out',
  });

  // ---- Steps spotlight (GSAP scrub — perfectly scroll-synced) ----
  const hiwEl   = document.getElementById('how-it-works');
  const stepEls = hiwEl ? Array.from(hiwEl.querySelectorAll('.step')) : [];
  if (hiwEl && stepEls.length) {
    hiwEl.classList.add('spotlight-on');
    ScrollTrigger.create({
      trigger: hiwEl,
      start: 'top 65%',
      end:   'bottom 35%',
      scrub: 0.6,
      onUpdate(self) {
        const p   = self.progress;
        const idx = p < 0.33 ? 0 : p < 0.67 ? 1 : 2;
        stepEls.forEach((s, i) => {
          s.classList.toggle('sp-active', i === idx);
          s.classList.toggle('sp-dim',   i !== idx);
        });
      }
    });
  }

  // ---- Testimonials ----
  gsap.from('.testimonial-card', {
    scrollTrigger: { trigger: '.testimonials-row', start: 'top 82%' },
    opacity: 0,
    y: dist,
    duration: dur,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // ---- CTA block ----
  gsap.from('.cta-block > *', {
    scrollTrigger: { trigger: '.cta-block', start: 'top 80%' },
    opacity: 0,
    y: 30,
    duration: dur,
    stagger: 0.1,
    ease: 'power3.out',
  });

  // ---- Section headers ----
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header, {
      scrollTrigger: { trigger: header, start: 'top 88%' },
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out',
    });
  });

  // ---- Footer ----
  gsap.from('#footer .footer-inner', {
    scrollTrigger: { trigger: '#footer', start: 'top 95%' },
    opacity: 0,
    y: 16,
    duration: 0.5,
    ease: 'power2.out',
  });
})();
