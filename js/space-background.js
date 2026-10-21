/**
 * ========================================================
 * 3D SOLAR SYSTEM CINEMATIC SCROLL BACKGROUND ENGINE
 * ========================================================
 * High-Performance Three.js Space Environment:
 * - Giant Cyber Green Earth with glowing atmosphere halo & orbital rings (positioned behind Harivansh's portrait)
 * - Radiant Golden Sun with intense solar flares on the left
 * - Saturn with tilted rings & Jupiter with storm bands on the right
 * - Detailed dark cratered rocky moons
 * - 70-rock 3D procedural asteroid belt with tumble physics
 * - Glowing neon emerald orbital trajectories slicing through space
 * - 3,000-point deep starfield
 *
 * SCROLL & INTERACTION MECHANICS:
 * - Dynamic scroll flight: Camera glides through space and descends across planetary planes
 * - Multi-layered scroll parallax: Planets, rings, and asteroids tumble & rotate in sync with page scroll
 * - Subtle mouse tilt: Smooth cursor parallax when moving
 * - Zero CPU waste: Damps down and freezes render loop when neither scrolling nor moving cursor
 * ========================================================
 */

import * as THREE from 'three';

export class SpaceBackgroundEngine {
  constructor(canvasId = 'spaceCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      console.warn(`SpaceBackgroundEngine: Canvas #${canvasId} not found.`);
      return;
    }

    // Scroll Tracking with Smooth Inertia
    this.scroll = {
      target: 0,
      current: 0,
      velocity: 0,
      max: 1
    };

    // Mouse Tracking with Damped Spring
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    this.isRendering = false;
    this.hasInteracted = false;

    // HUD Elements
    this.hudReadout = document.getElementById('hudScrollReadout');
    this.hudThumb = document.getElementById('hudScrollThumb');

    // Scene & Collections
    this.planetLayers = [];
    this.asteroidMeshes = [];
    this.orbitMeshes = [];

    this.initThree();
    this.createStarfield();
    this.createSun();
    this.createCyberEarth();
    this.createSaturn();
    this.createJupiter();
    this.createRockyMoons();
    this.createAsteroidBelt();
    this.createOrbitalTrajectories();

    this.bindEvents();

