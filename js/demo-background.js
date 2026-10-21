/**
 * ========================================================
 * 3D SOLAR SYSTEM HERO BACKGROUND DEMO
 * ========================================================
 * Procedural Three.js cinematic space environment matching
 * the reference image:
 * - Giant Cyber Green Earth with glowing atmosphere & rings
 * - Radiant Golden Sun with solar flares on the left
 * - Saturn with tilted rings & Jupiter with cloud bands
 * - Dark cratered rocky moons & floating asteroid belts
 * - Glowing neon emerald orbital trajectories
 *
 * CRITICAL INTERACTION RULE:
 * - Smooth cinematic parallax ONLY on mouse movement
 * - COMPLETELY STILL when mouse is idle (zero auto-rotation)
 */

import * as THREE from 'three';

class SpaceDemoScene {
  constructor() {
    this.canvas = document.getElementById('spaceCanvas');
    if (!this.canvas) return;

    // Movement Tracking
    this.mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };
    this.isRendering = false;
    this.hasInteracted = false;

    // HUD Elements
    this.statusBeacon = document.getElementById('statusBeacon');
    this.statusText = document.getElementById('statusText');
    this.telemetryDelta = document.getElementById('telemetryDelta');
    this.telemetryCoords = document.getElementById('telemetryCoords');
    this.centerGuide = document.getElementById('centerGuide');

    // Scene & Layers Containers
    this.planetLayers = [];
    this.asteroids = [];
    this.orbits = [];

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

