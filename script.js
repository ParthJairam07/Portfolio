/* ============================================================
   PARTH JAIRAM — PORTFOLIO SCRIPT
   GSAP 3 + ScrollTrigger + ScrollSmoother + SplitText + Three.js
   ============================================================ */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);

/* ============================================================
   1. PRELOADER
   ============================================================ */
const preloader = document.getElementById('preloader');
const preloaderBar = document.getElementById('preloaderBar');
const preloaderPercent = document.getElementById('preloaderPercent');
const preloaderContent = document.getElementById('preloaderContent');
const preloaderSlices = document.querySelectorAll('.preloader__slice');

const loaderObj = { v: 0 };
const loaderTl = gsap.timeline({
  onComplete: () => {
    // Cinematic slice reveal:
    // 1) inner content fades + rises
    // 2) sliced vertical panels (making up the full background)
    //    drop with a staggered scaleY:0 from top, revealing the site beneath
    const exitTl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        initMain();
      }
    });

    exitTl
      .to('#preloaderContent .preloader__inner', {
        y: -40,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power2.in'
      })
      .set('#preloaderContent', { autoAlpha: 0 })
      .set(preloaderSlices, { autoAlpha: 1 })
      .fromTo(preloaderSlices,
        { scaleY: 1 },
        {
          scaleY: 0,
          duration: 1.1,
          stagger: { each: 0.06, from: 'start' },
          ease: 'expo.inOut',
          transformOrigin: 'top center'
        },
        '<0.05'
      );
  }
});

loaderTl.to(loaderObj, {
  v: 100,
  duration: 2,
  ease: 'power2.inOut',
  onUpdate: () => {
    const val = Math.round(loaderObj.v);
    preloaderBar.style.width = val + '%';
    preloaderPercent.textContent = val + '%';
  }
});

/* ============================================================
   2. MAIN INITIALIZATION
   ============================================================ */
