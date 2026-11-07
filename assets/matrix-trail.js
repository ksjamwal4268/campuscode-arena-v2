// Aceternity-Style Matrix Trail Canvas System
// Responsive falling cyber rain + interactive cursor excitation trail
// Dynamically themed for Student (Lime #a8e62e), Organizer (Amber #ffb800), Admin (Blue #00b4ff), and Auth (Purple #a855f7)

(function () {
  'use strict';

  // Wait for DOM to be ready
  function initMatrixTrail() {
    let canvas = document.getElementById("matrix-trail-canvas");
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.id = "matrix-trail-canvas";
      // Fixed background / overlay with zero pointer events
      canvas.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; pointer-events: none; z-index: 0; display: none;";
      document.body.prepend(canvas);
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Dynamic Aceternity Props ---
    const config = {
      color: "#a8e62e",       // Accent color (CampusCode Lime #a8e62e, Amber #ffb800, Admin Blue #00b4ff, Auth #a855f7)
      headColor: "#ffffff",   // Leading glow color at cursor center
      fontSize: 16,           // Grid cell & font size (px)
      radius: 95,             // Proximity excitation radius around cursor (px)
      fade: 0.035,            // Trail decay speed per frame
      scramble: true,         // Scramble characters on hover
      ambient: 0.08,          // Ambient idle brightness (0 = fully dark, 0.1 = subtle)
      rainDensity: 0.15,      // Frequency of falling ambient rain (0 to 1)
      rainSpeed: 1.0,         // Ambient rain drop speed
      glow: 12,               // Bloom blur intensity
      active: false           // Whether active on current page
    };

    const CHARS = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ0123456789ABCDEF<>{}/*=+~";

    let width = 0, height = 0, cols = 0, rows = 0;
    let grid = [];
    let rain = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let animationFrameId = null;

    // Route-aware theme switching
    function updateThemeConfig() {
      const path = window.location.pathname;
      const isLanding = (path === '/' || path === '' || path.endsWith('index.html'));

      if (isLanding) {
        // Disable on landing page to preserve Three.js flight performance
        if (config.active) {
          config.active = false;
          canvas.style.display = "none";
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
        return;
      }

      // Check current portal / route
      const isStudent = path.startsWith('/student') || document.body.classList.contains('student-portal-active') || !!document.querySelector('.student-panel');
      const isOrg = path.startsWith('/organizer') || document.body.classList.contains('organizer-portal-active') || !!document.querySelector('.organizer-page');
      const isAdmin = path.startsWith('/admin') || document.body.classList.contains('admin-portal-active') || !!document.querySelector('.admin-app');
      const isAuth = path.startsWith('/login') || path.startsWith('/register') || document.body.classList.contains('auth-theme-45-active') || !!document.querySelector('.campus-login, .campus-register');
      const isPublic = path.startsWith('/u/') || path.startsWith('/verify/');

      if (isStudent) {
        config.color = "#a8e62e";       // Theme 27: Cyber Lime
        config.headColor = "#ffffff";
        config.ambient = 0.07;
        config.glow = 14;
      } else if (isOrg) {
        config.color = "#ffb800";       // Theme 28: Solar Amber
        config.headColor = "#ffffff";
        config.ambient = 0.07;
        config.glow = 14;
      } else if (isAdmin) {
        config.color = "#00b4ff";       // Theme 12: Electric Cyan / Blue
        config.headColor = "#ffffff";
        config.ambient = 0.07;
        config.glow = 14;
      } else if (isAuth) {
        config.color = "#a855f7";       // Theme 45: Electric Purple / Violet
        config.headColor = "#ffffff";
        config.ambient = 0.08;
        config.glow = 14;
      } else if (isPublic) {
        config.color = "#a8e62e";       // Public ID / Verify: Cyber Lime
        config.headColor = "#ffffff";
        config.ambient = 0.06;
        config.glow = 12;
      } else {
        config.color = "#a8e62e";
        config.headColor = "#ffffff";
        config.ambient = 0.07;
        config.glow = 12;
      }

      if (!config.active) {
        config.active = true;
        canvas.style.display = "block";
        resizeGrid();
        if (!animationFrameId) {
          render();
        }
      }
    }

    function resizeGrid() {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      if (width === 0 || height === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / config.fontSize);
      rows = Math.ceil(height / config.fontSize);

      grid = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          grid[r][c] = {
            char: CHARS[Math.floor(Math.random() * CHARS.length)],
            intensity: 0
          };
        }
      }

      rain = [];
      for (let c = 0; c < cols; c++) {
        rain[c] = {
          y: Math.random() * rows,
          speed: (0.3 + Math.random() * 0.7) * config.rainSpeed,
          active: Math.random() < config.rainDensity
        };
      }
    }

    window.addEventListener("resize", () => {
      if (config.active) resizeGrid();
    });

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (e.touches && e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
      mouse.active = false;
    });

    window.addEventListener("touchend", () => {
      mouse.active = false;
    });

    function render() {
      if (!config.active) {
        animationFrameId = null;
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.font = `${config.fontSize}px 'Courier New', monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 1. Update ambient falling rain
      for (let c = 0; c < cols; c++) {
        if (!rain[c]) continue;
        if (!rain[c].active) {
          if (Math.random() < 0.005 * config.rainDensity) rain[c].active = true;
          continue;
        }
        rain[c].y += rain[c].speed;
        const currentR = Math.floor(rain[c].y);
        if (currentR >= 0 && currentR < rows && grid[currentR] && grid[currentR][c]) {
          grid[currentR][c].intensity = Math.max(grid[currentR][c].intensity, 0.7);
          if (config.scramble) {
            grid[currentR][c].char = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }
        if (rain[c].y >= rows) {
          rain[c].y = 0;
          rain[c].active = Math.random() < config.rainDensity;
        }
      }

      // 2. Update interactive cursor proximity excitation
      if (mouse.active && rows > 0 && cols > 0) {
        const cursorCol = mouse.x / config.fontSize;
        const cursorRow = mouse.y / config.fontSize;
        const cellRadius = config.radius / config.fontSize;

        const minR = Math.max(0, Math.floor(cursorRow - cellRadius));
        const maxR = Math.min(rows - 1, Math.ceil(cursorRow + cellRadius));
        const minC = Math.max(0, Math.floor(cursorCol - cellRadius));
        const maxC = Math.min(cols - 1, Math.ceil(cursorCol + cellRadius));

        for (let r = minR; r <= maxR; r++) {
          for (let c = minC; c <= maxC; c++) {
            if (!grid[r] || !grid[r][c]) continue;
            const dx = (c + 0.5) * config.fontSize - mouse.x;
            const dy = (r + 0.5) * config.fontSize - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < config.radius) {
              const proximity = 1 - (dist / config.radius);
              grid[r][c].intensity = Math.max(grid[r][c].intensity, proximity);
              if (config.scramble && Math.random() < 0.25) {
                grid[r][c].char = CHARS[Math.floor(Math.random() * CHARS.length)];
              }
            }
          }
        }
      }

      // 3. Render characters with decay
      for (let r = 0; r < rows; r++) {
        if (!grid[r]) continue;
        for (let c = 0; c < cols; c++) {
          const cell = grid[r][c];
          if (!cell) continue;
          const totalIntensity = Math.min(1, cell.intensity + config.ambient);

          if (totalIntensity > 0.05) {
            const x = (c + 0.5) * config.fontSize;
            const y = (r + 0.5) * config.fontSize;

            if (cell.intensity > 0.8) {
              // Bright leading bloom
              ctx.shadowColor = config.color;
              ctx.shadowBlur = config.glow;
              ctx.fillStyle = config.headColor;
            } else {
              ctx.shadowBlur = 0;
              ctx.fillStyle = config.color;
            }

            ctx.globalAlpha = totalIntensity;
            ctx.fillText(cell.char, x, y);
          }

          // Decay trail
          if (cell.intensity > 0) {
            cell.intensity = Math.max(0, cell.intensity - config.fade);
          }
        }
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    }

    // Monitor route changes
    updateThemeConfig();
    window.addEventListener("popstate", updateThemeConfig);
    window.addEventListener("hashchange", updateThemeConfig);

    // Watch for SPA URL / DOM changes
    let lastPath = window.location.pathname;
    setInterval(() => {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        updateThemeConfig();
      }
    }, 400);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMatrixTrail);
  } else {
    initMatrixTrail();
  }
})();