    // Render initial still frame
    this.render();
  }

  /* --------------------------------------------------------
     1. THREE.JS INITIALIZATION & CINEMATIC LIGHTING
     -------------------------------------------------------- */
  initThree() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x090B0F, 0.004);

    this.camera = new THREE.PerspectiveCamera(
      46,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 80);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // 1. Primary Warm Solar Light (From left sun shining across the system)
    this.sunLight = new THREE.DirectionalLight(0xFFE5A3, 2.8);
    this.sunLight.position.set(-85, 20, 25);
    this.sunLight.target.position.set(20, -5, -40);
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

    // 2. Point light at Sun Core
    this.sunPointLight = new THREE.PointLight(0xFFA000, 3.5, 350, 1.1);
    this.sunPointLight.position.set(-78, 16, -18);
    this.scene.add(this.sunPointLight);

    // 3. Neon Emerald Atmospheric Bounce Light (From Cyber Earth)
    this.cyberGlowLight = new THREE.PointLight(0xE1E7F0, 4.2, 180, 1.4);
    this.cyberGlowLight.position.set(18, 14, -40);
    this.scene.add(this.cyberGlowLight);

    // 4. Subtle Deep-Space Ambient Light (So shadow sides remain visible & deep)
    this.ambientLight = new THREE.AmbientLight(0x04120A, 0.45);
    this.scene.add(this.ambientLight);
  }

  /* --------------------------------------------------------
     2. PROCEDURAL TEXTURE GENERATORS (High Precision)
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

    // Solar Granulation Noise
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

    for (let i = 0; i < 35; i++) {
      const cx = (i * 67 + 120) % 2048;
      const cy = (i * 43 + 80) % 1024;
      const radius = 60 + (i % 7) * 22;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glowing data nodes
      ctx.fillStyle = '#E1E7F0';
      ctx.beginPath();
      ctx.arc(cx + radius * 0.3, cy - radius * 0.2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#062013';
    }

    // Luminous cyber data paths
    ctx.strokeStyle = 'rgba(139, 155, 180, 0.45)';
    ctx.lineWidth = 2;
    for (let j = 0; j < 12; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * 90 + 50);
      ctx.bezierCurveTo(500, j * 90 + 20, 1500, j * 90 + 80, 2048, j * 90 + 50);
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  generateSaturnTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Horizontal banded gas giant clouds
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
      const idx = Math.floor((y / 512) * bands.length * 4) % bands.length;
      ctx.fillStyle = bands[idx];
      ctx.fillRect(0, y, 1024, 1);
    }

    // Great Red Storm
    ctx.fillStyle = '#A84B29';
    ctx.beginPath();
    ctx.ellipse(650, 320, 60, 35, -0.15, 0, Math.PI * 2);
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
  }

  generateCraterMoonTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#181F1A';
    ctx.fillRect(0, 0, 512, 512);

    // Craters
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = 8 + Math.random() * 24;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#0E1410';
      ctx.fill();
      ctx.strokeStyle = '#2D3830';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    return new THREE.CanvasTexture(canvas);
  }

  /* --------------------------------------------------------
     3. SOLAR SYSTEM OBJECTS CREATION
     -------------------------------------------------------- */

  // 1. Radiant Left Sun
  createSun() {
    this.sunGroup = new THREE.Group();
    this.sunBasePos = new THREE.Vector3(-74, 16, -20);
    this.sunGroup.position.copy(this.sunBasePos);

    // Sun Sphere
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
    const flareSprite = new THREE.Sprite(flareMaterial);
    flareSprite.scale.set(110, 110, 1);
    this.sunGroup.add(flareSprite);

    this.scene.add(this.sunGroup);

    // Register for parallax tracking
    this.planetLayers.push({
      obj: this.sunGroup,
      basePos: this.sunBasePos.clone(),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.12,
      rotationFactor: 0.1
    });
  }

  // 2. Centerpiece Cyber Green Earth
  createCyberEarth() {
    this.earthGroup = new THREE.Group();
    this.earthBasePos = new THREE.Vector3(18, 14, -45);
    this.earthGroup.position.copy(this.earthBasePos);

    // Planet Sphere
    const earthGeo = new THREE.SphereGeometry(26, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: this.generateCyberEarthTexture(),
      roughness: 0.65,
      metalness: 0.35,
      emissive: 0x00331D,
      emissiveIntensity: 0.3
    });
    this.earthMesh = new THREE.Mesh(earthGeo, earthMat);
    this.earthGroup.add(this.earthMesh);

    // Glowing Emerald Atmosphere Rim (Fresnel Halo)
    const haloGeo = new THREE.SphereGeometry(26.8, 64, 64);
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
          vec3 vNormel = normalize(normalMatrix * viewVector);
          intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.2);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying float intensity;
        void main() {
          vec3 glow = glowColor * intensity * 1.8;
          gl_FragColor = vec4(glow, intensity * 0.85);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    this.earthGroup.add(haloMesh);

    // Dynamic Cyber Laser Orbital Ring around Earth
    const ringGeo = new THREE.RingGeometry(32, 33.2, 80);
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
      parallaxSpeed: 0.28,
      rotationFactor: 0.35
    });
  }

  // 3. Saturn Gas Giant with Rings (Middle-Right)
  createSaturn() {
    this.saturnGroup = new THREE.Group();
    this.saturnBasePos = new THREE.Vector3(58, 2, -35);
    this.saturnGroup.position.copy(this.saturnBasePos);

    // Planet Body
    const saturnGeo = new THREE.SphereGeometry(9.5, 48, 48);
    const saturnMat = new THREE.MeshStandardMaterial({
      map: this.generateSaturnTexture(),
      roughness: 0.7,
      metalness: 0.1
    });
    const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
    this.saturnGroup.add(saturnMesh);

    // Saturn Rings
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

    this.saturnGroup.rotation.z = 0.38; // Realistic planetary axial tilt

    this.scene.add(this.saturnGroup);

    this.planetLayers.push({
      obj: this.saturnGroup,
      basePos: this.saturnBasePos.clone(),
      baseRot: new THREE.Euler(0, 0, 0.38),
      parallaxSpeed: 0.45,
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
      rotationFactor: 0.4
    });
  }

  // 6. Realistic Asteroid Belt (Foreground & Midground Rocks)
  createAsteroidBelt() {
    this.asteroidsGroup = new THREE.Group();

    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x242D26,
      roughness: 0.88,
      metalness: 0.12,
      flatShading: true
    });

    // 70 Asteroids distributed like in reference image
    for (let i = 0; i < 70; i++) {
      const geo = new THREE.DodecahedronGeometry(1 + Math.random() * 2.8, 1);

      // Random vertex displacement for realistic jagged rocky surface
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

      // Clusters: Left-Foreground, Right-Foreground, and Midground scatter
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
        rx = (Math.random() - 0.5) * 120;
        ry = (Math.random() - 0.5) * 80;
        rz = -10 - Math.random() * 40;
      }

      rock.position.set(rx, ry, rz);
      rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      rock.scale.setScalar(0.7 + Math.random() * 1.2);

      this.asteroidsGroup.add(rock);
    }

    this.scene.add(this.asteroidsGroup);

    // Foreground asteroids have strongest parallax depth
    this.planetLayers.push({
      obj: this.asteroidsGroup,
      basePos: new THREE.Vector3(0, 0, 0),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.85,
      rotationFactor: 0.5
    });
  }

  // 7. Glowing Green Orbital Trajectories
  createOrbitalTrajectories() {
    this.orbitsGroup = new THREE.Group();

    const ringConfigs = [
      { radiusX: 52, radiusY: 34, rotX: 1.1, rotZ: -0.4, color: 0xE1E7F0, opacity: 0.65 },
      { radiusX: 72, radiusY: 48, rotX: 1.25, rotZ: 0.3, color: 0xBFC7D5, opacity: 0.45 },
      { radiusX: 95, radiusY: 60, rotX: 0.95, rotZ: -0.15, color: 0x8B9BB4, opacity: 0.35 }
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
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending
      });

      const ellipse = new THREE.Line(geometry, material);
      ellipse.rotation.x = cfg.rotX;
      ellipse.rotation.z = cfg.rotZ;
      ellipse.position.set(12, 10, -45);
      this.orbitsGroup.add(ellipse);
    });

    this.scene.add(this.orbitsGroup);

    this.planetLayers.push({
      obj: this.orbitsGroup,
      basePos: new THREE.Vector3(0, 0, 0),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.22,
      rotationFactor: 0.15
    });
  }

  // 8. Multi-Layered Starfield
  createStarfield() {
    const starCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color(0xFFFFFF), // Cool white
      new THREE.Color(0xE1E7F0), // Neon emerald
      new THREE.Color(0x8B9BB4), // Cyber cyan
      new THREE.Color(0xFFE5A3)  // Warm solar gold
    ];

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 350;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
      positions[i * 3 + 2] = -50 - Math.random() * 250;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.stars = new THREE.Points(geometry, starMaterial);
    this.scene.add(this.stars);

    this.planetLayers.push({
      obj: this.stars,
      basePos: new THREE.Vector3(0, 0, 0),
      baseRot: new THREE.Euler(0, 0, 0),
      parallaxSpeed: 0.08,
      rotationFactor: 0.05
    });
  }

  /* --------------------------------------------------------
     4. MOUSE PARALLAX & IDLE ZERO-MOVEMENT LOOP
     -------------------------------------------------------- */
  bindEvents() {
    const onMove = (clientX, clientY) => {
      this.mouse.targetX = (clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(clientY / window.innerHeight) * 2 + 1;

      if (!this.hasInteracted) {
        this.hasInteracted = true;
        this.centerGuide?.classList.add('dimmed');
      }

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

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.render();
    });

    const recenterBtn = document.getElementById('recenterBtn');
    if (recenterBtn) {
      recenterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.mouse.targetX = 0;
        this.mouse.targetY = 0;
        this.startRenderLoop();
      });
    }
  }

  startRenderLoop() {
    if (!this.isRendering) {
      this.isRendering = true;
      this.updateHUDStatus(true);
      requestAnimationFrame(() => this.tick());
    }
  }

  updateHUDStatus(isMoving) {
    if (this.statusBeacon) {
      if (isMoving) {
        this.statusBeacon.classList.remove('idle');
      } else {
        this.statusBeacon.classList.add('idle');
      }
    }
    if (this.statusText) {
      this.statusText.innerHTML = isMoving
        ? 'Status: <span>Active (Parallax Moving)</span>'
        : 'Status: <span>Idle (Completely Still)</span>';
    }
  }

  tick() {
    const dx = this.mouse.targetX - this.mouse.x;
    const dy = this.mouse.targetY - this.mouse.y;
    const dist = Math.hypot(dx, dy);

    // Telemetry updates
    if (this.telemetryDelta) {
      this.telemetryDelta.textContent = (dist * 100).toFixed(2) + '%';
    }
    if (this.telemetryCoords) {
      this.telemetryCoords.textContent = `X: ${this.mouse.x.toFixed(3)} | Y: ${this.mouse.y.toFixed(3)}`;
    }

    // ONLY continue animating if mouse is currently interpolating to new position
    if (dist > 0.0003) {
      // Smooth cinematic damping
      this.mouse.x += dx * 0.045;
      this.mouse.y += dy * 0.045;

      // Camera gentle perspective shift
      this.camera.position.x = this.mouse.x * 6;
      this.camera.position.y = this.mouse.y * 4;
      this.camera.lookAt(0, 0, -25);

      // Move each planet layer based strictly on mouse coordinates and individual depth
      this.planetLayers.forEach(layer => {
        // Position parallax
        layer.obj.position.x = layer.basePos.x + this.mouse.x * layer.parallaxSpeed * 15;
        layer.obj.position.y = layer.basePos.y + this.mouse.y * layer.parallaxSpeed * 10;

        // Subtle axial tilt/rotation strictly driven by cursor position (NO auto-rotation)
        layer.obj.rotation.y = layer.baseRot.y + this.mouse.x * layer.rotationFactor;
        layer.obj.rotation.x = layer.baseRot.x - this.mouse.y * (layer.rotationFactor * 0.6);
      });

      this.render();
      requestAnimationFrame(() => this.tick());
    } else {
      // SETTLED! Snap exactly to target and STOP ANIMATING COMPLETELY
      this.mouse.x = this.mouse.targetX;
      this.mouse.y = this.mouse.targetY;

      this.camera.position.x = this.mouse.x * 6;
      this.camera.position.y = this.mouse.y * 4;
      this.camera.lookAt(0, 0, -25);

      this.planetLayers.forEach(layer => {
        layer.obj.position.x = layer.basePos.x + this.mouse.x * layer.parallaxSpeed * 15;
        layer.obj.position.y = layer.basePos.y + this.mouse.y * layer.parallaxSpeed * 10;
        layer.obj.rotation.y = layer.baseRot.y + this.mouse.x * layer.rotationFactor;
        layer.obj.rotation.x = layer.baseRot.x - this.mouse.y * (layer.rotationFactor * 0.6);
      });

      this.render();

      // ZERO MOVEMENT: Freeze render loop
      this.isRendering = false;
      this.updateHUDStatus(false);
      if (this.telemetryDelta) this.telemetryDelta.textContent = '0.00% (STILL)';
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new SpaceDemoScene();
});
