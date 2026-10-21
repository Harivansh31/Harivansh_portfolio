/**
 * ========================================================
 * CYBERNETIC AMBIENT BACKGROUND ENGINE
 * High-performance, lightweight, multi-depth parallax system:
 * - Faint animated cyber grid with scroll parallax & coordinate crosshairs
 * - Thin neon-green orbital lines & rotating HUD reticles with satellite nodes
 * - Small floating wireframe hexagons with subtle precession
 * - PCB circuit patterns with traveling neon-green energy pulses
 * - Ambient dust particles with proximity constellation links
 *
 * Designed specifically for Harivansh Vats Cyber Portfolio
 * Non-distracting, premium, ultra-smooth 60+ FPS across the entire website.
 * ========================================================
 */

export function initBackgroundParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Parallax & Smooth Scroll Tracking
  let targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  let smoothScrollY = targetScrollY;
  let lastScrollY = targetScrollY;
  let maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  // Mouse interaction
  let mouse = { x: -1000, y: -1000, radius: 120 };

  // HUD elements in DOM
  const hudReadout = document.getElementById('hudScrollReadout');
  const hudThumb = document.getElementById('hudScrollThumb');

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener('scroll', () => {
    targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  // ========================================================
  // 1. FAINT ANIMATED CYBER GRID WITH PARALLAX & CROSSHAIRS
  // ========================================================
  function drawGrid(smoothScroll, time) {
    const gridSize = 56;
    const parallaxOffset = (smoothScroll * 0.08) % gridSize;

    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.022)';

    // Vertical grid lines
    ctx.beginPath();
    for (let x = 0; x <= width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }

    // Horizontal lines shifted with smooth parallax
    for (let y = -gridSize + parallaxOffset; y <= height + gridSize; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Micro-crosshairs (+) at coordinate intersections
    const crossStep = gridSize * 3;
    const startY = Math.floor((-parallaxOffset) / crossStep) * crossStep + parallaxOffset;

    for (let x = crossStep; x < width; x += crossStep) {
      for (let y = startY; y < height + crossStep; y += crossStep) {
        const pulse = Math.sin(time * 0.0016 + (x + y) * 0.008) * 0.035 + 0.055;
        ctx.strokeStyle = `rgba(139, 155, 180, ${pulse})`;
        ctx.beginPath();
        ctx.moveTo(x - 3, y);
        ctx.lineTo(x + 3, y);
        ctx.moveTo(x, y - 3);
        ctx.lineTo(x, y + 3);
        ctx.stroke();
      }
    }

    // Gentle vertical scanning laser beam
    const scanY = (time * 0.035) % (height + 240) - 120;
    if (scanY > -60 && scanY < height + 60) {
      const grad = ctx.createLinearGradient(0, scanY - 35, 0, scanY + 35);
      grad.addColorStop(0, 'rgba(139, 155, 180, 0)');
      grad.addColorStop(0.5, 'rgba(139, 155, 180, 0.025)');
      grad.addColorStop(1, 'rgba(139, 155, 180, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, scanY - 35, width, 70);
    }

    ctx.restore();
  }

  // ========================================================
  // 2. THIN NEON-GREEN ORBITAL LINES & HUD RETICLES
  // ========================================================
  const orbitalSystems = [
    { rx: 0.84, worldY: 380, baseRadius: 185, rotSpeed: 0.00035, dir: 1, nodeCount: 2, label: 'RAD-01' },
    { rx: 0.12, worldY: 1550, baseRadius: 145, rotSpeed: -0.00045, dir: -1, nodeCount: 1, label: 'GEO-02' },
    { rx: 0.88, worldY: 2850, baseRadius: 210, rotSpeed: 0.0003, dir: 1, nodeCount: 2, label: 'ORB-03' },
    { rx: 0.14, worldY: 4250, baseRadius: 165, rotSpeed: -0.0004, dir: -1, nodeCount: 1, label: 'SYS-04' }
  ];

  function drawOrbitals(smoothScroll, time) {
    orbitalSystems.forEach((orb) => {
      const cx = orb.rx * width;
      const cy = orb.worldY - smoothScroll * 0.14;

      // Viewport culling
      if (cy < -300 || cy > height + 300) return;

      const r = orb.baseRadius;
      const rot = time * orb.rotSpeed;

      ctx.save();
      ctx.translate(cx, cy);

      // Primary thin orbital ring
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139, 155, 180, 0.045)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer dashed segmented ring
      ctx.save();
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.setLineDash([6, 18]);
      ctx.arc(0, 0, r + 24, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(139, 155, 180, 0.065)';
      ctx.stroke();
      ctx.restore();

      // Inner broken counter-rotating arc
      ctx.save();
      ctx.rotate(-rot * 1.5);
      ctx.beginPath();
      ctx.setLineDash([14, 28]);
      ctx.arc(0, 0, Math.max(40, r - 32), 0, Math.PI * 1.6);
      ctx.strokeStyle = 'rgba(191, 199, 213, 0.045)';
      ctx.stroke();
      ctx.restore();

      // 4 Cardinal tick marks
      ctx.strokeStyle = 'rgba(139, 155, 180, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-r - 6, 0); ctx.lineTo(-r + 6, 0);
      ctx.moveTo(r - 6, 0); ctx.lineTo(r + 6, 0);
      ctx.moveTo(0, -r - 6); ctx.lineTo(0, -r + 6);
      ctx.moveTo(0, r - 6); ctx.lineTo(0, r + 6);
      ctx.stroke();

      // Orbiting Satellite Beacon Nodes
      for (let k = 0; k < orb.nodeCount; k++) {
        const nodeAngle = rot * 2 + (k * Math.PI);
        const nx = Math.cos(nodeAngle) * r;
        const ny = Math.sin(nodeAngle) * r;

        // Faint beacon halo
        ctx.beginPath();
        ctx.arc(nx, ny, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 155, 180, 0.22)';
        ctx.fill();

        // Bright beacon core
        ctx.beginPath();
        ctx.arc(nx, ny, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#BFC7D5';
        ctx.shadowColor = '#BFC7D5';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Micro telemetry readout for 1st node
        if (k === 0) {
          const deg = Math.floor((Math.abs(rot * 180 / Math.PI)) % 360);
          ctx.font = '8px "JetBrains Mono", monospace';
          ctx.fillStyle = 'rgba(139, 155, 180, 0.28)';
          ctx.fillText(`${orb.label} [${deg}°]`, nx + 8, ny - 4);
        }
      }

      ctx.restore();
    });
  }

  // ========================================================
  // 3. SMALL FLOATING WIREFRAME HEXAGONS
  // ========================================================
  class Hexagon {
    constructor(worldY) {
      this.xRatio = 0.06 + Math.random() * 0.88;
      this.worldY = worldY;
      this.radius = Math.random() * 8 + 8; // 8px - 16px
      this.vx = (Math.random() - 0.5) * 0.14;
      this.vy = (Math.random() - 0.5) * 0.14;
      this.angle = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.005;
      this.baseAlpha = Math.random() * 0.07 + 0.05;
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = Math.random() * 0.02 + 0.008;
      this.hasCenterDot = Math.random() > 0.35;
    }

    update() {
      this.xRatio += this.vx / width;
      if (this.xRatio < 0.03) this.xRatio = 0.97;
      if (this.xRatio > 0.97) this.xRatio = 0.03;
      this.angle += this.rotSpeed;
      this.pulsePhase += this.pulseSpeed;
    }

    draw(smoothScroll) {
      const screenX = this.xRatio * width;
      const screenY = this.worldY - smoothScroll * 0.24;

      // Wrap vertically across total world span
      let adjY = screenY;
      const totalSpan = 5200 * 0.24;
      while (adjY < -60) adjY += totalSpan;
      while (adjY > height + 60) adjY -= totalSpan;

      if (adjY < -30 || adjY > height + 30) return;

      const currentAlpha = Math.max(0.02, this.baseAlpha + Math.sin(this.pulsePhase) * 0.04);

      ctx.save();
      ctx.translate(screenX, adjY);
      ctx.rotate(this.angle);

      // Draw 6-sided hexagon
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const theta = (i * Math.PI) / 3;
        const hx = this.radius * Math.cos(theta);
        const hy = this.radius * Math.sin(theta);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();

      ctx.strokeStyle = `rgba(139, 155, 180, ${currentAlpha})`;
      ctx.lineWidth = 1;
      ctx.shadowColor = 'rgba(139, 155, 180, 0.4)';
      ctx.shadowBlur = 4;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (this.hasCenterDot) {
        ctx.beginPath();
        ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 155, 180, ${currentAlpha * 1.5})`;
        ctx.fill();
      }

      ctx.restore();
    }
  }

  const hexagons = [];
  const hexCount = 18;
  for (let i = 0; i < hexCount; i++) {
    const wy = (i / hexCount) * 5200 + Math.random() * 200;
    hexagons.push(new Hexagon(wy));
  }

  // ========================================================
  // 4. PCB CIRCUIT PATTERNS WITH TRAVELING ENERGY PULSES
  // ========================================================
  const circuitConfigs = [
    // 1. Top Left margin (Hero)
    {
      xRatio: 0.03, worldY: 180,
      points: [[0, 0], [110, 0], [150, 40], [270, 40], [300, 70], [300, 140]],
      speed: 1.2
    },
    // 2. Top Right margin (Hero right)
    {
      xRatio: 0.84, worldY: 420,
      points: [[200, 0], [90, 0], [50, 40], [50, 130], [10, 170]],
      speed: 1.0
    },
    // 3. Mid Left (About section)
    {
      xRatio: 0.04, worldY: 1600,
      points: [[0, 40], [80, 40], [120, 80], [220, 80], [250, 110], [340, 110]],
      speed: 1.3
    },
    // 4. Mid Right (Projects section)
    {
      xRatio: 0.78, worldY: 2600,
      points: [[280, 20], [170, 20], [130, 60], [60, 60], [20, 100], [0, 100]],
      speed: 1.15
    },
    // 5. Lower Left (Experience section)
    {
      xRatio: 0.05, worldY: 3700,
      points: [[0, 0], [90, 0], [130, 40], [240, 40], [270, 70], [270, 150]],
      speed: 1.25
    },
    // 6. Bottom Right (Contact section)
    {
      xRatio: 0.76, worldY: 4800,
      points: [[300, 30], [180, 30], [140, 70], [60, 70], [30, 100], [0, 100]],
      speed: 1.1
    }
  ];

  class CircuitTrack {
    constructor(cfg) {
      this.xRatio = cfg.xRatio;
      this.worldY = cfg.worldY;
      this.rawPoints = cfg.points;
      this.speed = cfg.speed;
      this.pulseDist = Math.random() * 200;
      this.padBloom = 0;

      // Precompute segment lengths and cumulative distances
      this.segments = [];
      this.totalLength = 0;
      for (let i = 0; i < this.rawPoints.length - 1; i++) {
        const p1 = this.rawPoints[i];
        const p2 = this.rawPoints[i + 1];
        const dx = p2[0] - p1[0];
        const dy = p2[1] - p1[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        this.segments.push({ p1, p2, len, startDist: this.totalLength });
        this.totalLength += len;
      }
    }

    getPointAt(dist) {
      if (dist <= 0) return { x: this.rawPoints[0][0], y: this.rawPoints[0][1] };
      if (dist >= this.totalLength) {
        const last = this.rawPoints[this.rawPoints.length - 1];
        return { x: last[0], y: last[1] };
      }
      for (let seg of this.segments) {
        if (dist >= seg.startDist && dist <= seg.startDist + seg.len) {
          const t = (dist - seg.startDist) / seg.len;
          return {
            x: seg.p1[0] + (seg.p2[0] - seg.p1[0]) * t,
            y: seg.p1[1] + (seg.p2[1] - seg.p1[1]) * t
          };
        }
      }
      return { x: this.rawPoints[0][0], y: this.rawPoints[0][1] };
    }

    update() {
      this.pulseDist += this.speed;
      if (this.pulseDist > this.totalLength) {
        this.pulseDist = 0;
        this.padBloom = 1.0;
      }
      if (this.padBloom > 0) {
        this.padBloom = Math.max(0, this.padBloom - 0.035);
      }
    }

    draw(smoothScroll) {
      const originX = this.xRatio * width;
      const originY = this.worldY - smoothScroll * 0.20;

      // Viewport culling
      if (originY < -240 || originY > height + 240) return;

      ctx.save();
      ctx.translate(originX, originY);

      // Base PCB trace line
      ctx.beginPath();
      ctx.moveTo(this.rawPoints[0][0], this.rawPoints[0][1]);
      for (let i = 1; i < this.rawPoints.length; i++) {
        ctx.lineTo(this.rawPoints[i][0], this.rawPoints[i][1]);
      }
      ctx.strokeStyle = 'rgba(139, 155, 180, 0.045)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Solder pads at start & end
      const startPt = this.rawPoints[0];
      const endPt = this.rawPoints[this.rawPoints.length - 1];
      this.drawSolderPad(startPt[0], startPt[1], 0);
      this.drawSolderPad(endPt[0], endPt[1], this.padBloom);

      // Corner junction micro-dots
      for (let i = 1; i < this.rawPoints.length - 1; i++) {
        ctx.beginPath();
        ctx.arc(this.rawPoints[i][0], this.rawPoints[i][1], 1.4, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 155, 180, 0.16)';
        ctx.fill();
      }

      // Traveling glowing energy pulse
      const headPt = this.getPointAt(this.pulseDist);

      // Pulse fading tail
      const trailSteps = 5;
      for (let t = trailSteps; t >= 1; t--) {
        const td = this.pulseDist - t * 5;
        if (td > 0) {
          const pt = this.getPointAt(td);
          const tailAlpha = (1 - t / trailSteps) * 0.45;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 155, 180, ${tailAlpha})`;
          ctx.fill();
        }
      }

      // Leading bright core
      ctx.beginPath();
      ctx.arc(headPt.x, headPt.y, 2.2, 0, Math.PI * 2);
      ctx.fillStyle = '#BFC7D5';
      ctx.shadowColor = '#BFC7D5';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    drawSolderPad(x, y, bloom) {
      // Outer ring
      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(139, 155, 180, ${0.16 + bloom * 0.5})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Inner pad core
      ctx.beginPath();
      ctx.arc(x, y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 155, 180, ${0.3 + bloom * 0.6})`;
      ctx.fill();

      // Pulse arrival bloom ring
      if (bloom > 0.05) {
        ctx.beginPath();
        ctx.arc(x, y, 3.5 + (1 - bloom) * 9, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(139, 155, 180, ${bloom * 0.55})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }

  const circuits = circuitConfigs.map(cfg => new CircuitTrack(cfg));

  // ========================================================
  // 5. AMBIENT DUST PARTICLES & CONSTELLATION THREADS
  // ========================================================
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.6 + 0.8;
      this.alpha = Math.random() * 0.38 + 0.18;
      this.pulseSpeed = Math.random() * 0.02 + 0.006;
      this.pulseVal = Math.random() * Math.PI * 2;
    }

    update(scrollDelta) {
      this.x += this.vx;
      this.y += this.vy;

      // Scroll draft reaction
      this.y -= scrollDelta * 0.07;

      // Wrap around viewport edges smoothly
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
      if (this.y < -20) this.y = height + 20;
      if (this.y > height + 20) this.y = -20;

      this.pulseVal += this.pulseSpeed;

      // Mouse gentle repulsion
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 1.4;
        this.y -= (dy / dist) * force * 1.4;
      }
    }

    draw() {
      const curAlpha = Math.max(0.08, this.alpha + Math.sin(this.pulseVal) * 0.12);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139, 155, 180, ${curAlpha})`;
      ctx.shadowColor = 'rgba(139, 155, 180, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  const particles = [];
  const particleCount = 38;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // ========================================================
  // 6. CELESTIAL FLANK ENGINE (LEFT & RIGHT MARGINS)
  // Serene cyberpunk planetary motifs: Saturn, Crescent Moon,
  // and ringed worlds. MOVES STRICTLY ON SCROLL. Zero idle drift.
  // ========================================================

  function drawSaturn(cx, cy, radius, scrollAngle, alpha, label = 'SATURN // 06') {
    ctx.save();
    ctx.translate(cx, cy);

    // Planetary axis tilt plus smooth scroll rotation
    const tilt = -0.42 + scrollAngle * 0.4;
    ctx.rotate(tilt);

    // Ring dimensions
    const rx1 = radius * 1.55;
    const ry1 = radius * 0.42;
    const rx2 = radius * 2.05;
    const ry2 = radius * 0.54;
    const rx3 = radius * 2.45;
    const ry3 = radius * 0.65;

    // 1. Back arc of rings (behind the planet sphere)
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.6})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx1, ry1, 0, Math.PI, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([6, 12]);
    ctx.ellipse(0, 0, rx2, ry2, 0, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.ellipse(0, 0, rx3, ry3, 0, Math.PI, Math.PI * 2);
    ctx.stroke();

    // 2. Central Planet Sphere (occludes back half of rings)
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#090B0F';
    ctx.fill();
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 1.1})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Planetary latitude bands
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.45})`;
    ctx.lineWidth = 0.8;
    for (let b = -0.55; b <= 0.55; b += 0.36) {
      const by = radius * b;
      const bw = Math.sqrt(Math.max(0, radius * radius - by * by));
      ctx.beginPath();
      ctx.ellipse(0, by, bw, bw * 0.22, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Front half of rings (in front of planet sphere)
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.9})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx1, ry1, 0, 0, Math.PI);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([6, 12]);
    ctx.ellipse(0, 0, rx2, ry2, 0, 0, Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.ellipse(0, 0, rx3, ry3, 0, 0, Math.PI);
    ctx.stroke();

    // 4. Orbiting Shepherd Satellite (rotates strictly with scroll)
    const satAngle = scrollAngle * 2.2;
    const satX = Math.cos(satAngle) * rx2;
    const satY = Math.sin(satAngle) * ry2;
    ctx.beginPath();
    ctx.arc(satX, satY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#BFC7D5';
    ctx.shadowColor = '#BFC7D5';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Technical label
    ctx.rotate(-tilt);
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(139, 155, 180, ${alpha * 1.3})`;
    ctx.fillText(label, -radius * 1.2, radius + 20);

    ctx.restore();
  }

  function drawCrescentMoon(cx, cy, radius, scrollAngle, alpha, label = 'LUNA // 01') {
    ctx.save();
    ctx.translate(cx, cy);

    // Rotate strictly on scroll
    const rot = -0.25 + scrollAngle * 0.5;
    ctx.rotate(rot);

    // Outer orbital ellipse
    ctx.beginPath();
    ctx.setLineDash([4, 12]);
    ctx.ellipse(0, 0, radius * 2.2, radius * 1.25, 0.35, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.45})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbiting micro-satellite (moves strictly with scroll)
    const satAngle = scrollAngle * 1.8;
    const rawX = Math.cos(satAngle) * (radius * 2.2);
    const rawY = Math.sin(satAngle) * (radius * 1.25);
    const rotX = rawX * Math.cos(0.35) - rawY * Math.sin(0.35);
    const rotY = rawX * Math.sin(0.35) + rawY * Math.cos(0.35);
    ctx.beginPath();
    ctx.arc(rotX, rotY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#BFC7D5';
    ctx.shadowColor = '#BFC7D5';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Crescent Moon outline
    ctx.beginPath();
    ctx.arc(0, 0, radius, -Math.PI * 0.5, Math.PI * 0.5, false);
    ctx.bezierCurveTo(radius * 0.35, radius * 0.45, radius * 0.35, -radius * 0.45, 0, -radius);
    ctx.closePath();
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 1.1})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Subtle lunar crater wireframes
    ctx.beginPath();
    ctx.arc(radius * 0.42, -radius * 0.22, 3.5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.5})`;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(radius * 0.52, radius * 0.26, 2.5, 0, Math.PI * 2);
    ctx.stroke();

    // Dark side ghost contour (dashed)
    ctx.beginPath();
    ctx.setLineDash([2, 6]);
    ctx.arc(0, 0, radius, Math.PI * 0.5, -Math.PI * 0.5, false);
    ctx.strokeStyle = `rgba(191, 199, 213, ${alpha * 0.35})`;
    ctx.stroke();
    ctx.setLineDash([]);

    // Upright label
    ctx.rotate(-rot);
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(139, 155, 180, ${alpha * 1.3})`;
    ctx.fillText(label, -radius * 1.1, radius + 20);

    ctx.restore();
  }

  function drawRingedExoplanet(cx, cy, radius, scrollAngle, alpha, label = 'EXO // 03') {
    ctx.save();
    ctx.translate(cx, cy);

    // Dual intersecting gimbal orbital rings
    // Ring 1 (rotates with scroll)
    ctx.save();
    ctx.rotate(0.55 + scrollAngle * 0.4);
    ctx.beginPath();
    ctx.setLineDash([6, 12]);
    ctx.ellipse(0, 0, radius * 2.1, radius * 0.52, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.75})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Ring 2 (counter-tilts with scroll)
    ctx.save();
    ctx.rotate(-0.55 - scrollAngle * 0.4);
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 1.85, radius * 0.45, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(191, 199, 213, ${alpha * 0.6})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Planet body
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#090B0F';
    ctx.fill();
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 1.1})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Cardinal coordinate reticles
    ctx.beginPath();
    ctx.moveTo(-radius - 8, 0); ctx.lineTo(-radius + 4, 0);
    ctx.moveTo(radius - 4, 0); ctx.lineTo(radius + 8, 0);
    ctx.moveTo(0, -radius - 8); ctx.lineTo(0, -radius + 4);
    ctx.moveTo(0, radius - 4); ctx.lineTo(0, radius + 8);
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.75})`;
    ctx.stroke();

    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(139, 155, 180, ${alpha * 1.3})`;
    ctx.fillText(label, -radius * 1.1, radius + 20);

    ctx.restore();
  }

  function drawEclipseMoon(cx, cy, radius, scrollAngle, alpha, label = 'ECLIPSE // 04') {
    ctx.save();
    ctx.translate(cx, cy);

    ctx.rotate(scrollAngle * 0.35);

    // Outer orbital dashed ring
    ctx.beginPath();
    ctx.arc(0, 0, radius * 1.85, 0, Math.PI * 2);
    ctx.setLineDash([4, 14]);
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.45})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    ctx.setLineDash([]);

    // Moon sphere
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 1.1})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Wireframe meridian & parallel
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.5, radius, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(139, 155, 180, ${alpha * 0.45})`;
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, radius, radius * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Subtle eclipse shadow curve
    ctx.beginPath();
    ctx.arc(radius * 0.35, 0, radius * 0.9, -Math.PI * 0.42, Math.PI * 0.42);
    ctx.strokeStyle = `rgba(191, 199, 213, ${alpha * 0.6})`;
    ctx.stroke();

    ctx.rotate(-scrollAngle * 0.35);
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = `rgba(139, 155, 180, ${alpha * 1.3})`;
    ctx.fillText(label, -radius * 1.1, radius + 20);

    ctx.restore();
  }

  // Planetary configuration for left and right margins
  const celestialObjects = [
    // 1. Crescent Moon on the Left margin (near Hero/About)
    { side: 'left', worldY: 420, type: 'moon', radius: 24, alpha: 0.16, label: 'LUNA // 01' },
    // 2. Saturn with Tilted Rings on the Right margin (About section)
    { side: 'right', worldY: 820, type: 'saturn', radius: 28, alpha: 0.18, label: 'SATURN // 06' },
    // 3. Ringed Exoplanet on the Left margin (Projects section)
    { side: 'left', worldY: 2200, type: 'exoplanet', radius: 25, alpha: 0.16, label: 'EXO // 03' },
    // 4. Wireframe Eclipse Moon on the Right margin (Experience section)
    { side: 'right', worldY: 3450, type: 'eclipse', radius: 24, alpha: 0.16, label: 'ECLIPSE // 04' },
    // 5. Deep Space Saturn II on the Left margin (Certificates/Contact)
    { side: 'left', worldY: 4600, type: 'saturn', radius: 26, alpha: 0.17, label: 'SATURN // 02' }
  ];

  function drawCelestialFlanks(smoothScroll) {
    const maxContentWidth = 1240;
    const gutter = Math.max(0, (width - maxContentWidth) / 2);

    // Lateral positions strictly outside the central container
    const xLeft = gutter >= 65 ? gutter * 0.5 : Math.max(34, width * 0.05);
    const xRight = gutter >= 65 ? width - gutter * 0.5 : Math.min(width - 34, width * 0.95);

    // Scroll-only angle & velocity: NO time factor!
    // When smoothScroll is stationary, scrollAngle is constant.
    const scrollAngle = smoothScroll * 0.0012;

    celestialObjects.forEach((obj) => {
      // Parallax translation: ONLY shifts when smoothScroll changes
      const screenY = obj.worldY - smoothScroll * 0.25;

      // Viewport culling
      if (screenY < -150 || screenY > height + 150) return;

      const cx = obj.side === 'left' ? xLeft : xRight;

      if (obj.type === 'saturn') {
        drawSaturn(cx, screenY, obj.radius, scrollAngle, obj.alpha, obj.label);
      } else if (obj.type === 'moon') {
        drawCrescentMoon(cx, screenY, obj.radius, scrollAngle, obj.alpha, obj.label);
      } else if (obj.type === 'exoplanet') {
        drawRingedExoplanet(cx, screenY, obj.radius, scrollAngle, obj.alpha, obj.label);
      } else if (obj.type === 'eclipse') {
        drawEclipseMoon(cx, screenY, obj.radius, scrollAngle, obj.alpha, obj.label);
      }
    });
  }

  // ========================================================
  // 7. MAIN ENGINE ANIMATION LOOP
  // ========================================================
  let animationFrame;
  let startTime = performance.now();

  function animate(now) {
    // Conserve resources when page is in background tab
    if (document.hidden) {
      animationFrame = requestAnimationFrame(animate);
      return;
    }

    const time = now - startTime;

    // Smooth LERP scroll calculation
    const scrollDelta = targetScrollY - smoothScrollY;
    smoothScrollY += scrollDelta * 0.08;
    lastScrollY = targetScrollY;

    // Update HUD scroll telemetry
    if (hudReadout || hudThumb) {
      const percent = Math.min(100, Math.max(0, Math.round((smoothScrollY / maxScroll) * 100)));
      if (hudReadout) hudReadout.textContent = `DEPTH ${String(percent).padStart(2, '0')}%`;
      if (hudThumb) hudThumb.style.transform = `translateY(${(smoothScrollY / maxScroll) * 80}px)`;
    }

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Faint animated grid with coordinate crosshairs
    drawGrid(smoothScrollY, time);

    // 2. PCB circuit tracks & energy pulses
    circuits.forEach(c => {
      c.update();
      c.draw(smoothScrollY);
    });

    // 3. Thin neon-green orbital lines & HUD reticles
    drawOrbitals(smoothScrollY, time);

    // 4. Small floating hexagons
    hexagons.forEach(h => {
      h.update();
      h.draw(smoothScrollY);
    });

    // 5. Constellation connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 88) {
          const lineAlpha = (1 - dist / 88) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 155, 180, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // 6. Floating ambient particles
    particles.forEach(p => {
      p.update(scrollDelta);
      p.draw();
    });

    // 7. Celestial Lateral Flanks (Saturn, Moon, Planetary rings - MOVES STRICTLY ON SCROLL)
    drawCelestialFlanks(smoothScrollY);

    animationFrame = requestAnimationFrame(animate);
  }

  animationFrame = requestAnimationFrame(animate);

  return () => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener('resize', resize);
  };
}
