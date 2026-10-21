/**
 * ========================================================
 * HIGH-DEFINITION INTERACTIVE PARTICLE TYPOGRAPHY ENGINE
 * ========================================================
 * Award-Winning Particle Typography Engine:
 * - Supports Hero ("Harivansh Vats") and all 4 Skill Categories:
 *   1. "Data Analytics"
 *   2. "AI & Automation"
 *   3. "Development and Tools"
 *   4. "Engineering and IoT"
 * - Dense, razor-sharp pinpoint particles (thousands of micro-nodes per heading)
 * - Exact letterform rasterization using Google Font 'Outfit' 800-weight
 * - Crisp contrast: Star White (#FFFFFF) & Mint (#A5FFD6) for white text,
 *   vibrant Silver White (#E1E7F0) & Cool Grey (#8B9BB4) for highlighted text
 * - Cinematic disperse-to-assemble magnetic coalescence on initial scroll entrance
 * - Micro-oscillation organic floating that keeps letter silhouettes 100% sharp
 * - Diamond starlight shimmer / micro-twinkle per particle
 * - Real-time fluid mouse & touch repulsion with elastic spring recovery (zero jitter)
 * - Tactile cyber shockwave rings expanding outwards on click/tap
 * - Ambient auroral cursor glow
 * - Viewport intersection observer: sleeps offscreen to save battery and 0% CPU
 * - ResizeObserver: immediate responsive re-sampling across desktop, tablet, and mobile
 * - Accessible: Preserves semantic <h1> / <h2> for SEO & screen readers
 * ========================================================
 */

export class ParticleTypography {
  constructor(containerId = 'heroTitleContainer', canvasId = 'particleTitleCanvas', options = {}) {
    this.container = document.getElementById(containerId);
    this.canvas = document.getElementById(canvasId);

    if (!this.container || !this.canvas) {
      console.warn(`ParticleTypography: Container or canvas not found for ${containerId}`);
      return;
    }

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.shockwaves = [];
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Heading type detection
    if (options.type) {
      this.type = options.type;
    } else if (containerId.includes('skills')) {
      this.type = 'analytics';
    } else if (containerId.includes('ai')) {
      this.type = 'ai';
    } else if (containerId.includes('dev')) {
      this.type = 'dev';
    } else if (containerId.includes('eng')) {
      this.type = 'eng';
    } else {
      this.type = 'hero';
    }

    this.customLines = options.lines || null;
    this.customPaddingX = options.paddingX;
    this.customPaddingY = options.paddingY;

    this.mouse = {
      x: -9999,
      y: -9999,
      radius: options.mouseRadius || 80,
      isHovered: false
    };

    this.isRunning = false;
    this.isVisible = true;
    this.hasPlayedEntrance = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.animationFrameId = null;
    this.resizeObserver = null;

    // Load font before initial sampling
    this.ensureFontAndInit();
  }

