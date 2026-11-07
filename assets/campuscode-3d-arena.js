// 3D flight corridor and scroll animations for landing page
// Uses Three.js for depth perspective + canvas grid + synced DOM stage transitions

(function() {
  'use strict';

  const STAGE_CONFIG = [
    { index: 0, center: 0.04, label: 'THE ARENA ENTRY' },
    { index: 1, center: 0.16, label: 'WHAT IS CAMPUSCODE?' },
    { index: 2, center: 0.28, label: 'THE EXPERIENCE' },
    { index: 3, center: 0.40, label: 'HOW IT WORKS · DISCOVER' },
    { index: 4, center: 0.52, label: 'HOW IT WORKS · TEAM UP' },
    { index: 5, center: 0.64, label: 'HOW IT WORKS · BUILD' },
    { index: 6, center: 0.76, label: 'HOW IT WORKS · SHIP' },
    { index: 7, center: 0.88, label: 'ACTIVE HACKATHONS' },
    { index: 8, center: 0.98, label: 'MISSION CONTROL' }
  ];

  let flightUniverse = null;
  let threeScene = null, threeCamera = null, threeRenderer = null;
  let runwayGrid = null, ceilGrid = null, particleSystem = null;
  let floatingRings = [], floatingMonoliths = [];
  let mouseX = 0, mouseY = 0;
  let targetFlightZ = 450, currentFlightZ = 450;
  let targetProgress = 0, currentProgress = 0;
  let isRunning = false;

  // route check - manages landing 3D corridor & portal theme flags
  function checkRoute() {
    const path = window.location.pathname;

    // Check if on initializing route -> render custom Matrix Warp loading screen
    if (path.startsWith('/initializing')) {
      renderMatrixWarpLoader();
      return;
    } else {
      const existingLoader = document.getElementById('cc-matrix-warp-loader');
      if (existingLoader) {
        existingLoader.remove();
        matrixLoaderRunning = false;
        if (matrixLoaderRaf) cancelAnimationFrame(matrixLoaderRaf);
      }
    }

    const isLanding = (path === '/' || path === '' || path.endsWith('index.html') || window.location.protocol === 'file:');

    // Portal Theme Active Classes
    // Student Portal -> Theme 27: "Gorgeous Contrast" (Immersive Garden - Lime & Obsidian)
    // Admin Portal -> Theme 12: "Striking and Simple" (Bert - Electric Blue & Smoky Black)
    // Organizer Portal -> Theme 28: "Effective Accent Colors" (SMFB - Solar Amber & Charcoal)
    // Auth Pages (Login & Register) -> Theme 45: "Accent Colors That Pop" (Stinkdigital - Electric Purple on Dark Violet-Black)
    // Public Pages (/u/:id & /verify/:code) -> Cyber Dark Obsidian Identity & Credential Theme
    const hasStudent = path.startsWith('/student') || !!document.querySelector('.student-panel');
    const hasOrg = path.startsWith('/organizer') || !!document.querySelector('.organizer-page');
    const hasAdmin = path.startsWith('/admin') || !!document.querySelector('.admin-app');
    const hasAuth = path.startsWith('/login') || path.startsWith('/register') || !!document.querySelector('.campus-login, .campus-register');
    const hasPublicCard = path.startsWith('/u/') || path.startsWith('/verify/') || !!document.querySelector('.public-card-page, .public-verify-page');

    document.body.classList.toggle('student-portal-active', hasStudent);
    document.body.classList.toggle('organizer-portal-active', hasOrg);
    document.body.classList.toggle('admin-portal-active', hasAdmin);
    document.body.classList.toggle('auth-theme-45-active', hasAuth);
    document.body.classList.toggle('public-page-active', hasPublicCard);
    document.documentElement.classList.toggle('student-portal-active', hasStudent);
    document.documentElement.classList.toggle('organizer-portal-active', hasOrg);
    document.documentElement.classList.toggle('admin-portal-active', hasAdmin);
    document.documentElement.classList.toggle('auth-theme-45-active', hasAuth);
    document.documentElement.classList.toggle('public-page-active', hasPublicCard);

    if (isLanding) {
      document.body.classList.add('landing-flight-active');
      if (!flightUniverse) {
        buildFlightUniverse();
      } else {
        flightUniverse.style.display = 'block';
      }
      if (window.innerWidth > 768) {
        attachCardParallaxTilt();
        if (!isRunning) {
          isRunning = true;
          initThreeJS();
        }
      } else {
        // Mobile zero-lag layout: clear inline transforms so responsive CSS takes over
        const stages = document.querySelectorAll('#cc-flight-stages .cc-stage');
        stages.forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
          s.style.pointerEvents = '';
        });
      }
    } else {
      document.body.classList.remove('landing-flight-active');
      if (flightUniverse) {
        flightUniverse.style.display = 'none';
      }
      isRunning = false;
    }
  }

  // build landing dom outside #root
  function buildFlightUniverse() {
    if (document.getElementById('cc-3d-flight-universe')) {
      flightUniverse = document.getElementById('cc-3d-flight-universe');
      return;
    }

    flightUniverse = document.createElement('div');
    flightUniverse.id = 'cc-3d-flight-universe';
    flightUniverse.innerHTML = `
      <!-- scroll runway -->
      <div id="cc-flight-scroll-track"></div>

      <!-- viewport -->
      <div id="cc-flight-sticky-viewport">
        <canvas id="cc-flight-canvas"></canvas>

        <!-- navbar -->
        <header class="cc-flight-nav">
          <button class="cc-nav-brand" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="CampusCode Home">
            <img src="/assets/campuscode-logo.png" alt="CampusCode Logo" class="cc-brand-logo-img" />
            <div class="cc-brand-text">
              <strong>CAMPUSCODE</strong>
              <small>HACKATHON ARENA</small>
            </div>
          </button>

          <div class="cc-nav-stage-meter" id="ccNavStageMeter">
            <span class="cc-nav-pulse"></span>
            <span class="cc-nav-stage-label" id="ccNavStageLabel">THE ARENA ENTRY</span>
          </div>

          <div class="cc-nav-actions">
            <button class="cc-btn cc-btn-login" onclick="window.location.href='/login'">LOGIN</button>
            <button class="cc-btn cc-btn-primary" onclick="window.location.href='/register'">JOIN CAMPUSCODE ↗</button>
          </div>
        </header>

        <!-- stages -->
        <div id="cc-flight-stages">

          <!-- hero -->
          <div class="cc-stage" data-stage="0">
            <div class="cc-stage-badge">
              <span>CAMPUSCODE · NATIONAL HACKATHON ARENA</span>
            </div>
            <h1 class="cc-hero-title">
              BUILD.<br>
              <span class="text-purple">COMPETE.</span><br>
              SHIP.
            </h1>
            <p class="cc-stage-desc">
              The competitive platform where engineering students turn ambitious ideas into shipped software, verifiable credentials, and proof of work.
            </p>
            <div class="cc-hero-actions">
              <button class="cc-btn cc-btn-primary cc-btn-lg" onclick="window.ccFlyTo(1)">EXPLORE ARENA ↓</button>
              <button class="cc-btn cc-btn-outline cc-btn-lg" onclick="window.location.href='/register'">JOIN AS BUILDER ↗</button>
            </div>
          </div>

          <!-- what is campuscode -->
          <div class="cc-stage stage-hidden" data-stage="1">
            <div class="cc-stage-badge lime-badge">
              <span>ARCHITECTURE & PLATFORM</span>
            </div>
            <h2 class="cc-stage-title">WHERE STUDENTS BUILD.</h2>
            <p class="cc-stage-desc">
              CampusCode connects students, teams, college chapters, and enterprise hackathons into one unified engineering ecosystem.
            </p>
            <div class="cc-card-grid-3">
              <!-- comet card 1 -->
              <div class="cc-comet-card" data-comet="true">
                <div class="cc-comet-glare"></div>
                <div class="cc-comet-visual">
                  <span class="cc-comet-pill"><span class="dot-lime"></span>PRODUCTION</span>
                  <img loading="lazy" src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80" alt="Real Impact Terminal" />
                </div>
                <div class="cc-comet-footer">
                  <span>REAL IMPACT</span>
                  <span class="cc-comet-tag">#CC-01</span>
                </div>
                <p class="cc-comet-desc">Build and deploy production software that solves verified enterprise, open-source, and campus challenges.</p>
              </div>

              <!-- comet card 2 -->
              <div class="cc-comet-card" data-comet="true">
                <div class="cc-comet-glare"></div>
                <div class="cc-comet-visual">
                  <span class="cc-comet-pill"><span class="dot-lime"></span>ARENA SCORING</span>
                  <img loading="lazy" src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80" alt="Fair Competition Radar" />
                </div>
                <div class="cc-comet-footer">
                  <span>FAIR COMPETITION</span>
                  <span class="cc-comet-tag">#CC-02</span>
                </div>
                <p class="cc-comet-desc">Transparent multi-stage judging, automated repository screening, and live dynamic leaderboards.</p>
              </div>

              <!-- comet card 3 -->
              <div class="cc-comet-card" data-comet="true">
                <div class="cc-comet-glare"></div>
                <div class="cc-comet-visual">
                  <span class="cc-comet-pill"><span class="dot-lime"></span>PASSPORT</span>
                  <img loading="lazy" src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" alt="Proof of Work Wave" />
                </div>
                <div class="cc-comet-footer">
                  <span>PROOF OF WORK</span>
                  <span class="cc-comet-tag">#CC-03</span>
                </div>
                <p class="cc-comet-desc">Every commit, sprint, and win is cryptographically bound to your official builder passport.</p>
              </div>
            </div>
          </div>

          <!-- video -->
          <div class="cc-stage stage-hidden" data-stage="2">
            <div class="cc-stage-badge">
              <span>THE EXPERIENCE FILM</span>
            </div>
            <h2 class="cc-stage-title">BUILD TOGETHER.</h2>
            <p class="cc-stage-desc">Experience the energy of 48-hour sprints, high-stakes peer code reviews, and live final showdowns.</p>
            <div class="cc-video-monolith">
              <div class="cc-video-topbar">
                <span>CAMPUSCODE FILM</span>
                <span>WHAT IS CAMPUSCODE? (00:30)</span>
                <span>● AUTO-PLAYING</span>
              </div>
              <div class="cc-video-player-wrap">
                <video id="ccExperienceVideo" src="/videos/what-is-campuscode.mp4" playsinline loop muted autoplay></video>
                <div class="cc-video-hint" id="ccVideoAudioToggle" onclick="window.toggleVideoAudio()">🔊 CLICK FOR SOUND</div>
              </div>
            </div>
          </div>

          <!-- discover -->
          <div class="cc-stage stage-hidden" data-stage="3">
            <div class="cc-stage-badge">
              <span>HOW IT WORKS · DISCOVER</span>
            </div>
            <div class="cc-how-monolith">
              <div class="cc-monolith-header">
                <span class="cc-monolith-pill">PHASE 1 · DISCOVER CHALLENGES</span>
              </div>
              <h3 class="cc-monolith-title">DISCOVER</h3>
              <div class="cc-monolith-subtitle">Find hackathons tailored to your tech stack.</div>
              <p class="cc-monolith-desc">
                Browse national sprints, campus qualifiers, and corporate innovation bounties. Filter by track, prize money, mode, and eligibility to find problems matching your exact strengths.
              </p>
              <div class="cc-tag-cloud">
                <span class="cc-tag"># AI AGENTS</span>
                <span class="cc-tag"># FULL-STACK DEV</span>
                <span class="cc-tag"># DISTRIBUTED SYSTEMS</span>
                <span class="cc-tag"># WEB3 & FINTECH</span>
                <span class="cc-tag"># GENERATIVE UI</span>
              </div>
            </div>
          </div>

          <!-- team up -->
          <div class="cc-stage stage-hidden" data-stage="4">
            <div class="cc-stage-badge lime-badge">
              <span>HOW IT WORKS · TEAM UP</span>
            </div>
            <div class="cc-how-monolith">
              <div class="cc-monolith-header">
                <span class="cc-monolith-pill">PHASE 2 · QUANTUM SQUAD RADAR</span>
              </div>
              <h3 class="cc-monolith-title">TEAM UP</h3>
              <div class="cc-monolith-subtitle">Assemble high-synergy squads or fly solo.</div>
              <p class="cc-monolith-desc">
                Never lose because of missing teammates. Hackmate Radar matches complementary frontend, backend, ML, and UI designers across Anna University, IITs, and top tech institutes.
              </p>
              <div class="cc-tag-cloud">
                <span class="cc-tag" style="border-color: #a8e62e;">✦ Karthik (AI / Python)</span>
                <span class="cc-tag" style="border-color: #7665ff;">✦ Priya (Full-Stack / React)</span>
                <span class="cc-tag" style="border-color: #a8e62e;">✦ Arun (Systems / Rust)</span>
              </div>
            </div>
          </div>

          <!-- build -->
          <div class="cc-stage stage-hidden" data-stage="5">
            <div class="cc-stage-badge">
              <span>HOW IT WORKS · BUILD</span>
            </div>
            <div class="cc-how-monolith">
              <div class="cc-monolith-header">
                <span class="cc-monolith-pill">PHASE 3 · AUTONOMOUS SPRINT ENGINE</span>
              </div>
              <h3 class="cc-monolith-title">BUILD</h3>
              <div class="cc-monolith-subtitle">Build during intense sprints with intelligent copilots.</div>
              <p class="cc-monolith-desc">
                Accelerate with built-in IdeaCheck originality analysis, automated commit telemetry, milestone reminders, and 24/7 RuleBot mentor guidance throughout the hackathon.
              </p>
              <div class="cc-tag-cloud">
                <span class="cc-tag">Milestone Tracking</span>
                <span class="cc-tag">RuleBot Compliance Audits</span>
                <span class="cc-tag">Instant IdeaCheck</span>
              </div>
            </div>
          </div>

          <!-- ship -->
          <div class="cc-stage stage-hidden" data-stage="6">
            <div class="cc-stage-badge lime-badge">
              <span>HOW IT WORKS · SHIP</span>
            </div>
            <div class="cc-how-monolith">
              <div class="cc-monolith-header">
                <span class="cc-monolith-pill">PHASE 4 · DEPLOYMENT & VERIFICATION</span>
              </div>
              <h3 class="cc-monolith-title">SHIP</h3>
              <div class="cc-monolith-subtitle">Deploy verified projects and claim builder medals.</div>
              <p class="cc-monolith-desc">
                Ship live URLs, code repositories, and demo videos directly to the judges. Transparent rubrics evaluate originality, technical depth, and presentation for instant leaderboard points.
              </p>
              <div class="cc-tag-cloud">
                <span class="cc-tag">₹2,50,000+ Prize Pools</span>
                <span class="cc-tag">Verifiable Digital Credentials</span>
                <span class="cc-tag">National Campus Ranks</span>
              </div>
            </div>
          </div>

          <!-- hackathons -->
          <div class="cc-stage stage-hidden" data-stage="7">
            <div class="cc-stage-badge">
              <span>LIVE ARENA</span>
            </div>
            <h2 class="cc-stage-title">ENTER THE ARENA</h2>
            <p class="cc-stage-desc">Real challenges. Real cash prizes. Real engineering recognition.</p>
            <div class="cc-hack-grid">
              <div class="cc-hack-card">
                <span class="cc-hack-badge badge-live">● LIVE SPRINT ACTIVE</span>
                <h3 class="cc-hack-name">FirstCommit National AI Sprint</h3>
                <div class="cc-hack-prize">₹2,50,000 POOL · 1,240 BUILDERS</div>
                <p class="cc-hack-desc">Build autonomous AI agents, tool-calling systems, and multimodal applications in 48 hours.</p>
                <button class="cc-btn cc-btn-primary cc-btn-sm" onclick="window.demoLogin('STUDENT')">ENTER ARENA ↗</button>
              </div>

              <div class="cc-hack-card">
                <span class="cc-hack-badge badge-open">✦ REGISTRATION OPEN</span>
                <h3 class="cc-hack-name">NextWeb Digital Experience Arena</h3>
                <div class="cc-hack-prize">₹1,50,000 POOL · 890 BUILDERS</div>
                <p class="cc-hack-desc">Design and ship high-performance web experiences featuring 3D flight physics and generative UI.</p>
                <button class="cc-btn cc-btn-outline cc-btn-sm" onclick="window.demoLogin('STUDENT')">REGISTER SQUAD ↗</button>
              </div>
            </div>
          </div>

          <!-- final cta -->
          <div class="cc-stage stage-hidden" data-stage="8">
            <div class="cc-stage-badge lime-badge">
              <span>MISSION CONTROL</span>
            </div>
            <h2 class="cc-stage-title">YOUR NEXT PROJECT<br>STARTS HERE.</h2>
            <p class="cc-stage-desc">
              Join 10,000+ student developers across 120+ campuses building the future. Claim your verified builder profile today.
            </p>
            <div class="cc-hero-actions" style="margin-bottom: 20px;">
              <button class="cc-btn cc-btn-primary cc-btn-lg" onclick="window.location.href='/register'">JOIN CAMPUSCODE ↗</button>
              <button class="cc-btn cc-btn-lime cc-btn-lg" onclick="window.demoLogin('STUDENT')">STUDENT DASHBOARD 🎓</button>
              <button class="cc-btn cc-btn-outline cc-btn-lg" onclick="window.location.href='/login'">SIGN IN ↗</button>
            </div>
            <button class="cc-back-to-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">↑ REPLAY 3D FLIGHT CORRIDOR</button>
          </div>

        </div>

        <!-- hud -->
        <div class="cc-flight-bottom-hud">
          <div class="cc-flight-scroll-pill">
            <span class="cc-scroll-arrow">↓</span>
            <span>SCROLL TO FLY FORWARD THROUGH SPACE</span>
          </div>
        </div>

        <!-- progress bar -->
        <div class="cc-flight-progress-bar" id="ccFlightProgressBar"></div>
      </div>
    `;

    document.body.appendChild(flightUniverse);
  }

  // three.js setup
  function initThreeJS() {
    if (window.innerWidth <= 768) {
      // Zero-lag mobile optimization: WebGL disabled on mobile viewports
      return;
    }

    if (typeof THREE === 'undefined') {
      setTimeout(initThreeJS, 100);
      return;
    }

    const canvas = document.getElementById('cc-flight-canvas');
    const viewport = document.getElementById('cc-flight-sticky-viewport');
    if (!canvas || !viewport) return;

    const w = viewport.clientWidth || window.innerWidth;
    const h = viewport.clientHeight || window.innerHeight;

    // scene background & fog (Theme 17: "Innovative and Audacious" - Obsidian Space)
    threeScene = new THREE.Scene();
    threeScene.background = new THREE.Color(0x070707);
    threeScene.fog = new THREE.FogExp2(0x070707, 0.00065);

    // camera
    threeCamera = new THREE.PerspectiveCamera(58, w / h, 0.1, 4200);
    threeCamera.position.set(0, 15, 450);

    // renderer - optimized for maximum 60 FPS performance on all GPUs
    const dpr = window.devicePixelRatio || 1;
    threeRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: dpr <= 1.5,
      alpha: false,
      powerPreference: 'high-performance',
      precision: 'mediump',
      stencil: false,
      depth: true
    });
    threeRenderer.setSize(w, h);
    // Capping pixel ratio at 1.25 gives massive 2x-3x fillrate boost on laptop screens
    threeRenderer.setPixelRatio(Math.min(dpr, 1.25));

    // floor grid (Cyber laser tracks) - optimized division count
    runwayGrid = new THREE.GridHelper(3600, 72, 0x7665ff, 0x161a29);
    runwayGrid.position.set(0, -42, -1400);
    threeScene.add(runwayGrid);

    // ceiling grid (Cyber lime canopy) - optimized division count
    ceilGrid = new THREE.GridHelper(3600, 72, 0xa8e62e, 0x121b10);
    ceilGrid.position.set(0, 115, -1400);
    threeScene.add(ceilGrid);

    // torus rings along z-axis (Glowing quantum portals) - shared lightweight geometry
    floatingRings = [];
    const ringColors = [0x7665ff, 0xa8e62e, 0x7665ff, 0x00f0ff, 0x7665ff, 0xa8e62e, 0x7665ff, 0xa8e62e, 0x7665ff];
    const sharedRingGeo = new THREE.TorusGeometry(48, 1.2, 8, 32);
    for (let i = 0; i < 9; i++) {
      const stageConfig = STAGE_CONFIG[i];
      const portalZ = 450 - (stageConfig.center * 3750);

      const ringMat = new THREE.MeshBasicMaterial({
        color: ringColors[i % ringColors.length],
        transparent: true,
        opacity: 0.72
      });
      const ring = new THREE.Mesh(sharedRingGeo, ringMat);
      ring.position.set(0, 16, portalZ);
      threeScene.add(ring);
      floatingRings.push(ring);
    }

    // floating wireframe shapes - shared geometries & materials for zero alloc overhead
    floatingMonoliths = [];
    const sharedIcosaGeo = new THREE.IcosahedronGeometry(14, 0);
    const sharedBoxGeo = new THREE.BoxGeometry(16, 16, 16);
    const sharedPurpleMat = new THREE.MeshBasicMaterial({
      color: 0x7665ff,
      wireframe: true,
      transparent: true,
      opacity: 0.52
    });
    const sharedLimeMat = new THREE.MeshBasicMaterial({
      color: 0xa8e62e,
      wireframe: true,
      transparent: true,
      opacity: 0.52
    });

    for (let i = 0; i < 12; i++) {
      const isIcosa = (i % 2 === 0);
      const geo = isIcosa ? sharedIcosaGeo : sharedBoxGeo;
      const mat = isIcosa ? sharedPurpleMat : sharedLimeMat;
      const mesh = new THREE.Mesh(geo, mat);

      const side = (i % 2 === 0 ? 1 : -1);
      const x = side * (100 + Math.random() * 80);
      const y = -15 + Math.random() * 70;
      const z = 320 - (i * 280);

      mesh.position.set(x, y, z);
      threeScene.add(mesh);
      floatingMonoliths.push({
        mesh: mesh,
        baseY: y,
        rotX: 0.006 + Math.random() * 0.008,
        rotY: 0.008 + Math.random() * 0.010,
        phase: Math.random() * Math.PI * 2
      });
    }

    // particles - 1000 high-performance stars
    const pCount = 1000;
    const pPos = new Float32Array(pCount * 3);
    const pCol = new Float32Array(pCount * 3);
    const cPurple = new THREE.Color(0x7665ff);
    const cLime = new THREE.Color(0xa8e62e);

    for (let i = 0; i < pCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 650;
      pPos[i + 1] = (Math.random() - 0.5) * 230 + 30;
      pPos[i + 2] = (Math.random() - 0.5) * 4200 - 1500;

      const c = Math.random() > 0.5 ? cPurple : cLime;
      pCol[i] = c.r;
      pCol[i + 1] = c.g;
      pCol[i + 2] = c.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 2.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.65
    });
    particleSystem = new THREE.Points(pGeo, pMat);
    threeScene.add(particleSystem);

    // throttled mouse move handler
    let mouseMoveTicking = false;
    window.addEventListener('mousemove', (e) => {
      if (mouseMoveTicking) return;
      mouseMoveTicking = true;
      requestAnimationFrame(() => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        mouseMoveTicking = false;
      });
    }, { passive: true });

    // resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        // Paused on mobile, clear transforms for clean responsive flow
        const stages = document.querySelectorAll('#cc-flight-stages .cc-stage');
        stages.forEach(s => {
          s.style.transform = '';
          s.style.opacity = '';
          s.style.pointerEvents = '';
        });
        return;
      }

      if (!threeScene && !isRunning) {
        isRunning = true;
        initThreeJS();
        return;
      }

      if (!threeCamera || !threeRenderer) return;
      const w2 = viewport.clientWidth || window.innerWidth;
      const h2 = viewport.clientHeight || window.innerHeight;
      threeCamera.aspect = w2 / h2;
      threeCamera.updateProjectionMatrix();
      threeRenderer.setSize(w2, h2);
    });

    startRenderLoop();
  }

  // render loop
  let clock = 0;
  function startRenderLoop() {
    function animate() {
      if (!isRunning || window.innerWidth <= 768) return;
      requestAnimationFrame(animate);

      // pause rendering when user is on another tab to save 100% CPU/battery
      if (document.hidden) return;

      clock += 0.015;

      // smooth progress and camera position
      currentProgress += (targetProgress - currentProgress) * 0.09;
      currentFlightZ += (targetFlightZ - currentFlightZ) * 0.09;

      if (threeCamera) {
        threeCamera.position.z = currentFlightZ;
        threeCamera.position.x = mouseX * 24;
        threeCamera.position.y = 15 - (mouseY * 16) + Math.sin(clock * 1.2) * 1.4;
        threeCamera.rotation.z = -mouseX * 0.035;
      }

      // rotate rings
      const ringCount = floatingRings.length;
      for (let i = 0; i < ringCount; i++) {
        floatingRings[i].rotation.z += 0.005 * (i % 2 === 0 ? 1 : -1);
      }

      // float monoliths
      const monolithCount = floatingMonoliths.length;
      for (let i = 0; i < monolithCount; i++) {
        const item = floatingMonoliths[i];
        item.mesh.rotation.x += item.rotX;
        item.mesh.rotation.y += item.rotY;
        item.mesh.position.y = item.baseY + Math.sin(clock * 1.5 + item.phase) * 5;
      }

      // spin particle field
      const flightSpeed = Math.abs(targetProgress - currentProgress);
      if (particleSystem) {
        particleSystem.rotation.z += 0.0003 + (flightSpeed * 0.025);
      }

      if (threeRenderer && threeScene && threeCamera) {
        threeRenderer.render(threeScene, threeCamera);
      }

      updateStageTransforms(currentProgress);
    }
    animate();
  }

  // card tilt and cursor glare - optimized with rAF throttling & cached bounds
  function attachCardParallaxTilt() {
    if (window.innerWidth <= 768) return; // Skip on mobile for performance

    // general card tilt
    const generalCards = document.querySelectorAll('.cc-how-monolith, .cc-hack-card');
    generalCards.forEach(card => {
      if (card.dataset.tiltActive) return;
      card.dataset.tiltActive = 'true';

      let cardRect = null;
      let tiltRaf = null;

      card.addEventListener('mouseenter', () => {
        cardRect = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', (e) => {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        if (tiltRaf) return;
        const clientX = e.clientX;
        const clientY = e.clientY;
        tiltRaf = requestAnimationFrame(() => {
          tiltRaf = null;
          const x = clientX - cardRect.left - cardRect.width / 2;
          const y = clientY - cardRect.top - cardRect.height / 2;
          const rotX = (y / -16).toFixed(1);
          const rotY = (x / 18).toFixed(1);
          card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-3px) scale(1.015)`;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        cardRect = null;
        if (tiltRaf) {
          cancelAnimationFrame(tiltRaf);
          tiltRaf = null;
        }
        card.style.transform = '';
      });
    });

    // comet cards with dynamic glare
    const cometCards = document.querySelectorAll('.cc-comet-card');
    cometCards.forEach(card => {
      if (card.dataset.cometActive) return;
      card.dataset.cometActive = 'true';

      const glare = card.querySelector('.cc-comet-glare');
      let cardRect = null;
      let cometRaf = null;

      card.addEventListener('mouseenter', () => {
        cardRect = card.getBoundingClientRect();
      });

      card.addEventListener('mousemove', (e) => {
        if (!cardRect) cardRect = card.getBoundingClientRect();
        if (cometRaf) return;
        const clientX = e.clientX;
        const clientY = e.clientY;
        cometRaf = requestAnimationFrame(() => {
          cometRaf = null;
          const x = clientX - cardRect.left;
          const y = clientY - cardRect.top;
          const xCenter = x - cardRect.width / 2;
          const yCenter = y - cardRect.height / 2;

          const rotX = (yCenter / -11).toFixed(2);
          const rotY = (xCenter / 13).toFixed(2);

          card.style.transform = `perspective(850px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(10px) scale(1.02)`;

          if (glare) {
            glare.style.opacity = '1';
            glare.style.background = `radial-gradient(circle 180px at ${x}px ${y}px, rgba(118, 101, 255, 0.28), rgba(168, 230, 46, 0.14) 45%, transparent 75%)`;
          }
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        cardRect = null;
        if (cometRaf) {
          cancelAnimationFrame(cometRaf);
          cometRaf = null;
        }
        card.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
        if (glare) {
          glare.style.opacity = '0';
        }
      });
    });
  }

  // =========================================================================
  // MATRIX WARP LOADING SCREEN (STUDENT · ORGANIZER · ADMIN)
  // =========================================================================
  let matrixLoaderRunning = false;
  let matrixLoaderRaf = null;

  function renderMatrixWarpLoader() {
    const path = window.location.pathname;
    if (!path.startsWith('/initializing')) {
      const existing = document.getElementById('cc-matrix-warp-loader');
      if (existing) {
        existing.remove();
        matrixLoaderRunning = false;
        if (matrixLoaderRaf) cancelAnimationFrame(matrixLoaderRaf);
      }
      return;
    }

    if (document.getElementById('cc-matrix-warp-loader')) {
      return;
    }

    const role = (localStorage.getItem('role') || 'STUDENT').toUpperCase();
    let user = {};
    try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch(e) {}

    let config = {
      role: 'STUDENT',
      themeClass: 'theme-student',
      color: '#a8e62e',
      secondary: '#7665ff',
      name: user.name || 'Karthik Raja',
      sub: user.college ? (user.college + ' · ' + (user.department || 'CSE')) : 'Anna University, CEG Campus · Computer Science (3rd Year)',
      tag: user.campusId || user.campus_code_id || 'CC-CHENNAI-802',
      badge: 'STUDENT BUILDER ACCESS',
      avatar: user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Karthik',
      dest: '/student',
      steps: [
        '[01/04] NEURAL_HANDSHAKE: CONNECTING ANNA UNIVERSITY CEG NODE...',
        '[02/04] PASSPORT_SYNC: DECRYPTING BUILDER KEYS & REPOSITORIES...',
        '[03/04] RADAR_ONLINE: SYNCING HACKMATE SQUAD ENGINE...',
        '[04/04] SYSTEM_ONLINE: ENTERING STUDENT ARENA'
      ]
    };

    if (role === 'ORGANIZER') {
      config = {
        role: 'ORGANIZER',
        themeClass: 'theme-organizer',
        color: '#ffb800',
        secondary: '#ff9100',
        name: user.name || 'Priya Narayanan',
        sub: user.organization ? (user.organization + ' · Director') : 'Chennai Tech Council · Executive Hackathon Lead',
        tag: user.id || 'ORG-CHENNAI-01',
        badge: 'HACKATHON DIRECTOR & ORGANIZER',
        avatar: user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Priya',
        dest: '/organizer',
        steps: [
          '[01/04] AUTH_COUNCIL: AUTHORIZING CHENNAI TECH COUNCIL DISPATCH...',
          '[02/04] ARENA_MATRIX: HYDRATING 1,240 TEAMS & AST ENGINES...',
          '[03/04] RULEBOT_ACTIVE: MOUNTING 24/7 AI JURY & COMPLIANCE COPILOTS...',
          '[04/04] MISSION_CONTROL: ORGANIZER COMMAND DECK UNLOCKED'
        ]
      };
    } else if (role === 'ADMIN') {
      config = {
        role: 'ADMIN',
        themeClass: 'theme-admin',
        color: '#00f0ff',
        secondary: '#526eff',
        name: user.name || 'CampusCode Administrator',
        sub: 'Platform Overseer · Master Infrastructure Authority',
        tag: user.id || 'SYS-ADMIN-MASTER',
        badge: 'CAMPUSCODE PLATFORM OVERSEER',
        avatar: user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
        dest: '/admin',
        steps: [
          '[01/04] ROOT_KERNEL: INITIALIZING LEVEL 0 SECURITY ENCLAVE...',
          '[02/04] GLOBAL_FLEET: AUDITING NATIONAL CHAPTER NODES & AUDIT LOGS...',
          '[03/04] LEDGER_VERIFY: CRYPTOGRAPHIC PASSPORT LEDGER SYNCED...',
          '[04/04] OVERSEER_ONLINE: ADMIN DASHBOARD UNLOCKED'
        ]
      };
    }

    // Build DOM
    const loader = document.createElement('div');
    loader.id = 'cc-matrix-warp-loader';
    loader.className = config.themeClass;
    loader.innerHTML = `
      <canvas id="cc-matrix-canvas"></canvas>
      <div class="mw-grid-overlay"></div>

      <!-- Topbar -->
      <header class="mw-topbar">
        <div class="mw-brand">
          <img src="/assets/campuscode-logo.png" alt="CampusCode Logo" class="mw-brand-logo-img" />
          <div class="mw-brand-text">
            <span>CAMPUSCODE</span>
            <small>ARENA OS // QUANTUM RUNTIME</small>
          </div>
        </div>

        <div class="mw-secure-tag">
          <span class="mw-secure-dot"></span>
          <span>SECURE PROTOCOL v2.6 // AES-256</span>
        </div>
      </header>

      <!-- Center Stage -->
      <main class="mw-stage">
        <!-- Dual Counter-Rotating Reactor Core -->
        <div class="mw-reactor-wrap">
          <svg class="mw-reactor-svg" viewBox="0 0 240 240">
            <circle class="mw-ring-outer" cx="120" cy="120" r="105" fill="none" />
            <circle class="mw-ring-inner" cx="120" cy="120" r="82" fill="none" />
          </svg>
          <div class="mw-core-disc">
            <div class="mw-pct-number" id="mwPct">0%</div>
            <div class="mw-core-tag">WARP SYNC</div>
          </div>
        </div>

        <!-- User Identity Card -->
        <div class="mw-identity-card">
          <div class="mw-id-row">
            <div class="mw-id-avatar-box">
              <img src="${config.avatar}" alt="${config.name}" />
            </div>
            <div class="mw-id-details">
              <span class="mw-id-role-pill">
                <span>✦</span> ${config.badge}
              </span>
              <div class="mw-id-name">${config.name}</div>
              <div class="mw-id-sub">${config.sub}</div>
            </div>
          </div>

          <div class="mw-progress-container">
            <div class="mw-progress-track">
              <div class="mw-progress-fill" id="mwProgressFill"></div>
            </div>
            <div class="mw-telemetry-line" id="mwTelemetry">
              ${config.steps[0]}
            </div>
          </div>
        </div>
      </main>

      <!-- Bottom Bar -->
      <footer class="mw-footer">
        <div>
          SECTOR: <strong>${config.tag}</strong>
        </div>
        <div>
          STATUS: <strong style="color: ${config.color};">AUTHORIZING ACCESS...</strong>
        </div>
        <div>
          RUNTIME: <strong>60 FPS · 0.00% PACKET LOSS</strong>
        </div>
      </footer>
    `;

    document.body.appendChild(loader);

    // Canvas Matrix Warp Animation
    const canvas = document.getElementById('cc-matrix-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const particles = [];
    const PARTICLE_COUNT = 320;
    const chars = ['0', '1', 'CC', '26', 'Ω', 'λ', '⚡', 'A', 'F', '9'];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * canvas.width * 2.2,
        y: (Math.random() - 0.5) * canvas.height * 2.2,
        z: Math.random() * 1000,
        char: chars[Math.floor(Math.random() * chars.length)]
      });
    }

    const startTime = performance.now();
    const DURATION = 2400; // 2.4 seconds total sequence
    matrixLoaderRunning = true;

    function animateLoader(now) {
      if (!matrixLoaderRunning) return;
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);

      // Update UI elements
      const pct = Math.round(progress * 100);
      const pctEl = document.getElementById('mwPct');
      const barEl = document.getElementById('mwProgressFill');
      const telemEl = document.getElementById('mwTelemetry');

      if (pctEl) pctEl.textContent = `${pct}%`;
      if (barEl) barEl.style.width = `${pct}%`;

      // Update telemetry step
      if (telemEl) {
        if (progress < 0.25) telemEl.textContent = config.steps[0];
        else if (progress < 0.50) telemEl.textContent = config.steps[1];
        else if (progress < 0.75) telemEl.textContent = config.steps[2];
        else telemEl.textContent = config.steps[3];
      }

      // Draw Matrix Warp
      ctx.fillStyle = 'rgba(6, 8, 13, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      // Exponential warp speed acceleration
      const warpSpeed = 5 + Math.pow(progress, 2.4) * 65;

      ctx.font = '11px "DM Mono", monospace';

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.z -= warpSpeed;
        if (p.z <= 0) {
          p.z = 1000;
          p.x = (Math.random() - 0.5) * canvas.width * 2.2;
          p.y = (Math.random() - 0.5) * canvas.height * 2.2;
        }

        const k = 260 / p.z;
        const px = cx + p.x * k;
        const py = cy + p.y * k;

        if (px >= 0 && px <= canvas.width && py >= 0 && py <= canvas.height) {
          const depthAlpha = Math.min(1, (1 - p.z / 1000) * 1.5);

          if (progress > 0.45) {
            // Warp streaks
            ctx.strokeStyle = config.color;
            ctx.globalAlpha = depthAlpha * 0.85;
            ctx.lineWidth = Math.max(1, (1 - p.z / 1000) * 4);
            ctx.beginPath();
            ctx.moveTo(px, py);
            const tailK = k * (1 - (warpSpeed * 0.005));
            ctx.lineTo(cx + p.x * tailK, cy + p.y * tailK);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          } else {
            // Digital rain characters
            ctx.fillStyle = i % 3 === 0 ? config.secondary : config.color;
            ctx.globalAlpha = depthAlpha;
            ctx.fillText(p.char, px, py);
            ctx.globalAlpha = 1.0;
          }
        }
      }

      if (progress < 1) {
        matrixLoaderRaf = requestAnimationFrame(animateLoader);
      } else {
        // Complete! Shockwave & navigate
        loader.classList.add('fade-out');
        setTimeout(() => {
          matrixLoaderRunning = false;
          window.removeEventListener('resize', onResize);
          window.location.replace(config.dest);
        }, 320);
      }
    }

    matrixLoaderRaf = requestAnimationFrame(animateLoader);
  }

  function getActiveSidebar() {
    return document.querySelector('.student-sidebar, .org-sidebar, .admin-sidebar');
  }

  function isPortalPage() {
    const p = window.location.pathname;
    return p.startsWith('/student') || p.startsWith('/organizer') || p.startsWith('/admin');
  }

  // check if organizer or admin portal needs the initializing loading sequence
  function checkPortalInitializing() {
    const pathname = window.location.pathname;
    const token = localStorage.getItem('token') || localStorage.getItem('campuscode_token');
    
    // Check if on organizer and hasn't shown initializing sequence
    if (pathname.startsWith('/organizer')) {
      const seen = sessionStorage.getItem('cc_visited_organizer');
      if (!seen) {
        sessionStorage.setItem('cc_visited_organizer', 'yes');
        if (!token || localStorage.getItem('role') !== 'ORGANIZER') {
          if (typeof window.demoLogin === 'function') {
            window.demoLogin('ORGANIZER');
            return true;
          }
        }
        window.location.replace('/initializing');
        return true;
      }
    }

    // Check if on admin and hasn't shown initializing sequence
    if (pathname.startsWith('/admin')) {
      const seen = sessionStorage.getItem('cc_visited_admin');
      if (!seen) {
        sessionStorage.setItem('cc_visited_admin', 'yes');
        if (!token || localStorage.getItem('role') !== 'ADMIN') {
          if (typeof window.demoLogin === 'function') {
            window.demoLogin('ADMIN');
            return true;
          }
        }
        window.location.replace('/initializing');
        return true;
      }
    }

    return false;
  }

  // side panel is permanently visible by default on desktop, collapsible on click
  function setupHoverSlidebars() {
    if (window.innerWidth <= 780) {
      document.body.classList.add('sidebar-collapsed');
      document.body.classList.remove('mobile-sidebar-open');
      const sidebar = getActiveSidebar();
      if (sidebar) {
        sidebar.classList.remove('open', 'student-sidebar-open', 'is-open');
        sidebar.classList.add('is-collapsed');
      }
    } else {
      document.body.classList.remove('sidebar-collapsed', 'mobile-sidebar-open');
      const sidebar = getActiveSidebar();
      if (sidebar) {
        sidebar.classList.remove('is-collapsed');
      }
    }
  }

  // navigation drawer / collapse toggle for student, organizer, and admin
  function setupPortalSidebar3Bars() {
    const isPortal = isPortalPage();
    const existingBtn = document.getElementById('cc-3lines-trigger');

    if (!isPortal) {
      if (existingBtn) existingBtn.remove();
      document.body.classList.remove('sidebar-collapsed', 'mobile-sidebar-open');
      return;
    }

    // Auto-close sidebar on mobile when clicking nav items or tapping outside drawer
    if (!window.__ccSidebarAutoCloseBound) {
      window.__ccSidebarAutoCloseBound = true;
      document.addEventListener('click', (e) => {
        if (window.innerWidth <= 780) {
          const sidebar = getActiveSidebar();
          const trigger = document.getElementById('cc-3lines-trigger');
          if (!sidebar) return;

          // If clicked a nav item inside sidebar -> close drawer so user sees active page content
          const navItem = e.target.closest('.student-nav-item, .org-nav-item, .admin-nav-item, nav button, nav a');
          if (navItem && sidebar.contains(navItem)) {
            document.body.classList.add('sidebar-collapsed');
            document.body.classList.remove('mobile-sidebar-open');
            sidebar.classList.remove('open', 'student-sidebar-open', 'is-open');
            sidebar.classList.add('is-collapsed');
            return;
          }

          // If clicked outside sidebar and outside hamburger trigger when drawer is open -> close drawer
          if (!sidebar.contains(e.target) && (!trigger || !trigger.contains(e.target))) {
            if (document.body.classList.contains('mobile-sidebar-open') || !document.body.classList.contains('sidebar-collapsed')) {
              document.body.classList.add('sidebar-collapsed');
              document.body.classList.remove('mobile-sidebar-open');
              sidebar.classList.remove('open', 'student-sidebar-open', 'is-open');
              sidebar.classList.add('is-collapsed');
            }
          }
        }
      }, true);
    }

    if (!existingBtn) {
      const btn = document.createElement('button');
      btn.id = 'cc-3lines-trigger';
      btn.className = 'cc-3lines-trigger';
      btn.type = 'button';
      btn.setAttribute('aria-label', 'Toggle Side Panel');
      btn.setAttribute('title', 'Toggle Side Panel');
      btn.innerHTML = `
        <span class="cc-bar cc-bar-1"></span>
        <span class="cc-bar cc-bar-2"></span>
        <span class="cc-bar cc-bar-3"></span>
      `;

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sidebar = getActiveSidebar();
        const willBeCollapsed = !document.body.classList.contains('sidebar-collapsed');
        document.body.classList.toggle('sidebar-collapsed', willBeCollapsed);
        if (sidebar) {
          sidebar.classList.toggle('is-collapsed', willBeCollapsed);
          if (window.innerWidth <= 780) {
            document.body.classList.toggle('mobile-sidebar-open', !willBeCollapsed);
            sidebar.classList.toggle('open', !willBeCollapsed);
            sidebar.classList.toggle('student-sidebar-open', !willBeCollapsed);
            sidebar.classList.toggle('is-open', !willBeCollapsed);
          }
        }
      });

      document.body.appendChild(btn);
    }
  }

  // round 2: all student sidebar items connected & visible
  function filterStudentSidebarItems() {
    const isStudent = window.location.pathname.startsWith('/student');
    if (!isStudent) return;

    const sidebarItems = document.querySelectorAll('.student-sidebar .student-nav-item');
    if (!sidebarItems || sidebarItems.length === 0) return;

    sidebarItems.forEach(item => {
      item.classList.add('round1-visible');
      item.style.setProperty('display', 'flex', 'important');
    });
  }

  // update stages based on scroll progress - optimized with cached DOM elements & dirty check
  let cachedStageElements = null;
  let lastProgressApplied = -999;
  let lastStageIndexApplied = -1;

  function updateStageTransforms(progress) {
    if (window.innerWidth <= 768) return; // In mobile mode, native vertical document flow handles stages cleanly

    if (!cachedStageElements || cachedStageElements.length === 0) {
      cachedStageElements = document.querySelectorAll('#cc-flight-stages .cc-stage');
      if (!cachedStageElements || cachedStageElements.length === 0) return;
    }

    // Skip heavy DOM updates if scroll progress is essentially unchanged
    if (Math.abs(progress - lastProgressApplied) < 0.0002) {
      return;
    }
    lastProgressApplied = progress;

    const spacing = 0.12;
    let activeStageIndex = 0;
    let minDistance = 999;

    const len = cachedStageElements.length;
    for (let idx = 0; idx < len; idx++) {
      const el = cachedStageElements[idx];
      const config = STAGE_CONFIG[idx];
      if (!config) continue;

      const diff = (progress - config.center) / spacing;
      const absDiff = Math.abs(diff);

      if (absDiff < minDistance) {
        minDistance = absDiff;
        activeStageIndex = idx;
      }

      // hide stages outside the active window to prevent visual clutter
      if (absDiff >= 0.55) {
        if (!el.classList.contains('stage-hidden')) {
          el.classList.add('stage-hidden');
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
        }
        continue;
      }

      if (el.classList.contains('stage-hidden')) {
        el.classList.remove('stage-hidden');
      }

      // translate along z and scale based on scroll distance
      const zTranslate = -diff * 650;
      const scale = 1.0 + (diff * 0.35);

      let opacity = 1.0;
      if (absDiff > 0.25) {
        opacity = Math.max(0, 1.0 - (absDiff - 0.25) / 0.28);
      }

      // Hardware accelerated transform without expensive CSS filter blur
      el.style.transform = `translate3d(0, 0, ${zTranslate.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      el.style.opacity = opacity.toFixed(3);
      el.style.pointerEvents = (absDiff < 0.38) ? 'auto' : 'none';
    }

    if (activeStageIndex !== lastStageIndexApplied) {
      lastStageIndexApplied = activeStageIndex;
      const stageLabel = document.getElementById('ccNavStageLabel');
      if (stageLabel && STAGE_CONFIG[activeStageIndex]) {
        stageLabel.textContent = STAGE_CONFIG[activeStageIndex].label;
      }
    }

    const progressBar = document.getElementById('ccFlightProgressBar');
    if (progressBar) {
      progressBar.style.width = `${(progress * 100).toFixed(1)}%`;
    }

    // sync stage 2 video
    const video = document.getElementById('ccExperienceVideo');
    if (video) {
      const videoDist = Math.abs(progress - STAGE_CONFIG[2].center);
      if (videoDist < 0.12) {
        if (video.paused) video.play().catch(() => {});
      } else {
        if (!video.paused) video.pause();
      }
    }
  }

  // scroll handler
  function onScroll() {
    if (!flightUniverse || !isRunning || window.innerWidth <= 768) return;

    const scrollY = window.scrollY || window.pageYOffset || 0;
    const maxScroll = (document.documentElement.scrollHeight || 7000) - window.innerHeight;
    const rawProgress = maxScroll > 0 ? scrollY / maxScroll : 0;

    targetProgress = Math.min(1, Math.max(0, rawProgress));
    targetFlightZ = 450 - (targetProgress * 3750);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // helper functions
  window.ccFlyTo = function(stageIdx) {
    if (window.innerWidth <= 768) {
      const targetStage = document.querySelector(`.cc-stage[data-stage="${stageIdx}"]`);
      if (targetStage) {
        targetStage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    const config = STAGE_CONFIG[stageIdx];
    if (!config) return;
    const maxScroll = (document.documentElement.scrollHeight || 7000) - window.innerHeight;
    const targetScrollY = config.center * maxScroll;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  window.toggleVideoAudio = function() {
    const video = document.getElementById('ccExperienceVideo');
    const hint = document.getElementById('ccVideoAudioToggle');
    if (!video || !hint) return;
    video.muted = !video.muted;
    hint.textContent = video.muted ? '🔊 CLICK FOR SOUND' : '🔇 CLICK TO MUTE';
  };

  // Official CampusCode logo injector across all portal headers, marks, and sidebars
  function replaceLogoMarksWithOfficialPNG() {
    const marks = document.querySelectorAll('.login-brand-mark, .register-brand-mark, .cc-mark, .footer-mark, .init-logo, .public-card-brand-mark, .public-verify-brand-mark');
    marks.forEach(m => {
      if (m.dataset.officialLogoReplaced) return;
      m.dataset.officialLogoReplaced = 'true';
      m.innerHTML = '<img src="/assets/campuscode-logo.png" alt="CampusCode" class="official-cc-logo-img" style="width:100%;height:100%;object-fit:contain;display:block;" />';
    });
  }

  // init
  function boot() {
    if (checkPortalInitializing()) return;
    checkRoute();
    setupHoverSlidebars();
    setupPortalSidebar3Bars();
    filterStudentSidebarItems();
    replaceLogoMarksWithOfficialPNG();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('popstate', () => {
    cachedStageElements = null;
    if (checkPortalInitializing()) return;
    checkRoute();
    setupPortalSidebar3Bars();
    filterStudentSidebarItems();
    replaceLogoMarksWithOfficialPNG();
  });

  let lastCheckedPath = null;
  setInterval(() => {
    replaceLogoMarksWithOfficialPNG();
    if (window.location.pathname.startsWith('/initializing')) {
      if (!document.getElementById('cc-matrix-warp-loader')) {
        renderMatrixWarpLoader();
      }
    }
    if (window.location.pathname !== lastCheckedPath) {
      lastCheckedPath = window.location.pathname;
      cachedStageElements = null;
      checkRoute();
      setupPortalSidebar3Bars();
      filterStudentSidebarItems();
    }
  }, 200);

})();