    // Initial render pass
    this.updateDimensions();
    this.render();
  }

  /* --------------------------------------------------------
     1. THREE.JS INITIALIZATION & LIGHTING
     -------------------------------------------------------- */
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x090B0F, 0.0035);

    this.camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    this.cameraBasePos = new THREE.Vector3(0, 0, 80);
    this.camera.position.copy(this.cameraBasePos);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;

    // 1. Primary Warm Solar Light (From left sun shining across system)
    this.sunLight = new THREE.DirectionalLight(0xFFE5A3, 2.9);
    this.sunLight.position.set(-85, 20, 25);
    this.sunLight.target.position.set(20, -5, -40);
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

    // 2. Point Light at Sun Core
    this.sunPointLight = new THREE.PointLight(0xFFA000, 3.8, 380, 1.1);
    this.sunPointLight.position.set(-74, 16, -20);
    this.scene.add(this.sunPointLight);

    // 3. Neon Emerald Atmospheric Bounce Light (From Cyber Earth)
    this.cyberGlowLight = new THREE.PointLight(0xE1E7F0, 4.5, 200, 1.4);
    this.cyberGlowLight.position.set(18, 14, -40);
    this.scene.add(this.cyberGlowLight);

    // 4. Deep Space Ambient Light
    this.ambientLight = new THREE.AmbientLight(0x04140B, 0.5);
    this.scene.add(this.ambientLight);
  }

  /* --------------------------------------------------------
     2. PROCEDURAL TEXTURE GENERATION
     -------------------------------------------------------- */
  generateSunTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(512, 512, 80, 512, 512, 512);
    grad.addColorStop(0, '#FFFFFF');
    grad.addColorStop(0.3, '#FFF4C2');
    grad.addColorStop(0.55, '#FFB300');
    grad.addColorStop(0.8, '#FF6D00');
    grad.addColorStop(1, '#BF360C');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    const imgData = ctx.getImageData(0, 0, 1024, 1024);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 45;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n * 0.8));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.4));
    }
    ctx.putImageData(imgData, 0, 0);

    return new THREE.CanvasTexture(canvas);
  }

  generateCyberEarthTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Deep obsidian-space ocean base
    ctx.fillStyle = '#020905';
    ctx.fillRect(0, 0, 2048, 1024);

    // Global tech grid lattice
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 2048; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y < 1024; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(2048, y);
      ctx.stroke();
    }

    // Procedural continents & data islands
    ctx.fillStyle = '#062013';
    ctx.strokeStyle = '#E1E7F0';
    ctx.lineWidth = 2.5;

    for (let i = 0; i < 38; i++) {
      const cx = (i * 67 + 120) % 2048;
      const cy = (i * 43 + 80) % 1024;
      const radius = 60 + (i % 7) * 24;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glowing data nodes
      ctx.fillStyle = '#E1E7F0';
      ctx.beginPath();
      ctx.arc(cx + radius * 0.3, cy - radius * 0.2, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#062013';
    }

    // Luminous cyber data paths
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.45)';
    ctx.lineWidth = 2;
    for (let j = 0; j < 14; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * 80 + 40);
      ctx.bezierCurveTo(500, j * 80 + 10, 1500, j * 80 + 70, 2048, j * 80 + 40);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  generateSaturnTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const colors = ['#382E1E', '#786242', '#B49A6C', '#8A7250', '#D8C29D', '#64533C', '#4A3D2A'];
    for (let y = 0; y < 512; y++) {
      const colorIdx = Math.floor((y / 512) * colors.length * 3) % colors.length;
      ctx.fillStyle = colors[colorIdx];
      ctx.fillRect(0, y, 1024, 1);
    }

    return new THREE.CanvasTexture(canvas);
  }

  generateSaturnRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 0);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.15, 'rgba(180, 154, 108, 0.4)');
    grad.addColorStop(0.4, 'rgba(216, 194, 157, 0.85)');
    grad.addColorStop(0.55, 'rgba(0, 0, 0, 0.05)'); // Cassini Division Gap
    grad.addColorStop(0.65, 'rgba(200, 178, 140, 0.8)');
    grad.addColorStop(0.9, 'rgba(140, 120, 85, 0.4)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 64);

    return new THREE.CanvasTexture(canvas);
  }

  generateJupiterTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const bands = ['#2D2319', '#543D28', '#8C6843', '#BFA07A', '#6B4C2E', '#3D2A1A'];
    for (let y = 0; y < 512; y++) {
      const bIdx = Math.floor((y / 512) * 16) % bands.length;
      ctx.fillStyle = bands[bIdx];
      ctx.fillRect(0, y, 1024, 1);
    }

    // Great Red Spot
    ctx.fillStyle = '#B34A26';
    ctx.beginPath();
    ctx.ellipse(650, 320, 65, 38, 0, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  generateCraterMoonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#1D2420';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 60; i++) {
      const cx = Math.random() * 512;
      const cy = Math.random() * 512;
      const r = 4 + Math.random() * 18;

      ctx.fillStyle = '#0F1411';
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#2F3D35';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /* --------------------------------------------------------
     3. CELESTIAL BODIES CREATION
     -------------------------------------------------------- */
  createStarfield() {
    const starCount = 3000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 900;
      positions[i3 + 1] = (Math.random() - 0.5) * 900;
      positions[i3 + 2] = -120 - Math.random() * 450;

      // Color variation: 85% white, 15% cyber emerald
      if (Math.random() > 0.85) {
        colors[i3] = 0.0;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 0.64;
      } else {
        const bright = 0.6 + Math.random() * 0.4;
        colors[i3] = bright;
        colors[i3 + 1] = bright;
        colors[i3 + 2] = bright;
      }
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true
    });

    this.starField = new THREE.Points(starGeo, starMat);
    this.scene.add(this.starField);
  }

  // 1. Radiant Golden Sun (Left)
  createSun() {
    this.sunGroup = new THREE.Group();
    this.sunBasePos = new THREE.Vector3(-74, 16, -20);
    this.sunGroup.position.copy(this.sunBasePos);

    const sunGeo = new THREE.SphereGeometry(22, 48, 48);
    const sunMat = new THREE.MeshBasicMaterial({
      map: this.generateSunTexture()
    });
    this.sunMesh = new THREE.Mesh(sunGeo, sunMat);
    this.sunGroup.add(this.sunMesh);

    // Blinding Corona Glow Flare (Billboard Sprite)
    const flareCanvas = document.createElement('canvas');
    flareCanvas.width = 512;
    flareCanvas.height = 512;
    const fctx = flareCanvas.getContext('2d');
    const fgrad = fctx.createRadialGradient(256, 256, 30, 256, 256, 256);
    fgrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    fgrad.addColorStop(0.2, 'rgba(255, 224, 130, 0.85)');
    fgrad.addColorStop(0.45, 'rgba(255, 160, 0, 0.45)');
    fgrad.addColorStop(0.75, 'rgba(255, 109, 0, 0.15)');
    fgrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    fctx.fillStyle = fgrad;
    fctx.fillRect(0, 0, 512, 512);

    const flareTexture = new THREE.CanvasTexture(flareCanvas);
    const flareMaterial = new THREE.SpriteMaterial({
      map: flareTexture,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.95
    });
    this.sunFlareSprite = new THREE.Sprite(flareMaterial);
    this.sunFlareSprite.scale.set(110, 110, 1);
    this.sunGroup.add(this.sunFlareSprite);

    this.scene.add(this.sunGroup);

    this.planetLayers.push({
      obj: this.sunGroup,
      basePos: this.sunBasePos.clone(),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.15,
      scrollSpeedY: -25,
      rotationFactor: 0.12
    });
  }

  // 2. Centerpiece Cyber Green Earth (Positioned behind Harivansh's portrait)
  createCyberEarth() {
    this.earthGroup = new THREE.Group();
    // Default hero position: situated behind the right-hand portrait on desktop
    const isMobile = window.innerWidth < 768;
    this.earthBasePos = new THREE.Vector3(isMobile ? 0 : 20, 12, -45);
    this.earthGroup.position.copy(this.earthBasePos);

    // Planet Sphere
    const earthGeo = new THREE.SphereGeometry(27, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: this.generateCyberEarthTexture(),
      roughness: 0.65,
      metalness: 0.35,
      emissive: 0x00331D,
      emissiveIntensity: 0.35
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthGroup.add(this.earthMesh);

    // Glowing Emerald Atmosphere Rim (Fresnel Shader)
    const haloGeo = new THREE.SphereGeometry(27.9, 64, 64);
    const haloMat = new THREE.ShaderMaterial({
      uniforms: {
        glowColor: { value: new THREE.Color(0xE1E7F0) },
        viewVector: { value: this.camera.position }
      },
      vertexShader: `
        uniform vec3 viewVector;
        varying float intensity;
        void main() {
          vec3 vNormal = normalize(normalMatrix * normal);
          intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity * 1.9;
          gl_FragColor = vec4(glow, intensity * 0.9);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    this.earthHaloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.earthGroup.add(this.earthHaloMesh);

    // Dynamic Cyber Laser Orbital Ring around Earth
    const ringGeo = new THREE.RingGeometry(33, 34.3, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xE1E7F0,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const cyberRing = new THREE.Mesh(ringGeo, ringMat);
    cyberRing.rotation.x = Math.PI / 2.3;
    cyberRing.rotation.y = -0.3;
    this.earthGroup.add(cyberRing);

    this.scene.add(this.earthGroup);

    this.planetLayers.push({
      obj: this.earthGroup,
      basePos: this.earthBasePos.clone(),
      baseRot: new THREE.Euler(0.2, 0.4, 0),
      parallaxSpeed: 0.3,
      scrollSpeedY: -15,
      rotationFactor: 0.35
    });
  }

  // 3. Saturn Gas Giant with Rings (Right)
  createSaturn() {
    this.saturnGroup = new THREE.Group();
    this.saturnBasePos = new THREE.Vector3(58, 2, -35);
    this.saturnGroup.position.copy(this.saturnBasePos);

    const saturnGeo = new THREE.SphereGeometry(9.5, 48, 48);
    const saturnMat = new THREE.MeshStandardMaterial({
      map: this.generateSaturnTexture(),
      roughness: 0.7,
      metalness: 0.1
    });
    const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
    this.saturnGroup.add(saturnMesh);

    const ringGeo = new THREE.RingGeometry(13, 23, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      map: this.generateSaturnRingTexture(),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      roughness: 0.8
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.2;
    ringMesh.rotation.y = 0.25;
    this.saturnGroup.add(ringMesh);

    this.saturnGroup.rotation.z = 0.38;
    this.scene.add(this.saturnGroup);

    this.planetLayers.push({
      obj: this.saturnGroup,
      basePos: this.saturnBasePos.clone(),
      baseRot: new THREE.Euler(0, 0, 0.38),
      parallaxSpeed: 0.45,
      scrollSpeedY: -22,
      rotationFactor: 0.4
    });
  }

  // 4. Jupiter Gas Giant (Upper-Right)
  createJupiter() {
    this.jupiterGroup = new THREE.Group();
    this.jupiterBasePos = new THREE.Vector3(50, 32, -65);
    this.jupiterGroup.position.copy(this.jupiterBasePos);

    const jupiterGeo = new THREE.SphereGeometry(14, 48, 48);
    const jupiterMat = new THREE.MeshStandardMaterial({
      map: this.generateJupiterTexture(),
      roughness: 0.7,
      metalness: 0.1
    });
    const jupiterMesh = new THREE.Mesh(jupiterGeo, jupiterMat);
    this.jupiterGroup.add(jupiterMesh);

    this.scene.add(this.jupiterGroup);

    this.planetLayers.push({
      obj: this.jupiterGroup,
      basePos: this.jupiterBasePos.clone(),
      baseRot: new THREE.Euler(0.1, 0, 0),
      parallaxSpeed: 0.32,
      scrollSpeedY: -28,
      rotationFactor: 0.25
    });
  }

  // 5. Dark Rocky Moons
  createRockyMoons() {
    this.moonsGroup = new THREE.Group();

    const moonDefs = [
      { pos: new THREE.Vector3(-14, 34, -40), radius: 4.2, rotY: 0.2 },
      { pos: new THREE.Vector3(-32, -24, -30), radius: 6.5, rotY: 1.1 },
      { pos: new THREE.Vector3(6, -32, -35), radius: 7.5, rotY: 2.3 }
    ];

    const moonMat = new THREE.MeshStandardMaterial({
      map: this.generateCraterMoonTexture(),
      roughness: 0.9,
      metalness: 0.1,
      bumpScale: 0.08
    });

    moonDefs.forEach(def => {
      const geo = new THREE.SphereGeometry(def.radius, 32, 32);
      const mesh = new THREE.Mesh(geo, moonMat);
      mesh.position.copy(def.pos);
      mesh.rotation.y = def.rotY;
      this.moonsGroup.add(mesh);
    });

    this.scene.add(this.moonsGroup);

    this.planetLayers.push({
      obj: this.moonsGroup,
      basePos: new THREE.Vector3(0, 0, 0),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.5,
      scrollSpeedY: -35,
      rotationFactor: 0.4
    });
  }

  // 6. Realistic 70-Rock Asteroid Belt with Tumble Physics
  createAsteroidBelt() {
    this.asteroidsGroup = new THREE.Group();

    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x242D26,
      roughness: 0.88,
      metalness: 0.12,
      flatShading: true
    });

    for (let i = 0; i < 70; i++) {
      const geo = new THREE.DodecahedronGeometry(1 + Math.random() * 2.8, 1);
      const posAttr = geo.attributes.position;
      for (let j = 0; j < posAttr.count; j++) {
        const vx = posAttr.getX(j);
        const vy = posAttr.getY(j);
        const vz = posAttr.getZ(j);
        const noise = (Math.random() - 0.5) * 0.35;
        posAttr.setXYZ(j, vx * (1 + noise), vy * (1 + noise), vz * (1 + noise));
      }
      geo.computeVertexNormals();

      const rock = new THREE.Mesh(geo, asteroidMat);

      let rx, ry, rz;
      if (i < 25) {
        // Left Foreground Cluster
        rx = -45 + (Math.random() - 0.5) * 30;
        ry = -22 + (Math.random() - 0.5) * 20;
        rz = 5 + Math.random() * 25;
      } else if (i < 50) {
        // Right Foreground Cluster
        rx = 35 + (Math.random() - 0.5) * 30;
        ry = -20 + (Math.random() - 0.5) * 20;
        rz = 5 + Math.random() * 25;
      } else {
        // Deep Space Scatter
        rx = (Math.random() - 0.5) * 130;
        ry = (Math.random() - 0.5) * 90;
        rz = -10 - Math.random() * 45;
      }

      rock.position.set(rx, ry, rz);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.scale.setScalar(0.7 + Math.random() * 1.2);

      // Custom physics tumble parameters for scroll animations
      rock.userData = {
        baseY: ry,
        rotSpeedX: (Math.random() - 0.5) * 2.5,
        rotSpeedY: (Math.random() - 0.5) * 2.5,
        rotSpeedZ: (Math.random() - 0.5) * 1.5,
        driftSpeedY: 45 + Math.random() * 35
      };

      this.asteroidMeshes.push(rock);
      this.asteroidsGroup.add(rock);
    }

    this.scene.add(this.asteroidsGroup);

    this.planetLayers.push({
      obj: this.asteroidsGroup,
      basePos: new THREE.Vector3(0, 0, 0),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.85,
      scrollSpeedY: -45,
      rotationFactor: 0.5
    });
  }

  // 7. Glowing Green Orbital Trajectories
  createOrbitalTrajectories() {
    this.orbitsGroup = new THREE.Group();

    const ringConfigs = [
      { radiusX: 52, radiusY: 34, rotX: 1.1, rotZ: -0.4, color: 0xE1E7F0, opacity: 0.65 },
      { radiusX: 72, radiusY: 48, rotX: 1.25, rotZ: 0.3, color: 0xBFC7D5, opacity: 0.45 },
      { radiusX: 95, radiusY: 62, rotX: 1.05, rotZ: -0.15, color: 0x8B9BB4, opacity: 0.35 }
    ];

    ringConfigs.forEach(cfg => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        cfg.radiusX, cfg.radiusY,
        0, 2 * Math.PI,
        false,
        0
      );

      const points = curve.getPoints(120);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);

      const orbitMat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending
      });

      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = cfg.rotX;
      orbitLine.rotation.z = cfg.rotZ;

      this.orbitMeshes.push(orbitLine);
      this.orbitsGroup.add(orbitLine);
    });

    this.scene.add(this.orbitsGroup);

    this.planetLayers.push({
      obj: this.orbitsGroup,
      basePos: new THREE.Vector3(0, 0, -30),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.4,
      scrollSpeedY: -18,
      rotationFactor: 0.25
    });
  }

  /* --------------------------------------------------------
     4. EVENT LISTENERS (Scroll, Mouse, Resize)
     -------------------------------------------------------- */
  bindEvents() {
    // Scroll Listener
    const onScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      this.scroll.target = Math.min(1, Math.max(0, scrollY / this.scroll.max));
      this.startRenderLoop();
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mouse Movement
    const onMove = (clientX, clientY) => {
      this.mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;
      this.startRenderLoop();
    };

    window.addEventListener('mousemove', (e) => {
      onMove(e.clientX, e.clientY);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        onMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Resize
    window.addEventListener('resize', () => {
      this.updateDimensions();
      this.render();
    });
  }

  updateDimensions() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.scroll.max = Math.max(1, document.documentElement.scrollHeight - height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);

    // Responsive Earth positioning
    if (this.earthGroup) {
      const isMobile = width < 768;
      this.earthBasePos.x = isMobile ? 0 : 20;
    }
  }

  startRenderLoop() {
    if (!this.isRendering) {
      this.isRendering = true;
      requestAnimationFrame(() => this.tick());
    }
  }

  /* --------------------------------------------------------
     5. MAIN INTERPOLATION & RENDER TICK
     -------------------------------------------------------- */
  tick() {
    // 1. Scroll Inertia Interpolation
    const scrollDelta = this.scroll.target - this.scroll.current;
    this.scroll.velocity = scrollDelta;
    this.scroll.current += scrollDelta * 0.075;

    // 2. Mouse Interpolation
    const mouseDeltaX = this.mouse.targetX - this.mouse.x;
    const mouseDeltaY = this.mouse.targetY - this.mouse.y;
    const mouseDist = Math.hypot(mouseDeltaX, mouseDeltaY);
    this.mouse.x += mouseDeltaX * 0.055;
    this.mouse.y += mouseDeltaY * 0.055;

    const prog = this.scroll.current;
    const isScrollActive = Math.abs(scrollDelta) > 0.0001;
    const isMouseActive = mouseDist > 0.0003;

    // Update Telemetry HUD if present
    if (this.hudReadout) {
      this.hudReadout.textContent = `DEPTH ${(prog * 100).toFixed(0).padStart(2, '0')}%`;
    }
    if (this.hudThumb) {
      this.hudThumb.style.height = `${Math.max(8, prog * 100)}%`;
    }

    // 3. Cinematic Camera Progression Through Space
    // Camera gently zooms inward and pans down as you descend through portfolio sections
    const cameraSwoopZ = Math.sin(prog * Math.PI * 0.8) * 18;
    this.camera.position.x = this.mouse.x * 6 + Math.sin(prog * Math.PI) * 10;
    this.camera.position.y = this.mouse.y * 4 - prog * 28;
    this.camera.position.z = 80 - cameraSwoopZ;

    // LookAt follows space voyage progression
    this.camera.lookAt(
      prog * 12 + this.mouse.x * 2,
      -prog * 24 - this.mouse.y * 1.5,
      -30
    );

    // 4. Planets Multi-Layer Parallax & Axial Spins on Scroll
    this.planetLayers.forEach(layer => {
      // Position Parallax (Scroll descent + subtle mouse tracking)
      layer.obj.position.x = layer.basePos.x + this.mouse.x * layer.parallaxSpeed * 12;
      layer.obj.position.y = layer.basePos.y + (layer.scrollSpeedY * prog) + this.mouse.y * layer.parallaxSpeed * 8;

      // Axial Rotation proportional to scroll + cursor
      layer.obj.rotation.y = layer.baseRot.y + (prog * Math.PI * 1.8) + this.mouse.x * layer.rotationFactor;
      layer.obj.rotation.x = layer.baseRot.x + (prog * 0.3) - this.mouse.y * (layer.rotationFactor * 0.5);
    });

    // 5. High-Speed Asteroid Tumble Physics on Scroll
    const tumbleMultiplier = Math.abs(this.scroll.velocity) * 80 + 0.002;
    this.asteroidMeshes.forEach(rock => {
      rock.rotation.x += rock.userData.rotSpeedX * tumbleMultiplier;
      rock.rotation.y += rock.userData.rotSpeedY * tumbleMultiplier;
      rock.rotation.z += rock.userData.rotSpeedZ * tumbleMultiplier;
      rock.position.y = rock.userData.baseY + prog * rock.userData.driftSpeedY;
    });

    // 6. Orbital Trajectory dynamic tilt on scroll
    if (this.orbitsGroup) {
      this.orbitsGroup.rotation.z = prog * 0.65;
      this.orbitsGroup.rotation.y = prog * 0.45;
    }

    // 7. Sun Flare dynamic pulse on fast scroll
    if (this.sunFlareSprite) {
      const flarePulse = 110 + Math.abs(this.scroll.velocity) * 80;
      this.sunFlareSprite.scale.set(flarePulse, flarePulse, 1);
    }

    this.render();

    // ONLY continue animating if scrolling or moving mouse; freeze completely when settled
    if (isScrollActive || isMouseActive) {
      requestAnimationFrame(() => this.tick());
    } else {
      // Snap cleanly
      this.scroll.current = this.scroll.target;
      this.mouse.x = this.mouse.targetX;
      this.mouse.y = this.mouse.targetY;
      this.isRendering = false;
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

/**
 * Initialize and mount the space background engine
 */
export function initSpaceBackground(canvasId = 'spaceCanvas') {
  return new SpaceBackgroundEngine(canvasId);
}
