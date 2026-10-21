/**
 * ========================================================
 * 3D FUTURISTIC HOLOGRAPHIC GLOBE ENGINE
 * Geographically Flawless Earth World Globe (Silver, White & Black)
 * - 9,509 high-density continental dots from Natural Earth 50m dataset
 * - Crisp, recognizable Earth continents: Americas, Europe, Africa, Asia, India, Australia
 * - Proper Three.js depth buffer & rendering order (solid dark core + radiant front dots)
 * - Atmospheric Fresnel rim shader for soft luminous silver/white limb glow
 * - Sleek 3D orbital trajectory rings with glowing white waypoint nodes
 * - Traveling data packet pulses along curved intercontinental bezier arcs
 * - Pure white horizon flare burst at the pedestal base
 * - Concentric holographic pedestal rings on the floor plane
 * - Interactive 3D mouse parallax tilt & continuous organic planetary rotation
 * - IntersectionObserver lifecycle for 0% CPU consumption off-screen
 * ========================================================
 */

import * as THREE from 'three';
import { LAND_POINTS, OCEAN_POINTS } from './world-data.js';

export class ContactGlobe {
  constructor(canvasId = 'contactGlobeCanvas', wrapperId = 'contactGlobeWrapper') {
    this.canvas = document.getElementById(canvasId);
    this.wrapper = document.getElementById(wrapperId);

    if (!this.canvas || !this.wrapper) {
      console.warn('ContactGlobe: Canvas or wrapper element not found.');
      return;
    }

    this.isRunning = false;
    this.isVisible = true;
    this.reqId = null;
    this.time = 0;

    // Mouse coordinates (smoothed parallax)
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    // Globe Radius
    this.radius = 138;

    this.initScene();
    this.buildGlobe();
    this.setupEvents();
    this.start();
  }

  initScene() {
    this.width = this.wrapper.clientWidth || 560;
    this.height = this.wrapper.clientHeight || 560;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1200);
    this.camera.position.set(0, 10, 420);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // Rotating globe core group
    this.globeGroup = new THREE.Group();
    this.mainGroup.add(this.globeGroup);

