/**
 * ========================================================
 * 3D ANIMATED HOLOGRAPHIC ORB ENGINE (DATA ANALYTICS & AI)
 * ========================================================
 * High-Performance Animated Centerpiece for Skills Section:
 * - Shared visual container for Data Analytics and AI & Automation
 * - Gentle floating levitation & subtle organic rotation
 * - Realistic 3D glass reflections (multi-layer specular gloss, fresnel rim)
 * - Restrained neon-green rim lighting (avoiding blown-out glow)
 * - Smoothly animated 3D bar chart rising on scroll
 * - Line chart that draws itself progressively with glowing node beacons
 * - Natural scroll-based reveal & reversal on upward scrolling
 * - Floating satellite tool bubbles (Python, SQL, Excel, Power BI)
 * - Interactive 3D mouse parallax tilt & cross-card highlight sync
 * - Multi-mode state: 'analytics' <-> 'ai' within the SAME glass container
 * - Respects prefers-reduced-motion
 * - Lightweight, optimized for 60fps across mobile, tablet, and desktop
 * ========================================================
 */

export class AnalyticsOrbEngine {
  constructor(canvasId = 'analyticsOrbCanvas', containerId = 'analyticsOrbContainer') {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);

    if (!this.canvas || !this.container) {
      console.warn('AnalyticsOrbEngine: Canvas or container not found.');
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Reduced motion preference
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse Parallax (smoothed)
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    // Scroll Progress State (0 = outside view, 1 = fully active in view)
    this.scrollProgress = this.prefersReducedMotion ? 1.0 : 0.0;
    this.targetScrollProgress = this.prefersReducedMotion ? 1.0 : 0.0;
    this.revealProgress = this.prefersReducedMotion ? 1.0 : 0.0; // Damped animation progress

    // Shared Container Multi-Mode State (Analytics <-> AI & Automation <-> Web Development <-> Engineering & IoT)
    this.currentMode = 'analytics'; // 'analytics' | 'ai' | 'dev' | 'eng'
    this.targetModeTransition = 0.0; // 0.0 = analytics, 1.0 = ai, 2.0 = dev, 3.0 = eng
    this.modeTransition = 0.0;

    // Particle & Ember System
    this.particles = [];
    this.orbitRingAngle = 0;
    this.isRunning = false;
    this.isVisible = true;
    this.animationFrameId = null;
    this.startTime = performance.now();

    // Data Analytics 3D Bar Chart definition
    this.bars = [
      { baseHeight: 0.38, amp: 0.08, freq: 0.0016, phase: 0.0, colorStart: '#E1E7F0', colorEnd: '#BFC7D5' },
      { baseHeight: 0.58, amp: 0.10, freq: 0.0020, phase: 1.2, colorStart: '#E1E7F0', colorEnd: '#8B9BB4' },
      { baseHeight: 0.78, amp: 0.09, freq: 0.0018, phase: 2.5, colorStart: '#FFFFFF', colorEnd: '#E1E7F0' },
      { baseHeight: 0.95, amp: 0.07, freq: 0.0022, phase: 3.8, colorStart: '#E1E7F0', colorEnd: '#BFC7D5' }
    ];

    // AI & Automation Neural Network Nodes definition (For Mode 2)
    this.aiNodes = [
      { x: 0, y: 0, r: 8, pulse: 0, color: '#E1E7F0' },
      { x: -0.45, y: -0.32, r: 5, pulse: 1.0, color: '#8B9BB4' },
      { x: 0.42, y: -0.36, r: 5, pulse: 2.1, color: '#FFFFFF' },
      { x: -0.52, y: 0.28, r: 5, pulse: 3.4, color: '#BFC7D5' },
      { x: 0.48, y: 0.25, r: 5, pulse: 4.2, color: '#E1E7F0' },
      { x: 0.0, y: -0.55, r: 4, pulse: 5.0, color: '#FFFFFF' },
      { x: 0.0, y: 0.52, r: 4, pulse: 1.8, color: '#8B9BB4' }
    ];

    this.init();
  }

  init() {
    this.setupDimensions();
    this.createEmbers();
    this.bindEvents();
    this.updateScrollPosition();
    this.start();

    // Expose engine instance on window for external transitions
    window.analyticsOrbEngine = this;
  }

  setupDimensions() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.container.getBoundingClientRect();

