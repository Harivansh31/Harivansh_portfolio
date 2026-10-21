/**
 * ===================================================================
 * 3D FLOATING CURVED WIREFRAME CARPET ENGINE (FULL WEBSITE & DEEP DISTANCE)
 * ===================================================================
 * - Full Website Presence: Accompany the visitor seamlessly across all
 *   sections (Home, About, Skills, Projects, Experience, Certificates, Contact).
 * - Distant Perspective: Positioned deeper in 3D Z-space, looking like a
 *   majestic, suspended wireframe carpet floating far behind the website content.
 * - Deep-Space Parallax: Slow, graceful parallax on scroll and cursor/touch,
 *   giving natural depth without visual clutter or distraction.
 * - Soft Atmospheric Glow: Fine silver-white grid lines with delicate edge
 *   dissolving and distance fog for a cinematic, premium feel.
 * - 60 FPS GPU-accelerated GLSL shader with automatic pause on tab blur.
 * ===================================================================
 */

import * as THREE from 'three';

export class WireframeCarpetEngine {
  constructor(canvasId = 'particleCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`WireframeCarpetEngine: Canvas #${canvasId} not found.`);
      return;
    }

    // Interaction & Tracking
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    // Full website scroll tracking with smooth inertia
    this.scroll = {
      current: 0,
      target: 0,
      y: 0,
      max: 1
    };

