/**
 * ===================================================================
 * 3D SILK PARTICLE-WAVE WIREFRAME MESH ENGINE
 * ===================================================================
 * Inspired by high-end creative technology studios (e.g. Active Theory, Stripe, Locomotive).
 *
 * Visual Characteristics:
 * - Pure black (#000000) backdrop.
 * - Thousands of delicate white and soft silver particles.
 * - Ultra-thin connecting wireframe lines forming a continuous 3D digital silk ocean wave.
 * - Multi-octave sinusoidal & procedural fluid undulations flowing smoothly and seamlessly.
 * - Mouse-reactive local surface deformation and subtle camera parallax.
 * - Zero CPU overhead: Vertex displacement computed in parallel on the GPU via custom GLSL shaders.
 * - Smooth 60 FPS performance on both mobile and desktop.
 * ===================================================================
 */

import * as THREE from 'three';

export class WaveBackgroundEngine {
  constructor(canvasId = 'particleCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`WaveBackgroundEngine: Canvas #${canvasId} not found.`);
      return;
    }

    // Interaction & State
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      worldX: 0,
      worldZ: 0,
      targetWorldX: 0,
      targetWorldZ: 0,
      isHovered: false
    };

    this.scroll = {
      current: 0,
      target: 0,
      normalized: 0
    };

    this.lastTime = 0;
    this.isRunning = false;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.raycaster = new THREE.Raycaster();
    this.mousePlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.mouseRay = new THREE.Vector2(-999, -999);
    this.intersectionPoint = new THREE.Vector3();

    this.init();
  }

  init() {
    this.setupRenderer();
    this.setupCamera();
    this.setupWaveMesh();
    this.bindEvents();
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
    this.renderer.setClearColor(0x000000, 0); // Transparent so pure black body shows through
    this.scene = new THREE.Scene();
  }

  setupCamera() {
    // Cinematic angled viewpoint looking diagonally across the undulating silk surface
    this.camera = new THREE.PerspectiveCamera(
      48,
      this.width / this.height,
      0.1,
      1000
    );

    this.baseCameraPos = new THREE.Vector3(0, 24, 46);
    this.baseCameraLookAt = new THREE.Vector3(0, -3, -8);

    this.camera.position.copy(this.baseCameraPos);
    this.camera.lookAt(this.baseCameraLookAt);
  }

  setupWaveMesh() {
    // Grid resolution: 160 x 110 = 17,600 vertices
    // Mobile optimization: slightly lower density for high framerates on lower-end devices
    const isMobile = this.width < 768;
    this.cols = isMobile ? 110 : 160;
    this.rows = isMobile ? 90 : 130;

    const meshWidth = isMobile ? 210 : 270;
    const meshDepth = isMobile ? 180 : 250;

    const count = this.cols * this.rows;
    const positions = new Float32Array(count * 3);
    const gridUvs = new Float32Array(count * 2);

    let idx = 0;
    let uvIdx = 0;

    for (let r = 0; r < this.rows; r++) {
      const v = r / (this.rows - 1);
      const z = (v - 0.5) * meshDepth;

      for (let c = 0; c < this.cols; c++) {
        const u = c / (this.cols - 1);
        const x = (u - 0.5) * meshWidth;

        positions[idx * 3 + 0] = x;
        positions[idx * 3 + 1] = 0;
        positions[idx * 3 + 2] = z;

        gridUvs[uvIdx * 2 + 0] = u;
        gridUvs[uvIdx * 2 + 1] = v;

        idx++;
        uvIdx++;
      }
    }

    // Line indices for wireframe connections
    // Horizontal segments: (c, r) -> (c + 1, r)
    // Vertical segments: (c, r) -> (c, r + 1)
    const lineIndices = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const current = r * this.cols + c;
        // Horizontal segment
        if (c < this.cols - 1) {
          lineIndices.push(current, current + 1);
        }
        // Vertical segment
        if (r < this.rows - 1) {
          lineIndices.push(current, current + this.cols);
        }
      }
    }

    // Shared buffer attributes
    const posAttr = new THREE.BufferAttribute(positions, 3);
    const uvAttr = new THREE.BufferAttribute(gridUvs, 2);

    // Points Geometry (no line indices needed)
    this.pointsGeometry = new THREE.BufferGeometry();
    this.pointsGeometry.setAttribute('position', posAttr);
    this.pointsGeometry.setAttribute('aGridUv', uvAttr);

    // Lines Geometry (uses lineIndices for segment drawing)
    this.linesGeometry = new THREE.BufferGeometry();
    this.linesGeometry.setAttribute('position', posAttr);
    this.linesGeometry.setAttribute('aGridUv', uvAttr);
    this.linesGeometry.setIndex(lineIndices);

    // Common GLSL Wave Equations (Identical for Points & Lines)
    const waveCommonVertexGLSL = `
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uMouseRadius;
      uniform float uMouseStrength;
      uniform float uScroll;
      uniform float uPixelRatio;
      attribute vec2 aGridUv;

      varying float vElevation;
      varying float vEdgeFade;
      varying vec3 vWorldPos;

      // Multi-harmonic fluid silk wave function
      float computeWave(vec2 p, float t) {
        // 1. Primary horizontal traveling wave
        float w1 = sin(p.x * 0.042 - t * 0.75 + p.y * 0.024) * 6.8;

        // 2. Transverse rolling swell (creates alternating smooth crests and troughs)
        float w2 = cos(p.y * 0.052 + t * 0.62 + sin(p.x * 0.032) * 1.7) * 5.4;

        // 3. Diagonal shearing undulating wave
        float w3 = sin((p.x * 0.058 - p.y * 0.038) + t * 0.72) * 4.2;

        // 4. Subtle micro silk wrinkles / surface tension ripples
        float w4 = sin(p.x * 0.115 + p.y * 0.075 - t * 1.05) * 1.6;
        float w5 = cos((p.x * 0.082 + p.y * 0.125) - t * 0.48) * 1.2;

        return w1 + w2 + w3 + w4 + w5;
      }

      vec3 getDisplacedPosition(vec3 basePos) {
        vec3 p = basePos;

        // Subtle lateral silk sway
        p.x += cos(p.z * 0.036 + uTime * 0.4) * 2.2;
        p.z += sin(p.x * 0.032 + uTime * 0.32) * 1.8;

        // Edge fade factor (broad active area across screen)
        float edgeX = smoothstep(0.0, 0.08, aGridUv.x) * smoothstep(1.0, 0.92, aGridUv.x);
        float edgeZ = smoothstep(0.0, 0.08, aGridUv.y) * smoothstep(1.0, 0.92, aGridUv.y);
        float edge = edgeX * edgeZ;
        vEdgeFade = edge;

        // Elevation calculation
        float h = computeWave(p.xz, uTime);

        // Interactive mouse displacement (delicate ripple push)
        float distToMouse = length(p.xz - uMouse);
        if (distToMouse < uMouseRadius) {
          float influence = smoothstep(uMouseRadius, 0.0, distToMouse);
          float ripple = sin(distToMouse * 0.28 - uTime * 2.8) * 0.5 + 0.5;
          h += influence * uMouseStrength * (ripple * 1.2 - 0.4);
          
          vec2 push = normalize(p.xz - uMouse + vec2(0.001));
          p.xz += push * influence * 2.2;
        }

        // Apply edge-damped elevation
        p.y += h * edge;
        vElevation = p.y;

        return p;
      }
    `;

    // Uniforms
    this.uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(-9999, -9999) },
      uMouseRadius: { value: 40.0 },
      uMouseStrength: { value: 5.5 },
      uScroll: { value: 0 },
      uPixelRatio: { value: this.dpr },
      uColorPeak: { value: new THREE.Color(0xFFFFFF) },    // Pure white peak highlights
      uColorSlope: { value: new THREE.Color(0xD8DFEA) },   // Bright crisp silver slope highlights
      uColorBase: { value: new THREE.Color(0x485262) },    // Visible cool slate-silver base
      uPointOpacity: { value: 1.0 },
      uLineOpacity: { value: 0.60 }
    };

    // 1. Particle Points Material
    const pointsMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        ${waveCommonVertexGLSL}

        void main() {
          vec3 displaced = getDisplacedPosition(position);
          vWorldPos = displaced;
          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Responsive point size with perspective attenuation
          float baseSize = 2.4 * uPixelRatio;
          gl_PointSize = baseSize * (18.0 / -mvPosition.z);
          gl_PointSize = clamp(gl_PointSize, 1.0, 6.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorPeak;
        uniform vec3 uColorSlope;
        uniform vec3 uColorBase;
        uniform float uPointOpacity;

        varying float vElevation;
        varying float vEdgeFade;

        void main() {
          // Circular particle disk with soft anti-aliased edge
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;
          float circleAlpha = smoothstep(0.5, 0.12, dist);

          // Elevation color mapping
          float normH = clamp((vElevation + 12.0) / 24.0, 0.0, 1.0);
          vec3 color = mix(uColorBase, uColorSlope, smoothstep(0.12, 0.58, normH));
          color = mix(color, uColorPeak, smoothstep(0.64, 0.96, normH));

          // Soft highlight glow on wave crests
          float crestGlow = smoothstep(0.75, 1.0, normH) * 0.35;
          color += vec3(crestGlow);

          float alpha = circleAlpha * (0.35 + 0.65 * normH) * vEdgeFade * uPointOpacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    // 2. Wireframe Line Segments Material
    const linesMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: `
        ${waveCommonVertexGLSL}

        void main() {
          vec3 displaced = getDisplacedPosition(position);
          vWorldPos = displaced;
          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColorPeak;
        uniform vec3 uColorSlope;
        uniform vec3 uColorBase;
        uniform float uLineOpacity;

        varying float vElevation;
        varying float vEdgeFade;

        void main() {
          float normH = clamp((vElevation + 12.0) / 24.0, 0.0, 1.0);
          vec3 color = mix(uColorBase, uColorSlope, smoothstep(0.12, 0.62, normH));
          color = mix(color, uColorPeak, smoothstep(0.68, 1.0, normH));

          float alpha = (0.08 + 0.32 * normH) * vEdgeFade * uLineOpacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    // Create Meshes
    this.pointsMesh = new THREE.Points(this.pointsGeometry, pointsMaterial);
    this.linesMesh = new THREE.LineSegments(this.linesGeometry, linesMaterial);

    this.scene.add(this.linesMesh);
    this.scene.add(this.pointsMesh);
  }

  bindEvents() {
    this.onResize = this.handleResize.bind(this);
    this.onMouseMove = this.handleMouseMove.bind(this);
    this.onMouseLeave = this.handleMouseLeave.bind(this);
    this.onTouchMove = this.handleTouchMove.bind(this);
    this.onScroll = this.handleScroll.bind(this);

    window.addEventListener('resize', this.onResize, { passive: true });
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('mouseleave', this.onMouseLeave, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);
    this.uniforms.uPixelRatio.value = this.dpr;
    this.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  handleMouseMove(e) {
    this.mouse.isHovered = true;
    // Normalized device coordinates [-1, 1]
    this.mouseRay.x = (e.clientX / this.width) * 2 - 1;
    this.mouseRay.y = -(e.clientY / this.height) * 2 + 1;

    // Raycast against horizontal plane y=0 to find 3D ground coordinates
    this.raycaster.setFromCamera(this.mouseRay, this.camera);
    if (this.raycaster.ray.intersectPlane(this.mousePlane, this.intersectionPoint)) {
      this.mouse.targetWorldX = this.intersectionPoint.x;
      this.mouse.targetWorldZ = this.intersectionPoint.z;
    }

    this.mouse.targetX = this.mouseRay.x;
    this.mouse.targetY = this.mouseRay.y;
  }

  handleTouchMove(e) {
    if (e.touches && e.touches.length > 0) {
      this.handleMouseMove({
        clientX: e.touches[0].clientX,
        clientY: e.touches[0].clientY
      });
    }
  }

  handleMouseLeave() {
    this.mouse.isHovered = false;
    this.mouse.targetWorldX = -9999;
    this.mouse.targetWorldZ = -9999;
    this.mouse.targetX = 0;
    this.mouse.targetY = 0;
  }

  handleScroll() {
    this.scroll.target = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (!this.maxScroll || this.maxScroll <= 1) {
      this.maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    }
    this.scroll.normalized = Math.min(1, Math.max(0, this.scroll.target / this.maxScroll));
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true;
      this.lastTime = performance.now();
      this.tick();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    const delta = Math.min((now - (this.lastTime || now)) / 1000, 0.1);
    this.lastTime = now;
    const speedMultiplier = this.isReducedMotion ? 0.35 : 1.0;
    this.uniforms.uTime.value += delta * speedMultiplier;

    // Smooth Damped Mouse Lerp
    const mouseLerp = 0.08;
    this.mouse.worldX += (this.mouse.targetWorldX - this.mouse.worldX) * mouseLerp;
    this.mouse.worldZ += (this.mouse.targetWorldZ - this.mouse.worldZ) * mouseLerp;
    this.uniforms.uMouse.value.set(this.mouse.worldX, this.mouse.worldZ);

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    // Smooth Scroll Lerp
    this.scroll.current += (this.scroll.target - this.scroll.current) * 0.06;
    this.uniforms.uScroll.value = this.scroll.current;

    // Camera organic tilt and subtle scroll flight
    const scrollOffset = this.scroll.normalized;
    const targetCamX = this.mouse.x * 2.8;
    const targetCamY = this.baseCameraPos.y + this.mouse.y * 1.8 - scrollOffset * 2.2;
    const targetCamZ = this.baseCameraPos.z - scrollOffset * 4.5;

    this.camera.position.x += (targetCamX - this.camera.position.x) * 0.04;
    this.camera.position.y += (targetCamY - this.camera.position.y) * 0.04;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.04;

    this.camera.lookAt(
      this.baseCameraLookAt.x + this.mouse.x * 1.5,
      this.baseCameraLookAt.y - scrollOffset * 1.0,
      this.baseCameraLookAt.z - scrollOffset * 3.0
    );

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.tick.bind(this));
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseleave', this.onMouseLeave);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('scroll', this.onScroll);

    this.pointsGeometry?.dispose();
    this.linesGeometry?.dispose();
    this.pointsMesh?.material?.dispose();
    this.linesMesh?.material?.dispose();
    this.renderer?.dispose();
  }
}

export function initWaveBackground(canvasId = 'particleCanvas') {
  return new WaveBackgroundEngine(canvasId);
}
