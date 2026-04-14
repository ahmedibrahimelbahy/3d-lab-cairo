// ======================================
// CUSTOM CURSOR — dot pointer + spinning 3D cube trail
// Desktop (pointer: fine) only
// ======================================

(function () {
  'use strict';

  if (!window.matchMedia('(pointer: fine)').matches) return;

  const TRAIL = 7;
  const CUBE_SIZE_START = 16; // px, largest cube (closest to cursor)

  // ---- Inject styles ----
  const style = document.createElement('style');
  style.textContent = `
    body.cc-active, body.cc-active * { cursor: none !important; }

    #cc-dot {
      position: fixed;
      top: 0; left: 0;
      width: 8px; height: 8px;
      margin-left: -4px; margin-top: -4px;
      background: #1D58FE;
      border-radius: 50%;
      pointer-events: none;
      z-index: 999999;
      will-change: transform;
    }

    .cc-cube {
      position: fixed;
      top: 0; left: 0;
      pointer-events: none;
      z-index: 999998;
      will-change: transform, opacity;
    }

    .cc-cube svg {
      display: block;
      animation: cc-spin var(--s, 2s) linear infinite;
    }

    @keyframes cc-spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);

  // ---- Main dot ----
  const dot = document.createElement('div');
  dot.id = 'cc-dot';
  document.body.appendChild(dot);

  // ---- Cube trail ----
  const cubes = [];
  for (let i = 0; i < TRAIL; i++) {
    const size   = Math.round(CUBE_SIZE_START - i * 1.5);
    const half   = size / 2;
    const alpha  = (1 - i / TRAIL * 0.85).toFixed(2);
    const spinMs = Math.round(1800 + i * 300);

    const el = document.createElement('div');
    el.className = 'cc-cube';
    el.style.cssText = `width:${size}px;height:${size}px;opacity:${alpha};--s:${spinMs}ms;`;
    el.innerHTML = `
      <svg width="${size}" height="${size}" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="1" width="13" height="13" rx="0.8"
              stroke="rgba(29, 88, 254,0.3)" stroke-width="1.2"/>
        <rect x="1" y="6" width="13" height="13" rx="0.8"
              stroke="rgba(29, 88, 254,${(0.9 - i * 0.08).toFixed(2)})" stroke-width="1.5"
              fill="rgba(29, 88, 254,0.05)"/>
        <line x1="1" y1="6"  x2="6"  y2="1"  stroke="rgba(29, 88, 254,0.45)" stroke-width="1"/>
        <line x1="14" y1="6" x2="19" y2="1"  stroke="rgba(29, 88, 254,0.45)" stroke-width="1"/>
        <line x1="14" y1="19" x2="19" y2="14" stroke="rgba(29, 88, 254,0.35)" stroke-width="1"/>
        <line x1="1" y1="19" x2="6"  y2="14" stroke="rgba(29, 88, 254,0.25)" stroke-width="1"/>
      </svg>`;

    document.body.appendChild(el);
    cubes.push({ el, half });
  }

  document.body.classList.add('cc-active');

  // ---- State ----
  const mouse = { x: -200, y: -200 };
  // Rolling position history — one entry per cube, slightly delayed
  const history = Array.from({ length: TRAIL }, () => ({ x: -200, y: -200 }));

  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  // Hide everything off-screen when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    cubes.forEach(c => (c.el.style.opacity = '0'));
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    cubes.forEach((c, i) => (c.el.style.opacity = (1 - i / TRAIL * 0.85).toFixed(2)));
  });

  // ---- Animate loop ----
  function tick() {
    // Dot: snap to mouse immediately
    dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;

    // Update history — each entry lerps toward the previous position
    history[0].x += (mouse.x - history[0].x) * 0.35;
    history[0].y += (mouse.y - history[0].y) * 0.35;
    for (let i = 1; i < TRAIL; i++) {
      history[i].x += (history[i - 1].x - history[i].x) * 0.28;
      history[i].y += (history[i - 1].y - history[i].y) * 0.28;
    }

    // Position cubes
    cubes.forEach((c, i) => {
      const x = history[i].x - c.half;
      const y = history[i].y - c.half;
      c.el.style.transform = `translate(${x}px, ${y}px)`;
    });

    requestAnimationFrame(tick);
  }

  tick();
})();