    this.lastTime = performance.now();
    this.isRunning = false;

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupMesh();
    this.bindEvents();
    this.updateDimensions();
    this.start();
  }

  setupRenderer() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setClearColor(0x000000, 0); // Transparent so deep-black background shows through
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    // Narrow 32-deg FOV placed further back (Z = 72) to make the carpet look far in the background
    this.camera = new THREE.PerspectiveCamera(
      32,
      this.width / this.height,
      0.1,
      1200
    );

    // Elevated and distant viewpoint looking down toward the deep suspended carpet
    this.baseCameraPos = new THREE.Vector3(0, 9.0, 72);
    this.baseCameraLookAt = new THREE.Vector3(0, -0.5, -6);

    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.baseCameraLookAt);
  }

  setupMesh() {
    const isMobile = this.width < 768;

    // High density grid with small, closely spaced quad cells
    this.cols = isMobile ? 120 : 170;
    this.rows = isMobile ? 60 : 85;

    const count = this.cols * this.rows;
    const positions = new Float32Array(count * 3);
    const gridUvs = new Float32Array(count * 2);

    let idx = 0;
    let uvIdx = 0;

    // Build normalized grid in [-0.5, 0.5] range
    for (let r = 0; r < this.rows; r++) {
      const v = r / (this.rows - 1);
      const zNorm = v - 0.5;

      for (let c = 0; c < this.cols; c++) {
        const u = c / (this.cols - 1);
        const xNorm = u - 0.5;

        positions[idx * 3 + 0] = xNorm;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = zNorm;

        gridUvs[uvIdx * 2 + 0] = u;
        gridUvs[uvIdx * 2 + 1] = v;

        idx++;
        uvIdx++;
      }
    }

    // Line indices for wireframe connections (horizontal & vertical segments only)
    const lineIndices = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = r * this.cols + c;
        if (c < this.cols - 1) {
          lineIndices.push(current, current + 1);
        }
        if (r < this.rows - 1) {
          lineIndices.push(current, current + this.cols);
        }
      }
    }

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('aGridUv', new THREE.BufferAttribute(gridUvs, 2));
    this.geometry.setIndex(lineIndices);

    // GLSL Shader: Controlled waves, fine silver-white lines, pure black edges
    const vertexShader = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseRadius;
      uniform float uMouseStrength;
      uniform float uWaveScale;
      attribute vec2 aGridUv;

      varying float vElevation;
      varying float vEdgeFade;
      varying float vDepth;

      void main() {
        vec3 p = position;

        // Normalized 2D coordinates in [-1, 1]
        float nx = (aGridUv.x - 0.5) * 2.0;
        float nz = (aGridUv.y - 0.5) * 2.0;

        // 1. Natural edge tapering factor: lines gracefully taper off at boundaries
        float edgeX = smoothstep(0.0, 0.09, aGridUv.x) * smoothstep(1.0, 0.91, aGridUv.x);
        float edgeZ = smoothstep(0.0, 0.09, aGridUv.y) * smoothstep(1.0, 0.91, aGridUv.y);
        float edgeFade = edgeX * edgeZ;
        vEdgeFade = edgeFade;

        // 2. Reference Image Base Shape (Controlled, natural curves):
        // Central smooth convex dome / hill
        float r2 = nx * nx * 3.8 + (nz + 0.12) * (nz + 0.12) * 4.6;
        float centerDome = exp(-r2) * 4.8;

        // Front edge sweeping S-curve (swoops smoothly on left into a tip)
        float frontMask = smoothstep(0.65, 0.05, aGridUv.y);
        float sCurve = sin(nx * 3.6 - 0.45) * 1.65 * frontMask;

        // Back edge gentle upward curvature
        float backMask = pow(smoothstep(0.38, 0.98, aGridUv.y), 2.2);
        float backLip = backMask * 2.1;

        // Subtle side wing taper
        float sideWing = pow(abs(nx), 2.8) * sin(nx * 2.5 + uTime * 0.35) * 0.75;

        // 3. Subtle, continuous floating movement (calm & fluid in deep space)
        float breathe = 1.0 + sin(uTime * 0.38) * 0.04;
        float w1 = sin(nx * 4.2 - uTime * 0.52 + nz * 2.8) * 0.50;
        float w2 = cos(nz * 4.5 + uTime * 0.40 + sin(nx * 3.0) * 0.7) * 0.38;
        float w3 = sin((nx * 5.0 - nz * 3.5) + uTime * 0.58) * 0.22;
        float microWave = sin(nx * 9.0 + nz * 7.0 - uTime * 0.75) * 0.09;

        // 4. Interactive pointer displacement
        float distToMouse = length(p.xz - uMouse);
        float mouseDisp = 0.0;
        if (distToMouse < uMouseRadius) {
          float influence = smoothstep(uMouseRadius, 0.0, distToMouse);
          mouseDisp = sin(distToMouse * 0.35 - uTime * 2.2) * influence * uMouseStrength;
        }

        // Apply controlled elevation with natural edge tapering
        float totalElevation = (centerDome * breathe + sCurve + backLip + sideWing + w1 + w2 + w3 + microWave + mouseDisp) * edgeFade * uWaveScale;
        p.y += totalElevation;
        vElevation = p.y;

        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        vDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
      }
    `;

    const fragmentShader = `
      uniform vec3 uColorPeak;
      uniform vec3 uColorCrest;
      uniform vec3 uColorBase;
      uniform float uLineOpacity;

      varying float vElevation;
      varying float vEdgeFade;
      varying float vDepth;

      void main() {
        // Elevation-based silver-white luminance mapping matching the reference
        float normH = clamp((vElevation + 1.2) / 6.0, 0.0, 1.0);
        vec3 col = mix(uColorBase, uColorCrest, smoothstep(0.12, 0.58, normH));
        col = mix(col, uColorPeak, smoothstep(0.62, 0.98, normH));

        // Soft crest glow on peaks
        float crestGlow = smoothstep(0.70, 1.0, normH) * 0.35;
        col += vec3(crestGlow);

        // Distance fog calibrated for the deep camera position (Z = 72)
        // Softly dissolves boundaries into pure black void
        float depthFade = smoothstep(115.0, 48.0, vDepth) * smoothstep(20.0, 36.0, vDepth);

        float alpha = (0.35 + 0.65 * normH) * vEdgeFade * depthFade * uLineOpacity;

        if (alpha <= 0.005) {
          discard;
        }

        gl_FragColor = vec4(col, alpha);
      }
    `;

    this.uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uMouseRadius: { value: 0.22 },
      uMouseStrength: { value: 0.40 },
      uWaveScale: { value: 1.0 },
      uColorPeak: { value: new THREE.Color(0xFFFFFF) },    // Crisp pure white peak highlights
      uColorCrest: { value: new THREE.Color(0xD2DEEC) },   // Soft silver slope highlights
      uColorBase: { value: new THREE.Color(0x48566A) },    // Elegant deep slate-silver base
      uLineOpacity: { value: 0.72 }                         // Slightly softened for deep background separation
    };

    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.mesh = new THREE.LineSegments(this.geometry, material);
    // Suspended in deep space behind the website content
    this.baseMeshPos = new THREE.Vector3(0, -1.0, -8);
    this.mesh.position.copy(this.baseMeshPos);

    this.scene.add(this.mesh);
  }

  updateDimensions() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);

    // Calculate frustum at mesh distance (Z = -8, distance = 72 + 8 = 80 units)
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const distanceToMesh = this.baseCameraPos.z - this.baseMeshPos.z;
    const frustumHeight = 2 * Math.tan(fovRad / 2) * distanceToMesh;
    const frustumWidth = frustumHeight * this.camera.aspect;

    // Sized to sit gracefully in the deep distance:
    // Spans ~84–88% of width, looking comfortably far behind the content
    const targetWidth = frustumWidth * (this.width < 768 ? 0.90 : 0.84);
    const targetDepth = targetWidth * 0.33;

    if (this.mesh) {
      this.mesh.scale.set(targetWidth, 1.0, targetDepth);
    }

    if (this.uniforms) {
      this.uniforms.uWaveScale.value = Math.max(0.65, Math.min(1.20, targetWidth / 55.0));
    }

    this.handleScroll();
  }

  bindEvents() {
    this.onResize = this.updateDimensions.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onTouchMove = this.handleTouchMove.bind(this);
    this.onScroll = this.handleScroll.bind(this);
    this.onVisibilityChange = this.handleVisibilityChange.bind(this);

    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('touchstart', this.onTouchMove, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', () => {
      this.mouse.targetX *= 0.5;
      this.mouse.targetY *= 0.5;
    }, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  handleScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    // Continuous scroll tracking across the entire website (0.0 at top to 1.0 at footer)
    this.scroll.target = Math.min(1, Math.max(0, scrollY / maxScroll));
    this.scroll.y = scrollY;
  }

  handleMouseMove(e) {
    this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }

  handleTouchMove(e) {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      this.mouse.targetX = (touch.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(touch.clientY / window.innerHeight) * 2 + 1;
      this.handleScroll();
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.isRunning = false;
    } else {
      if (!this.isRunning) {
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(() => this.tick());
      }
    }
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      requestAnimationFrame(() => this.tick());
    }
  }

  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;

    // 1. Damped Spring Interpolation for Mouse & Scroll
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth whole-page scroll interpolation
    const scrollDelta = this.scroll.target - this.scroll.current;
    this.scroll.current += scrollDelta * 0.05;
    const prog = this.scroll.current;

    // 2. Update Shader Uniforms
    this.uniforms.uTime.value += dt;
    this.uniforms.uMouse.value.set(this.mouse.x * 0.5, this.mouse.y * 0.5);

    // 3. Majestic Deep-Space Camera & Mesh Parallax across Full Website
    // Slow, distant vertical and depth progression as user explores the portfolio
    const scrollOffsetY = prog * 22.0;
    const scrollSwoopZ = Math.sin(prog * Math.PI) * 6.0;

    // Camera smoothly travels in deep 3D perspective
    this.camera.position.x = this.baseCameraPos.x + this.mouse.x * 2.2;
    this.camera.position.y = this.baseCameraPos.y + this.mouse.y * 1.5 - scrollOffsetY;
    this.camera.position.z = this.baseCameraPos.z - scrollSwoopZ;

    this.camera.lookAt(
      this.baseCameraLookAt.x + this.mouse.x * 0.6,
      this.baseCameraLookAt.y - scrollOffsetY * 0.75,
      this.baseCameraLookAt.z
    );

    // Subtle mesh orientation reaction
    if (this.mesh) {
      this.mesh.rotation.y = this.mouse.x * 0.020 + Math.sin(this.uniforms.uTime.value * 0.22) * 0.010;
      this.mesh.rotation.x = -this.mouse.y * 0.014;
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(() => this.tick());
  }

  destroy() {
    this.isRunning = false;
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchstart', this.onTouchMove);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('scroll', this.onScroll);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);

    if (this.geometry) this.geometry.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}

/**
 * Initialize and mount the floating wireframe carpet background engine
 */
export function initWireframeCarpet(canvasId = 'particleCanvas') {
  return new WireframeCarpetEngine(canvasId);
}
