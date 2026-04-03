// ======================================
// MAIN — Nav, mobile menu, misc
// ======================================

(function () {
  'use strict';

  document.documentElement.classList.add('js-loaded');

  // ---- Nav scroll state ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function onScroll() {
    const y = window.scrollY;
    if (y > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ---- Steps reveal (entrance only — spotlight handled by GSAP in animations.js) ----
  const hiwSection = document.getElementById('how-it-works');
  if (hiwSection) {
    const stepsObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      hiwSection.classList.add('steps-visible');
      stepsObserver.unobserve(hiwSection);
    }, { threshold: 0.15 });
    stepsObserver.observe(hiwSection);
  }

  // ---- Side nav active section tracking ----
  const snavItems = document.querySelectorAll('.snav-item[data-snav]');
  if (snavItems.length) {
    const sectionIds = Array.from(snavItems).map(a => a.dataset.snav);

    function updateSideNav() {
      const threshold = window.innerHeight * 0.45;
      let activeId = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= threshold) activeId = id;
      }
      snavItems.forEach(item =>
        item.classList.toggle('snav-active', item.dataset.snav === activeId)
      );
    }

    window.addEventListener('scroll', updateSideNav, { passive: true });
    updateSideNav();
  }

  // ---- Smooth anchor scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