    // Natural Earth axial tilt (approx 20°)
    this.globeGroup.rotation.z = 0.22;
    this.globeGroup.rotation.x = 0.12;
  }

  createPointTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(240, 245, 255, 0.95)');
    grad.addColorStop(0.6, 'rgba(200, 215, 235, 0.6)');
    grad.addColorStop(0.85, 'rgba(140, 160, 185, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(canvas);
  }

  createFlareTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 32, 0, 128, 32, 128);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.2, 'rgba(225, 235, 250, 0.95)');
    grad.addColorStop(0.5, 'rgba(180, 195, 215, 0.55)');
    grad.addColorStop(0.75, 'rgba(100, 115, 135, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 64);

    return new THREE.CanvasTexture(canvas);
  }

  createBeaconTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(235, 242, 255, 0.95)');
    grad.addColorStop(0.5, 'rgba(190, 205, 225, 0.6)');
    grad.addColorStop(0.75, 'rgba(130, 150, 175, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(canvas);
  }

  buildGlobe() {
    const radius = this.radius;

    // 1. Dark Occlusion Core Sphere (Opaque so back-side points are masked cleanly)
    const coreGeo = new THREE.SphereGeometry(radius * 0.99, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x05070a,
      depthWrite: true,
      depthTest: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.renderOrder = 0;
    this.globeGroup.add(coreMesh);

    // 2. Atmospheric Fresnel Rim Glow (Silver / Platinum Halo around the limb)
    const atmoGeo = new THREE.SphereGeometry(radius * 1.018, 48, 48);
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(0xe1e7f0) }
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vNormal;
        void main() {
          float rim = pow(1.0 - abs(vNormal.z), 3.2);
          gl_FragColor = vec4(uColor, rim * 0.85);
        }
      `,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    atmoMesh.renderOrder = 1;
    this.globeGroup.add(atmoMesh);

    // 3. High-Precision Continental Points (Natural Earth 50m - 9,509 Points)
    const pointTexture = this.createPointTexture();

    const positions = [];
    const colors = [];
    const sizes = [];

    // Add Land Points
    const landCount = LAND_POINTS.length / 3;
    for (let i = 0; i < landCount; i++) {
      const idx = i * 3;
      const x = LAND_POINTS[idx] * radius;
      const y = LAND_POINTS[idx + 1] * radius;
      const z = LAND_POINTS[idx + 2] * radius;

      positions.push(x, y, z);

      // Silver & Crisp White palette
      const rnd = Math.random();
      if (rnd > 0.45) {
        // Pure White highlight
        colors.push(1.0, 1.0, 1.0);
        sizes.push(3.4 + Math.random() * 0.8);
      } else if (rnd > 0.15) {
        // Bright Platinum Silver (#E1E7F0)
        colors.push(0.90, 0.93, 0.97);
        sizes.push(2.9 + Math.random() * 0.5);
      } else {
        // Soft Metallic Silver-Grey (#BFC7D5)
        colors.push(0.78, 0.82, 0.88);
        sizes.push(2.4);
      }
    }

    // Add Ocean Coordinate Grid Points (Subtle translucent grey)
    const oceanCount = OCEAN_POINTS.length / 3;
    for (let i = 0; i < oceanCount; i++) {
      const idx = i * 3;
      positions.push(
        OCEAN_POINTS[idx] * radius,
        OCEAN_POINTS[idx + 1] * radius,
        OCEAN_POINTS[idx + 2] * radius
      );
      colors.push(0.18, 0.22, 0.28);
      sizes.push(1.3);
    }

    const dotGeometry = new THREE.BufferGeometry();
    dotGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    dotGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    dotGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));

    const dotMaterial = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      map: pointTexture,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.globePoints = new THREE.Points(dotGeometry, dotMaterial);
    this.globePoints.renderOrder = 2;
    this.globeGroup.add(this.globePoints);

    // 4. Orbital Trajectories, Waypoint Beacons & Base System
    this.createOrbitalSystem();
    this.createConnectingArcs();
    this.createPedestalAndFlare();
    this.createCosmicDust();
  }

  createOrbitalSystem() {
    this.orbitGroup = new THREE.Group();
    this.orbitGroup.renderOrder = 3;
    this.mainGroup.add(this.orbitGroup);

    const beaconTex = this.createBeaconTexture();
    this.beacons = [];

    const buildRing = (radiusX, radiusZ, tiltX, tiltY, tiltZ, colorHex, opacityVal, speedVal) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.x = tiltX;
      ringGroup.rotation.y = tiltY;
      ringGroup.rotation.z = tiltZ;
      this.orbitGroup.add(ringGroup);

      const segments = 120;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * radiusX, 0, Math.sin(theta) * radiusZ));
      }

      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: opacityVal,
        blending: THREE.AdditiveBlending
      });
      const line = new THREE.Line(geo, mat);
      ringGroup.add(line);

      return { group: ringGroup, radiusX, radiusZ, speed: speedVal };
    };

    // Sleek, delicate orbital trajectories
    this.ring1Data = buildRing(185, 180, Math.PI * 0.38, Math.PI * 0.14, -Math.PI * 0.18, 0xe1e7f0, 0.38, 0.16);
    this.ring2Data = buildRing(208, 200, -Math.PI * 0.32, -Math.PI * 0.12, Math.PI * 0.28, 0x94a3b8, 0.28, -0.12);
    this.ring3Data = buildRing(232, 224, Math.PI * 0.18, -Math.PI * 0.25, Math.PI * 0.42, 0x64748b, 0.22, 0.09);

    const addBeaconToRing = (ringData, initialAngle, size = 18) => {
      const beaconContainer = new THREE.Group();
      ringData.group.add(beaconContainer);

      // Core pure white sphere
      const coreGeo = new THREE.SphereGeometry(3.0, 16, 16);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        blending: THREE.AdditiveBlending
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      beaconContainer.add(coreMesh);

      // Silver-white radial aura sprite
      const spriteMat = new THREE.SpriteMaterial({
        map: beaconTex,
        color: 0xe1e7f0,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(size, size, 1);
      beaconContainer.add(sprite);

      this.beacons.push({
        container: beaconContainer,
        ringData,
        angle: initialAngle
      });
    };

    // Beacons on Ring 1
    addBeaconToRing(this.ring1Data, 0.4, 22);
    addBeaconToRing(this.ring1Data, 1.8, 26);
    addBeaconToRing(this.ring1Data, 3.6, 18);
    addBeaconToRing(this.ring1Data, 5.2, 20);

    // Beacons on Ring 2
    addBeaconToRing(this.ring2Data, 0.8, 20);
    addBeaconToRing(this.ring2Data, 2.5, 24);
    addBeaconToRing(this.ring2Data, 4.7, 16);

    // Outer Beacon
    addBeaconToRing(this.ring3Data, 1.2, 18);
  }

  createConnectingArcs() {
    this.arcsGroup = new THREE.Group();
    this.arcsGroup.renderOrder = 3;
    this.globeGroup.add(this.arcsGroup);

    const toVec = (lat, lon, alt = 1.0) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = lon * (Math.PI / 180);
      const r = this.radius * alt;
      const r_xz = r * Math.sin(phi);
      return new THREE.Vector3(
        r_xz * Math.sin(theta),
        r * Math.cos(phi),
        r_xz * Math.cos(theta)
      );
    };

    // Major data conduits (Americas -> Europe, Europe -> India, India -> East Asia)
    const arcPairs = [
      { from: [40, -74], to: [51, 0], midAlt: 1.34 },    // NY to London
      { from: [51, 0], to: [28, 77], midAlt: 1.40 },     // London to Delhi
      { from: [28, 77], to: [35, 139], midAlt: 1.36 }    // Delhi to Tokyo
    ];

    this.arcPhotons = [];
    const photonTex = this.createBeaconTexture();

    arcPairs.forEach((pair) => {
      const v0 = toVec(pair.from[0], pair.from[1], 1.0);
      const v1 = toVec(pair.to[0], pair.to[1], 1.0);

      const vMid = v0.clone().add(v1).multiplyScalar(0.5);
      vMid.normalize().multiplyScalar(this.radius * pair.midAlt);

      const curve = new THREE.QuadraticBezierCurve3(v0, vMid, v1);
      const curvePoints = curve.getPoints(45);

      const curveGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: 0xe1e7f0,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      this.arcsGroup.add(arcLine);

      const pMat = new THREE.SpriteMaterial({
        map: photonTex,
        color: 0xffffff,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const photon = new THREE.Sprite(pMat);
      photon.scale.set(12, 12, 1);
      this.arcsGroup.add(photon);

      this.arcPhotons.push({
        sprite: photon,
        curve,
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.003
      });
    });
  }

  createPedestalAndFlare() {
    this.pedestalGroup = new THREE.Group();
    this.pedestalGroup.position.set(0, -145, 0);
    this.pedestalGroup.renderOrder = 3;
    this.mainGroup.add(this.pedestalGroup);

    // Concentric Base Rings in Silver / Charcoal
    const ringConfigs = [
      { r: 135, color: 0xe1e7f0, opacity: 0.55 },
      { r: 180, color: 0x94a3b8, opacity: 0.38 },
      { r: 235, color: 0x64748b, opacity: 0.25 },
      { r: 300, color: 0x334155, opacity: 0.15 }
    ];

    ringConfigs.forEach(cfg => {
      const segments = 100;
      const pts = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * cfg.r, 0, Math.sin(theta) * cfg.r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: cfg.opacity,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Line(geo, mat);
      this.pedestalGroup.add(ring);
    });

    // Radiant Horizon Flare (Pure White / Platinum)
    const flareTex = this.createFlareTexture();
    const flareMat = new THREE.SpriteMaterial({
      map: flareTex,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    this.horizonFlare = new THREE.Sprite(flareMat);
    this.horizonFlare.scale.set(280, 38, 1);
    this.horizonFlare.position.set(0, 10, 15);
    this.pedestalGroup.add(this.horizonFlare);

    const puddleMat = new THREE.SpriteMaterial({
      map: flareTex,
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const puddle = new THREE.Sprite(puddleMat);
    puddle.scale.set(190, 28, 1);
    puddle.position.set(0, 5, 5);
    this.pedestalGroup.add(puddle);
  }

  createCosmicDust() {
    const dustCount = 180;
    const dustPositions = [];
    const dustColors = [];

    for (let i = 0; i < dustCount; i++) {
      const dist = 160 + Math.random() * 160;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const sinPhi = Math.sin(phi);

      dustPositions.push(
        dist * sinPhi * Math.cos(theta),
        dist * sinPhi * Math.sin(theta),
        dist * Math.cos(phi)
      );

      const isBright = Math.random() > 0.65;
      if (isBright) {
        dustColors.push(1.0, 1.0, 1.0);
      } else {
        dustColors.push(0.65, 0.70, 0.78);
      }
    }

    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.Float32BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 2.2,
      map: this.createPointTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.dustPoints = new THREE.Points(dustGeo, dustMat);
    this.dustPoints.renderOrder = 3;
    this.mainGroup.add(this.dustPoints);
  }

  setupEvents() {
    this.onMouseMove = (e) => {
      const rect = this.wrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      this.mouse.targetX = x * 0.38;
      this.mouse.targetY = y * 0.28;
    };
    this.wrapper.addEventListener('mousemove', this.onMouseMove, { passive: true });

    this.onMouseLeave = () => {
      this.mouse.targetX = 0;
      this.mouse.targetY = 0;
    };
    this.wrapper.addEventListener('mouseleave', this.onMouseLeave, { passive: true });

    this.onResize = () => {
      if (!this.wrapper) return;
      this.width = this.wrapper.clientWidth || 560;
      this.height = this.wrapper.clientHeight || 560;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    };
    window.addEventListener('resize', this.onResize, { passive: true });

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    this.observer.observe(this.wrapper);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    let lastTime = performance.now();

    const animate = (now) => {
      this.reqId = requestAnimationFrame(animate);

      if (!this.isVisible) return;

      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      this.time += delta;

      // 1. Organic Planetary Rotation (West to East)
      if (this.globeGroup) {
        this.globeGroup.rotation.y += 0.16 * delta;
      }

      // 2. Cosmic Dust Gentle Drift
      if (this.dustPoints) {
        this.dustPoints.rotation.y += 0.04 * delta;
        this.dustPoints.rotation.x += 0.02 * delta;
      }

      // 3. Orbital Trajectory Revolutions & Beacons
      if (this.beacons && this.beacons.length) {
        this.beacons.forEach(b => {
          b.angle += b.ringData.speed * delta;
          const x = Math.cos(b.angle) * b.ringData.radiusX;
          const z = Math.sin(b.angle) * b.ringData.radiusZ;
          b.container.position.set(x, 0, z);
        });
      }

      // 4. Data Conduit Pulses
      if (this.arcPhotons && this.arcPhotons.length) {
        this.arcPhotons.forEach(ap => {
          ap.progress += ap.speed;
          if (ap.progress > 1.0) ap.progress = 0.0;
          const pt = ap.curve.getPoint(ap.progress);
          ap.sprite.position.copy(pt);
        });
      }

      // 5. Horizon Flare Soft Radiant Pulsing
      if (this.horizonFlare) {
        const pulse = 1.0 + Math.sin(this.time * 2.8) * 0.07;
        this.horizonFlare.scale.set(280 * pulse, 38 * pulse, 1);
      }

      // 6. Pedestal Rings Micro-rotation
      if (this.pedestalGroup) {
        this.pedestalGroup.rotation.y += 0.05 * delta;
      }

      // 7. Interactive Mouse Parallax Smoothing
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

      if (this.mainGroup) {
        this.mainGroup.rotation.y = this.mouse.x * 0.55;
        this.mainGroup.rotation.x = -this.mouse.y * 0.4;
      }

      this.renderer.render(this.scene, this.camera);
    };

    this.reqId = requestAnimationFrame(animate);
  }

  destroy() {
    this.isRunning = false;
    if (this.reqId) cancelAnimationFrame(this.reqId);
    if (this.observer) this.observer.disconnect();
    window.removeEventListener('resize', this.onResize);
    if (this.wrapper) {
      this.wrapper.removeEventListener('mousemove', this.onMouseMove);
      this.wrapper.removeEventListener('mouseleave', this.onMouseLeave);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}

export function initContactGlobe() {
  const canvas = document.getElementById('contactGlobeCanvas');
  const wrapper = document.getElementById('contactGlobeWrapper');
  if (!canvas || !wrapper) return null;
  return new ContactGlobe('contactGlobeCanvas', 'contactGlobeWrapper');
}
