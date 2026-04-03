// ======================================
// HERO — Three.js scene + GSAP entrance
// ======================================

(function () {
  'use strict';

  // ---- Device detection ----
  const isMobile = window.innerWidth < 768;
  const isTouch  = window.matchMedia('(hover: none)').matches;
  const isLowEnd = (navigator.hardwareConcurrency || 8) <= 2 ||
                   (navigator.deviceMemory || 8) <= 2;
  const useThree = !isMobile && !isLowEnd && typeof THREE !== 'undefined';

  const heroEl   = document.getElementById('hero');
  const canvas   = document.getElementById('hero-canvas');

  if (!useThree) {
    heroEl.classList.add('hero-static');
    if (canvas) canvas.style.display = 'none';
  } else {
    initThree();
  }

  runHeroGSAP();

  // ---- Three.js Scene ----
  function initThree() {
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 5;

    // Icosahedron wireframe
    const geo     = new THREE.IcosahedronGeometry(1.8, 1);
    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0x3B9EFF,
      transparent: true,
      opacity: 0.35
    });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    scene.add(wireMesh);

    // Solid inner mesh for depth
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0x3B9EFF,
      transparent: true,
      opacity: 0.04,
      wireframe: false
    });
    const solidMesh = new THREE.Mesh(geo, solidMat);
    scene.add(solidMesh);

    // Particle cloud
    const ptCount = 120;
    const ptPositions = new Float32Array(ptCount * 3);
    for (let i = 0; i < ptCount; i++) {
      ptPositions[i * 3]     = (Math.random() - 0.5) * 8;
      ptPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      ptPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const ptGeo = new THREE.BufferGeometry();
    ptGeo.setAttribute('position', new THREE.BufferAttribute(ptPositions, 3));
    const ptMat = new THREE.PointsMaterial({ color: 0x3B9EFF, size: 0.03, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(ptGeo, ptMat));

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const ptLight = new THREE.PointLight(0x3B9EFF, 1.5, 10);
    ptLight.position.set(3, 2, 3);
    scene.add(ptLight);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    if (!isTouch) {
      window.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      });
    }

    // Resize
    function resize() {
      const w = heroEl.clientWidth;
      const h = heroEl.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // Pause when out of view
    const observer = new IntersectionObserver(entries => {
      entries[0].isIntersecting ? renderer.setAnimationLoop(animate) : renderer.setAnimationLoop(null);
    }, { threshold: 0.1 });
    observer.observe(heroEl);

    // Animate
    function animate(t) {
      const time = t * 0.001;
      wireMesh.rotation.y  = time * 0.18;
      wireMesh.rotation.x  = time * 0.10;
      solidMesh.rotation.y = time * 0.18;
      solidMesh.rotation.x = time * 0.10;

      // Smooth mouse parallax
      camera.position.x += (mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.4 - camera.position.y) * 0.04;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
  }

  // ---- Hero GSAP Entrance ----
  function runHeroGSAP() {
    if (typeof gsap === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.hero-content > *').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const tl = gsap.timeline({ delay: 0.2 });

    tl.from('.hero-badge',   { opacity: 0, y: 16, duration: 0.5, ease: 'power2.out' })
      .from('.hero-headline .line-1', { opacity: 0, y: 30, duration: 0.65, ease: 'power3.out' }, '-=0.2')
      .from('.hero-headline .line-2', { opacity: 0, y: 30, duration: 0.65, ease: 'power3.out' }, '-=0.45')
      .from('.hero-subtext',  { opacity: 0, y: 20, duration: 0.55, ease: 'power2.out' }, '-=0.35')
      .from('.hero-actions',  { opacity: 0, y: 16, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
      .from('.hero-trust',    { opacity: 0,         duration: 0.5,  ease: 'none'        }, '-=0.2')
      .from('.scroll-hint',   { opacity: 0, y: 8,   duration: 0.4,  ease: 'power1.out'  }, '+=0.4');

    // Reveal float button after 2s
    gsap.to('.wa-float', {
      delay: 2,
      duration: 0.6,
      ease: 'back.out(1.5)',
      onStart() { document.querySelector('.wa-float').classList.add('visible'); }
    });
  }
})();