  async ensureFontAndInit() {
    try {
      if (document.fonts && document.fonts.load) {
        await document.fonts.load('800 64px Outfit');
        await document.fonts.ready;
      }
    } catch (e) {
      console.warn('ParticleTypography: font ready wait skipped', e);
    }

    this.init();

    // Re-sample when all webfonts finish downloading to guarantee true Outfit 800 glyphs
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        this.setupDimensions();
        this.rasterizeAndSample();
        this.start();
      });
    }
  }

  init() {
    this.setupDimensions();
    this.rasterizeAndSample();
    this.bindEvents();

    this.container.classList.add('particle-engine-active');

    // Trigger entrance animation if initially visible
    if (this.isVisible) {
      this.hasPlayedEntrance = true;
      this.triggerEntranceAnimation();
    }

    this.start();
  }

  /* --------------------------------------------------------
     1. DIMENSIONS & RESPONSIVE SCALING
     -------------------------------------------------------- */
  setupDimensions() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const containerRect = this.container.getBoundingClientRect();
    this.width = Math.max(260, Math.floor(containerRect.width || 520));

    // Padding for particle float and scatter bounds
    if (this.type === 'hero') {
      this.paddingX = this.customPaddingX !== undefined ? this.customPaddingX : 12;
      this.paddingY = this.customPaddingY !== undefined ? this.customPaddingY : 16;
    } else {
      this.paddingX = this.customPaddingX !== undefined ? this.customPaddingX : 4;
      this.paddingY = this.customPaddingY !== undefined ? this.customPaddingY : 8;
    }

    if (this.type === 'hero') {
      this.isSingleLine = this.width >= 540;
      if (this.isSingleLine) {
        this.fontSize = Math.min(72, Math.max(50, Math.floor(this.width * 0.106)));
        this.height = Math.floor(this.fontSize * 1.35) + this.paddingY * 2;
      } else {
        this.fontSize = Math.min(54, Math.max(40, Math.floor(this.width * 0.125)));
        this.height = Math.floor(this.fontSize * 2.30) + this.paddingY * 2;
      }
    } else if (this.type === 'dev' || this.type === 'eng') {
      // 2-line layout
      this.isSingleLine = false;
      this.fontSize = Math.min(48, Math.max(34, Math.floor(this.width * 0.086)));
      this.height = Math.floor(this.fontSize * 2.34) + this.paddingY * 2;
    } else {
      // analytics or ai: single-line on desktop, 2-line on narrow mobile (< 440px)
      this.isSingleLine = this.width >= 440;
      if (this.isSingleLine) {
        this.fontSize = Math.min(52, Math.max(36, Math.floor(this.width * 0.088)));
        this.height = Math.floor(this.fontSize * 1.35) + this.paddingY * 2;
      } else {
        this.fontSize = Math.min(44, Math.max(32, Math.floor(this.width * 0.108)));
        this.height = Math.floor(this.fontSize * 2.34) + this.paddingY * 2;
      }
    }

    // Set container height so layout doesn't jump
    this.container.style.height = `${this.height}px`;

    // High-DPI Canvas Buffer
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  /* --------------------------------------------------------
     2. GET TEXT LINES & TOKENS
     -------------------------------------------------------- */
  getLines() {
    if (this.customLines) {
      return typeof this.customLines === 'function' ? this.customLines(this.isSingleLine, this.width) : this.customLines;
    }

    if (this.type === 'hero') {
      if (this.isSingleLine) {
        return [
          [
            { text: 'Harivansh ', color: 'white' },
            { text: 'Vats', color: 'green' }
          ]
        ];
      } else {
        return [
          [{ text: 'Harivansh', color: 'white' }],
          [{ text: 'Vats', color: 'green' }]
        ];
      }
    }

    if (this.type === 'analytics') {
      if (this.isSingleLine) {
        return [
          [
            { text: 'Data ', color: 'white' },
            { text: 'Analytics', color: 'green' }
          ]
        ];
      } else {
        return [
          [{ text: 'Data', color: 'white' }],
          [{ text: 'Analytics', color: 'green' }]
        ];
      }
    }

    if (this.type === 'ai') {
      if (this.isSingleLine) {
        return [
          [
            { text: 'AI & ', color: 'white' },
            { text: 'Automation', color: 'green' }
          ]
        ];
      } else {
        return [
          [{ text: 'AI &', color: 'white' }],
          [{ text: 'Automation', color: 'green' }]
        ];
      }
    }

    if (this.type === 'dev') {
      return [
        [{ text: 'Development', color: 'green' }],
        [{ text: 'and Tools', color: 'white' }]
      ];
    }

    if (this.type === 'eng') {
      return [
        [{ text: 'Engineering', color: 'white' }],
        [{ text: 'and IoT', color: 'green' }]
      ];
    }

    return [[{ text: 'Harivansh ', color: 'white' }, { text: 'Vats', color: 'green' }]];
  }

  /* --------------------------------------------------------
     3. EXACT RASTERIZATION & HIGH-DENSITY PINPOINT SAMPLING
     -------------------------------------------------------- */
  rasterizeAndSample() {
    const offscreen = document.createElement('canvas');
    offscreen.width = Math.floor(this.width * this.dpr);
    offscreen.height = Math.floor(this.height * this.dpr);
    const octx = offscreen.getContext('2d');
    octx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    octx.fillStyle = '#000000';
    octx.fillRect(0, 0, this.width, this.height);

    // Font matching portfolio Outfit 800
    octx.font = `800 ${this.fontSize}px 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif`;
    octx.textBaseline = 'middle';
    octx.letterSpacing = '-0.025em';

    const lines = this.getLines();
    const lineCount = lines.length;

    lines.forEach((lineChunks, lineIndex) => {
      let lineY;
      if (lineCount === 1) {
        lineY = this.paddingY + this.fontSize * 0.68;
      } else {
        lineY = this.paddingY + this.fontSize * (0.62 + lineIndex * 1.14);
      }

      let currentX = this.paddingX;
      lineChunks.forEach(chunk => {
        if (chunk.color === 'green') {
          octx.fillStyle = 'rgb(0, 255, 0)';
        } else {
          octx.fillStyle = 'rgb(255, 255, 255)';
        }
        octx.fillText(chunk.text, currentX, lineY);
        currentX += octx.measureText(chunk.text).width;
      });
    });

    // Read pixel data
    const imgData = octx.getImageData(0, 0, offscreen.width, offscreen.height);
    const data = imgData.data;

    // High Density Sampling:
    // Gap = 2 to 3 buffer pixels gives thousands of razor-sharp pinpoint particles
    const gap = this.dpr > 1.5 ? 3 : 2;
    const newParticles = [];

    for (let py = 0; py < offscreen.height; py += gap) {
      for (let px = 0; px < offscreen.width; px += gap) {
        const idx = (py * offscreen.width + px) * 4;
        const r = data[idx];
        const g = data[idx + 1];

        // Is pixel inside a letter glyph?
        if (r > 70 || g > 70) {
          const homeX = px / this.dpr;
          const homeY = py / this.dpr;

          const isNeon = g > 160 && r < 100;
          const rand = Math.random();

          let color;
          let glowColor;
          let radius;

          if (isNeon) {
            // Highlighted silver-white & cool grey metallic tones
            if (rand < 0.65) {
              color = '#FFFFFF';
              glowColor = 'rgba(255, 255, 255, 0.85)';
              radius = 1.25 + Math.random() * 0.45;
            } else if (rand < 0.85) {
              color = '#E1E7F0';
              glowColor = 'rgba(225, 231, 240, 0.90)';
              radius = 1.35 + Math.random() * 0.40;
            } else {
              color = '#BFC7D5';
              glowColor = 'rgba(191, 199, 213, 0.75)';
              radius = 1.15 + Math.random() * 0.40;
            }
          } else {
            // Base text: Cool grey & silver
            if (rand < 0.70) {
              color = '#FFFFFF';
              glowColor = 'rgba(255, 255, 255, 0.80)';
              radius = 1.20 + Math.random() * 0.45;
            } else if (rand < 0.86) {
              color = '#E1E7F0';
              glowColor = 'rgba(225, 231, 240, 0.75)';
              radius = 1.15 + Math.random() * 0.40;
            } else if (rand < 0.94) {
              color = '#BFC7D5';
              glowColor = 'rgba(191, 199, 213, 0.75)';
              radius = 1.25 + Math.random() * 0.40;
            } else {
              color = '#8B9BB4';
              glowColor = 'rgba(139, 155, 180, 0.85)';
              radius = 1.30 + Math.random() * 0.40;
            }
          }

          newParticles.push({
            x: homeX,
            y: homeY,
            homeX,
            homeY,
            vx: 0,
            vy: 0,
            radius,
            color,
            glowColor,
            isNeon,
            // Micro-harmonic float (imperceptible to letter shape, but alive)
            phaseX: Math.random() * Math.PI * 2,
            phaseY: Math.random() * Math.PI * 2,
            freqX: 0.0018 + Math.random() * 0.0012,
            freqY: 0.0015 + Math.random() * 0.0012,
            ampX: 0.35 + Math.random() * 0.45,
            ampY: 0.35 + Math.random() * 0.45,
            // Starlight twinkle shimmer
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.0022 + Math.random() * 0.0035
          });
        }
      }
    }

    this.particles = newParticles;
  }

  /* --------------------------------------------------------
     4. CINEMATIC DISPERSE-TO-ASSEMBLE ENTRANCE
     -------------------------------------------------------- */
  triggerEntranceAnimation() {
    if (this.isReducedMotion || !this.particles.length) return;

    const count = this.particles.length;
    for (let i = 0; i < count; i++) {
      const p = this.particles[i];
      // Cosmic scatter: particles start in an organic cloud around their position
      const angle = Math.random() * Math.PI * 2;
      const distance = 35 + Math.random() * 55;
      p.x = p.homeX + Math.cos(angle) * distance;
      p.y = p.homeY + Math.sin(angle) * distance;
      p.vx = (Math.random() - 0.5) * 3.5;
      p.vy = (Math.random() - 0.5) * 3.5;
    }

    this.start();
  }

  /* --------------------------------------------------------
     5. INTERACTIVE EVENTS (Mouse, Touch, Shockwave, Resize)
     -------------------------------------------------------- */
  bindEvents() {
    const updateMouse = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = clientX - rect.left;
      this.mouse.y = clientY - rect.top;
      this.mouse.isHovered = true;
      this.start();
    };

    this.canvas.addEventListener('mousemove', (e) => {
      updateMouse(e.clientX, e.clientY);
    }, { passive: true });

    this.canvas.addEventListener('mouseenter', (e) => {
      updateMouse(e.clientX, e.clientY);
    }, { passive: true });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.isHovered = false;
    });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
        triggerShockwave(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        updateMouse(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
      this.mouse.isHovered = false;
    });

    // Click / Tap Cosmic Shockwave Burst
    const triggerShockwave = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;

      this.shockwaves.push({
        x: sx,
        y: sy,
        radius: 2,
        maxRadius: Math.max(150, this.width * 0.45),
        speed: 9.5,
        force: 14,
        life: 1.0
      });

      this.start();
    };

    this.canvas.addEventListener('click', (e) => {
      triggerShockwave(e.clientX, e.clientY);
    });

    // ResizeObserver for instant container responsiveness
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const newWidth = Math.floor(entry.contentRect.width);
          if (newWidth > 120 && Math.abs(newWidth - this.width) > 6) {
            this.setupDimensions();
            this.rasterizeAndSample();
            this.start();
          }
        }
      });
      this.resizeObserver.observe(this.container);
    }

    // Debounced Window Resize Fallback
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        this.setupDimensions();
        this.rasterizeAndSample();
        this.start();
      }, 160);
    });

    // Reduced Motion Accessibility
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.start();
    });

    // Battery & Performance Optimization (sleeps when offscreen, 0% CPU)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
        if (this.isVisible) {
          if (!this.hasPlayedEntrance) {
            this.hasPlayedEntrance = true;
            this.triggerEntranceAnimation();
          }
          this.start();
        } else {
          this.stop();
        }
      });
    }, { threshold: 0.1, rootMargin: '40px 0px 40px 0px' });

    observer.observe(this.container);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.stop();
      else if (this.isVisible) this.start();
    });
  }

  /* --------------------------------------------------------
     6. SIMULATION & RENDERING LOOP
     -------------------------------------------------------- */
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

  tick(time) {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Process & Draw Shockwaves
    for (let s = this.shockwaves.length - 1; s >= 0; s--) {
      const wave = this.shockwaves[s];
      wave.radius += wave.speed;
      wave.life = 1 - wave.radius / wave.maxRadius;
      if (wave.life <= 0) {
        this.shockwaves.splice(s, 1);
        continue;
      }

      // Render sleek expanding cyber shockwave rings
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(139, 155, 180, ${Math.max(0, wave.life * 0.75)})`;
      this.ctx.lineWidth = Math.max(1, wave.life * 2.5);
      this.ctx.shadowColor = '#E1E7F0';
      this.ctx.shadowBlur = 10;
      this.ctx.stroke();

      // Secondary concentric silver wave
      if (wave.radius > 12) {
        this.ctx.beginPath();
        this.ctx.arc(wave.x, wave.y, Math.max(0, wave.radius - 8), 0, Math.PI * 2);
        this.ctx.strokeStyle = `rgba(191, 199, 213, ${Math.max(0, wave.life * 0.40)})`;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    const mouseActive = this.mouse.isHovered && this.mouse.x > -100;
    const mouseRadius = this.mouse.radius;
    const springStiffness = this.isReducedMotion ? 0.16 : 0.088;
    const damping = this.isReducedMotion ? 0.70 : 0.835;

    let hasActiveMotion = this.shockwaves.length > 0 || mouseActive;

    // 2. Subtle Auroral Cursor Glow
    if (mouseActive) {
      const mouseGlow = this.ctx.createRadialGradient(
        this.mouse.x, this.mouse.y, 0,
        this.mouse.x, this.mouse.y, mouseRadius * 1.15
      );
      mouseGlow.addColorStop(0, 'rgba(139, 155, 180, 0.1)');
      mouseGlow.addColorStop(0.5, 'rgba(191, 199, 213, 0.04)');
      mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = mouseGlow;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // 3. Update & Draw Particles with Pinpoint Crispness
    const count = this.particles.length;

    // Set tight glow for radiant neon vibrancy without blurring strokes
    this.ctx.shadowBlur = 4;

    for (let i = 0; i < count; i++) {
      const p = this.particles[i];

      // Micro-harmonic organic breathing
      const floatX = this.isReducedMotion ? 0 : Math.sin(time * p.freqX + p.phaseX) * p.ampX;
      const floatY = this.isReducedMotion ? 0 : Math.cos(time * p.freqY + p.phaseY) * p.ampY;

      const targetX = p.homeX + floatX;
      const targetY = p.homeY + floatY;

      // Mouse Proximity Repulsion
      if (mouseActive && !this.isReducedMotion) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseRadius && dist > 0) {
          const force = Math.pow(1 - dist / mouseRadius, 1.6) * 5.5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      // Shockwave Dispersion
      if (this.shockwaves.length > 0 && !this.isReducedMotion) {
        for (let s = 0; s < this.shockwaves.length; s++) {
          const wave = this.shockwaves[s];
          const wx = p.x - wave.x;
          const wy = p.y - wave.y;
          const wdist = Math.hypot(wx, wy);
          const ringDist = Math.abs(wdist - wave.radius);

          if (ringDist < 25 && wdist > 0) {
            const push = (1 - ringDist / 25) * wave.force * wave.life;
            p.vx += (wx / wdist) * push;
            p.vy += (wy / wdist) * push;
          }
        }
      }

      // Elastic Spring Physics
      const fx = (targetX - p.x) * springStiffness;
      const fy = (targetY - p.y) * springStiffness;

      p.vx = (p.vx + fx) * damping;
      p.vy = (p.vy + fy) * damping;

      p.x += p.vx;
      p.y += p.vy;

      if (Math.abs(p.vx) > 0.02 || Math.abs(p.vy) > 0.02) {
        hasActiveMotion = true;
      }

      // Starlight Micro-Twinkle Shimmer
      const twinkle = 0.80 + 0.20 * Math.sin(time * p.twinkleSpeed + p.twinklePhase);
      this.ctx.globalAlpha = twinkle;

      // Render Razor-Sharp Pinpoint Particle
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.glowColor;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Reset shadow blur & global alpha
    this.ctx.shadowBlur = 0;
    this.ctx.globalAlpha = 1.0;

    // Continue loop if moving or floating; sleep if reduced motion & settled
    if (hasActiveMotion || !this.isReducedMotion) {
      this.animationFrameId = requestAnimationFrame((t) => this.tick(t));
    } else {
      this.stop();
    }
  }

  destroy() {
    this.stop();
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

/**
 * Initialize single particle typography engine
 */
export function initParticleTypography(
  containerId = 'heroTitleContainer',
  canvasId = 'particleTitleCanvas',
  options = {}
) {
  return new ParticleTypography(containerId, canvasId, options);
}

/**
 * Initialize all particle typography engines across hero and all 4 skill categories
 */
export function initAllParticleTypography() {
  const instances = [];

  const configs = [
    { containerId: 'heroTitleContainer', canvasId: 'particleTitleCanvas', type: 'hero' },
    { containerId: 'skillsHeadingContainer', canvasId: 'skillsParticleCanvas', type: 'analytics' },
    { containerId: 'aiHeadingContainer', canvasId: 'aiParticleCanvas', type: 'ai' },
    { containerId: 'devHeadingContainer', canvasId: 'devParticleCanvas', type: 'dev' },
    { containerId: 'engHeadingContainer', canvasId: 'engParticleCanvas', type: 'eng' }
  ];

  configs.forEach(cfg => {
    if (document.getElementById(cfg.containerId) && document.getElementById(cfg.canvasId)) {
      instances.push(new ParticleTypography(cfg.containerId, cfg.canvasId, { type: cfg.type }));
    }
  });

  return instances;
}