    // Use container dimensions or sensible responsive defaults
    this.width = Math.max(340, rect.width || 520);
    this.height = Math.max(340, rect.height || 520);

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);

    // Apply DPR scale cleanly
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  createEmbers() {
    this.particles = [];
    const count = this.prefersReducedMotion ? 12 : 28;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * (this.width * 0.65),
        y: (Math.random() - 0.5) * (this.height * 0.65),
        size: 1.0 + Math.random() * 2.0,
        speedY: 0.35 + Math.random() * 0.7,
        speedX: (Math.random() - 0.5) * 0.4,
        alpha: 0.15 + Math.random() * 0.5,
        color: Math.random() > 0.4 ? '#E1E7F0' : '#8B9BB4',
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  bindEvents() {
    // 1. Mouse Parallax (Desktop)
    this.container.addEventListener('mousemove', (e) => {
      if (this.prefersReducedMotion) return;
      const rect = this.container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      this.mouse.targetX = nx * 12;
      this.mouse.targetY = ny * 8;
    }, { passive: true });

    this.container.addEventListener('mouseleave', () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });

    // Touch Support
    this.container.addEventListener('touchmove', (e) => {
      if (this.prefersReducedMotion || !e.touches.length) return;
      const rect = this.container.getBoundingClientRect();
      const nx = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1;
      this.mouse.targetX = nx * 10;
      this.mouse.targetY = ny * 6;
    }, { passive: true });

    this.container.addEventListener('touchend', () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    });

    // 2. Scroll-Based Progressive Reveal & Reversal (RAF throttled for 120fps fluid scrolling)
    let scrollRafId = null;
    window.addEventListener('scroll', () => {
      if (!scrollRafId) {
        scrollRafId = requestAnimationFrame(() => {
          this.updateScrollPosition();
          scrollRafId = null;
        });
      }
    }, { passive: true });



    // 4. Resize Handling
    window.addEventListener('resize', () => {
      this.setupDimensions();
      this.updateScrollPosition();
    }, { passive: true });

    // 5. Visibility / Battery Optimization (Track entire master skills section)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) {
          this.setupDimensions();
          this.start();
        } else {
          this.stop();
        }
      });
    }, { threshold: 0.01, rootMargin: '200px 0px 200px 0px' });

    const trackEl = document.getElementById('skillsMasterTrack') || this.container;
    observer.observe(trackEl);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
      else if (this.isVisible) this.start();
    });

    // 6. Navigation / Dock Integration
    this.setupCategorySwitchers();
  }

  /**
   * Calculate Scroll Progress for Natural Reveal, Reversal, and Continuous 4-Mode Transition
   */
  updateScrollPosition() {
    const section = document.getElementById('skills');
    const aiSection = document.getElementById('ai-automation');
    const devSection = document.getElementById('web-development');
    const engSection = document.getElementById('engineering-iot');
    const track = document.getElementById('skillsMasterTrack') || section;
    if (!section) return;

    const rect = track.getBoundingClientRect();
    const vh = window.innerHeight;

    if (this.prefersReducedMotion) {
      this.targetScrollProgress = 1.0;
      this.scrollProgress = 1.0;
    } else {
      // Entry starts when master track top is at 95% of viewport
      // Fully active when master track top reaches 25% of viewport
      const enterPoint = vh * 0.95;
      const activePoint = vh * 0.25;
      const progress = (enterPoint - rect.top) / (enterPoint - activePoint);
      this.targetScrollProgress = Math.max(0, Math.min(1, progress));
    }

    // Continuous 4-state transition:
    // 0.0 = Data Analytics, 1.0 = AI & Automation, 2.0 = Development & Tools, 3.0 = Engineering & IoT
    let targetMode = 0.0;
    const triggerStart = vh * 0.70;
    const triggerFull = vh * 0.20;
    const span = triggerStart - triggerFull;

    if (engSection && engSection.getBoundingClientRect().top <= triggerStart) {
      // Transitioning from Dev (2.0) to Eng & IoT (3.0)
      const engRect = engSection.getBoundingClientRect();
      const engProgress = Math.max(0, Math.min(1.0, (triggerStart - engRect.top) / span));
      targetMode = 2.0 + engProgress;
    } else if (devSection && devSection.getBoundingClientRect().top <= triggerStart) {
      // Transitioning from AI (1.0) to Dev (2.0)
      const devRect = devSection.getBoundingClientRect();
      const devProgress = Math.max(0, Math.min(1.0, (triggerStart - devRect.top) / span));
      targetMode = 1.0 + devProgress;
    } else if (aiSection && aiSection.getBoundingClientRect().top <= triggerStart) {
      // Transitioning from Analytics (0.0) to AI (1.0)
      const aiRect = aiSection.getBoundingClientRect();
      const aiProgress = Math.max(0, Math.min(1.0, (triggerStart - aiRect.top) / span));
      targetMode = aiProgress;
    } else {
      targetMode = 0.0;
    }

    this.targetModeTransition = targetMode;

    if (!this.isRunning) {
      this.updateDockStates(this.targetModeTransition);
    }
  }

  /**
   * Synchronize the Left Cyber Dock Rail and text labels with active mode transition
   */
  updateDockStates(t) {
    const dockAnalytics = document.getElementById('dockNodeAnalytics');
    const dockAi = document.getElementById('dockNodeAi');
    const dockDev = document.getElementById('dockNodeDev');
    const dockEng = document.getElementById('dockNodeEng');

    if (!dockAnalytics || !dockAi) return;

    const dockLabelAnalytics = dockAnalytics.querySelector('.dock-label');
    const dockLabelAi = dockAi.querySelector('.dock-label-ai');
    const dockLabelDev = dockDev ? dockDev.querySelector('.dock-label-dev') : null;
    const dockLabelEng = dockEng ? dockEng.querySelector('.dock-label-eng') : null;

    let targetActive = 'analytics';
    if (t >= 2.45) {
      targetActive = 'eng';
    } else if (t >= 1.45) {
      targetActive = 'dev';
    } else if (t >= 0.45) {
      targetActive = 'ai';
    } else {
      targetActive = 'analytics';
    }

    if (this.activeDockId !== targetActive) {
      this.activeDockId = targetActive;
      this.currentMode = targetActive;

      dockAnalytics.classList.toggle('active', targetActive === 'analytics');
      dockAi.classList.toggle('active', targetActive === 'ai');
      if (dockDev) dockDev.classList.toggle('active', targetActive === 'dev');
      if (dockEng) dockEng.classList.toggle('active', targetActive === 'eng');

      if (dockLabelAnalytics) dockLabelAnalytics.style.display = targetActive === 'analytics' ? 'flex' : 'none';
      if (dockLabelAi) dockLabelAi.style.display = targetActive === 'ai' ? 'flex' : 'none';
      if (dockLabelDev) dockLabelDev.style.display = targetActive === 'dev' ? 'flex' : 'none';
      if (dockLabelEng) dockLabelEng.style.display = targetActive === 'eng' ? 'flex' : 'none';
    }
  }

  /**
   * Setup Category Switching (Dock nodes and < > buttons across all sections)
   */
  setupCategorySwitchers() {
    const prevBtn = document.getElementById('skillsPrevBtn');
    const nextBtn = document.getElementById('skillsNextBtn');
    const aiPrevBtn = document.getElementById('aiPrevBtn');
    const aiNextBtn = document.getElementById('aiNextBtn');
    const devPrevBtn = document.getElementById('devPrevBtn');
    const devNextBtn = document.getElementById('devNextBtn');
    const engPrevBtn = document.getElementById('engPrevBtn');
    const engNextBtn = document.getElementById('engNextBtn');
    const dockNodes = document.querySelectorAll('.skills-dock-rail .dock-node');

    const handleSwitch = (node) => {
      const id = node.id;
      if (id === 'dockNodeEng') {
        this.setMode('eng');
      } else if (id === 'dockNodeDev') {
        this.setMode('dev');
      } else if (id === 'dockNodeAi') {
        this.setMode('ai');
      } else if (id === 'dockNodeAnalytics') {
        this.setMode('analytics');
      } else {
        const cat = parseInt(node.getAttribute('data-category') || '0', 10);
        if (cat === 4) this.setMode('eng');
        else if (cat === 3) this.setMode('dev');
        else if (cat === 2) this.setMode('ai');
        else if (cat === 1) this.setMode('analytics');
      }
    };

    dockNodes.forEach((node) => {
      node.addEventListener('click', (e) => {
        const href = node.getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
        handleSwitch(node);
      });
    });

    // 02. Data Analytics arrows
    prevBtn?.addEventListener('click', () => {
      const aboutEl = document.getElementById('about');
      aboutEl?.scrollIntoView({ behavior: 'smooth' });
    });
    nextBtn?.addEventListener('click', () => {
      const aiEl = document.getElementById('ai-automation');
      aiEl?.scrollIntoView({ behavior: 'smooth' });
      this.setMode('ai');
    });

    // 03. AI & Automation arrows
    aiPrevBtn?.addEventListener('click', () => {
      const skillsEl = document.getElementById('skills');
      skillsEl?.scrollIntoView({ behavior: 'smooth' });
      this.setMode('analytics');
    });
    aiNextBtn?.addEventListener('click', () => {
      const devEl = document.getElementById('web-development');
      devEl?.scrollIntoView({ behavior: 'smooth' });
      this.setMode('dev');
    });

    // 04. Web Development arrows
    devPrevBtn?.addEventListener('click', () => {
      const aiEl = document.getElementById('ai-automation');
      aiEl?.scrollIntoView({ behavior: 'smooth' });
      this.setMode('ai');
    });
    devNextBtn?.addEventListener('click', () => {
      const engEl = document.getElementById('engineering-iot');
      engEl?.scrollIntoView({ behavior: 'smooth' });
      this.setMode('eng');
    });

    // 05. Engineering and IoT arrows
    engPrevBtn?.addEventListener('click', () => {
      const devEl = document.getElementById('web-development');
      devEl?.scrollIntoView({ behavior: 'smooth' });
      this.setMode('dev');
    });
    engNextBtn?.addEventListener('click', () => {
      const projEl = document.getElementById('projects');
      projEl?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  setMode(mode) {
    this.currentMode = mode;
    if (mode === 'eng') {
      this.targetModeTransition = 3.0;
    } else if (mode === 'dev') {
      this.targetModeTransition = 2.0;
    } else if (mode === 'ai') {
      this.targetModeTransition = 1.0;
    } else {
      this.targetModeTransition = 0.0;
    }
  }

  toggleMode() {
    if (this.currentMode === 'analytics') this.setMode('ai');
    else if (this.currentMode === 'ai') this.setMode('dev');
    else if (this.currentMode === 'dev') this.setMode('eng');
    else this.setMode('analytics');
  }

  start() {
    if (!this.isRunning && this.isVisible) {
      this.isRunning = true;
      this.animationFrameId = requestAnimationFrame((t) => this.tick(t));
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  tick(now) {
    if (!this.isRunning) return;

    const time = now - this.startTime;
    const motionFactor = this.prefersReducedMotion ? 0.0 : 1.0;

    // Smooth Damping on Scroll Progress (Natural entry and reversal)
    this.scrollProgress += (this.targetScrollProgress - this.scrollProgress) * 0.075;
    this.revealProgress = this.scrollProgress;

    // Smooth Mode Transition Interpolation ('analytics' <-> 'ai' <-> 'dev' <-> 'eng')
    this.modeTransition += (this.targetModeTransition - this.modeTransition) * 0.06;

    // Continuously update dock active classes and labels in sync with modeTransition
    this.updateDockStates(this.modeTransition);

    // Smooth Mouse Damping
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08 * motionFactor;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08 * motionFactor;

    // Gentle Floating Motion & Subtle Organic Rotation (Requirement 2)
    const floatY = Math.sin(time * 0.0013) * 9 * motionFactor;
    const floatX = Math.cos(time * 0.0010) * 4 * motionFactor;
    const subtleTilt = Math.sin(time * 0.0008) * 0.03 * motionFactor;

    // Apply 3D Perspective Tilt to container scene
    const sceneWrapper = this.container.querySelector('.analytics-3d-scene');
    if (sceneWrapper) {
      const rotY = this.mouse.x * 0.6 + floatX * 0.3;
      const rotX = -this.mouse.y * 0.6 + floatY * 0.2;
      sceneWrapper.style.transform = `perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg)`;
    }

    // Mode Weights across 4 modes (0.0 = Analytics, 1.0 = AI, 2.0 = Web Dev, 3.0 = Eng & IoT)
    const t = Math.max(0, Math.min(3.0, this.modeTransition));
    const wAnalytics = Math.max(0, Math.min(1.0, 1.0 - t));
    const wAi = t <= 1.0 ? Math.max(0, Math.min(1.0, t)) : Math.max(0, Math.min(1.0, 2.0 - t));
    const wDev = t <= 2.0 ? Math.max(0, Math.min(1.0, t - 1.0)) : Math.max(0, Math.min(1.0, 3.0 - t));
    const wEng = Math.max(0, Math.min(1.0, t - 2.0));

    // Clear Canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Compute Dynamic Center & Dimensions
    const centerX = this.width * 0.5 + floatX + this.mouse.x * 0.35;
    const centerY = this.height * 0.48 + floatY + this.mouse.y * 0.35;
    const baseSphereRadius = Math.min(this.width, this.height) * 0.31;
    // Scale on scroll reveal (scale from 0.84 to 1.0)
    const sphereRadius = baseSphereRadius * (0.84 + 0.16 * this.revealProgress);

    // If completely scrolled out of view, save CPU
    if (this.revealProgress < 0.02) {
      this.animationFrameId = requestAnimationFrame((t) => this.tick(t));
      return;
    }

    this.ctx.save();
    // Global reveal opacity
    this.ctx.globalAlpha = Math.max(0, Math.min(1, this.revealProgress * 1.3));

    // 1. Draw Concentric Holographic Pedestal Base with Floor Reflection
    this.drawHoloBase(centerX, centerY + sphereRadius * 1.08, sphereRadius, time, motionFactor);

    // 2. Draw Ascending Cyber Embers
    this.drawEmbers(centerX, centerY, sphereRadius, time, motionFactor);

    // 3. Draw Back Half of Tilted Orbital Ring
    this.drawOrbitalRing(centerX, centerY, sphereRadius * 1.34, time, true, subtleTilt);

    // 4. Draw Central Glass Sphere Cosmic Interior & Rotating Grid
    this.drawSphereInterior(centerX, centerY, sphereRadius, time, subtleTilt);

    // 5. Draw Visuals with Smooth Transition between Modes
    // Mode A: Data Analytics (Rising 3D Bars & Progressive Line Chart)
    if (wAnalytics > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha *= wAnalytics;
      this.drawAnimatedBarChartAndTrendline(centerX, centerY, sphereRadius, time, motionFactor);
      this.ctx.restore();
    }

    // Mode B: AI & Automation (Neural Synaptic Network & Pulsing Core)
    if (wAi > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha *= wAi;
      this.drawAiSynapticNetwork(centerX, centerY, sphereRadius, time, motionFactor);
      this.ctx.restore();
    }

    // Mode C: Web Development & Tools (Holographic IDE Window, Globe, Devices & Wireframes)
    if (wDev > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha *= wDev;
      this.drawWebDevelopmentVisual(centerX, centerY, sphereRadius, time, motionFactor);
      this.ctx.restore();
    }

    // Mode D: Engineering and IoT (Robotic Arm, CAD Screen, Central Gear, Arduino, ESP32)
    if (wEng > 0.01) {
      this.ctx.save();
      this.ctx.globalAlpha *= wEng;
      this.drawEngineeringIotVisual(centerX, centerY, sphereRadius, time, motionFactor);
      this.ctx.restore();
    }

    // 6. Draw Realistic Glass Sphere Shell & Restrained Neon Fresnel Rim
    this.drawRealisticGlassShell(centerX, centerY, sphereRadius, time);

    // 7. Draw Front Half of Tilted Orbital Ring
    this.drawOrbitalRing(centerX, centerY, sphereRadius * 1.34, time, false, subtleTilt);

    this.ctx.restore();

    this.animationFrameId = requestAnimationFrame((t) => this.tick(t));
  }

  /* --------------------------------------------------------
     1. HOLOGRAPHIC PROJECTOR PLATFORM BASE
     -------------------------------------------------------- */
  drawHoloBase(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    const baseW = radius * 2.1;
    const baseH = baseW * 0.22;

    ctx.save();

    // Soft Ambient Floor Reflection Glow
    const floorGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, baseW * 0.55);
    floorGrad.addColorStop(0, 'rgba(139, 155, 180, 0.22)');
    floorGrad.addColorStop(0.35, 'rgba(191, 199, 213, 0.08)');
    floorGrad.addColorStop(0.7, 'rgba(139, 155, 180, 0.02)');
    floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = floorGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, baseW * 0.55, baseH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Concentric Projector Rings
    const ringRadii = [baseW * 0.45, baseW * 0.34, baseW * 0.22];

    ringRadii.forEach((r, idx) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.26, 0, 0, Math.PI * 2);
      ctx.strokeStyle = idx === 1 ? 'rgba(139, 155, 180, 0.75)' : 'rgba(139, 155, 180, 0.25)';
      ctx.lineWidth = idx === 1 ? 1.5 : 1.0;
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = idx === 1 ? 8 : 3;
      ctx.stroke();
    });

    // Rotating Radar Dashed Ring
    ctx.save();
    ctx.beginPath();
    const radarRot = time * 0.00035 * motionFactor;
    ctx.ellipse(cx, cy, baseW * 0.38, baseW * 0.38 * 0.26, radarRot, 0, Math.PI * 2);
    ctx.setLineDash([5, 10]);
    ctx.strokeStyle = 'rgba(191, 199, 213, 0.5)';
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  /* --------------------------------------------------------
     2. ASCENDING CYBER EMBERS & PARTICLES
     -------------------------------------------------------- */
  drawEmbers(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    this.particles.forEach(p => {
      p.y -= p.speedY * motionFactor;
      p.x += Math.sin(time * 0.002 + p.phase) * p.speedX * motionFactor;

      if (p.y < -radius * 1.3) {
        p.y = radius * 1.2;
        p.x = (Math.random() - 0.5) * (radius * 1.8);
      }

      const px = cx + p.x;
      const py = cy + p.y;
      const alpha = p.alpha * (0.6 + Math.sin(time * 0.003 + p.phase) * 0.4);

      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 5;
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha * this.revealProgress));

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();
  }

  /* --------------------------------------------------------
     3. TILTED PLANETARY ORBITAL RINGS
     -------------------------------------------------------- */
  drawOrbitalRing(cx, cy, radius, time, isBack, subtleTilt) {
    const ctx = this.ctx;
    ctx.save();

    const ringRx = radius * 1.14;
    const ringRy = radius * 0.36;
    const rotZ = -0.36 + subtleTilt;

    ctx.translate(cx, cy);
    ctx.rotate(rotZ);

    ctx.beginPath();
    if (isBack) {
      // Top half behind the sphere
      ctx.ellipse(0, 0, ringRx, ringRy, 0, Math.PI, Math.PI * 2);
    } else {
      // Bottom half in front of the sphere
      ctx.ellipse(0, 0, ringRx, ringRy, 0, 0, Math.PI);
    }

    ctx.strokeStyle = 'rgba(139, 155, 180, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Traveling Data Node on the orbital ring
    const angle = (time * 0.00075) % (Math.PI * 2);
    const nodeInBack = angle > Math.PI;

    if (nodeInBack === isBack) {
      const nx = Math.cos(angle) * ringRx;
      const ny = Math.sin(angle) * ringRy;

      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(nx, ny, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* --------------------------------------------------------
     4. CENTRAL SPHERE INTERIOR & ROTATING CYBER GRID
     -------------------------------------------------------- */
  drawSphereInterior(cx, cy, radius, time, subtleTilt) {
    const ctx = this.ctx;
    ctx.save();

    // Inner Mask
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Deep Glass Spherical Volume Gradient
    const innerGrad = ctx.createRadialGradient(
      cx - radius * 0.25, cy - radius * 0.35, radius * 0.08,
      cx, cy, radius
    );
    innerGrad.addColorStop(0, 'rgba(139, 155, 180, 0.20)');
    innerGrad.addColorStop(0.45, 'rgba(4, 24, 15, 0.72)');
    innerGrad.addColorStop(0.85, 'rgba(2, 10, 6, 0.90)');
    innerGrad.addColorStop(1, 'rgba(139, 155, 180, 0.28)');

    ctx.fillStyle = innerGrad;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    // Subtle Rotating Latitude Lines
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.09)';
    ctx.lineWidth = 0.9;

    for (let i = -3; i <= 3; i++) {
      const latY = cy + (i / 4) * radius * 0.85;
      const latRadius = Math.sqrt(Math.max(0, radius * radius - (latY - cy) * (latY - cy)));

      ctx.beginPath();
      ctx.ellipse(cx, latY, latRadius * 0.95, latRadius * 0.22, subtleTilt, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* --------------------------------------------------------
     5. ANIMATED 3D DATA ANALYTICS BARS & PROGRESSIVE LINE CHART
     -------------------------------------------------------- */
  drawAnimatedBarChartAndTrendline(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    // Clip strictly inside the sphere interior
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
    ctx.clip();

    // Chart Dimensions
    const chartW = radius * 1.28;
    const maxBarH = radius * 0.80;
    const barW = chartW / 6.4;
    const gap = barW * 0.44;
    const baseY = cy + radius * 0.48;
    const startX = cx - chartW * 0.5 + barW * 0.5;

    // Track bar top centers for the connected progressive trendline
    const nodePoints = [];

    // Scroll reveal progress for bars (staggered rise)
    this.bars.forEach((bar, idx) => {
      // Staggered rise progress per bar
      const barDelay = idx * 0.12;
      const barProgress = Math.max(0, Math.min(1, (this.revealProgress - barDelay) / 0.52));
      // Smooth cubic ease out
      const easedRise = 1 - Math.pow(1 - barProgress, 3);

      // Subtle resting wave breathing (only when active)
      const pulse = Math.sin(time * bar.freq + bar.phase) * bar.amp * motionFactor * easedRise;
      const heightFactor = Math.min(0.98, Math.max(0.01, (bar.baseHeight + pulse) * easedRise));
      const currentH = maxBarH * heightFactor;

      const bx = startX + idx * (barW + gap);
      const by = baseY - currentH;

      // 3D Isometric bevel depth
      const depthX = barW * 0.24;
      const depthY = depthX * 0.44;

      if (currentH > 2) {
        // A. Left 3D Shadow Face
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + depthX, by - depthY);
        ctx.lineTo(bx + depthX, baseY - depthY);
        ctx.lineTo(bx, baseY);
        ctx.closePath();

        const sideGrad = ctx.createLinearGradient(bx, by, bx, baseY);
        sideGrad.addColorStop(0, 'rgba(191, 199, 213, 0.55)');
        sideGrad.addColorStop(1, 'rgba(52, 60, 73, 0.35)');
        ctx.fillStyle = sideGrad;
        ctx.fill();
        ctx.strokeStyle = 'rgba(139, 155, 180, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // B. Front 3D Radiant Face
        ctx.beginPath();
        ctx.rect(bx, by, barW, currentH);

        const frontGrad = ctx.createLinearGradient(bx, by, bx, baseY);
        frontGrad.addColorStop(0, bar.colorStart);
        frontGrad.addColorStop(0.65, bar.colorEnd);
        frontGrad.addColorStop(1, 'rgba(2, 28, 16, 0.85)');

        ctx.fillStyle = frontGrad;
        ctx.shadowColor = bar.colorStart;
        ctx.shadowBlur = 10;
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 1.1;
        ctx.stroke();

        // C. Top Specular Bevel Cap
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + depthX, by - depthY);
        ctx.lineTo(bx + barW + depthX, by - depthY);
        ctx.lineTo(bx + barW, by);
        ctx.closePath();

        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#E1E7F0';
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.8;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // Store node point (center top of bar)
      nodePoints.push({
        x: bx + barW * 0.5,
        y: by,
        reached: false
      });
    });

    // ----------------------------------------------------
    // PROGRESSIVE LINE CHART DRAWING (Requirement 2 & 3)
    // ----------------------------------------------------
    if (nodePoints.length > 1) {
      // Progress of line draw: starts at 22% scroll reveal, finishes at 90%
      const lineProgress = Math.max(0, Math.min(1, (this.revealProgress - 0.22) / 0.68));

      if (lineProgress > 0.01) {
        // Calculate cumulative segment lengths
        const segmentLengths = [];
        let totalPathLength = 0;

        for (let i = 0; i < nodePoints.length - 1; i++) {
          const dx = nodePoints[i + 1].x - nodePoints[i].x;
          const dy = nodePoints[i + 1].y - nodePoints[i].y;
          const segLen = Math.hypot(dx, dy);
          segmentLengths.push(segLen);
          totalPathLength += segLen;
        }

        const currentTargetLength = totalPathLength * lineProgress;

        // Trace and stroke progressive sub-path
        ctx.beginPath();
        ctx.moveTo(nodePoints[0].x, nodePoints[0].y);

        let accumulated = 0;
        let headX = nodePoints[0].x;
        let headY = nodePoints[0].y;

        for (let i = 0; i < nodePoints.length - 1; i++) {
          const p1 = nodePoints[i];
          const p2 = nodePoints[i + 1];
          const segLen = segmentLengths[i];

          if (accumulated + segLen <= currentTargetLength) {
            // Full segment completed
            p1.reached = true;
            p2.reached = true;
            ctx.lineTo(p2.x, p2.y);
            accumulated += segLen;
            headX = p2.x;
            headY = p2.y;
          } else {
            // Fractional segment currently being drawn
            p1.reached = true;
            const remaining = currentTargetLength - accumulated;
            const t = remaining / segLen;
            headX = p1.x + (p2.x - p1.x) * t;
            headY = p1.y + (p2.y - p1.y) * t;
            ctx.lineTo(headX, headY);
            break;
          }
        }

        // Stroke Outer Glow Laser Line
        ctx.strokeStyle = '#E1E7F0';
        ctx.lineWidth = 3.2;
        ctx.shadowColor = '#E1E7F0';
        ctx.shadowBlur = 12;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Stroke Inner Sharp Laser Core
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#FFFFFF';
        ctx.stroke();

        // Animated Traveling Laser Data Sparks along the drawn line
        if (lineProgress > 0.4 && motionFactor > 0) {
          const sparkCount = 2;
          for (let s = 0; s < sparkCount; s++) {
            const sparkOffset = ((time * 0.0009 + s * 0.5) % 1.0) * lineProgress;
            const sparkDist = totalPathLength * sparkOffset;

            // Find point at sparkDist
            let acc = 0;
            for (let i = 0; i < nodePoints.length - 1; i++) {
              const segLen = segmentLengths[i];
              if (acc + segLen >= sparkDist) {
                const st = (sparkDist - acc) / segLen;
                const sx = nodePoints[i].x + (nodePoints[i + 1].x - nodePoints[i].x) * st;
                const sy = nodePoints[i].y + (nodePoints[i + 1].y - nodePoints[i].y) * st;

                ctx.beginPath();
                ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#FFFFFF';
                ctx.shadowColor = '#8B9BB4';
                ctx.shadowBlur = 12;
                ctx.fill();
                break;
              }
              acc += segLen;
            }
          }
        }

        // Draw Data Nodes (Pulsing Beacons) that have been reached by the line
        nodePoints.forEach((pt, idx) => {
          if (!pt.reached && lineProgress < 0.99) return;

          const pulse = Math.sin(time * 0.0035 + idx * 0.9) * 0.35 + 0.65;
          const outerR = 5 + pulse * 3.5;

          // Expanding Radar Ripple Ring
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, outerR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(139, 155, 180, ${0.9 - pulse * 0.6})`;
          ctx.lineWidth = 1.3;
          ctx.stroke();

          // Solid Luminous Node Core
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#E1E7F0';
          ctx.shadowBlur = 10;
          ctx.fill();
        });
      }
    }

    ctx.restore();
  }

  /* --------------------------------------------------------
     5B. AI & AUTOMATION NEURAL NETWORK & AGENT (Reference Match)
     -------------------------------------------------------- */
  drawAiSynapticNetwork(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    // Clip strictly inside the sphere
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
    ctx.clip();

    // 1. Concentric Holographic Floor Pedestal Rings (inside orb)
    const floorY = cy + radius * 0.48;
    const floorW = radius * 1.35;
    const floorH = floorW * 0.28;

    // Floor green glow
    const floorGlow = ctx.createRadialGradient(cx, floorY, 5, cx, floorY, floorW * 0.6);
    floorGlow.addColorStop(0, 'rgba(139, 155, 180, 0.45)');
    floorGlow.addColorStop(0.35, 'rgba(191, 199, 213, 0.18)');
    floorGlow.addColorStop(0.8, 'rgba(139, 155, 180, 0.04)');
    floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = floorGlow;
    ctx.beginPath();
    ctx.ellipse(cx, floorY, floorW * 0.6, floorH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Concentric green glowing rings on floor
    [0.92, 0.68, 0.44, 0.24].forEach((rf, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, floorY, floorW * 0.5 * rf, floorH * 0.5 * rf, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(139, 155, 180, 0.85)' : 'rgba(139, 155, 180, 0.35)';
      ctx.lineWidth = i === 1 ? 1.6 : 1.0;
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = i === 1 ? 8 : 3;
      ctx.stroke();
    });

    // Upward volumetric projector beam cone
    const beamGrad = ctx.createLinearGradient(cx, floorY, cx, cy - radius * 0.5);
    beamGrad.addColorStop(0, 'rgba(139, 155, 180, 0.16)');
    beamGrad.addColorStop(0.45, 'rgba(191, 199, 213, 0.06)');
    beamGrad.addColorStop(1, 'rgba(139, 155, 180, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(cx - floorW * 0.35, floorY);
    ctx.lineTo(cx - radius * 0.45, cy - radius * 0.4);
    ctx.lineTo(cx + radius * 0.45, cy - radius * 0.4);
    ctx.lineTo(cx + floorW * 0.35, floorY);
    ctx.closePath();
    ctx.fill();

    // 2. Synaptic Neural Constellation
    const neuralPoints = [
      { x: -0.68, y: -0.36, r: 3.5, color: '#E1E7F0' },
      { x: -0.38, y: -0.66, r: 3.0, color: '#8B9BB4' },
      { x: 0.35,  y: -0.68, r: 3.2, color: '#E1E7F0' },
      { x: 0.70,  y: -0.32, r: 3.5, color: '#8B9BB4' },
      { x: 0.72,  y: 0.18,  r: 3.0, color: '#FFFFFF' },
      { x: -0.70, y: 0.20,  r: 3.2, color: '#E1E7F0' },
      { x: -0.44, y: 0.56,  r: 2.8, color: '#8B9BB4' },
      { x: 0.46,  y: 0.54,  r: 2.8, color: '#FFFFFF' }
    ];

    const mappedNodes = neuralPoints.map(np => ({
      x: cx + np.x * radius * 0.88 + Math.sin(time * 0.0015 + np.x * 5) * 4 * motionFactor,
      y: cy + np.y * radius * 0.88 + Math.cos(time * 0.0018 + np.y * 5) * 4 * motionFactor,
      r: np.r,
      color: np.color
    }));

    // Draw neural laser links
    ctx.save();
    ctx.lineWidth = 1.0;
    for (let i = 0; i < mappedNodes.length; i++) {
      for (let j = i + 1; j < mappedNodes.length; j++) {
        const p1 = mappedNodes[i];
        const p2 = mappedNodes[j];
        const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        if (dist < radius * 1.1) {
          const alpha = (1 - dist / (radius * 1.1)) * 0.38;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(139, 155, 180, ${alpha})`;
          ctx.stroke();

          // Traveling data spark
          if (motionFactor > 0) {
            const st = ((time * 0.001 + (i * 3 + j) * 0.2) % 1.0);
            const sx = p1.x + (p2.x - p1.x) * st;
            const sy = p1.y + (p2.y - p1.y) * st;
            ctx.beginPath();
            ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#8B9BB4';
            ctx.shadowBlur = 6;
            ctx.fill();
          }
        }
      }
    }

    // Draw neural nodes
    mappedNodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 8;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    });
    ctx.restore();

    // 3. Four Floating Holographic HUD Screens (Matching Reference Image)
    this.drawHoloScreens(cx, cy, radius, time, motionFactor);

    // 4. Centerpiece AI Agent Robot (Matching Reference Image)
    this.drawAiRobotAgent(cx, cy, radius, time, motionFactor);

    ctx.restore();
  }

  /* --------------------------------------------------------
     5C. FOUR FLOATING HOLOGRAPHIC HUD SCREENS
     -------------------------------------------------------- */
  drawHoloScreens(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;

    // --- Screen 1: Top-Left Analytics HUD (📈) ---
    ctx.save();
    const s1X = cx - radius * 0.52;
    const s1Y = cy - radius * 0.26 + Math.sin(time * 0.0016) * 4 * motionFactor;
    const s1W = radius * 0.46;
    const s1H = radius * 0.32;
    ctx.translate(s1X, s1Y);
    ctx.rotate(-0.08);

    // Panel background & glass border
    ctx.fillStyle = 'rgba(2, 22, 14, 0.75)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.7)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-s1W * 0.5, -s1H * 0.5, s1W, s1H, 6);
    ctx.fill();
    ctx.stroke();

    // Header bar
    ctx.fillStyle = 'rgba(139, 155, 180, 0.2)';
    ctx.fillRect(-s1W * 0.5, -s1H * 0.5, s1W, s1H * 0.26);
    ctx.fillStyle = '#E1E7F0';
    ctx.font = `bold ${Math.max(7, Math.floor(radius * 0.045))}px monospace`;
    ctx.fillText('METRICS.SYS', -s1W * 0.42, -s1H * 0.32);

    // Mini bar graph inside Screen 1
    const barCount = 5;
    const miniBw = (s1W * 0.7) / barCount;
    for (let b = 0; b < barCount; b++) {
      const bh = (s1H * 0.45) * (0.35 + 0.15 * b + Math.sin(time * 0.003 + b) * 0.1 * motionFactor);
      ctx.fillStyle = b === 4 ? '#E1E7F0' : 'rgba(191, 199, 213, 0.8)';
      ctx.fillRect(-s1W * 0.4 + b * miniBw * 1.15, s1H * 0.38 - bh, miniBw * 0.75, bh);
    }
    // Growth Trendline
    ctx.beginPath();
    ctx.moveTo(-s1W * 0.38, s1H * 0.2);
    ctx.lineTo(-s1W * 0.15, s1H * 0.05);
    ctx.lineTo(s1W * 0.1, -s1H * 0.05);
    ctx.lineTo(s1W * 0.36, -s1H * 0.18);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    // --- Screen 2: Top-Right Prompt / Terminal HUD (>_) ---
    ctx.save();
    const s2X = cx + radius * 0.48;
    const s2Y = cy - radius * 0.38 + Math.cos(time * 0.0015) * 4 * motionFactor;
    const s2W = radius * 0.52;
    const s2H = radius * 0.36;
    ctx.translate(s2X, s2Y);
    ctx.rotate(0.06);

    ctx.fillStyle = 'rgba(2, 22, 14, 0.78)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-s2W * 0.5, -s2H * 0.5, s2W, s2H, 6);
    ctx.fill();
    ctx.stroke();

    // Header with 3 dots
    ctx.fillStyle = 'rgba(139, 155, 180, 0.2)';
    ctx.fillRect(-s2W * 0.5, -s2H * 0.5, s2W, s2H * 0.24);
    ctx.fillStyle = '#E1E7F0';
    ctx.beginPath();
    ctx.arc(-s2W * 0.40, -s2H * 0.38, 2.2, 0, Math.PI * 2);
    ctx.arc(-s2W * 0.30, -s2H * 0.38, 2.2, 0, Math.PI * 2);
    ctx.arc(-s2W * 0.20, -s2H * 0.38, 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Code lines
    ctx.font = `${Math.max(7, Math.floor(radius * 0.042))}px monospace`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('>_ AI.AGENT()', -s2W * 0.42, -s2H * 0.06);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('MODEL: ONLINE', -s2W * 0.42, s2H * 0.14);
    ctx.fillStyle = '#E1E7F0';
    ctx.fillText('ACCURACY: 99.8%', -s2W * 0.42, s2H * 0.34);
    ctx.restore();

    // --- Screen 3: Mid-Right Sliders / Dashboard HUD (🎛️) ---
    ctx.save();
    const s3X = cx + radius * 0.56;
    const s3Y = cy + radius * 0.08 + Math.sin(time * 0.0018 + 1) * 3 * motionFactor;
    const s3W = radius * 0.44;
    const s3H = radius * 0.30;
    ctx.translate(s3X, s3Y);
    ctx.rotate(0.04);

    ctx.fillStyle = 'rgba(2, 22, 14, 0.75)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.65)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-s3W * 0.5, -s3H * 0.5, s3W, s3H, 6);
    ctx.fill();
    ctx.stroke();

    // Horizontal progress bars
    const barW = s3W * 0.78;
    [0.85, 0.65, 0.92].forEach((fillRatio, idx) => {
      const y = -s3H * 0.25 + idx * (s3H * 0.26);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(-s3W * 0.4, y, barW, 4.5);

      const grad = ctx.createLinearGradient(-s3W * 0.4, y, -s3W * 0.4 + barW * fillRatio, y);
      grad.addColorStop(0, '#E1E7F0');
      grad.addColorStop(1, '#8B9BB4');
      ctx.fillStyle = grad;
      ctx.fillRect(-s3W * 0.4, y, barW * fillRatio, 4.5);
    });
    ctx.restore();

    // --- Screen 4: Bottom-Right Generative AI Vision Card (🖼️) ---
    ctx.save();
    const s4X = cx + radius * 0.40;
    const s4Y = cy + radius * 0.40 + Math.cos(time * 0.0017 + 2) * 2.5 * motionFactor;
    const s4W = radius * 0.36;
    const s4H = radius * 0.25;
    ctx.translate(s4X, s4Y);

    ctx.fillStyle = 'rgba(2, 22, 14, 0.8)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.6)';
    ctx.lineWidth = 1.1;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.roundRect(-s4W * 0.5, -s4H * 0.5, s4W, s4H, 5);
    ctx.fill();
    ctx.stroke();

    // Landscape Mountain Vector Icon
    ctx.beginPath();
    ctx.moveTo(-s4W * 0.34, s4H * 0.25);
    ctx.lineTo(-s4W * 0.1, -s4H * 0.15);
    ctx.lineTo(s4W * 0.12, s4H * 0.05);
    ctx.lineTo(s4W * 0.24, -s4H * 0.1);
    ctx.lineTo(s4W * 0.35, s4H * 0.25);
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Glowing Sun
    ctx.beginPath();
    ctx.arc(-s4W * 0.15, -s4H * 0.2, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = '#8B9BB4';
    ctx.fill();

    ctx.restore();
  }

  /* --------------------------------------------------------
     5D. FUTURISTIC AI AGENT ROBOT (Centerpiece Matching Reference Image)
     -------------------------------------------------------- */
  drawAiRobotAgent(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    // Robot levitation offset
    const robotY = cy + radius * 0.05 + Math.sin(time * 0.0022) * 5 * motionFactor;
    const headY = robotY - radius * 0.16;

    // Ambient Hologram Glow behind robot
    const robotAura = ctx.createRadialGradient(cx, robotY, radius * 0.08, cx, robotY, radius * 0.48);
    robotAura.addColorStop(0, 'rgba(139, 155, 180, 0.35)');
    robotAura.addColorStop(0.5, 'rgba(191, 199, 213, 0.12)');
    robotAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = robotAura;
    ctx.beginPath();
    ctx.arc(cx, robotY, radius * 0.48, 0, Math.PI * 2);
    ctx.fill();

    // --- 1. TORSO / BODY ---
    const bodyW = radius * 0.24;
    const bodyH = radius * 0.26;
    const bodyY = robotY + radius * 0.12;

    ctx.save();
    // Rounded White Futuristic Torso
    const bodyGrad = ctx.createLinearGradient(cx - bodyW, bodyY - bodyH * 0.5, cx + bodyW, bodyY + bodyH * 0.5);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.35, '#E6F4EE');
    bodyGrad.addColorStop(0.75, '#B7D5C7');
    bodyGrad.addColorStop(1, '#1A3828');

    ctx.fillStyle = bodyGrad;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.ellipse(cx, bodyY, bodyW, bodyH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Torso Gloss Highlight
    ctx.beginPath();
    ctx.ellipse(cx - bodyW * 0.3, bodyY - bodyH * 0.35, bodyW * 0.45, bodyH * 0.25, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();

    // Chest Badge: Circular Holographic Emblem with [ AI ]
    const badgeR = radius * 0.10;
    const badgeY = bodyY - radius * 0.01;

    ctx.beginPath();
    ctx.arc(cx, badgeY, badgeR, 0, Math.PI * 2);
    ctx.fillStyle = '#03140C';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 12;
    ctx.stroke();

    // Inner glowing ring
    ctx.beginPath();
    ctx.arc(cx, badgeY, badgeR * 0.78, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(191, 199, 213, 0.6)';
    ctx.lineWidth = 1.0;
    ctx.stroke();

    // AI Text in Badge
    ctx.fillStyle = '#E1E7F0';
    ctx.font = `bold ${Math.max(10, Math.floor(radius * 0.09))}px var(--font-heading, sans-serif)`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('AI', cx, badgeY + 1);
    ctx.restore();

    // --- 2. ROBOT ARMS & HANDS ---
    // Left Arm (Floating naturally downwards)
    ctx.save();
    ctx.strokeStyle = '#DCEEE4';
    ctx.lineWidth = radius * 0.055;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(cx - bodyW * 0.85, bodyY - bodyH * 0.2);
    ctx.quadraticCurveTo(cx - bodyW * 1.25, bodyY + bodyH * 0.2, cx - bodyW * 0.95, bodyY + bodyH * 0.55);
    ctx.stroke();
    // Left Hand
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx - bodyW * 0.95, bodyY + bodyH * 0.55, radius * 0.045, 0, Math.PI * 2);
    ctx.fill();

    // Right Arm (Raised gracefully pointing towards the HUD screens, matching reference image!)
    ctx.beginPath();
    ctx.moveTo(cx + bodyW * 0.82, bodyY - bodyH * 0.2);
    ctx.quadraticCurveTo(cx + bodyW * 1.35, bodyY - bodyH * 0.45, cx + bodyW * 1.45, bodyY - bodyH * 0.85);
    ctx.stroke();

    // Right Pointing Hand
    const handX = cx + bodyW * 1.45;
    const handY = bodyY - bodyH * 0.85;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(handX, handY, radius * 0.042, 0, Math.PI * 2);
    ctx.fill();
    // Pointing finger index line
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.lineTo(handX + radius * 0.04, handY - radius * 0.04);
    ctx.stroke();
    // Glowing laser fingertip spark
    ctx.fillStyle = '#E1E7F0';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(handX + radius * 0.04, handY - radius * 0.04, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // --- 3. NECK ---
    ctx.fillStyle = '#081E13';
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(cx - radius * 0.06, headY + radius * 0.12, radius * 0.12, radius * 0.07, 3);
    ctx.fill();
    ctx.stroke();

    // --- 4. HEAD (Glossy White Spherical Head) ---
    const headW = radius * 0.32;
    const headH = radius * 0.26;

    // Top Antenna Stalk & Glowing Beacon Ball
    ctx.save();
    ctx.strokeStyle = '#A8C9B9';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx, headY - headH * 0.95);
    ctx.quadraticCurveTo(cx - 3, headY - headH * 1.25, cx, headY - headH * 1.4);
    ctx.stroke();

    // Antenna Beacon Orb
    const antPulse = Math.sin(time * 0.005) * 0.3 + 0.7;
    ctx.fillStyle = '#E1E7F0';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 14 * antPulse;
    ctx.beginPath();
    ctx.arc(cx, headY - headH * 1.4, radius * 0.04 * antPulse, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(cx, headY - headH * 1.4, radius * 0.02, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Headphone Ear Pucks (Sides)
    [-1, 1].forEach(side => {
      const earX = cx + side * (headW * 0.95);
      const earY = headY;
      ctx.save();
      ctx.fillStyle = '#03140C';
      ctx.strokeStyle = '#E1E7F0';
      ctx.lineWidth = 1.8;
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(earX, earY, radius * 0.055, radius * 0.085, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner LED
      ctx.fillStyle = '#8B9BB4';
      ctx.beginPath();
      ctx.arc(earX, earY, radius * 0.025, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Main Head Skull
    ctx.save();
    const headGrad = ctx.createRadialGradient(
      cx - headW * 0.3, headY - headH * 0.4, radius * 0.05,
      cx, headY, headW
    );
    headGrad.addColorStop(0, '#FFFFFF');
    headGrad.addColorStop(0.3, '#F0FAF5');
    headGrad.addColorStop(0.75, '#C2DFD1');
    headGrad.addColorStop(1, '#1A3828');

    ctx.fillStyle = headGrad;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(cx, headY, headW, headH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Head Top Highlight
    ctx.beginPath();
    ctx.ellipse(cx - headW * 0.25, headY - headH * 0.45, headW * 0.48, headH * 0.22, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fill();

    // --- 5. BLACK VISOR FACEPLATE ---
    const visorW = headW * 0.76;
    const visorH = headH * 0.65;
    const visorY = headY + radius * 0.015;

    ctx.fillStyle = '#040F09';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(cx, visorY, visorW, visorH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Visor Glass Specular Arc Reflection
    ctx.beginPath();
    ctx.ellipse(cx - visorW * 0.2, visorY - visorH * 0.38, visorW * 0.55, visorH * 0.22, -Math.PI / 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fill();

    // --- 6. GLOWING NEON-GREEN EYES (Friendly Expression) ---
    const eyeOffsetX = headW * 0.32;
    const eyeY = visorY - radius * 0.01;
    const eyeRx = radius * 0.048;
    const eyeRy = radius * 0.065;

    [-1, 1].forEach(side => {
      const eyeX = cx + side * eyeOffsetX;

      // Outer Eye Glow
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, eyeRx * 1.3, eyeRy * 1.3, side * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(139, 155, 180, 0.35)';
      ctx.fill();

      // Main Eye Capsule
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, eyeRx, eyeRy, side * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#E1E7F0';
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = 14;
      ctx.fill();

      // Pupil / Core White Specular
      ctx.beginPath();
      ctx.ellipse(eyeX + side * 1, eyeY - 2, eyeRx * 0.52, eyeRy * 0.55, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#FFFFFF';
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    // Cute Neon-Green Smiling Mouth
    ctx.beginPath();
    ctx.arc(cx, visorY + radius * 0.062, radius * 0.042, 0.15 * Math.PI, 0.85 * Math.PI);
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.stroke();

    ctx.restore();
    ctx.restore();
  }

  /* --------------------------------------------------------
     5E. WEB DEVELOPMENT & TOOLS VISUAL (Reference Match)
     -------------------------------------------------------- */
  drawWebDevelopmentVisual(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    // Clip strictly inside the sphere
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
    ctx.clip();

    // 1. Concentric Holographic Floor Pedestal Rings (inside orb)
    const floorY = cy + radius * 0.48;
    const floorW = radius * 1.35;
    const floorH = floorW * 0.28;

    // Floor green glow
    const floorGlow = ctx.createRadialGradient(cx, floorY, 5, cx, floorY, floorW * 0.6);
    floorGlow.addColorStop(0, 'rgba(139, 155, 180, 0.45)');
    floorGlow.addColorStop(0.35, 'rgba(191, 199, 213, 0.18)');
    floorGlow.addColorStop(0.8, 'rgba(139, 155, 180, 0.04)');
    floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = floorGlow;
    ctx.beginPath();
    ctx.ellipse(cx, floorY, floorW * 0.6, floorH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Concentric green glowing rings on floor
    [0.92, 0.68, 0.44, 0.24].forEach((rf, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, floorY, floorW * 0.5 * rf, floorH * 0.5 * rf, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(139, 155, 180, 0.85)' : 'rgba(139, 155, 180, 0.35)';
      ctx.lineWidth = i === 1 ? 1.6 : 1.0;
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = i === 1 ? 8 : 3;
      ctx.stroke();
    });

    // Upward volumetric projector beam cone
    const beamGrad = ctx.createLinearGradient(cx, floorY, cx, cy - radius * 0.5);
    beamGrad.addColorStop(0, 'rgba(139, 155, 180, 0.16)');
    beamGrad.addColorStop(0.45, 'rgba(191, 199, 213, 0.06)');
    beamGrad.addColorStop(1, 'rgba(139, 155, 180, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(cx - floorW * 0.35, floorY);
    ctx.lineTo(cx - radius * 0.45, cy - radius * 0.4);
    ctx.lineTo(cx + radius * 0.45, cy - radius * 0.4);
    ctx.lineTo(cx + floorW * 0.35, floorY);
    ctx.closePath();
    ctx.fill();

    // Floating levitation delta
    const levX = Math.cos(time * 0.0011) * 3 * motionFactor;
    const levY = Math.sin(time * 0.0016) * 4 * motionFactor;

    // 2. Connecting cyber laser arcs from center IDE to outer holo mockups
    this.drawWebCyberConnectors(cx, cy, radius, time, motionFactor);

    // 3. Top-Right: Rotating 3D Wireframe Globe (Matching Reference Image)
    this.drawHoloGlobe(cx + radius * 0.38 + levX * 0.5, cy - radius * 0.42 + levY * 0.6, radius * 0.20, time, motionFactor);

    // 4. Top-Left: Holographic Desktop Wireframe Window (Matching Reference Image)
    this.drawHoloDesktopWindow(cx - radius * 0.44 + levX * 0.6, cy - radius * 0.30 - levY * 0.5, radius, time, motionFactor);

    // 5. Mid-Right: Holographic Mobile Smartphone Mockup (Matching Reference Image)
    this.drawHoloMobileMockup(cx + radius * 0.48 - levX * 0.5, cy - radius * 0.04 + levY * 0.7, radius, time, motionFactor);

    // 6. Bottom-Right: Floating Wireframe Grid Card (Matching Reference Image)
    this.drawHoloGridCard(cx + radius * 0.34 + levX * 0.4, cy + radius * 0.36 - levY * 0.4, radius, time, motionFactor);

    // 7. Bottom-Left / Accents: Floating 3D Isometric Cube, Gear, Cloud Icons
    this.drawHoloDevIcons(cx, cy, radius, time, motionFactor);

    // 8. Centerpiece: Holographic Code Editor Window with Glowing < / > (Matching Reference Image)
    this.drawCentralCodeWindow(cx + levX * 0.3, cy + radius * 0.04 + levY * 0.4, radius, time, motionFactor);

    ctx.restore();
  }

  /* --------------------------------------------------------
     5F. CYBER CONNECTORS & DATA PARTICLES
     -------------------------------------------------------- */
  drawWebCyberConnectors(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    const centerTarget = { x: cx, y: cy + radius * 0.04 };
    const targets = [
      { x: cx - radius * 0.38, y: cy - radius * 0.26, color: '#E1E7F0' },
      { x: cx + radius * 0.38, y: cy - radius * 0.38, color: '#8B9BB4' },
      { x: cx + radius * 0.44, y: cy - radius * 0.04, color: '#FFFFFF' },
      { x: cx + radius * 0.32, y: cy + radius * 0.32, color: '#E1E7F0' },
      { x: cx - radius * 0.40, y: cy + radius * 0.26, color: '#8B9BB4' }
    ];

    targets.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.moveTo(centerTarget.x, centerTarget.y);
      const cpX = (centerTarget.x + pt.x) * 0.5 + Math.sin(time * 0.002 + idx) * 8 * motionFactor;
      const cpY = (centerTarget.y + pt.y) * 0.5 + Math.cos(time * 0.002 + idx) * 8 * motionFactor;
      ctx.quadraticCurveTo(cpX, cpY, pt.x, pt.y);
      ctx.strokeStyle = `rgba(139, 155, 180, ${0.18 + 0.1 * Math.sin(time * 0.003 + idx)})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      // Traveling data spark along line
      if (motionFactor > 0) {
        const st = ((time * 0.0009 + idx * 0.22) % 1.0);
        // Quadratic bezier point: (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const it = 1 - st;
        const sx = it * it * centerTarget.x + 2 * it * st * cpX + st * st * pt.x;
        const sy = it * it * centerTarget.y + 2 * it * st * cpY + st * st * pt.y;

        ctx.beginPath();
        ctx.arc(sx, sy, 2.0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    });

    ctx.restore();
  }

  /* --------------------------------------------------------
     5G. ROTATING 3D WIREFRAME GLOBE (Top-Right)
     -------------------------------------------------------- */
  drawHoloGlobe(gx, gy, gRadius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(gx, gy);

    // Globe soft green glow aura
    const globeAura = ctx.createRadialGradient(0, 0, 2, 0, 0, gRadius * 1.3);
    globeAura.addColorStop(0, 'rgba(139, 155, 180, 0.28)');
    globeAura.addColorStop(0.5, 'rgba(191, 199, 213, 0.08)');
    globeAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = globeAura;
    ctx.beginPath();
    ctx.arc(0, 0, gRadius * 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Outer perimeter circle
    ctx.beginPath();
    ctx.arc(0, 0, gRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.75)';
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Rotating 3 longitude ellipses
    const tilt = 0.22;
    for (let i = 0; i < 4; i++) {
      const angle = time * 0.00075 * motionFactor + (i * Math.PI) / 4;
      const wf = Math.cos(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(1, Math.abs(wf) * gRadius), gRadius, tilt, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139, 155, 180, 0.38)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // 3 Horizontal latitude ellipses
    [-0.55, 0, 0.55].forEach(lat => {
      const yOff = lat * gRadius * 0.85;
      const rAtLat = Math.sqrt(Math.max(0, gRadius * gRadius - yOff * yOff));
      ctx.beginPath();
      ctx.ellipse(0, yOff, rAtLat, rAtLat * 0.28, tilt, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(191, 199, 213, 0.42)';
      ctx.lineWidth = 0.9;
      ctx.stroke();
    });

    // Glowing network beacon nodes on globe surface
    const nodeAngles = [0.3, 1.8, 3.2, 4.7];
    nodeAngles.forEach((na, i) => {
      const a = na + time * 0.00075 * motionFactor;
      const nx = Math.cos(a) * gRadius * 0.75;
      const ny = Math.sin(a * 0.8) * gRadius * 0.55;

      ctx.beginPath();
      ctx.arc(nx, ny, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = 8;
      ctx.fill();
    });

    ctx.restore();
  }

  /* --------------------------------------------------------
     5H. HOLOGRAPHIC DESKTOP WIREFRAME WINDOW (Top-Left)
     -------------------------------------------------------- */
  drawHoloDesktopWindow(wx, wy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(wx, wy);
    ctx.rotate(-0.06);

    const w = radius * 0.48;
    const h = radius * 0.34;

    // Window shadow & glass fill
    ctx.fillStyle = 'rgba(2, 22, 14, 0.80)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.roundRect(-w * 0.5, -h * 0.5, w, h, 6);
    ctx.fill();
    ctx.stroke();

    // Window top header bar
    const barH = h * 0.22;
    ctx.fillStyle = 'rgba(139, 155, 180, 0.22)';
    ctx.fillRect(-w * 0.5, -h * 0.5, w, barH);

    // 3 mini window control dots
    ctx.fillStyle = '#E1E7F0';
    [-w * 0.40, -w * 0.32, -w * 0.24].forEach(dotX => {
      ctx.beginPath();
      ctx.arc(dotX, -h * 0.5 + barH * 0.5, 2.0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top URL pill
    ctx.fillStyle = 'rgba(139, 155, 180, 0.15)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(-w * 0.15, -h * 0.5 + barH * 0.18, w * 0.55, barH * 0.64, 3);
    ctx.fill();
    ctx.stroke();

    // Body: Left wireframe image box
    const bodyTop = -h * 0.5 + barH + 4;
    const imgW = w * 0.40;
    const imgH = h * 0.58;
    ctx.fillStyle = 'rgba(191, 199, 213, 0.08)';
    ctx.strokeStyle = 'rgba(191, 199, 213, 0.5)';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(-w * 0.45, bodyTop, imgW, imgH, 3);
    ctx.fill();
    ctx.stroke();

    // Inside image: Mountain icon
    ctx.beginPath();
    ctx.moveTo(-w * 0.42, bodyTop + imgH - 3);
    ctx.lineTo(-w * 0.30, bodyTop + imgH * 0.4);
    ctx.lineTo(-w * 0.18, bodyTop + imgH * 0.65);
    ctx.lineTo(-w * 0.10, bodyTop + imgH * 0.3);
    ctx.lineTo(-w * 0.07, bodyTop + imgH - 3);
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Sun in image
    ctx.beginPath();
    ctx.arc(-w * 0.16, bodyTop + imgH * 0.3, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#8B9BB4';
    ctx.fill();

    // Body: Right column skeleton text lines
    const textX = 0;
    const lineW = w * 0.42;
    [0.18, 0.38, 0.58, 0.78].forEach((ratio, i) => {
      const ly = bodyTop + imgH * ratio;
      const lw = i === 3 ? lineW * 0.6 : (i % 2 === 0 ? lineW : lineW * 0.85);
      ctx.fillStyle = i === 0 ? 'rgba(139, 155, 180, 0.8)' : 'rgba(255, 255, 255, 0.45)';
      ctx.fillRect(textX, ly, lw, 3.2);
    });

    ctx.restore();
  }

  /* --------------------------------------------------------
     5I. HOLOGRAPHIC MOBILE SMARTPHONE MOCKUP (Mid-Right)
     -------------------------------------------------------- */
  drawHoloMobileMockup(px, py, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(0.04);

    const w = radius * 0.24;
    const h = radius * 0.44;

    // Phone body chassis
    ctx.fillStyle = 'rgba(2, 22, 14, 0.82)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.85)';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 9;
    ctx.beginPath();
    ctx.roundRect(-w * 0.5, -h * 0.5, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Top speaker / dynamic island notch
    ctx.fillStyle = '#E1E7F0';
    ctx.beginPath();
    ctx.roundRect(-w * 0.2, -h * 0.5 + 4, w * 0.4, 2.5, 1.2);
    ctx.fill();

    // Screen content: Mini hero banner card
    const bannerY = -h * 0.5 + 10;
    const bannerH = h * 0.30;
    ctx.fillStyle = 'rgba(191, 199, 213, 0.12)';
    ctx.strokeStyle = 'rgba(191, 199, 213, 0.55)';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.roundRect(-w * 0.42, bannerY, w * 0.84, bannerH, 3);
    ctx.fill();
    ctx.stroke();

    // Mountain peak in mobile banner
    ctx.beginPath();
    ctx.moveTo(-w * 0.35, bannerY + bannerH - 2);
    ctx.lineTo(-w * 0.15, bannerY + bannerH * 0.35);
    ctx.lineTo(w * 0.05, bannerY + bannerH * 0.7);
    ctx.lineTo(w * 0.25, bannerY + bannerH * 0.25);
    ctx.lineTo(w * 0.38, bannerY + bannerH - 2);
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.1;
    ctx.stroke();

    // 3 Content rows with icon square + text wireframe
    const rowStartY = bannerY + bannerH + 6;
    const rowH = (h * 0.42) / 3;

    for (let r = 0; r < 3; r++) {
      const ry = rowStartY + r * rowH;
      // Icon square
      ctx.fillStyle = r === 0 ? 'rgba(139, 155, 180, 0.6)' : 'rgba(191, 199, 213, 0.5)';
      ctx.fillRect(-w * 0.40, ry, w * 0.22, rowH * 0.65);

      // Text line
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(-w * 0.12, ry + 2, w * 0.52, 2.8);
      ctx.fillStyle = 'rgba(139, 155, 180, 0.4)';
      ctx.fillRect(-w * 0.12, ry + 7, w * 0.34, 2.2);
    }

    // Home indicator bar at bottom
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(-w * 0.22, h * 0.5 - 5, w * 0.44, 2.0, 1.0);
    ctx.fill();

    ctx.restore();
  }

  /* --------------------------------------------------------
     5J. HOLOGRAPHIC WIREFRAME GRID CARD (Bottom-Right)
     -------------------------------------------------------- */
  drawHoloGridCard(gx, gy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(0.03);

    const w = radius * 0.42;
    const h = radius * 0.25;

    ctx.fillStyle = 'rgba(2, 22, 14, 0.75)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.65)';
    ctx.lineWidth = 1.1;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 7;
    ctx.beginPath();
    ctx.roundRect(-w * 0.5, -h * 0.5, w, h, 5);
    ctx.fill();
    ctx.stroke();

    // Header bar
    ctx.fillStyle = 'rgba(139, 155, 180, 0.2)';
    ctx.fillRect(-w * 0.5, -h * 0.5, w, h * 0.25);

    // 3 column cards inside
    const colW = (w * 0.84) / 3;
    const colH = h * 0.55;
    const colY = -h * 0.5 + h * 0.32;

    for (let c = 0; c < 3; c++) {
      const cxPos = -w * 0.42 + c * colW * 1.05;
      ctx.fillStyle = 'rgba(191, 199, 213, 0.1)';
      ctx.strokeStyle = c === 1 ? '#E1E7F0' : 'rgba(139, 155, 180, 0.4)';
      ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.roundRect(cxPos, colY, colW * 0.9, colH, 2.5);
      ctx.fill();
      ctx.stroke();

      // Mini image inside each card
      ctx.fillStyle = c === 1 ? '#E1E7F0' : '#8B9BB4';
      ctx.fillRect(cxPos + 2, colY + 3, colW * 0.9 - 4, colH * 0.45);
    }

    ctx.restore();
  }

  /* --------------------------------------------------------
     5K. HOLOGRAPHIC 3D CUBE, GEAR, AND CLOUD ICONS (Bottom-Left)
     -------------------------------------------------------- */
  drawHoloDevIcons(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;

    // --- 1. Isometric 3D Wireframe Cube (Bottom-Left) ---
    ctx.save();
    const cubeX = cx - radius * 0.46;
    const cubeY = cy + radius * 0.26 + Math.sin(time * 0.002) * 3 * motionFactor;
    const s = radius * 0.09;
    ctx.translate(cubeX, cubeY);

    // Cube vertices
    const topV = { x: 0, y: -s };
    const leftV = { x: -s * 0.866, y: -s * 0.5 };
    const rightV = { x: s * 0.866, y: -s * 0.5 };
    const centerV = { x: 0, y: 0 };
    const botLeftV = { x: -s * 0.866, y: s * 0.5 };
    const botRightV = { x: s * 0.866, y: s * 0.5 };
    const botV = { x: 0, y: s };

    // Top face
    ctx.beginPath();
    ctx.moveTo(topV.x, topV.y);
    ctx.lineTo(rightV.x, rightV.y);
    ctx.lineTo(centerV.x, centerV.y);
    ctx.lineTo(leftV.x, leftV.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(139, 155, 180, 0.25)';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Left face
    ctx.beginPath();
    ctx.moveTo(leftV.x, leftV.y);
    ctx.lineTo(centerV.x, centerV.y);
    ctx.lineTo(botV.x, botV.y);
    ctx.lineTo(botLeftV.x, botLeftV.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(191, 199, 213, 0.18)';
    ctx.fill();
    ctx.strokeStyle = '#8B9BB4';
    ctx.stroke();

    // Right face
    ctx.beginPath();
    ctx.moveTo(rightV.x, rightV.y);
    ctx.lineTo(botRightV.x, botRightV.y);
    ctx.lineTo(botV.x, botV.y);
    ctx.lineTo(centerV.x, centerV.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(139, 155, 180, 0.12)';
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.restore();

    // --- 2. Holographic Gear / Settings Cog (Bottom-Left Lower) ---
    ctx.save();
    const gearX = cx - radius * 0.28;
    const gearY = cy + radius * 0.38 + Math.cos(time * 0.0018) * 2.5 * motionFactor;
    const gearR = radius * 0.08;
    ctx.translate(gearX, gearY);
    ctx.rotate(time * 0.0009 * motionFactor);

    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 6;

    // Cog teeth
    const teeth = 8;
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a1 = (i * Math.PI * 2) / teeth;
      const a2 = a1 + Math.PI / teeth;
      const rOuter = gearR * 1.22;
      const rInner = gearR * 0.88;

      const x1 = Math.cos(a1) * rInner;
      const y1 = Math.sin(a1) * rInner;
      const x2 = Math.cos(a1 + 0.12) * rOuter;
      const y2 = Math.sin(a1 + 0.12) * rOuter;
      const x3 = Math.cos(a2 - 0.12) * rOuter;
      const y3 = Math.sin(a2 - 0.12) * rOuter;
      const x4 = Math.cos(a2) * rInner;
      const y4 = Math.sin(a2) * rInner;

      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(139, 155, 180, 0.15)';
    ctx.fill();
    ctx.stroke();

    // Inner axle hole
    ctx.beginPath();
    ctx.arc(0, 0, gearR * 0.38, 0, Math.PI * 2);
    ctx.fillStyle = '#04110A';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.stroke();
    ctx.restore();

    // --- 3. Holographic Cloud (Bottom-Mid) ---
    ctx.save();
    const cloudX = cx - radius * 0.08;
    const cloudY = cy + radius * 0.44 + Math.sin(time * 0.0015) * 2 * motionFactor;
    const cw = radius * 0.11;
    ctx.translate(cloudX, cloudY);

    ctx.beginPath();
    ctx.arc(-cw * 0.4, 0, cw * 0.32, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(-cw * 0.1, -cw * 0.35, cw * 0.44, Math.PI * 1.0, Math.PI * 1.95);
    ctx.arc(cw * 0.35, -cw * 0.1, cw * 0.35, Math.PI * 1.5, Math.PI * 0.35);
    ctx.arc(cw * 0.15, cw * 0.25, cw * 0.22, 0, Math.PI * 0.5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(191, 199, 213, 0.16)';
    ctx.fill();
    ctx.strokeStyle = '#8B9BB4';
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#8B9BB4';
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.restore();
  }

  /* --------------------------------------------------------
     5L. CENTERPIECE HOLOGRAPHIC CODE WINDOW (WITH GLOWING < / >)
     (Pixel-Perfect Match to Attached Reference Image)
     -------------------------------------------------------- */
  drawCentralCodeWindow(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const w = radius * 0.88;
    const h = radius * 0.60;

    // Ambient radial bloom behind centerpiece code window
    const windowBloom = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius * 0.58);
    windowBloom.addColorStop(0, 'rgba(139, 155, 180, 0.38)');
    windowBloom.addColorStop(0.5, 'rgba(191, 199, 213, 0.12)');
    windowBloom.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = windowBloom;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.58, 0, Math.PI * 2);
    ctx.fill();

    // 1. Dark Glass Window Body
    ctx.fillStyle = 'rgba(2, 18, 11, 0.88)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.90)';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.roundRect(-w * 0.5, -h * 0.5, w, h, 8);
    ctx.fill();
    ctx.stroke();

    // Inner subtle cyan rim
    ctx.strokeStyle = 'rgba(191, 199, 213, 0.35)';
    ctx.lineWidth = 1.0;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.roundRect(-w * 0.5 + 2, -h * 0.5 + 2, w - 4, h - 4, 6);
    ctx.stroke();

    // 2. Window Header Bar
    const barH = h * 0.20;
    ctx.fillStyle = 'rgba(139, 155, 180, 0.18)';
    ctx.fillRect(-w * 0.5, -h * 0.5, w, barH);

    // 3 Window Control Buttons (Red, Amber, Green)
    const btnRadius = 2.4;
    const btnY = -h * 0.5 + barH * 0.5;
    const btnStartX = -w * 0.44;

    ctx.fillStyle = '#FF5F56';
    ctx.beginPath();
    ctx.arc(btnStartX, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#FFBD2E';
    ctx.beginPath();
    ctx.arc(btnStartX + 8, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#27C93F';
    ctx.beginPath();
    ctx.arc(btnStartX + 16, btnY, btnRadius, 0, Math.PI * 2);
    ctx.fill();

    // Active Tab Pill: <dev/>
    ctx.fillStyle = '#E1E7F0';
    ctx.font = `bold ${Math.max(8, Math.floor(radius * 0.045))}px monospace`;
    ctx.fillText('App.tsx', -w * 0.18, -h * 0.5 + barH * 0.68);

    // 3. Line Numbers & Code Lines (Left Side)
    const lineStartY = -h * 0.5 + barH + 12;
    const lineSpacing = h * 0.14;
    const fontSize = Math.max(7, Math.floor(radius * 0.038));
    ctx.font = `${fontSize}px monospace`;

    // Code line syntax definitions
    const codeSyntax = [
      { num: '1', parts: [{ t: 'import ', c: '#C084FC' }, { t: '{ Web }', c: '#8B9BB4' }] },
      { num: '2', parts: [{ t: 'const ', c: '#E1E7F0' }, { t: 'app = ', c: '#FFFFFF' }, { t: 'build()', c: '#FFD43B' }] },
      { num: '3', parts: [{ t: 'return ', c: '#C084FC' }, { t: '(', c: '#FFFFFF' }] },
      { num: '4', parts: [{ t: '  ', c: '#FFFFFF' }] },
      { num: '5', parts: [{ t: ')', c: '#FFFFFF' }] }
    ];

    codeSyntax.forEach((item, idx) => {
      const y = lineStartY + idx * lineSpacing;
      // Line number
      ctx.fillStyle = 'rgba(139, 155, 180, 0.45)';
      ctx.fillText(item.num, -w * 0.44, y);

      // Code text tokens
      let currentX = -w * 0.36;
      item.parts.forEach(part => {
        ctx.fillStyle = part.c;
        ctx.fillText(part.t, currentX, y);
        currentX += ctx.measureText(part.t).width;
      });
    });

    // 4. Centerpiece Glowing < / > Symbol (Matching Reference Image)
    const tagSize = radius * 0.28;
    const tagY = h * 0.08;

    ctx.save();
    ctx.translate(0, tagY);

    // Deep Neon Green Glow behind tag
    const tagGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, tagSize * 1.5);
    tagGlow.addColorStop(0, 'rgba(139, 155, 180, 0.65)');
    tagGlow.addColorStop(0.45, 'rgba(191, 199, 213, 0.22)');
    tagGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = tagGlow;
    ctx.beginPath();
    ctx.arc(0, 0, tagSize * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Draw Left Bracket `<`
    const drawTagPath = () => {
      // Left Bracket: <
      ctx.beginPath();
      ctx.moveTo(-tagSize * 0.45, -tagSize * 0.52);
      ctx.lineTo(-tagSize * 0.95, 0);
      ctx.lineTo(-tagSize * 0.45, tagSize * 0.52);
      ctx.stroke();

      // Middle Slash: /
      ctx.beginPath();
      ctx.moveTo(tagSize * 0.16, -tagSize * 0.62);
      ctx.lineTo(-tagSize * 0.16, tagSize * 0.62);
      ctx.stroke();

      // Right Bracket: >
      ctx.beginPath();
      ctx.moveTo(tagSize * 0.45, -tagSize * 0.52);
      ctx.lineTo(tagSize * 0.95, 0);
      ctx.lineTo(tagSize * 0.45, tagSize * 0.52);
      ctx.stroke();
    };

    // Layer 1: Radiant Outer Neon-Green Bloom
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 6.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 22;
    drawTagPath();

    // Layer 2: Sharp Crisp Neon Stroke
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.2;
    ctx.shadowColor = '#8B9BB4';
    ctx.shadowBlur = 10;
    drawTagPath();

    // Layer 3: Ultra-Bright White Specular Core
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.4;
    ctx.shadowBlur = 0;
    drawTagPath();

    ctx.restore();

    // 5. Blinking Cursor |
    const isBlink = Math.floor(time * 0.003) % 2 === 0;
    if (isBlink) {
      const cursorX = w * 0.32;
      const cursorY = lineStartY + 3 * lineSpacing;
      ctx.fillStyle = '#E1E7F0';
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = 6;
      ctx.fillRect(cursorX, cursorY - 9, 2.0, 11);
    }

    ctx.restore();
  }

  /* --------------------------------------------------------
     5M. ENGINEERING AND IOT VISUAL (MATCHING REFERENCE IMAGE)
     -------------------------------------------------------- */
  drawEngineeringIotVisual(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    // Clip strictly inside the sphere
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 2, 0, Math.PI * 2);
    ctx.clip();

    // 1. Concentric Holographic Floor Pedestal Rings (inside orb)
    const floorY = cy + radius * 0.48;
    const floorW = radius * 1.35;
    const floorH = floorW * 0.28;

    // Floor green glow
    const floorGlow = ctx.createRadialGradient(cx, floorY, 5, cx, floorY, floorW * 0.6);
    floorGlow.addColorStop(0, 'rgba(139, 155, 180, 0.45)');
    floorGlow.addColorStop(0.35, 'rgba(191, 199, 213, 0.18)');
    floorGlow.addColorStop(0.8, 'rgba(139, 155, 180, 0.04)');
    floorGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = floorGlow;
    ctx.beginPath();
    ctx.ellipse(cx, floorY, floorW * 0.6, floorH * 0.85, 0, 0, Math.PI * 2);
    ctx.fill();

    // Concentric green glowing rings on floor
    [0.92, 0.68, 0.44, 0.24].forEach((rf, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, floorY, floorW * 0.5 * rf, floorH * 0.5 * rf, 0, 0, Math.PI * 2);
      ctx.strokeStyle = i === 1 ? 'rgba(139, 155, 180, 0.85)' : 'rgba(139, 155, 180, 0.35)';
      ctx.lineWidth = i === 1 ? 1.6 : 1.0;
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = i === 1 ? 8 : 3;
      ctx.stroke();
    });

    // Upward volumetric projector beam cone
    const beamGrad = ctx.createLinearGradient(cx, floorY, cx, cy - radius * 0.5);
    beamGrad.addColorStop(0, 'rgba(139, 155, 180, 0.16)');
    beamGrad.addColorStop(0.45, 'rgba(191, 199, 213, 0.06)');
    beamGrad.addColorStop(1, 'rgba(139, 155, 180, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(cx - floorW * 0.35, floorY);
    ctx.lineTo(cx - radius * 0.45, cy - radius * 0.4);
    ctx.lineTo(cx + radius * 0.45, cy - radius * 0.4);
    ctx.lineTo(cx + floorW * 0.35, floorY);
    ctx.closePath();
    ctx.fill();

    // Floating levitation delta
    const levX = Math.cos(time * 0.0012) * 3 * motionFactor;
    const levY = Math.sin(time * 0.0016) * 4 * motionFactor;

    // 2. Cyber Circuit Data Connectors between devices
    this.drawEngCyberConnectors(cx, cy, radius, time, motionFactor);

    // 3. Top-Left: Articulated Industrial Robotic Arm (Matching Reference Image)
    this.drawIndustrialRoboticArm(cx - radius * 0.38 + levX * 0.5, cy - radius * 0.14 + levY * 0.6, radius, time, motionFactor);

    // 4. Top-Right: Holographic CAD Screen with 3D Mechanical Part (Matching Reference Image)
    this.drawCadMonitorScreen(cx + radius * 0.40 - levX * 0.5, cy - radius * 0.32 - levY * 0.4, radius, time, motionFactor);

    // 5. Bottom-Left: Detailed Arduino Uno Microcontroller (Matching Reference Image)
    this.drawArduinoBoard(cx - radius * 0.40 + levX * 0.4, cy + radius * 0.30 + levY * 0.5, radius, time, motionFactor);

    // 6. Bottom-Right: Detailed ESP32 Microchip Module (Matching Reference Image)
    this.drawEsp32Module(cx + radius * 0.42 - levX * 0.4, cy + radius * 0.28 - levY * 0.5, radius, time, motionFactor);

    // 7. Bottom-Center: Holographic Cloud Network Hub (Matching Reference Image)
    this.drawHoloCloudAndIoTNode(cx + levX * 0.2, cy + radius * 0.42 + levY * 0.3, radius, time, motionFactor);

    // 8. Floating 3D Isometric Components / Cubes (Matching Reference Image)
    this.drawFloatingEngCubes(cx, cy, radius, time, motionFactor);

    // 9. Centerpiece: Radiant Glowing Cogwheel / Gear (Matching Reference Image)
    this.drawCentralHoloGear(cx + levX * 0.3, cy + radius * 0.04 + levY * 0.4, radius, time, motionFactor);

    ctx.restore();
  }

  /* --------------------------------------------------------
     5N. CYBER CONNECTORS & DATA STREAMS FOR ENGINEERING/IOT
     -------------------------------------------------------- */
  drawEngCyberConnectors(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();

    const centerGear = { x: cx, y: cy + radius * 0.04 };
    const targets = [
      { x: cx - radius * 0.34, y: cy - radius * 0.18, color: '#E1E7F0' }, // Robot arm
      { x: cx + radius * 0.35, y: cy - radius * 0.28, color: '#8B9BB4' }, // CAD screen
      { x: cx - radius * 0.36, y: cy + radius * 0.26, color: '#E1E7F0' }, // Arduino
      { x: cx + radius * 0.38, y: cy + radius * 0.24, color: '#8B9BB4' }, // ESP32
      { x: cx, y: cy + radius * 0.38, color: '#FFFFFF' }                  // Cloud
    ];

    targets.forEach((pt, idx) => {
      ctx.beginPath();
      ctx.moveTo(centerGear.x, centerGear.y);
      const cpX = (centerGear.x + pt.x) * 0.5 + Math.sin(time * 0.002 + idx * 1.5) * 6 * motionFactor;
      const cpY = (centerGear.y + pt.y) * 0.5 + Math.cos(time * 0.002 + idx * 1.5) * 6 * motionFactor;
      ctx.quadraticCurveTo(cpX, cpY, pt.x, pt.y);
      ctx.strokeStyle = `rgba(139, 155, 180, ${0.22 + 0.1 * Math.sin(time * 0.003 + idx)})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();

      // Animated traveling data pulse
      if (motionFactor > 0) {
        const st = ((time * 0.00085 + idx * 0.2) % 1.0);
        const it = 1 - st;
        const sx = it * it * centerGear.x + 2 * it * st * cpX + st * st * pt.x;
        const sy = it * it * centerGear.y + 2 * it * st * cpY + st * st * pt.y;

        ctx.beginPath();
        ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = pt.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    });

    ctx.restore();
  }

  /* --------------------------------------------------------
     5O. CENTRAL RADIANT HOLOGRAPHIC GEAR / COGWHEEL
     (Exact Centerpiece from Reference Image)
     -------------------------------------------------------- */
  drawCentralHoloGear(gx, gy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(gx, gy);

    const gearR = radius * 0.34;
    const teeth = 8;
    const rot = time * 0.00075 * motionFactor;

    // Ambient radial glow behind gear
    const gearGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, gearR * 1.6);
    gearGlow.addColorStop(0, 'rgba(139, 155, 180, 0.65)');
    gearGlow.addColorStop(0.35, 'rgba(139, 155, 180, 0.28)');
    gearGlow.addColorStop(0.7, 'rgba(191, 199, 213, 0.08)');
    gearGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gearGlow;
    ctx.beginPath();
    ctx.arc(0, 0, gearR * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Concentric guide rings outside gear
    [1.42, 1.25].forEach((rf, i) => {
      ctx.beginPath();
      ctx.arc(0, 0, gearR * rf, 0, Math.PI * 2);
      ctx.strokeStyle = i === 0 ? 'rgba(139, 155, 180, 0.25)' : 'rgba(191, 199, 213, 0.35)';
      ctx.lineWidth = 1.0;
      ctx.setLineDash(i === 0 ? [4, 8] : []);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.rotate(rot);

    // 1. Gear Body & Teeth Path
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const a = (i * Math.PI * 2) / teeth;
      const step = (Math.PI * 2) / teeth;

      const a0 = a;
      const a1 = a + step * 0.22;
      const a2 = a + step * 0.32;
      const a3 = a + step * 0.68;
      const a4 = a + step * 0.78;
      const a5 = a + step;

      const rIn = gearR * 0.72;
      const rOut = gearR * 1.06;

      if (i === 0) ctx.moveTo(Math.cos(a0) * rIn, Math.sin(a0) * rIn);
      else ctx.lineTo(Math.cos(a0) * rIn, Math.sin(a0) * rIn);

      ctx.lineTo(Math.cos(a1) * rIn, Math.sin(a1) * rIn);
      ctx.lineTo(Math.cos(a2) * rOut, Math.sin(a2) * rOut);
      ctx.lineTo(Math.cos(a3) * rOut, Math.sin(a3) * rOut);
      ctx.lineTo(Math.cos(a4) * rIn, Math.sin(a4) * rIn);
      ctx.lineTo(Math.cos(a5) * rIn, Math.sin(a5) * rIn);
    }
    ctx.closePath();

    // Gear dark metallic fill with green edge glow
    ctx.fillStyle = 'rgba(3, 22, 14, 0.92)';
    ctx.fill();

    // Radiant outer neon-green stroke
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 2.4;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 14;
    ctx.stroke();

    // Crisp inner specular edge
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 4;
    ctx.stroke();

    // 2. Inner Concentric Grooves
    ctx.beginPath();
    ctx.arc(0, 0, gearR * 0.58, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(191, 199, 213, 0.55)';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // 3. 4 Hollow Circular Cutout Windows
    const cutouts = 4;
    const cutR = gearR * 0.12;
    const cutDist = gearR * 0.42;
    for (let c = 0; c < cutouts; c++) {
      const ca = (c * Math.PI * 2) / cutouts + Math.PI / 4;
      const cxPos = Math.cos(ca) * cutDist;
      const cyPos = Math.sin(ca) * cutDist;

      ctx.beginPath();
      ctx.arc(cxPos, cyPos, cutR, 0, Math.PI * 2);
      ctx.fillStyle = '#041009';
      ctx.fill();
      ctx.strokeStyle = '#E1E7F0';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // 4. Center Axle Hub & White Radiant Core
    ctx.beginPath();
    ctx.arc(0, 0, gearR * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = '#02120A';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 10;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, gearR * 0.10, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = '#FFFFFF';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.restore();
  }

  /* --------------------------------------------------------
     5P. 3D ARTICULATED INDUSTRIAL ROBOTIC ARM (Top-Left)
     (Detailed Match to Attached Reference Image)
     -------------------------------------------------------- */
  drawIndustrialRoboticArm(ax, ay, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(ax, ay);

    // Subtle joint articulation sway
    const j1 = -0.52 + Math.sin(time * 0.0014) * 0.04 * motionFactor;
    const j2 = 1.12 + Math.cos(time * 0.0016) * 0.05 * motionFactor;

    // 1. Heavy Base Turret & Mounting Flange
    ctx.save();
    const baseW = radius * 0.22;
    const baseH = radius * 0.09;

    // Base glowing halo
    ctx.fillStyle = 'rgba(139, 155, 180, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, radius * 0.20, baseW * 0.7, baseH * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base cylinder
    const baseGrad = ctx.createLinearGradient(-baseW * 0.5, 0, baseW * 0.5, 0);
    baseGrad.addColorStop(0, '#102A1C');
    baseGrad.addColorStop(0.3, '#E1F2E9');
    baseGrad.addColorStop(0.7, '#A8CBB8');
    baseGrad.addColorStop(1, '#0C1C13');
    ctx.fillStyle = baseGrad;
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.roundRect(-baseW * 0.5, radius * 0.14, baseW, baseH, 4);
    ctx.fill();
    ctx.stroke();

    // Base joint ring
    ctx.beginPath();
    ctx.ellipse(0, radius * 0.14, baseW * 0.38, baseH * 0.45, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#02120A';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.stroke();
    ctx.restore();

    // 2. Shoulder Joint Pivot
    const shoulderX = 0;
    const shoulderY = radius * 0.12;
    ctx.beginPath();
    ctx.arc(shoulderX, shoulderY, radius * 0.05, 0, Math.PI * 2);
    ctx.fillStyle = '#061D12';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // 3. Lower Arm Link (Boom Segment)
    const arm1Len = radius * 0.28;
    const elbowX = shoulderX + Math.sin(j1) * arm1Len;
    const elbowY = shoulderY - Math.cos(j1) * arm1Len;

    ctx.save();
    // Arm 1 metallic beam
    ctx.strokeStyle = '#D8EFE3';
    ctx.lineWidth = radius * 0.052;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(elbowX, elbowY);
    ctx.stroke();

    // Inner dark accent stripe along arm 1
    ctx.strokeStyle = '#092416';
    ctx.lineWidth = radius * 0.02;
    ctx.beginPath();
    ctx.moveTo(shoulderX, shoulderY);
    ctx.lineTo(elbowX, elbowY);
    ctx.stroke();
    ctx.restore();

    // 4. Elbow Joint Pivot Cylinder
    ctx.beginPath();
    ctx.arc(elbowX, elbowY, radius * 0.044, 0, Math.PI * 2);
    ctx.fillStyle = '#04130A';
    ctx.fill();
    ctx.strokeStyle = '#8B9BB4';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#8B9BB4';
    ctx.shadowBlur = 8;
    ctx.stroke();

    // Inner green status LED
    ctx.beginPath();
    ctx.arc(elbowX, elbowY, radius * 0.018, 0, Math.PI * 2);
    ctx.fillStyle = '#E1E7F0';
    ctx.fill();

    // 5. Forearm Link (Upper Articulated Segment)
    const arm2Angle = j1 + j2;
    const arm2Len = radius * 0.24;
    const wristX = elbowX + Math.sin(arm2Angle) * arm2Len;
    const wristY = elbowY - Math.cos(arm2Angle) * arm2Len;

    ctx.save();
    ctx.strokeStyle = '#EBF6F0';
    ctx.lineWidth = radius * 0.042;
    ctx.lineCap = 'round';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.moveTo(elbowX, elbowY);
    ctx.lineTo(wristX, wristY);
    ctx.stroke();

    // Inner accent line
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(elbowX, elbowY);
    ctx.lineTo(wristX, wristY);
    ctx.stroke();
    ctx.restore();

    // 6. Wrist Rotary Servo Housing
    ctx.beginPath();
    ctx.arc(wristX, wristY, radius * 0.034, 0, Math.PI * 2);
    ctx.fillStyle = '#071F14';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // 7. Gripper / Claw Base & 2 Articulated Prongs (Poised over the gear)
    const clawAngle = arm2Angle + 0.35;
    const clawLen = radius * 0.09;
    const clawTipX = wristX + Math.sin(clawAngle) * clawLen;
    const clawTipY = wristY - Math.cos(clawAngle) * clawLen;

    // Claw mount
    ctx.beginPath();
    ctx.moveTo(wristX, wristY);
    ctx.lineTo(clawTipX, clawTipY);
    ctx.strokeStyle = '#EBF6F0';
    ctx.lineWidth = radius * 0.026;
    ctx.stroke();

    // Upper claw finger
    ctx.beginPath();
    ctx.moveTo(clawTipX, clawTipY);
    ctx.lineTo(clawTipX + radius * 0.05, clawTipY - radius * 0.025);
    ctx.lineTo(clawTipX + radius * 0.07, clawTipY + radius * 0.01);
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Lower claw finger
    ctx.beginPath();
    ctx.moveTo(clawTipX, clawTipY);
    ctx.lineTo(clawTipX + radius * 0.05, clawTipY + radius * 0.035);
    ctx.lineTo(clawTipX + radius * 0.07, clawTipY + radius * 0.02);
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glowing laser alignment spot between fingers
    ctx.beginPath();
    ctx.arc(clawTipX + radius * 0.055, clawTipY + radius * 0.005, 2.0, 0, Math.PI * 2);
    ctx.fillStyle = '#8B9BB4';
    ctx.shadowColor = '#8B9BB4';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.restore();
  }

  /* --------------------------------------------------------
     5Q. HOLOGRAPHIC CAD SCREEN WITH 3D MECHANICAL PART (Top-Right)
     (Detailed Match to Attached Reference Image)
     -------------------------------------------------------- */
  drawCadMonitorScreen(sx, sy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(sx, sy);

    const sw = radius * 0.48;
    const sh = radius * 0.34;

    // Ambient radial glow behind CAD screen
    const screenGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, sw * 0.85);
    screenGlow.addColorStop(0, 'rgba(139, 155, 180, 0.32)');
    screenGlow.addColorStop(0.5, 'rgba(191, 199, 213, 0.10)');
    screenGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = screenGlow;
    ctx.beginPath();
    ctx.arc(0, 0, sw * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // 1. Tilted Dark Glass Monitor Frame
    ctx.fillStyle = 'rgba(2, 18, 12, 0.88)';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.85)';
    ctx.lineWidth = 1.6;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.roundRect(-sw * 0.5, -sh * 0.5, sw, sh, 6);
    ctx.fill();
    ctx.stroke();

    // Inner subtle cyan border
    ctx.strokeStyle = 'rgba(191, 199, 213, 0.35)';
    ctx.lineWidth = 1.0;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.roundRect(-sw * 0.5 + 2, -sh * 0.5 + 2, sw - 4, sh - 4, 4);
    ctx.stroke();

    // 2. Top Title Bar
    const barH = sh * 0.20;
    ctx.fillStyle = 'rgba(139, 155, 180, 0.16)';
    ctx.fillRect(-sw * 0.5, -sh * 0.5, sw, barH);

    // 3 Control Dots
    [-sw * 0.44, -sw * 0.44 + 6, -sw * 0.44 + 12].forEach((bx, i) => {
      ctx.beginPath();
      ctx.arc(bx, -sh * 0.5 + barH * 0.5, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#FF5F56' : i === 1 ? '#FFBD2E' : '#27C93F';
      ctx.fill();
    });

    // Header Title: CAD // 3D_MODEL
    ctx.fillStyle = '#E1E7F0';
    ctx.font = `bold ${Math.max(7, Math.floor(radius * 0.038))}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillText('CAD // PART_04', -sw * 0.24, -sh * 0.5 + barH * 0.70);

    // 3. 3D Rotating Isometric Wireframe Mechanical Part (Motor Housing / Gearbox)
    ctx.save();
    const partY = sh * 0.12;
    ctx.translate(0, partY);

    const rotAngle = time * 0.0012 * motionFactor;
    const partR = radius * 0.11;
    const partH = radius * 0.14;

    // Flange Outer Ring (Top)
    ctx.beginPath();
    ctx.ellipse(0, -partH * 0.5, partR * 1.15, partR * 0.45, 0, 0, Math.PI * 2);
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 6;
    ctx.stroke();

    // Cylinder Body (Top & Bottom Rings)
    ctx.beginPath();
    ctx.ellipse(0, partH * 0.5, partR * 1.15, partR * 0.45, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.55)';
    ctx.stroke();

    // Inner Axle Hole
    ctx.beginPath();
    ctx.ellipse(0, -partH * 0.5, partR * 0.42, partR * 0.16, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#03120A';
    ctx.fill();
    ctx.strokeStyle = '#8B9BB4';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 6 Rotating Longitudinal Wireframe Ribs
    for (let r = 0; r < 6; r++) {
      const ribA = rotAngle + (r * Math.PI) / 3;
      const rx = Math.cos(ribA) * partR;
      const ryOffset = Math.sin(ribA) * (partR * 0.38);

      ctx.beginPath();
      ctx.moveTo(rx, -partH * 0.5 + ryOffset);
      ctx.lineTo(rx, partH * 0.5 + ryOffset);
      ctx.strokeStyle = r % 2 === 0 ? 'rgba(139, 155, 180, 0.75)' : 'rgba(191, 199, 213, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }

    // Outer Mounting Tabs on Flange
    [-1, 1].forEach(side => {
      const tabX = side * partR * 1.22;
      ctx.beginPath();
      ctx.arc(tabX, -partH * 0.5, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#E1E7F0';
      ctx.fill();
    });

    ctx.restore();

    // Bottom Status Readout
    ctx.fillStyle = 'rgba(139, 155, 180, 0.65)';
    ctx.font = `${Math.max(6, Math.floor(radius * 0.030))}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('DIM: 120mm · TOL: ±0.02', 0, sh * 0.44);

    ctx.restore();
  }

  /* --------------------------------------------------------
     5R. DETAILED ARDUINO UNO MICROCONTROLLER BOARD (Bottom-Left)
     (Detailed Match to Attached Reference Image)
     -------------------------------------------------------- */
  drawArduinoBoard(bx, by, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-0.16);

    const bw = radius * 0.42;
    const bh = radius * 0.30;

    // Ambient silver-grey glow behind board
    const boardGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, bw * 0.75);
    boardGlow.addColorStop(0, 'rgba(139, 155, 180, 0.42)');
    boardGlow.addColorStop(0.5, 'rgba(139, 155, 180, 0.12)');
    boardGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = boardGlow;
    ctx.beginPath();
    ctx.arc(0, 0, bw * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // 1. Classic Arduino Blue/Teal PCB Body
    const pcbGrad = ctx.createLinearGradient(-bw * 0.5, -bh * 0.5, bw * 0.5, bh * 0.5);
    pcbGrad.addColorStop(0, '#00818A');
    pcbGrad.addColorStop(0.5, '#006B73');
    pcbGrad.addColorStop(1, '#004A50');
    ctx.fillStyle = pcbGrad;
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.75)';
    ctx.lineWidth = 1.4;
    ctx.shadowColor = '#00979C';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(-bw * 0.5, -bh * 0.5, bw, bh, 5);
    ctx.fill();
    ctx.stroke();

    // 4 Corner Mounting Holes
    const hOffX = bw * 0.42;
    const hOffY = bh * 0.40;
    [[-hOffX, -hOffY], [hOffX, -hOffY], [-hOffX, hOffY], [hOffX, hOffY]].forEach(([hx, hy]) => {
      ctx.beginPath();
      ctx.arc(hx, hy, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = '#041009';
      ctx.fill();
      ctx.strokeStyle = '#D4AF37'; // Gold contact ring around mounting hole
      ctx.lineWidth = 0.8;
      ctx.stroke();
    });

    // 2. Silver USB Type-B Connector (Left Top)
    ctx.save();
    const usbW = bw * 0.18;
    const usbH = bh * 0.28;
    const usbX = -bw * 0.5 - usbW * 0.25;
    const usbY = -bh * 0.32;
    const usbGrad = ctx.createLinearGradient(usbX, usbY, usbX + usbW, usbY + usbH);
    usbGrad.addColorStop(0, '#FFFFFF');
    usbGrad.addColorStop(0.5, '#C8D6D1');
    usbGrad.addColorStop(1, '#6B7A75');
    ctx.fillStyle = usbGrad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 1.0;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.roundRect(usbX, usbY, usbW, usbH, 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 3. Black DC Power Barrel Jack (Left Bottom)
    ctx.save();
    const dcW = bw * 0.20;
    const dcH = bh * 0.26;
    const dcX = -bw * 0.5 - dcW * 0.25;
    const dcY = bh * 0.08;
    ctx.fillStyle = '#1A1D1B';
    ctx.strokeStyle = '#444C48';
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.roundRect(dcX, dcY, dcW, dcH, 2);
    ctx.fill();
    ctx.stroke();
    // Jack socket hole
    ctx.beginPath();
    ctx.arc(dcX + dcW * 0.6, dcY + dcH * 0.5, 2.2, 0, Math.PI * 2);
    ctx.fillStyle = '#050706';
    ctx.fill();
    ctx.restore();

    // 4. ATmega328P DIP IC Chip (Center of Board)
    ctx.save();
    const icW = bw * 0.44;
    const icH = bh * 0.22;
    const icX = -bw * 0.08;
    const icY = -bh * 0.04;

    // IC Body
    ctx.fillStyle = '#151816';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.roundRect(icX, icY, icW, icH, 2);
    ctx.fill();
    ctx.stroke();

    // Silver pin legs along top and bottom of IC
    const pins = 8;
    for (let p = 0; p < pins; p++) {
      const px = icX + 3 + (p * (icW - 6)) / (pins - 1);
      ctx.fillStyle = '#D6E2DE';
      // Top pin leg
      ctx.fillRect(px - 1, icY - 2.5, 2, 2.5);
      // Bottom pin leg
      ctx.fillRect(px - 1, icY + icH, 2, 2.5);
    }
    ctx.restore();

    // 5. Female Header Pin Strips (Top & Bottom Edges)
    // Top digital pins header
    ctx.fillStyle = '#0D110F';
    ctx.fillRect(-bw * 0.34, -bh * 0.48, bw * 0.70, bh * 0.12);
    // Tiny gold pin socket holes
    for (let h = 0; h < 10; h++) {
      const hx = -bw * 0.31 + (h * (bw * 0.64)) / 9;
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(hx, -bh * 0.44, 1.6, 1.6);
    }

    // Bottom power & analog pins header
    ctx.fillStyle = '#0D110F';
    ctx.fillRect(-bw * 0.34, bh * 0.36, bw * 0.70, bh * 0.12);
    for (let h = 0; h < 10; h++) {
      const hx = -bw * 0.31 + (h * (bw * 0.64)) / 9;
      ctx.fillStyle = '#D4AF37';
      ctx.fillRect(hx, bh * 0.40, 1.6, 1.6);
    }

    // 6. White Silkscreen: ARDUINO Text & Infinity Loop (∞)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = `bold ${Math.max(6, Math.floor(radius * 0.035))}px var(--font-heading, sans-serif)`;
    ctx.textAlign = 'left';
    ctx.fillText('ARDUINO', -bw * 0.12, -bh * 0.24);

    // Mini infinity logo (∞)
    ctx.beginPath();
    ctx.arc(-bw * 0.22, -bh * 0.27, 2.2, 0, Math.PI * 2);
    ctx.arc(-bw * 0.17, -bh * 0.27, 2.2, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 0.9;
    ctx.stroke();

    // 7. Glowing LEDs: ON (Green) & Flickering TX/RX (Amber)
    const onFlicker = 0.85 + Math.sin(time * 0.005) * 0.15;
    ctx.beginPath();
    ctx.arc(bw * 0.28, -bh * 0.16, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#E1E7F0';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8 * onFlicker;
    ctx.fill();

    const txBlink = Math.floor(time * 0.008) % 3 === 0;
    if (txBlink) {
      ctx.beginPath();
      ctx.arc(bw * 0.28, -bh * 0.06, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = '#FFBD2E';
      ctx.shadowColor = '#FFBD2E';
      ctx.shadowBlur = 6;
      ctx.fill();
    }

    ctx.restore();
  }

  /* --------------------------------------------------------
     5S. DETAILED ESP32 MICROCONTROLLER MODULE (Bottom-Right)
     (Detailed Match to Attached Reference Image)
     -------------------------------------------------------- */
  drawEsp32Module(ex, ey, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(0.14);

    const ew = radius * 0.32;
    const eh = radius * 0.44;

    // Ambient green-cyan glow behind ESP32
    const espGlow = ctx.createRadialGradient(0, 0, 5, 0, 0, ew * 0.85);
    espGlow.addColorStop(0, 'rgba(139, 155, 180, 0.38)');
    espGlow.addColorStop(0.5, 'rgba(191, 199, 213, 0.12)');
    espGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = espGlow;
    ctx.beginPath();
    ctx.arc(0, 0, ew * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // 1. Sleek Black PCB Body
    ctx.fillStyle = '#0B110E';
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.85)';
    ctx.lineWidth = 1.3;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.roundRect(-ew * 0.5, -eh * 0.5, ew, eh, 4);
    ctx.fill();
    ctx.stroke();

    // 2. Gold Castellated Pin Solder Pads along Left and Right Edges
    const padCount = 9;
    for (let p = 0; p < padCount; p++) {
      const py = -eh * 0.32 + (p * (eh * 0.74)) / (padCount - 1);
      ctx.fillStyle = '#D4AF37';
      // Left pad
      ctx.fillRect(-ew * 0.5, py - 1.2, 3.2, 2.4);
      // Right pad
      ctx.fillRect(ew * 0.5 - 3.2, py - 1.2, 3.2, 2.4);
    }

    // 3. Top Copper PCB Serpentine Antenna Section
    ctx.save();
    const antY = -eh * 0.48;
    ctx.fillStyle = '#18241D';
    ctx.fillRect(-ew * 0.40, antY, ew * 0.80, eh * 0.16);

    // Zigzag antenna copper track
    ctx.beginPath();
    ctx.moveTo(-ew * 0.34, antY + eh * 0.12);
    ctx.lineTo(-ew * 0.34, antY + eh * 0.04);
    ctx.lineTo(-ew * 0.18, antY + eh * 0.04);
    ctx.lineTo(-ew * 0.18, antY + eh * 0.12);
    ctx.lineTo(-ew * 0.02, antY + eh * 0.12);
    ctx.lineTo(-ew * 0.02, antY + eh * 0.04);
    ctx.lineTo(ew * 0.16, antY + eh * 0.04);
    ctx.lineTo(ew * 0.16, antY + eh * 0.12);
    ctx.lineTo(ew * 0.32, antY + eh * 0.12);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.4;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // 4. Silver Metallic RF Shield Box
    ctx.save();
    const shW = ew * 0.78;
    const shH = eh * 0.44;
    const shX = -shW * 0.5;
    const shY = -eh * 0.28;

    const shGrad = ctx.createLinearGradient(shX, shY, shX + shW, shY + shH);
    shGrad.addColorStop(0, '#FFFFFF');
    shGrad.addColorStop(0.3, '#E1ECE7');
    shGrad.addColorStop(0.7, '#A5BCB3');
    shGrad.addColorStop(1, '#667D74');
    ctx.fillStyle = shGrad;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.roundRect(shX, shY, shW, shH, 3);
    ctx.fill();
    ctx.stroke();

    // Stamped Text on RF Shield: "ESP32"
    ctx.fillStyle = '#1B3126';
    ctx.font = `900 ${Math.max(7, Math.floor(radius * 0.042))}px var(--font-heading, sans-serif)`;
    ctx.textAlign = 'center';
    ctx.fillText('ESP32', 0, shY + shH * 0.45);

    ctx.fillStyle = '#3E5C4E';
    ctx.font = `${Math.max(5, Math.floor(radius * 0.024))}px monospace`;
    ctx.fillText('WROOM-32', 0, shY + shH * 0.72);
    ctx.restore();

    // 5. Radiating WiFi Waves pulsing from the antenna upwards!
    if (motionFactor > 0) {
      const wifiPulse = (time * 0.0018) % 1.0;
      for (let w = 0; w < 3; w++) {
        const wr = radius * 0.08 + w * (radius * 0.05) + wifiPulse * (radius * 0.04);
        const wAlpha = Math.max(0, 1 - (w * 0.3 + wifiPulse * 0.5));
        ctx.beginPath();
        ctx.arc(0, -eh * 0.5, wr, -0.85 * Math.PI, -0.15 * Math.PI);
        ctx.strokeStyle = `rgba(139, 155, 180, ${wAlpha})`;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = '#E1E7F0';
        ctx.shadowBlur = 8;
        ctx.stroke();
      }
    }

    // 6. Bottom LEDs
    ctx.beginPath();
    ctx.arc(-ew * 0.25, eh * 0.36, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5F56';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ew * 0.25, eh * 0.36, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#E1E7F0';
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 8;
    ctx.fill();

    ctx.restore();
  }

  /* --------------------------------------------------------
     5T. HOLOGRAPHIC CLOUD NETWORK NODE (Bottom-Center)
     (Detailed Match to Attached Reference Image)
     -------------------------------------------------------- */
  drawHoloCloudAndIoTNode(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);

    const cw = radius * 0.16;

    // Cloud soft glow
    const cloudGlow = ctx.createRadialGradient(0, 0, 2, 0, 0, cw * 1.4);
    cloudGlow.addColorStop(0, 'rgba(139, 155, 180, 0.55)');
    cloudGlow.addColorStop(0.5, 'rgba(191, 199, 213, 0.18)');
    cloudGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cloudGlow;
    ctx.beginPath();
    ctx.arc(0, 0, cw * 1.4, 0, Math.PI * 2);
    ctx.fill();

    // Cloud vector outline
    ctx.beginPath();
    ctx.arc(-cw * 0.45, 0, cw * 0.36, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(-cw * 0.12, -cw * 0.42, cw * 0.48, Math.PI * 1.0, Math.PI * 1.95);
    ctx.arc(cw * 0.40, -cw * 0.12, cw * 0.38, Math.PI * 1.5, Math.PI * 0.35);
    ctx.arc(cw * 0.16, cw * 0.28, cw * 0.24, 0, Math.PI * 0.5);
    ctx.closePath();

    ctx.fillStyle = 'rgba(139, 155, 180, 0.20)';
    ctx.fill();
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // Connected IoT network dots below cloud
    [-cw * 0.35, 0, cw * 0.35].forEach((nx, i) => {
      ctx.beginPath();
      ctx.arc(nx, cw * 0.55, 2.0, 0, Math.PI * 2);
      ctx.fillStyle = i === 1 ? '#E1E7F0' : '#8B9BB4';
      ctx.shadowColor = '#E1E7F0';
      ctx.shadowBlur = 6;
      ctx.fill();

      // Connector line up to cloud
      ctx.beginPath();
      ctx.moveTo(nx, cw * 0.55);
      ctx.lineTo(nx * 0.7, cw * 0.22);
      ctx.strokeStyle = 'rgba(139, 155, 180, 0.45)';
      ctx.lineWidth = 1.0;
      ctx.stroke();
    });

    ctx.restore();
  }

  /* --------------------------------------------------------
     5U. FLOATING 3D ISOMETRIC ENGINEERING CUBES
     (Exact Match to Floating Cubes in Reference Image)
     -------------------------------------------------------- */
  drawFloatingEngCubes(cx, cy, radius, time, motionFactor) {
    const ctx = this.ctx;

    // 3 Floating isometric component cubes
    const cubes = [
      { x: cx - radius * 0.22, y: cy - radius * 0.08, s: radius * 0.045, rot: 0.12, color: '#E1E7F0' },
      { x: cx + radius * 0.24, y: cy - radius * 0.16, s: radius * 0.040, rot: -0.25, color: '#8B9BB4' },
      { x: cx - radius * 0.26, y: cy + radius * 0.16, s: radius * 0.038, rot: 0.35, color: '#FFFFFF' }
    ];

    cubes.forEach((cube, idx) => {
      ctx.save();
      const lev = Math.sin(time * 0.002 + idx * 2.0) * 3 * motionFactor;
      ctx.translate(cube.x, cube.y + lev);
      ctx.rotate(cube.rot + time * 0.0006 * motionFactor);

      const s = cube.s;
      const topV = { x: 0, y: -s };
      const rightV = { x: s * 0.866, y: -s * 0.5 };
      const leftV = { x: -s * 0.866, y: -s * 0.5 };
      const centerV = { x: 0, y: 0 };
      const botLeftV = { x: -s * 0.866, y: s * 0.5 };
      const botRightV = { x: s * 0.866, y: s * 0.5 };
      const botV = { x: 0, y: s };

      // Top face (brightest)
      ctx.beginPath();
      ctx.moveTo(topV.x, topV.y);
      ctx.lineTo(rightV.x, rightV.y);
      ctx.lineTo(centerV.x, centerV.y);
      ctx.lineTo(leftV.x, leftV.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(139, 155, 180, 0.35)';
      ctx.fill();
      ctx.strokeStyle = cube.color;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = cube.color;
      ctx.shadowBlur = 6;
      ctx.stroke();

      // Left face
      ctx.beginPath();
      ctx.moveTo(leftV.x, leftV.y);
      ctx.lineTo(centerV.x, centerV.y);
      ctx.lineTo(botV.x, botV.y);
      ctx.lineTo(botLeftV.x, botLeftV.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(191, 199, 213, 0.22)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(191, 199, 213, 0.75)';
      ctx.stroke();

      // Right face
      ctx.beginPath();
      ctx.moveTo(rightV.x, rightV.y);
      ctx.lineTo(botRightV.x, botRightV.y);
      ctx.lineTo(botV.x, botV.y);
      ctx.lineTo(centerV.x, centerV.y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(139, 155, 180, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(139, 155, 180, 0.65)';
      ctx.stroke();

      ctx.restore();
    });
  }

  /* --------------------------------------------------------
     6. REALISTIC 3D GLASS SHELL & RESTRAINED FRESNEL RIM
     -------------------------------------------------------- */
  drawRealisticGlassShell(cx, cy, radius, time) {
    const ctx = this.ctx;
    ctx.save();

    // A. Crisp Restrained Fresnel Halo Rim (Requirement 2: restrained lighting)
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.68)';
    ctx.lineWidth = 2.0;
    ctx.shadowColor = '#E1E7F0';
    ctx.shadowBlur = 10;
    ctx.stroke();

    // B. Inner Glass Refraction Shadow
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 1, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // C. Realistic Curved Specular Visor Reflection (Top-Left)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 3, 0, Math.PI * 2);
    ctx.clip();

    const glareGrad = ctx.createLinearGradient(
      cx - radius * 0.7, cy - radius * 0.75,
      cx + radius * 0.15, cy + radius * 0.15
    );
    glareGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    glareGrad.addColorStop(0.25, 'rgba(139, 155, 180, 0.18)');
    glareGrad.addColorStop(0.65, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = glareGrad;
    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.35, cy - radius * 0.44, radius * 0.62, radius * 0.22, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    // Secondary Upper Glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.beginPath();
    ctx.ellipse(cx - radius * 0.2, cy - radius * 0.68, radius * 0.35, radius * 0.08, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // D. Subtle Bottom-Right Ground Reflection Bounce
    const bottomBounce = ctx.createRadialGradient(
      cx + radius * 0.5, cy + radius * 0.55, 5,
      cx + radius * 0.5, cy + radius * 0.55, radius * 0.7
    );
    bottomBounce.addColorStop(0, 'rgba(191, 199, 213, 0.25)');
    bottomBounce.addColorStop(0.5, 'rgba(139, 155, 180, 0.08)');
    bottomBounce.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = bottomBounce;
    ctx.beginPath();
    ctx.ellipse(cx + radius * 0.38, cy + radius * 0.42, radius * 0.45, radius * 0.26, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  destroy() {
    this.stop();
  }
}

/**
 * Initialize Analytics 3D Orb Engine
 */
export function initAnalyticsOrb(canvasId = 'analyticsOrbCanvas', containerId = 'analyticsOrbContainer') {
  return new AnalyticsOrbEngine(canvasId, containerId);
}