function initMain() {

  /* ------- CUSTOM CURSOR ------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const dotPos = { x: mouse.x, y: mouse.y };
  const ringPos = { x: mouse.x, y: mouse.y };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  gsap.ticker.add(() => {
    dotPos.x += (mouse.x - dotPos.x) * 0.9;
    dotPos.y += (mouse.y - dotPos.y) * 0.9;
    ringPos.x += (mouse.x - ringPos.x) * 0.12;
    ringPos.y += (mouse.y - ringPos.y) * 0.12;

    cursorDot.style.transform = `translate(${dotPos.x}px, ${dotPos.y}px) translate(-50%, -50%)`;
    cursorRing.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px) translate(-50%, -50%)`;
  });

  document.querySelectorAll('a, button, .magnetic, .exp, .skill-col__tags span').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hover'));
  });

  /* ------- MAGNETIC BUTTONS ------- */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ------- SMOOTH SCROLL ------- */
  const smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.2,
    effects: true,
    normalizeScroll: true,
    smoothTouch: 0.1
  });

  /* ------- SCROLL PROGRESS ------- */
  const scrollFill = document.getElementById('scrollFill');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      scrollFill.style.width = (self.progress * 100) + '%';
    }
  });

  /* ------- SIDE NAV ACTIVE STATE ------- */
  const sections = ['hero', 'about', 'experience', 'skills', 'contact'];
  sections.forEach((id, i) => {
    ScrollTrigger.create({
      trigger: '#' + id,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          document.querySelectorAll('.side-nav__item').forEach(n => n.classList.remove('active'));
          document.querySelectorAll('.side-nav__item')[i]?.classList.add('active');
        }
      }
    });
  });

  /* ------- CLOCK ------- */
  const clockEl = document.getElementById('clock');
  function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* ------- THREE.JS SITE-WIDE INTERACTIVE BACKGROUND ------- */
  initBackground();

  /* ------- HERO TEXT ANIMATIONS ------- */
  const heroTitleSplit = new SplitText('#heroTitle', { type: 'chars', charsClass: 'split-char' });
  const heroDescSplit = new SplitText('#heroDesc', { type: 'words, lines', linesClass: 'split-line' });

  const heroTl = gsap.timeline({ delay: 0.3 });
  heroTl
    .from('.hero__tag', { y: 20, opacity: 0, duration: 0.8, ease: 'expo.out' })
    .from(heroTitleSplit.chars, {
      yPercent: 120,
      opacity: 0,
      duration: 1.2,
      stagger: 0.03,
      ease: 'expo.out'
    }, '-=0.4')
    .from('.hero__subtitle > *', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.06,
      ease: 'expo.out'
    }, '-=0.6')
    .from(heroDescSplit.words, {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.01,
      ease: 'expo.out'
    }, '-=0.5')
    .from('.hero__cta > *', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'expo.out'
    }, '-=0.4')
    .from('.hero__corner', { opacity: 0, duration: 1, stagger: 0.1 }, '-=0.8')
    .from('.hero__scroll', { opacity: 0, duration: 1 }, '-=0.5');

  /* ------- SECTION HEAD REVEAL ------- */
  gsap.utils.toArray('.section-head').forEach(head => {
    gsap.from(head.children, {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.08,
      ease: 'expo.out',
      scrollTrigger: { trigger: head, start: 'top 85%' }
    });
  });

  /* ------- ABOUT ANIMATIONS ------- */
  const aboutTitleSplit = new SplitText('#aboutTitle', { type: 'words, lines', linesClass: 'split-line' });
  gsap.from(aboutTitleSplit.words, {
    yPercent: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.03,
    ease: 'expo.out',
    scrollTrigger: { trigger: '#aboutTitle', start: 'top 80%' }
  });

  const aboutParaSplit = new SplitText('#aboutPara', { type: 'words' });
  gsap.from(aboutParaSplit.words, {
    opacity: 0.1,
    duration: 0.02,
    stagger: 0.015,
    ease: 'none',
    scrollTrigger: {
      trigger: '#aboutPara',
      start: 'top 85%',
      end: 'bottom 60%',
      scrub: true
    }
  });

  /* ------- COUNT-UP STATS ------- */
  document.querySelectorAll('.stat__num').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const counter = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(counter, {
          v: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(counter.v) + suffix;
          }
        });
      }
    });
  });

  /* ------- EXPERIENCE: KEYFRAME / SCROLL-PATH PIN ------- */
  initExperienceKeyframe();

  /* ------- SKILLS ------- */
  const skillsTitleSplit = new SplitText('.skills__title', { type: 'words, lines', linesClass: 'split-line' });
  gsap.from(skillsTitleSplit.words, {
    yPercent: 100, opacity: 0, duration: 1, stagger: 0.03, ease: 'expo.out',
    scrollTrigger: { trigger: '.skills__title', start: 'top 85%', toggleActions: 'play none none reverse' }
  });

  gsap.utils.toArray('.skill-col').forEach((col) => {
    const label = col.querySelector('.skill-col__label');
    const tags = col.querySelectorAll('.skill-col__tags span');
    gsap.set(label, { y: 20, autoAlpha: 0 });
    gsap.set(tags, { y: 20, autoAlpha: 0 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: col,
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });
    tl.to(label, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
      .to(tags, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.03, ease: 'expo.out' }, '-=0.3');
  });

  /* ------- CONTACT ------- */
  const contactSplit = new SplitText('#contactTitle', { type: 'words, chars', charsClass: 'split-char' });
  gsap.from(contactSplit.chars, {
    yPercent: 100, opacity: 0, duration: 1, stagger: 0.02, ease: 'expo.out',
    scrollTrigger: { trigger: '#contactTitle', start: 'top 80%' }
  });

  gsap.from('.contact__email', {
    y: 30, opacity: 0, duration: 1, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__email', start: 'top 85%' }
  });
  gsap.from('.contact__links a', {
    y: 20, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__links', start: 'top 90%' }
  });

  /* ------- CONTACT FORM ------- */
  gsap.from('.contact__form > *', {
    y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out',
    scrollTrigger: { trigger: '.contact__form', start: 'top 85%' }
  });

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const statusEl = document.getElementById('cfStatus');
    const submitText = document.getElementById('cfSubmitText');
    const nameEl = document.getElementById('cfName');
    const emailEl = document.getElementById('cfEmail');
    const msgEl = document.getElementById('cfMessage');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const message = msgEl.value.trim();
      if (!name || !email || !message) {
        statusEl.textContent = '// please fill in all fields';
        statusEl.classList.remove('is-success');
        statusEl.classList.add('is-error');
        gsap.fromTo(contactForm, { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
        return;
      }
      // No backend — open user's mail client with pre-filled message.
      // Swap this block for a fetch() to Formspree/Resend/Web3Forms for real submissions.
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\n—\nFrom: ${name} <${email}>`);
      window.location.href = `mailto:parth.jairam06@gmail.com?subject=${subject}&body=${body}`;

      statusEl.textContent = '// opening your mail client...';
      statusEl.classList.remove('is-error');
      statusEl.classList.add('is-success');
      submitText.textContent = 'sent ✓';
      gsap.fromTo('.contact__form-submit', { scale: 1 }, { scale: 1.03, yoyo: true, repeat: 1, duration: 0.3, ease: 'power2.inOut' });

      setTimeout(() => {
        contactForm.reset();
        submitText.textContent = 'send another';
      }, 1500);
    });
  }

  /* ------- REFRESH ------- */
  ScrollTrigger.refresh();
}

/* ============================================================
   3. THREE.JS SITE-WIDE INTERACTIVE BACKGROUND
   4K Unsplash image with WebGL ripple/displacement on cursor
   ============================================================ */
function initBackground() {
  const canvas = document.getElementById('bgCanvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0a0a, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const uniforms = {
    u_time: { value: 0 },
    u_tex: { value: null },
    u_texRes: { value: new THREE.Vector2(1, 1) },
    u_res: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    u_mouseVel: { value: 0 },
    u_scroll: { value: 0 },
    u_ready: { value: 0 }
  };

  const vertex = `
    varying vec2 v_uv;
    void main() {
      v_uv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const fragment = `
    precision highp float;
    varying vec2 v_uv;
    uniform float u_time;
    uniform sampler2D u_tex;
    uniform vec2 u_texRes;
    uniform vec2 u_res;
    uniform vec2 u_mouse;
    uniform float u_mouseVel;
    uniform float u_scroll;
    uniform float u_ready;

    // Simplex noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                      + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                              dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // cover (object-fit: cover) for image plane
    vec2 coverUV(vec2 uv, vec2 texRes, vec2 res) {
      float rTex = texRes.x / texRes.y;
      float rRes = res.x / res.y;
      vec2 scale = (rRes > rTex) ? vec2(1.0, rTex / rRes) : vec2(rRes / rTex, 1.0);
      return (uv - 0.5) * scale + 0.5;
    }

    void main() {
      vec2 uv = v_uv;

      // subtle parallax from scroll
      uv.y -= u_scroll * 0.02;

      // cover fit
      vec2 cuv = coverUV(uv, u_texRes, u_res);

      // distance to mouse (in uv space, aspect-adjusted)
      vec2 m = u_mouse;
      vec2 diff = uv - m;
      diff.x *= u_res.x / u_res.y;
      float dist = length(diff);

      // ripple / displacement from mouse
      float ripple = sin(dist * 35.0 - u_time * 3.0) * exp(-dist * 6.0);
      float fall = smoothstep(0.45, 0.0, dist);

      // flowing noise distortion
      float n = snoise(cuv * 3.0 + u_time * 0.08);
      vec2 distort = vec2(
        snoise(cuv * 4.0 + vec2(u_time * 0.12, 0.0)),
        snoise(cuv * 4.0 + vec2(0.0, u_time * 0.12))
      ) * 0.012;

      distort += diff * ripple * 0.06 * (1.0 + u_mouseVel * 2.0);
      distort += diff * fall * 0.03;

      vec2 sampleUV = cuv + distort;

      // chromatic aberration near mouse
      float ca = fall * 0.006 + u_mouseVel * 0.004;
      float r = texture2D(u_tex, sampleUV + vec2(ca, 0.0)).r;
      float g = texture2D(u_tex, sampleUV).g;
      float b = texture2D(u_tex, sampleUV - vec2(ca, 0.0)).b;
      vec3 col = vec3(r, g, b);

      // darken & grade for dark theme
      col = mix(col, col * vec3(0.35, 0.45, 0.4), 0.55);
      col *= 0.85;

      // neon-green tint bloom near mouse
      col += vec3(0.05, 0.45, 0.1) * fall * 0.18;

      // subtle noise grain
      float grain = (fract(sin(dot(gl_FragCoord.xy + u_time, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.03;
      col += grain;

      // vignette
      float vig = smoothstep(1.25, 0.35, length(v_uv - 0.5));
      col *= vig;

      // fade-in while texture loads
      col *= u_ready;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const material = new THREE.ShaderMaterial({ vertexShader: vertex, fragmentShader: fragment, uniforms });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(plane);

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    uniforms.u_res.value.set(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  // Load 4K Unsplash texture
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');
  loader.load(
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=3840&q=85&auto=format&fit=crop',
    (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      uniforms.u_tex.value = tex;
      uniforms.u_texRes.value.set(tex.image.width, tex.image.height);
      gsap.to(uniforms.u_ready, { value: 1, duration: 2, ease: 'power2.out' });
    }
  );

  // Mouse tracking
  const target = { x: 0.5, y: 0.5 };
  let lastX = 0.5, lastY = 0.5;
  let mouseVel = 0;
  window.addEventListener('mousemove', (e) => {
    target.x = e.clientX / window.innerWidth;
    target.y = 1.0 - e.clientY / window.innerHeight;
  });

  // Scroll parallax
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      uniforms.u_scroll.value = self.progress;
    }
  });

  const clock = new THREE.Clock();
  function tick() {
    uniforms.u_time.value = clock.getElapsedTime();

    // smooth mouse
    const dx = target.x - uniforms.u_mouse.value.x;
    const dy = target.y - uniforms.u_mouse.value.y;
    uniforms.u_mouse.value.x += dx * 0.06;
    uniforms.u_mouse.value.y += dy * 0.06;

    // velocity
    const vel = Math.hypot(uniforms.u_mouse.value.x - lastX, uniforms.u_mouse.value.y - lastY);
    mouseVel += (vel * 8 - mouseVel) * 0.1;
    uniforms.u_mouseVel.value = mouseVel;
    lastX = uniforms.u_mouse.value.x;
    lastY = uniforms.u_mouse.value.y;

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
}

/* ============================================================
   4. EXPERIENCE — KEYFRAME / SCROLL-PATH PIN
   Experiences stacked, each cross-fades in as user scrolls
   through the pinned container.
   ============================================================ */
function initExperienceKeyframe() {
  const pin = document.querySelector('.exp-pin');
  const list = document.querySelector('.exp-list');
  const exps = gsap.utils.toArray('.exp');
  const progressFill = document.getElementById('expProgress');
  const currentEl = document.getElementById('expCurrent');
  const totalEl = document.getElementById('expTotal');

  if (!pin || !exps.length) return;
  totalEl.textContent = String(exps.length).padStart(2, '0');

  // mobile fallback: render as a normal stacked list, animate on entry
  if (window.innerWidth < 900) {
    exps.forEach((exp) => {
      const role = exp.querySelector('.exp__role');
      const roleSplit = new SplitText(role, { type: 'words', wordsClass: 'split-word' });
      gsap.from([exp.querySelector('.exp__meta'), roleSplit.words, exp.querySelector('.exp__company'), ...exp.querySelectorAll('.exp__bullets li'), ...exp.querySelectorAll('.exp__tags span')], {
        y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out',
        scrollTrigger: { trigger: exp, start: 'top 85%' }
      });
    });
    return;
  }

  // stack all experiences on top of each other
  exps.forEach((exp, i) => {
    gsap.set(exp, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 60 });
  });

  const stepDuration = 1; // per-step duration in timeline units
  const crossfade = 0.45;
  const totalSteps = exps.length - 1;

  // build a scrubbed master timeline
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${window.innerHeight * (totalSteps * 1.0)}`,
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        progressFill.style.height = (p * 100) + '%';
        const idx = Math.min(exps.length - 1, Math.round(p * totalSteps));
        currentEl.textContent = String(idx + 1).padStart(2, '0');
      }
    }
  });

  for (let i = 0; i < totalSteps; i++) {
    const from = exps[i];
    const to = exps[i + 1];
    masterTl
      .to(from, { autoAlpha: 0, y: -60, duration: crossfade, ease: 'power2.inOut' }, i * stepDuration)
      .fromTo(to,
        { autoAlpha: 0, y: 60 },
        { autoAlpha: 1, y: 0, duration: crossfade, ease: 'power2.out' },
        i * stepDuration + crossfade * 0.4
      );
  }

  // Intro animation for the first experience
  const firstExp = exps[0];
  const firstRole = firstExp.querySelector('.exp__role');
  const firstRoleSplit = new SplitText(firstRole, { type: 'words', wordsClass: 'split-word' });
  const introTl = gsap.timeline({
    scrollTrigger: { trigger: pin, start: 'top 60%', toggleActions: 'play none none reverse' }
  });
  introTl
    .from(firstExp.querySelector('.exp__meta').children, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: 'expo.out' })
    .from(firstRoleSplit.words, { yPercent: 100, autoAlpha: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out' }, '-=0.4')
    .from(firstExp.querySelector('.exp__company'), { y: 10, autoAlpha: 0, duration: 0.6, ease: 'expo.out' }, '-=0.5')
    .from(firstExp.querySelectorAll('.exp__bullets li'), { y: 15, autoAlpha: 0, duration: 0.5, stagger: 0.08, ease: 'expo.out' }, '-=0.4')
    .from(firstExp.querySelectorAll('.exp__tags span'), { y: 10, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: 'expo.out' }, '-=0.3');
}
