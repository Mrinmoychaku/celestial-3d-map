/**
 * SOLIS-IX · CELESTIAL BLUEPRINT
 * Master Production Specification v2.0 - 3D Simulation Engine
 * Fully featured with:
 * 1. Command Palette (⌘K / Ctrl+K) fuzzy navigation
 * 2. Simulation Clock (T+ sim-days, epoch Gregorian date, time-scale)
 * 3. Planet Size Silhouette Comparison Overlay (◐ SCALE)
 * 4. Orbital Trail Ghosting with fading alpha
 * 5. Cinematic Camera Modes (Free, Orbit-Lock, Orrery, Fly-by)
 * 6. Screenshot Export (⤓ CAPTURE) with astrometric watermark
 * 7. URL State Sharing via hash
 * 8. Comprehensive Keyboard Shortcuts
 * 9. Gravitational Wave Pulses radiating from Solis every 8s
 * 10. Comet System (Halcyon-C) with dual ion/dust tails
 * 11. Procedural Nebula Backdrop Skybox
 * 12. 12 Constellations 3D Overlay
 * 13. Space Weather Events (Solar Flares & coronal bursts)
 * 14. Thermal Imaging False-Color Infrared Mode
 * 15. Astrometric Telemetry JSON Export
 * 16. Full Persistence Layer (localStorage solisix.*)
 * 17. Performance Monitor (FPS, Draw Calls, Triangles, Memory)
 * 18. Rock-solid Zero-Drift Camera Tracking & Highlighting
 */

class CelestialSimulation {
  constructor() {
    this.container = document.getElementById('webgl-container');
    this.hudContainer = document.getElementById('hud-overlay');
    this.svgLinesContainer = document.getElementById('hud-svg-lines');

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;

    this.planets = [];
    this.moons = [];
    this.orbitMeshes = [];
    this.orbitPulses = [];
    this.asteroidBelt = null;
    this.gridGroup = null;
    this.solarWindParticles = null;
    this.nebulaClouds = [];

    // Focus Highlighting & Tracking
    this.focusSpotlight = null;
    this.selectionReticle = null;
    this.lastTrackedTargetPos = null;

    // Simulation Clock & State
    this.time = 0;
    this.simTimeDays = 0;
    this.timeScale = parseFloat(localStorage.getItem('solisix.speed')) || 1.0;
    this.isPlaying = true;
    this.currentLanguage = localStorage.getItem('solisix.lang') || 'bn';
    this.selectedBody = null;
    this.isTracking = false;
    this.isAutoTouring = false;
    this.tourIndex = 0;
    this.tourTimer = 0;

    // Camera animation state & modes
    this.cameraAnimation = null;
    this.defaultCameraPos = new THREE.Vector3(0, 85, 135);
    this.defaultTarget = new THREE.Vector3(0, 0, 0);
    this.cameraMode = localStorage.getItem('solisix.mode') || 'free'; // 'free' | 'orbit' | 'orrery' | 'fly'
    this.flySinTime = 0;

    // Layer visibility & persistence (solisix.*)
    this.showOrbits = localStorage.getItem('solisix.layers.orbits') !== 'false';
    this.showHudLabels = localStorage.getItem('solisix.layers.hud') === 'true'; // false by default
    this.showInfoCard = localStorage.getItem('solisix.card.open') === 'true'; // false by default
    this.showGrid = localStorage.getItem('solisix.layers.grid') !== 'false';
    this.showAsteroids = true;
    this.showTrails = localStorage.getItem('solisix.layers.trails') === 'true';
    this.showEvents = localStorage.getItem('solisix.layers.events') !== 'false';
    this.showConstellations = localStorage.getItem('solisix.layers.constellations') === 'true';
    this.showNebula = localStorage.getItem('solisix.layers.nebula') !== 'false';
    this.isThermalMode = false;

    // Visual systems
    this.waveRings = [];
    this.wavePulseTimer = 0;
    this.orbitalTrails = [];
    this.cometSystem = null;
    this.nebulaSkybox = null;
    this.constellationsGroup = null;
    this.solarFlareActive = false;
    this.solarFlareTimer = 45 + Math.random() * 30;
    this.flareDuration = 0;

    // Cosmic Timeline Evolution State
    this.currentEpochIndex = parseInt(localStorage.getItem('solisix.epoch')) || 2;
    this.isTimelineOpen = false;
    this.isTimelineAutoPlaying = false;
    this.timelineAutoPlayTimer = 0;
    this.planetaryNebulaRing = null;
    this.chronosRingMesh = null;

    // Performance monitor
    this.perfVisible = false;
    this.fps = 60;
    this.frameCount = 0;
    this.lastFpsUpdate = performance.now();

    // Raycaster
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // HUD DOM elements
    this.hudElements = new Map();

    this.init();
  }

  init() {
    this.setupThree();
    this.setupLighting();
    this.setupStarfield();
    this.setupNebulae();
    this.setupNebulaSkybox();
    this.setupConstellations();
    this.setupSolarWind();
    this.setupCoordinateGrid();
    this.setupGravitationalWaveTrack();
    this.setupGravitationalWaveRings();
    this.setupPlanetaryNebulaRing();
    this.buildSolarSystem();
    this.buildAsteroidBelt();
    this.setupOrbitalTrails();
    this.setupSolarFlares();
    this.setupEvents();
    this.setupKeyboardShortcuts();
    this.setupHudUi();
    this.setupTimeline();
    this.applyEpoch(this.currentEpochIndex, false);
    this.restoreStateFromHash();

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    console.log("Solis-IX Celestial Blueprint v2.0 Initialized successfully.");
  }

  setupThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040b, 0.0011);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 3500);
    this.camera.position.copy(this.defaultCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
      preserveDrawingBuffer: true // Required for screenshot capture
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.0;
    this.controls.maxDistance = 850;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.18;
    this.controls.target.copy(this.defaultTarget);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x22304d, 0.95);
    this.scene.add(ambientLight);

    // Primary Sun PointLight
    this.sunLight = new THREE.PointLight(0xfff5e6, 3.6, 1500, 1.0);
    this.sunLight.position.set(0, 0, 0);
    this.scene.add(this.sunLight);

    const dirLight = new THREE.DirectionalLight(0x80a0cc, 0.5);
    dirLight.position.set(45, 90, 45);
    this.scene.add(dirLight);

    // Dedicated Dynamic Focus Spotlight for selected planet highlighting
    this.focusSpotlight = new THREE.PointLight(0xffffff, 0, 80, 1.2);
    this.scene.add(this.focusSpotlight);
  }

  setupStarfield() {
    const starCount = 4500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    const colorChoices = [
      new THREE.Color(0xaaccff),
      new THREE.Color(0xffffff),
      new THREE.Color(0xffe4b5),
      new THREE.Color(0x70e0ff),
      new THREE.Color(0xffb07c)
    ];

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 950 + Math.random() * 950;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const c = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 1.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.82
    });

    const starfield = new THREE.Points(geometry, material);
    this.scene.add(starfield);
  }

  setupNebulae() {
    const nebulaColors = ['#1e1b4b', '#0f172a', '#312e81', '#1e293b', '#042f2e'];
    for (let i = 0; i < 7; i++) {
      const col = nebulaColors[i % nebulaColors.length];
      const tex = TextureGenerator.createNebulaTexture(col, 512);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.16 + Math.random() * 0.12,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(mat);
      const dist = 320 + Math.random() * 320;
      const ang = (i / 7) * Math.PI * 2 + Math.random() * 0.5;
      sprite.position.set(
        Math.cos(ang) * dist,
        (Math.random() - 0.5) * 110,
        Math.sin(ang) * dist
      );
      const s = 190 + Math.random() * 240;
      sprite.scale.set(s, s, 1);
      this.scene.add(sprite);
      this.nebulaClouds.push(sprite);
    }
  }

  setupNebulaSkybox() {
    const geo = new THREE.SphereGeometry(820, 32, 32);
    const tex = TextureGenerator.createNebulaSkyboxTexture();
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.BackSide,
      depthWrite: false
    });
    this.nebulaSkybox = new THREE.Mesh(geo, mat);
    this.nebulaSkybox.visible = this.showNebula;
    this.scene.add(this.nebulaSkybox);
  }

  setupConstellations() {
    this.constellationsGroup = new THREE.Group();
    const R = 780;

    CONSTELLATIONS_DATA.forEach(c => {
      const starPositions = [];
      const linePositions = [];

      c.stars.forEach(s => {
        const x = R * Math.cos(s.dec) * Math.cos(s.ra);
        const y = R * Math.sin(s.dec);
        const z = R * Math.cos(s.dec) * Math.sin(s.ra);
        starPositions.push(x, y, z);
      });

      c.lines.forEach(([i1, i2]) => {
        const s1 = c.stars[i1];
        const s2 = c.stars[i2];
        if (s1 && s2) {
          linePositions.push(
            R * Math.cos(s1.dec) * Math.cos(s1.ra),
            R * Math.sin(s1.dec),
            R * Math.cos(s1.dec) * Math.sin(s1.ra),
            R * Math.cos(s2.dec) * Math.cos(s2.ra),
            R * Math.sin(s2.dec),
            R * Math.cos(s2.dec) * Math.sin(s2.ra)
          );
        }
      });

      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({
        color: 0x7dfcff,
        size: 3.5,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
      });
      const starPoints = new THREE.Points(starGeo, starMat);
      this.constellationsGroup.add(starPoints);

      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending
      });
      const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
      this.constellationsGroup.add(linesMesh);
    });

    this.constellationsGroup.visible = this.showConstellations;
    this.scene.add(this.constellationsGroup);
  }

  setupSolarWind() {
    const particleCount = 380;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 0.4,
        (Math.random() - 0.5) * 2
      ).normalize();
      const dist = 6 + Math.random() * 95;

      positions[i * 3] = dir.x * dist;
      positions[i * 3 + 1] = dir.y * dist;
      positions[i * 3 + 2] = dir.z * dist;

      velocities.push({
        dir: dir,
        dist: dist,
        speed: 0.22 + Math.random() * 0.45
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffaa44,
      size: 1.5,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    const mesh = new THREE.Points(geometry, material);
    this.scene.add(mesh);
    this.solarWindParticles = { mesh, velocities, count: particleCount };
  }

  setupCoordinateGrid() {
    this.gridGroup = new THREE.Group();

    // Concentric blueprint range rings
    const ringRadii = [25, 45, 68, 92, 120, 155];
    ringRadii.forEach((r, idx) => {
      const segments = 128;
      const points = [];
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * r, 0, Math.sin(theta) * r));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: idx % 2 === 0 ? 0.16 : 0.08
      });
      const circle = new THREE.Line(geo, mat);
      this.gridGroup.add(circle);
    });

    // Radial spokes
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const points = [
        new THREE.Vector3(Math.cos(angle) * 12, 0, Math.sin(angle) * 12),
        new THREE.Vector3(Math.cos(angle) * 165, 0, Math.sin(angle) * 165)
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color: 0x00f0ff,
        transparent: true,
        opacity: 0.07
      });
      const spoke = new THREE.Line(geo, mat);
      this.gridGroup.add(spoke);
    }

    this.gridGroup.visible = this.showGrid;
    this.scene.add(this.gridGroup);
  }

  setupGravitationalWaveTrack() {
    const points = [];
    const radius = 175;
    const segments = 240;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const wave = Math.sin(theta * 16) * 1.5;
      points.push(new THREE.Vector3(
        Math.cos(theta) * (radius + wave),
        Math.sin(theta * 12) * 0.8,
        Math.sin(theta) * (radius + wave)
      ));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.18
    });
    const waveLine = new THREE.Line(geo, mat);
    this.gridGroup.add(waveLine);
  }

  setupGravitationalWaveRings() {
    this.waveRings = [];
    for (let i = 0; i < 3; i++) {
      const geo = new THREE.RingGeometry(0.8, 1.6, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x00f0ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = Math.PI / 2;
      this.scene.add(ring);
      this.waveRings.push({
        mesh: ring,
        progress: -1,
        speed: 0.22
      });
    }
    this.wavePulseTimer = 0;
  }

  updateWaveRings(dt) {
    this.wavePulseTimer += dt;
    if (this.wavePulseTimer >= 8.0) {
      this.wavePulseTimer = 0;
      const ringObj = this.waveRings.find(r => r.progress < 0);
      if (ringObj) {
        ringObj.progress = 0;
        if (window.cosmicAudio) {
          window.cosmicAudio.playWaveThump();
        }
      }
    }

    this.waveRings.forEach(r => {
      if (r.progress >= 0) {
        r.progress += dt * r.speed;
        if (r.progress >= 1.0) {
          r.progress = -1;
          r.mesh.material.opacity = 0;
        } else {
          const scale = 6 + Math.pow(r.progress, 0.75) * 175;
          r.mesh.scale.set(scale, scale, 1);
          r.mesh.material.opacity = (1 - r.progress) * 0.75;
        }
      }
    });
  }

  setupPlanetaryNebulaRing() {
    const geo = new THREE.RingGeometry(25, 82, 64);
    const tex = TextureGenerator.createNebulaTexture('#38bdf8', 512);
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    this.planetaryNebulaRing = new THREE.Mesh(geo, mat);
    this.planetaryNebulaRing.rotation.x = Math.PI / 2;
    this.planetaryNebulaRing.visible = false;
    this.scene.add(this.planetaryNebulaRing);
  }

  setupOrbitalTrails() {
    this.orbitalTrails = [];
    this.planets.forEach(p => {
      if (p.data.orbitRadius <= 0) return;
      const maxPoints = 48;
      const positions = new Float32Array(maxPoints * 3);
      const colors = new Float32Array(maxPoints * 3);
      const baseColor = new THREE.Color(p.data.color || 0x00f0ff);

      for (let i = 0; i < maxPoints; i++) {
        const alpha = (i / maxPoints);
        colors[i * 3] = baseColor.r * alpha;
        colors[i * 3 + 1] = baseColor.g * alpha;
        colors[i * 3 + 2] = baseColor.b * alpha;
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const mat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const line = new THREE.Line(geo, mat);
      line.visible = this.showTrails;
      this.scene.add(line);

      this.orbitalTrails.push({
        planet: p,
        line: line,
        history: [],
        maxPoints: maxPoints
      });
    });
  }

  updateOrbitalTrails() {
    if (!this.showTrails) return;
    const wp = new THREE.Vector3();
    this.orbitalTrails.forEach(t => {
      t.planet.group.getWorldPosition(wp);
      t.history.push(wp.clone());
      if (t.history.length > t.maxPoints) {
        t.history.shift();
      }
      const posAttr = t.line.geometry.attributes.position;
      const count = t.history.length;
      for (let i = 0; i < t.maxPoints; i++) {
        const histIdx = Math.max(0, count - t.maxPoints + i);
        const p = t.history[histIdx] || wp;
        posAttr.setXYZ(i, p.x, p.y, p.z);
      }
      posAttr.needsUpdate = true;
    });
  }

  setupSolarFlares() {
    this.solarFlareActive = false;
    this.solarFlareTimer = 50 + Math.random() * 30;
    this.flareDuration = 0;

    const count = 500;
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize().multiplyScalar(45 + Math.random() * 65);
      vel.push(v);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 2.4,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.solarFlareParticles = new THREE.Points(geo, mat);
    this.solarFlareVelocities = vel;
    this.scene.add(this.solarFlareParticles);
  }

  triggerSolarFlare() {
    this.solarFlareActive = true;
    this.flareDuration = 3.8;

    const pos = this.solarFlareParticles.geometry.attributes.position;
    for (let i = 0; i < 500; i++) {
      pos.setXYZ(i, 0, 0, 0);
    }
    pos.needsUpdate = true;
    this.solarFlareParticles.material.opacity = 0.95;

    if (window.cosmicAudio) {
      window.cosmicAudio.playSolarFlare();
    }

    const alertBanner = document.getElementById('solar-flare-alert');
    if (alertBanner) {
      alertBanner.classList.add('visible');
      setTimeout(() => alertBanner.classList.remove('visible'), 4000);
    }
  }

  updateSolarFlare(dt) {
    if (!this.showEvents) return;
    if (!this.solarFlareActive) {
      this.solarFlareTimer -= dt;
      if (this.solarFlareTimer <= 0) {
        this.triggerSolarFlare();
        this.solarFlareTimer = 55 + Math.random() * 35;
      }
      return;
    }

    this.flareDuration -= dt;
    const p = Math.max(0, this.flareDuration / 3.8);
    this.solarFlareParticles.material.opacity = p * 0.95;

    const pos = this.solarFlareParticles.geometry.attributes.position;
    for (let i = 0; i < 500; i++) {
      const v = this.solarFlareVelocities[i];
      const x = pos.getX(i) + v.x * dt;
      const y = pos.getY(i) + v.y * dt;
      const z = pos.getZ(i) + v.z * dt;
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;

    if (this.flareDuration <= 0) {
      this.solarFlareActive = false;
      this.solarFlareParticles.material.opacity = 0;
    }
  }

  buildSolarSystem() {
    CELESTIAL_DATA.forEach(data => {
      let mesh;
      const group = new THREE.Group();

      if (data.id === 'sun') {
        const geo = new THREE.SphereGeometry(data.size, 64, 64);
        const tex = TextureGenerator.createSunTexture();
        const mat = new THREE.MeshBasicMaterial({ map: tex });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        const coronaTex = TextureGenerator.createCoronaTexture('#ffaa33', 512);
        const coronaMat = new THREE.SpriteMaterial({
          map: coronaTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.95
        });
        const coronaSprite = new THREE.Sprite(coronaMat);
        coronaSprite.scale.set(data.size * 5.4, data.size * 5.4, 1);
        group.add(coronaSprite);
        this.sunCorona = coronaSprite;

        const coreMat = new THREE.SpriteMaterial({
          map: coronaTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.8
        });
        const coreSprite = new THREE.Sprite(coreMat);
        coreSprite.scale.set(data.size * 2.8, data.size * 2.8, 1);
        group.add(coreSprite);

      } else if (data.id === 'cygnus_beacon') {
        const geo = new THREE.SphereGeometry(data.size, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xffaa44,
          emissive: 0xff6600,
          emissiveIntensity: 1.6,
          roughness: 0.2
        });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        const beaconTex = TextureGenerator.createBeaconTexture();
        const spriteMat = new THREE.SpriteMaterial({
          map: beaconTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.88
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(data.size * 6.5, data.size * 6.5, 1);
        group.add(sprite);

        const beaconLight = new THREE.PointLight(0xff8833, 1.4, 90, 1.5);
        group.add(beaconLight);

      } else if (data.isComet) {
        // Displaced rough icy nucleus
        const geo = new THREE.IcosahedronGeometry(data.size, 2);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vy = pos.getY(i);
          const vz = pos.getZ(i);
          const noise = 1 + (Math.sin(vx * 12) * Math.cos(vy * 12) * 0.25);
          pos.setXYZ(i, vx * noise, vy * noise, vz * noise);
        }
        geo.computeVertexNormals();

        const tex = TextureGenerator.createCometTexture();
        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.85,
          metalness: 0.1
        });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        const comaTex = TextureGenerator.createCoronaTexture('#7dfcff', 256);
        const comaMat = new THREE.SpriteMaterial({
          map: comaTex,
          transparent: true,
          opacity: 0.85,
          blending: THREE.AdditiveBlending
        });
        const comaSprite = new THREE.Sprite(comaMat);
        comaSprite.scale.set(data.size * 5, data.size * 5, 1);
        group.add(comaSprite);

        // Dual Tails: Ion tail (straight blue) + Dust tail (curved amber)
        const tailCount = 400;
        const ionPoints = new Float32Array(tailCount * 3);
        const dustPoints = new Float32Array(tailCount * 3);
        const ionColors = new Float32Array(tailCount * 3);
        const dustColors = new Float32Array(tailCount * 3);

        for (let i = 0; i < tailCount; i++) {
          ionPoints[i * 3] = 0;
          ionPoints[i * 3 + 1] = 0;
          ionPoints[i * 3 + 2] = 0;
          ionColors[i * 3] = 0.25;
          ionColors[i * 3 + 1] = 0.55;
          ionColors[i * 3 + 2] = 1.0;

          dustPoints[i * 3] = 0;
          dustPoints[i * 3 + 1] = 0;
          dustPoints[i * 3 + 2] = 0;
          dustColors[i * 3] = 0.95;
          dustColors[i * 3 + 1] = 0.65;
          dustColors[i * 3 + 2] = 0.15;
        }

        const ionGeo = new THREE.BufferGeometry();
        ionGeo.setAttribute('position', new THREE.BufferAttribute(ionPoints, 3));
        ionGeo.setAttribute('color', new THREE.BufferAttribute(ionColors, 3));
        const ionMat = new THREE.PointsMaterial({
          size: 1.3,
          vertexColors: true,
          transparent: true,
          opacity: 0.65,
          blending: THREE.AdditiveBlending
        });
        const ionTailMesh = new THREE.Points(ionGeo, ionMat);
        this.scene.add(ionTailMesh);

        const dustGeo = new THREE.BufferGeometry();
        dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPoints, 3));
        dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
        const dustMat = new THREE.PointsMaterial({
          size: 1.6,
          vertexColors: true,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending
        });
        const dustTailMesh = new THREE.Points(dustGeo, dustMat);
        this.scene.add(dustTailMesh);

        this.cometSystem = {
          group: group,
          mesh: mesh,
          data: data,
          ionTail: ionTailMesh,
          dustTail: dustTailMesh
        };

      } else {
        const geo = new THREE.SphereGeometry(data.size, 64, 64);
        let tex;

        if (data.id === 'terra_nova') {
          tex = TextureGenerator.createEarthTexture();
        } else if (data.id === 'chronos_magister') {
          tex = TextureGenerator.createSaturnTexture();
        } else if (data.id === 'zeus_major') {
          tex = TextureGenerator.createJupiterTexture();
        } else if (data.id === 'ares_crimson') {
          tex = TextureGenerator.createMarsTexture();
        } else if (data.id === 'aether_cyan') {
          tex = TextureGenerator.createIceGiantTexture();
        } else {
          tex = TextureGenerator.createRockyTexture(512, 256, data.color === '#b56238' ? 0.75 : 0.5);
        }

        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.65,
          metalness: 0.15
        });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        // Planetary Rings for Chronos
        if (data.hasRings && data.id === 'chronos_magister') {
          const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 128);
          const ringTex = TextureGenerator.createSaturnRingTexture();
          
          const pos = ringGeo.attributes.position;
          const uvs = ringGeo.attributes.uv;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const r = Math.sqrt(x * x + y * y);
            const u = (r - data.ringInner) / (data.ringOuter - data.ringInner);
            uvs.setXY(i, u, 0.5);
          }

          const ringMat = new THREE.MeshBasicMaterial({
            map: ringTex,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.94,
            blending: THREE.NormalBlending
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2 + (data.ringTilt || 0.45);
          group.add(ringMesh);
          this.chronosRingMesh = ringMesh;
        }

        // Vertical Dust Rings for Aether Cyan
        if (data.hasRings && data.id === 'aether_cyan') {
          const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 96);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0x70e0ff,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.y = data.ringTilt || 1.5;
          group.add(ringMesh);
        }

        // Moons
        if (data.moons && data.moons.length > 0) {
          data.moons.forEach(m => {
            const moonPivot = new THREE.Group();
            moonPivot.rotation.x = m.orbitTilt || 0;

            const orbitSegments = 64;
            const orbitPoints = [];
            for (let i = 0; i <= orbitSegments; i++) {
              const th = (i / orbitSegments) * Math.PI * 2;
              orbitPoints.push(new THREE.Vector3(Math.cos(th) * m.distance, 0, Math.sin(th) * m.distance));
            }
            const orbitGeo = new THREE.BufferGeometry().setFromPoints(orbitPoints);
            const orbitMat = new THREE.LineBasicMaterial({
              color: new THREE.Color(m.color).multiplyScalar(0.7),
              transparent: true,
              opacity: 0.25
            });
            const orbitTrack = new THREE.LineLoop(orbitGeo, orbitMat);
            moonPivot.add(orbitTrack);

            const moonGeo = new THREE.SphereGeometry(m.size, 24, 24);
            let moonTex;
            if (m.textureType === 'io') {
              moonTex = TextureGenerator.createIoTexture();
            } else if (m.textureType === 'europa') {
              moonTex = TextureGenerator.createEuropaTexture();
            } else if (m.textureType === 'titan') {
              moonTex = TextureGenerator.createTitanTexture();
            } else {
              moonTex = TextureGenerator.createRockyTexture(256, 128, 0.5);
            }

            const moonMat = new THREE.MeshStandardMaterial({
              map: moonTex,
              roughness: 0.85
            });
            const moonMesh = new THREE.Mesh(moonGeo, moonMat);
            moonMesh.position.x = m.distance;
            moonPivot.add(moonMesh);

            group.add(moonPivot);

            const moonEntry = {
              pivot: moonPivot,
              mesh: moonMesh,
              data: m,
              parentPlanet: data,
              angle: Math.random() * Math.PI * 2,
              speed: m.speed || 0.03
            };
            this.moons.push(moonEntry);
            moonMesh.userData.moonEntry = moonEntry;
          });
        }
      }

      group.userData.bodyData = data;
      this.scene.add(group);

      if (data.orbitRadius > 0) {
        const orbitCurve = this.createOrbitGeometry(data);
        const orbitLine = new THREE.Line(orbitCurve.geometry, orbitCurve.material);
        this.scene.add(orbitLine);
        this.orbitMeshes.push(orbitLine);

        const pulseGeo = new THREE.SphereGeometry(0.38, 12, 12);
        const pulseMat = new THREE.MeshBasicMaterial({
          color: data.color,
          blending: THREE.AdditiveBlending
        });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        this.scene.add(pulseMesh);
        this.orbitPulses.push({
          mesh: pulseMesh,
          data: data,
          progress: Math.random()
        });
      }

      this.planets.push({
        group: group,
        mesh: mesh,
        data: data,
        angle: Math.random() * Math.PI * 2
      });

      this.createHudLabel(data);
    });

    // 3D Highlighting Selection Reticle Ring
    const retGeo = new THREE.RingGeometry(1.2, 1.38, 48);
    const retMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    this.selectionReticle = new THREE.Mesh(retGeo, retMat);
    this.selectionReticle.visible = false;
    this.scene.add(this.selectionReticle);
  }

  createOrbitGeometry(data) {
    const segments = 180;
    const points = [];
    const a = data.orbitRadius;
    const b = data.orbitRadius * (1 - (data.eccentricity || 0));
    const inc = data.inclination || 0;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * a;
      const z = Math.sin(theta) * b;
      const y = Math.sin(theta) * a * Math.sin(inc);
      points.push(new THREE.Vector3(x, y, z));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color(data.color).multiplyScalar(0.75),
      transparent: true,
      opacity: 0.38
    });

    return { geometry, material };
  }

  buildAsteroidBelt() {
    const asteroidCount = 450;
    const innerRadius = 49;
    const outerRadius = 57;

    const baseGeometry = new THREE.DodecahedronGeometry(0.24, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8892a0,
      roughness: 0.9,
      metalness: 0.1
    });

    const instancedMesh = new THREE.InstancedMesh(baseGeometry, material, asteroidCount);
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const rotation = new THREE.Euler();
    const quaternion = new THREE.Quaternion();
    const scale = new THREE.Vector3();

    for (let i = 0; i < asteroidCount; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 3.5;

      position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      quaternion.setFromEuler(rotation);

      const s = 0.4 + Math.random() * 0.9;
      scale.set(s, s, s);

      matrix.compose(position, quaternion, scale);
      instancedMesh.setMatrixAt(i, matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    this.asteroidBelt = instancedMesh;
    this.scene.add(instancedMesh);
  }

  createHudLabel(data) {
    const tag = document.createElement('div');
    tag.className = 'hud-tag';
    tag.id = `tag-${data.id}`;

    const isBn = this.currentLanguage === 'bn';
    tag.innerHTML = `
      <div class="hud-tag-dot" style="border-color: ${data.color}"></div>
      <div class="hud-tag-content">
        <div class="hud-tag-title">${isBn ? data.name : data.nameEn}</div>
        <div class="hud-tag-dist">${data.distanceAu}</div>
      </div>
    `;

    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectCelestialBody(data.id);
    });

    this.hudContainer.appendChild(tag);
    this.hudElements.set(data.id, {
      dom: tag,
      data: data
    });
  }

  updateHudPositions() {
    if (!this.showHudLabels) return;

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const widthHalf = width / 2;
    const heightHalf = height / 2;

    let svgLines = '';

    this.planets.forEach(p => {
      const hudItem = this.hudElements.get(p.data.id);
      if (!hudItem) return;

      const wp = new THREE.Vector3();
      p.group.getWorldPosition(wp);

      const pos = wp.clone().project(this.camera);

      if (pos.z > 1.0) {
        hudItem.dom.style.display = 'none';
        return;
      }

      const screenX = (pos.x * widthHalf) + widthHalf;
      const screenY = -(pos.y * heightHalf) + heightHalf;

      if (screenX < -60 || screenX > width + 60 || screenY < -60 || screenY > height + 60) {
        hudItem.dom.style.display = 'none';
        return;
      }

      hudItem.dom.style.display = 'flex';
      hudItem.dom.style.left = `${screenX + 16}px`;
      hudItem.dom.style.top = `${screenY - 18}px`;

      const targetX = screenX + 16;
      const targetY = screenY;
      const col = p.data.color || '#00f0ff';

      svgLines += `
        <line x1="${screenX}" y1="${screenY}" x2="${targetX}" y2="${targetY}" stroke="${col}" stroke-width="1" stroke-dasharray="2 3" opacity="0.6" />
        <circle cx="${screenX}" cy="${screenY}" r="2" fill="${col}" opacity="0.9" />
      `;
    });

    this.svgLinesContainer.innerHTML = svgLines;
  }

  selectCelestialBody(bodyId) {
    const planetObj = this.planets.find(p => p.data.id === bodyId);
    if (!planetObj) return;

    this.selectedBody = planetObj;
    this.isTracking = true;

    const targetWorldPos = new THREE.Vector3();
    planetObj.group.getWorldPosition(targetWorldPos);
    this.lastTrackedTargetPos = targetWorldPos.clone();

    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
      window.cosmicAudio.playWhoosh();
    }

    this.updateTelemetryCard(planetObj.data);

    // Focused close-up camera position
    const offsetDist = Math.max(planetObj.data.size * 3.2, 11);
    const cameraTargetPos = targetWorldPos.clone().add(new THREE.Vector3(offsetDist * 0.8, offsetDist * 0.45, offsetDist));

    this.startCameraAnimation(cameraTargetPos, targetWorldPos, 1000);
    this.highlightBody(planetObj.data, targetWorldPos);

    document.querySelectorAll('.hud-tag').forEach(tag => tag.classList.remove('active'));
    const activeTag = document.getElementById(`tag-${bodyId}`);
    if (activeTag) activeTag.classList.add('active');

    this.updateUrlHash();
  }

  selectMoon(moonEntry) {
    if (!moonEntry) return;

    this.selectedBody = {
      group: moonEntry.mesh,
      data: moonEntry.data,
      isMoon: true
    };
    this.isTracking = true;

    const targetWorldPos = new THREE.Vector3();
    moonEntry.mesh.getWorldPosition(targetWorldPos);
    this.lastTrackedTargetPos = targetWorldPos.clone();

    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
      window.cosmicAudio.playWhoosh();
    }

    this.updateMoonTelemetryCard(moonEntry.data, moonEntry.parentPlanet);

    const offsetDist = Math.max(moonEntry.data.size * 4.2, 3.5);
    const cameraTargetPos = targetWorldPos.clone().add(new THREE.Vector3(offsetDist * 0.8, offsetDist * 0.4, offsetDist));

    this.startCameraAnimation(cameraTargetPos, targetWorldPos, 900);
    this.highlightBody(moonEntry.data, targetWorldPos);

    this.updateUrlHash();
  }

  highlightBody(data, worldPos) {
    if (this.focusSpotlight) {
      this.focusSpotlight.color.set(data.color || 0xffffff);
      this.focusSpotlight.intensity = 3.2;
      this.focusSpotlight.distance = Math.max(data.size * 8, 40);
      this.focusSpotlight.position.copy(worldPos).add(new THREE.Vector3(data.size * 2, data.size * 3, data.size * 2.5));
      this.focusSpotlight.visible = true;
    }

    if (this.selectionReticle) {
      const scale = (data.size || 2.0) * 1.35;
      this.selectionReticle.scale.set(scale, scale, 1);
      this.selectionReticle.position.copy(worldPos);
      this.selectionReticle.material.color.set(data.color || 0x00f0ff);
      this.selectionReticle.visible = true;
    }

    this.orbitMeshes.forEach(mesh => {
      if (this.selectedBody && this.selectedBody.data && mesh.geometry) {
        mesh.material.opacity = 0.15;
      } else {
        mesh.material.opacity = 0.38;
      }
    });
  }

  clearHighlight() {
    if (this.focusSpotlight) {
      this.focusSpotlight.visible = false;
      this.focusSpotlight.intensity = 0;
    }
    if (this.selectionReticle) {
      this.selectionReticle.visible = false;
    }
    this.orbitMeshes.forEach(mesh => {
      mesh.material.opacity = 0.38;
    });
  }

  startCameraAnimation(toPos, toTarget, duration = 1000) {
    this.cameraAnimation = {
      fromPos: this.camera.position.clone(),
      toPos: toPos.clone(),
      fromTarget: this.controls.target.clone(),
      toTarget: toTarget.clone(),
      startTime: performance.now(),
      duration: duration
    };
  }

  updateCameraAnimation() {
    if (!this.cameraAnimation) return;

    const now = performance.now();
    const elapsed = now - this.cameraAnimation.startTime;
    const progress = Math.min(elapsed / this.cameraAnimation.duration, 1.0);

    const ease = progress < 0.5 
      ? 4 * progress * progress * progress 
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    this.camera.position.lerpVectors(this.cameraAnimation.fromPos, this.cameraAnimation.toPos, ease);
    this.controls.target.lerpVectors(this.cameraAnimation.fromTarget, this.cameraAnimation.toTarget, ease);

    if (progress >= 1.0) {
      this.cameraAnimation = null;
    }
  }

  resetCamera() {
    this.selectedBody = null;
    this.isTracking = false;
    this.isAutoTouring = false;
    this.lastTrackedTargetPos = null;

    this.clearHighlight();
    this.startCameraAnimation(this.defaultCameraPos, this.defaultTarget, 1200);

    document.querySelectorAll('.hud-tag').forEach(tag => tag.classList.remove('active'));
    document.getElementById('telemetry-card').classList.remove('visible');
    
    if (window.cosmicAudio) {
      window.cosmicAudio.playWhoosh();
    }
    this.updateUrlHash();
  }

  updateTelemetryCard(data) {
    const card = document.getElementById('telemetry-card');
    const isBn = this.currentLanguage === 'bn';

    document.getElementById('tel-title').textContent = isBn ? data.name : data.nameEn;
    document.getElementById('tel-type').textContent = data.type;
    document.getElementById('tel-spectral').textContent = data.spectral || 'Standard Sol-V';
    document.getElementById('tel-radius').textContent = data.radiusKm;
    document.getElementById('tel-distance').textContent = data.distanceAu;
    document.getElementById('tel-period').textContent = data.period;
    document.getElementById('tel-velocity').textContent = data.velocity;
    document.getElementById('tel-temp').textContent = data.temp;
    document.getElementById('tel-desc').textContent = isBn ? data.description : data.descriptionEn;

    document.getElementById('tel-color-accent').style.borderColor = data.color;
    document.getElementById('tel-status-light').style.background = data.color;

    // Moons List
    const moonsContainer = document.getElementById('tel-moons-list');
    if (moonsContainer) {
      if (data.moons && data.moons.length > 0) {
        moonsContainer.style.display = 'block';
        moonsContainer.innerHTML = `
          <div style="font-size: 10px; color: var(--cyan-glow); margin: 8px 0 4px 0; font-family: var(--font-mono); font-weight: bold;">
            ${isBn ? 'উপগ্রহ মণ্ডল (Moons):' : 'Satellites (Moons):'}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${data.moons.map(m => `
              <span class="jump-chip" style="font-size: 9px; padding: 2px 6px; border-color: ${m.color};" 
                    onclick="simulation.selectMoonById('${m.id}')">
                🌕 ${isBn ? m.name.split(' ')[0] : m.nameEn.split(' ')[0]}
              </span>
            `).join('')}
          </div>
        `;
      } else {
        moonsContainer.style.display = 'none';
        moonsContainer.innerHTML = '';
      }
    }

    if (this.showInfoCard) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  }

  updateMoonTelemetryCard(moonData, parentPlanet) {
    const card = document.getElementById('telemetry-card');
    const isBn = this.currentLanguage === 'bn';

    document.getElementById('tel-title').textContent = isBn ? moonData.name : moonData.nameEn;
    document.getElementById('tel-type').textContent = moonData.type;
    document.getElementById('tel-spectral').textContent = isBn ? `মাতৃগ্রহ: ${parentPlanet.nameEn}` : `Parent: ${parentPlanet.nameEn}`;
    document.getElementById('tel-radius').textContent = moonData.radiusKm;
    document.getElementById('tel-distance').textContent = `${moonData.distance * 10000} km`;
    document.getElementById('tel-period').textContent = isBn ? 'টাইডাল লকড' : 'Tidally Locked';
    document.getElementById('tel-velocity').textContent = `${(moonData.speed * 80).toFixed(1)} km/s`;
    document.getElementById('tel-temp').textContent = parentPlanet.temp;
    document.getElementById('tel-desc').textContent = isBn ? moonData.description : moonData.descriptionEn;

    document.getElementById('tel-color-accent').style.borderColor = moonData.color;
    document.getElementById('tel-status-light').style.background = moonData.color;

    const moonsContainer = document.getElementById('tel-moons-list');
    if (moonsContainer) {
      moonsContainer.style.display = 'block';
      moonsContainer.innerHTML = `
        <span class="jump-chip" style="font-size: 10px; margin-top: 6px; display: inline-block;" 
              onclick="simulation.selectCelestialBody('${parentPlanet.id}')">
          ⬅️ ${isBn ? 'মাতৃগ্রহে ফিরে যান' : 'Back to Parent Planet'}
        </span>
      `;
    }

    if (this.showInfoCard) {
      card.classList.add('visible');
    } else {
      card.classList.remove('visible');
    }
  }

  setInfoCardVisibility(visible) {
    this.showInfoCard = !!visible;
    localStorage.setItem('solisix.card.open', this.showInfoCard ? 'true' : 'false');

    const infoToggle = document.getElementById('toggle-info');
    if (infoToggle) {
      infoToggle.checked = this.showInfoCard;
    }

    const infoBtn = document.getElementById('btn-toggle-info');
    if (infoBtn) {
      infoBtn.classList.toggle('active', this.showInfoCard);
    }

    const card = document.getElementById('telemetry-card');
    if (!card) return;

    if (this.showInfoCard) {
      if (this.selectedBody) {
        if (this.selectedBody.isMoon) {
          const moonObj = this.moons.find(m => m.data.id === this.selectedBody.data.id);
          if (moonObj) this.updateMoonTelemetryCard(moonObj.data, moonObj.parentPlanet);
        } else {
          this.updateTelemetryCard(this.selectedBody.data);
        }
        card.classList.add('visible');
      } else {
        this.selectCelestialBody('terra_nova');
      }
    } else {
      card.classList.remove('visible');
    }
  }

  selectMoonById(moonId) {
    const moonEntry = this.moons.find(m => m.data.id === moonId);
    if (moonEntry) this.selectMoon(moonEntry);
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    this.container.addEventListener('pointerdown', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshesToTest = [
        ...this.planets.map(p => p.mesh).filter(Boolean),
        ...this.moons.map(m => m.mesh).filter(Boolean)
      ];
      const intersects = this.raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const hitPlanet = this.planets.find(p => p.mesh === hitMesh);
        if (hitPlanet) {
          this.selectCelestialBody(hitPlanet.data.id);
          return;
        }
        const hitMoon = this.moons.find(m => m.mesh === hitMesh);
        if (hitMoon) {
          this.selectMoon(hitMoon);
        }
      }
    });

    this.container.addEventListener('pointermove', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshesToTest = [
        ...this.planets.map(p => p.mesh).filter(Boolean),
        ...this.moons.map(m => m.mesh).filter(Boolean)
      ];
      const intersects = this.raycaster.intersectObjects(meshesToTest);
      document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'default';
    });
  }

  setCameraMode(mode) {
    this.cameraMode = mode;
    localStorage.setItem('solisix.mode', mode);

    document.querySelectorAll('.mode-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    if (mode === 'orrery') {
      this.startCameraAnimation(new THREE.Vector3(0, 240, 0), new THREE.Vector3(0, 0, 0), 1200);
      this.selectedBody = null;
      this.isTracking = false;
      this.clearHighlight();
    } else if (mode === 'fly') {
      this.flySinTime = 0;
    }

    this.updateUrlHash();
  }

  toggleThermalMode() {
    this.isThermalMode = !this.isThermalMode;
    const btn = document.getElementById('btn-thermal');
    if (btn) btn.classList.toggle('active', this.isThermalMode);

    this.planets.forEach((p, idx) => {
      if (p.data.id === 'sun' || p.data.id === 'cygnus_beacon') return;
      if (this.isThermalMode) {
        if (!p.originalMaterial) p.originalMaterial = p.mesh.material;
        const thermalTex = TextureGenerator.createThermalTexture(512, 256, idx * 3.7);
        p.mesh.material = new THREE.MeshStandardMaterial({
          map: thermalTex,
          roughness: 0.5,
          metalness: 0.2
        });
      } else {
        if (p.originalMaterial) p.mesh.material = p.originalMaterial;
      }
    });

    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
    }
  }

  captureScreenshot() {
    if (!this.renderer) return;

    this.renderer.render(this.scene, this.camera);
    const canvas = this.renderer.domElement;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const ctx = exportCanvas.getContext('2d');

    ctx.drawImage(canvas, 0, 0);

    // Astrometric Sci-Fi Watermark
    ctx.save();
    ctx.font = 'bold 16px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00f0ff';
    ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText('SOLIS-IX // ASTROMETRIC CELESTIAL BLUEPRINT', 28, 40);

    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(200, 235, 255, 0.8)';
    const bodyTitle = this.selectedBody 
      ? (this.currentLanguage === 'bn' ? this.selectedBody.data.name : this.selectedBody.data.nameEn)
      : 'FULL SYSTEM OVERVIEW';
    ctx.fillText(`TARGET: ${bodyTitle} | EPOCH: ${(2349.117 + this.simTimeDays / 365.25).toFixed(3)} CE`, 28, 62);
    ctx.fillText(`TIMESTAMP: ${new Date().toISOString()} | SIM-DAYS: ${this.simTimeDays.toFixed(1)}`, 28, 80);
    ctx.restore();

    const dataUrl = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    const targetName = this.selectedBody ? this.selectedBody.data.id : 'solis-ix';
    link.download = `solis-ix-${targetName}-${Date.now()}.png`;
    link.href = dataUrl;
    link.click();

    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
    }
  }

  exportAstrometricJson() {
    const data = this.selectedBody ? this.selectedBody.data : CELESTIAL_DATA[0];
    const exportObj = {
      system_id: "SOLIS-IX",
      system_name: "Solis-IX Planetary System",
      epoch: (2349.117 + this.simTimeDays / 365.25).toFixed(3),
      sim_elapsed_days: this.simTimeDays.toFixed(3),
      exported_at: new Date().toISOString(),
      target: {
        id: data.id,
        name: {
          bn: data.name,
          en: data.nameEn
        },
        classification: data.type,
        spectral_class: data.spectral || "N/A",
        radius_km: data.radiusKm,
        mass: data.mass || "N/A",
        distance_au: data.distanceAu,
        period: data.period,
        velocity: data.velocity,
        temperature: data.temp,
        description: {
          bn: data.description,
          en: data.descriptionEn
        },
        atmospheric_telemetry: data.atmosphereData || null,
        moons: (data.moons || []).map(m => ({
          id: m.id,
          name_bn: m.name,
          name_en: m.nameEn,
          radius_km: m.radiusKm,
          distance_units: m.distance,
          description: m.description
        }))
      },
      camera_coordinates: {
        x: this.camera.position.x.toFixed(2),
        y: this.camera.position.y.toFixed(2),
        z: this.camera.position.z.toFixed(2),
        mode: this.cameraMode
      }
    };

    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `solis-ix-${data.id}-telemetry.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }

  openScaleComparison() {
    const modal = document.getElementById('scale-compare-modal');
    if (!modal) return;
    modal.classList.add('visible');

    const container = document.getElementById('scale-items-container');
    if (!container) return;

    const isBn = this.currentLanguage === 'bn';
    const targetBody = this.selectedBody ? this.selectedBody.data : CELESTIAL_DATA.find(d => d.id === 'zeus_major');
    const earthRadiusKm = 6371;

    const targetRadiusNumber = parseFloat(String(targetBody.radiusKm).replace(/,/g, '').replace(/[^0-9.]/g, '')) || 25000;
    const targetPx = Math.min(180, Math.max(16, (targetRadiusNumber / earthRadiusKm) * 38));

    const compareList = [
      { name: isBn ? 'সোলিস (সূর্য-আংশিক)' : 'Solis-IX (Star-Arc)', radiusKm: 696340, color: '#ffaa33', px: 220, isStar: true },
      { name: isBn ? (targetBody.name.split(' ')[0]) : (targetBody.nameEn.split(' ')[0]), radiusKm: targetRadiusNumber, color: targetBody.color, px: targetPx },
      { name: isBn ? 'টেরা নোভা (আদর্শ)' : 'Terra Nova (Ref)', radiusKm: 6371, color: '#38bdf8', px: 38 },
      { name: isBn ? 'লুনা (চাঁদ)' : 'Luna (Moon)', radiusKm: 1737, color: '#94a3b8', px: 11 }
    ];

    container.innerHTML = compareList.map(item => `
      <div class="scale-item">
        <div class="scale-circle" style="
          width: ${item.px}px; 
          height: ${item.px}px; 
          --circle-color: ${item.color};
          ${item.isStar ? 'border-radius: 50% 50% 0 0; border-bottom: none;' : ''}
        "></div>
        <div class="scale-label">
          <strong>${item.name}</strong><br>
          <span style="color: var(--cyan-glow);">${item.radiusKm.toLocaleString()} km</span>
        </div>
      </div>
    `).join('');
  }

  closeScaleComparison() {
    const modal = document.getElementById('scale-compare-modal');
    if (modal) modal.classList.remove('visible');
  }

  openCommandPalette() {
    const modal = document.getElementById('cmd-palette-modal');
    if (!modal) return;
    modal.classList.add('visible');
    const input = document.getElementById('cmd-palette-input');
    if (input) {
      input.value = '';
      input.focus();
      this.filterCommandPalette('');
    }
  }

  closeCommandPalette() {
    const modal = document.getElementById('cmd-palette-modal');
    if (modal) modal.classList.remove('visible');
  }

  filterCommandPalette(query) {
    const listEl = document.getElementById('cmd-palette-list');
    if (!listEl) return;

    const q = query.trim().toLowerCase();
    const isBn = this.currentLanguage === 'bn';
    const items = [];

    CELESTIAL_DATA.forEach(b => {
      const name = isBn ? b.name : b.nameEn;
      const match = !q || name.toLowerCase().includes(q) || b.nameEn.toLowerCase().includes(q) || (b.type && b.type.toLowerCase().includes(q));
      if (match) {
        items.push({
          id: b.id,
          name: name,
          type: b.type,
          dist: b.distanceAu || '—',
          color: b.color,
          isMoon: false
        });
      }
      if (b.moons) {
        b.moons.forEach(m => {
          const mName = isBn ? m.name : m.nameEn;
          const mMatch = !q || mName.toLowerCase().includes(q) || m.nameEn.toLowerCase().includes(q);
          if (mMatch) {
            items.push({
              id: m.id,
              name: mName,
              type: isBn ? `উপগ্রহ (মাতৃগ্রহ: ${b.nameEn})` : `Moon (Parent: ${b.nameEn})`,
              dist: `${m.distance * 10000} km`,
              color: m.color,
              isMoon: true
            });
          }
        });
      }
    });

    listEl.innerHTML = items.slice(0, 10).map((it, idx) => `
      <div class="cmd-item ${idx === 0 ? 'selected' : ''}" data-id="${it.id}" data-is-moon="${it.isMoon}" onclick="simulation.executeCommandSelect('${it.id}', ${it.isMoon})">
        <div>
          <span style="color: ${it.color}; margin-right: 6px;">●</span>
          <strong>${it.name}</strong>
          <span class="cmd-item-class" style="margin-left: 8px;">// ${it.type}</span>
        </div>
        <div style="font-size: 10px; color: rgba(180, 220, 255, 0.6);">${it.dist}</div>
      </div>
    `).join('');
  }

  executeCommandSelect(id, isMoon) {
    this.closeCommandPalette();
    if (isMoon) {
      this.selectMoonById(id);
    } else {
      this.selectCelestialBody(id);
    }
  }

  updateUrlHash() {
    const bodyId = this.selectedBody ? this.selectedBody.data.id : 'solis';
    const hash = `#body=${encodeURIComponent(bodyId)}&mode=${encodeURIComponent(this.cameraMode)}&lang=${encodeURIComponent(this.currentLanguage)}`;
    history.replaceState(null, '', hash);
  }

  restoreStateFromHash() {
    if (!window.location.hash) return;
    const params = new URLSearchParams(window.location.hash.slice(1));
    const lang = params.get('lang');
    if (lang === 'bn' || lang === 'en') {
      this.currentLanguage = lang;
      const langBtn = document.getElementById('btn-lang');
      if (langBtn) langBtn.textContent = lang === 'bn' ? 'English' : 'বাংলা';
      this.updateLanguageTexts();
    }
    const mode = params.get('mode');
    if (mode && ['free', 'orbit', 'orrery', 'fly'].includes(mode)) {
      this.setCameraMode(mode);
    }
    const body = params.get('body');
    if (body && body !== 'solis') {
      setTimeout(() => {
        const moonObj = this.moons.find(m => m.data.id === body);
        if (moonObj) {
          this.selectMoon(moonObj);
        } else {
          this.selectCelestialBody(body);
        }
      }, 400);
    }
  }

  setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      const isCmdActive = document.getElementById('cmd-palette-modal')?.classList.contains('visible');

      if (isCmdActive) {
        if (e.key === 'Escape') {
          this.closeCommandPalette();
        } else if (e.key === 'Enter') {
          const selectedItem = document.querySelector('.cmd-item.selected');
          if (selectedItem) selectedItem.click();
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const items = Array.from(document.querySelectorAll('.cmd-item'));
          const curIdx = items.findIndex(el => el.classList.contains('selected'));
          let nextIdx = curIdx + (e.key === 'ArrowDown' ? 1 : -1);
          if (nextIdx < 0) nextIdx = items.length - 1;
          if (nextIdx >= items.length) nextIdx = 0;
          items.forEach(el => el.classList.remove('selected'));
          if (items[nextIdx]) items[nextIdx].classList.add('selected');
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.openCommandPalette();
        return;
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        this.perfVisible = !this.perfVisible;
        const perfEl = document.getElementById('perf-monitor');
        if (perfEl) perfEl.classList.toggle('visible', this.perfVisible);
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          document.getElementById('btn-play-pause')?.click();
          break;
        case 'r':
        case 'R':
          this.resetCamera();
          break;
        case 'f':
        case 'F':
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
          break;
        case 'm':
        case 'M':
          document.getElementById('btn-audio')?.click();
          break;
        case 'l':
        case 'L':
          const hudToggle = document.getElementById('toggle-hud');
          if (hudToggle) {
            hudToggle.checked = !hudToggle.checked;
            hudToggle.dispatchEvent(new Event('change'));
          }
          break;
        case 'i':
        case 'I':
          this.setInfoCardVisibility(!this.showInfoCard);
          break;
        case 't':
        case 'T':
          this.toggleThermalMode();
          break;
        case 'a':
        case 'A':
          document.getElementById('btn-auto-tour')?.click();
          break;
        case 'Escape':
          this.closeCommandPalette();
          this.closeScaleComparison();
          this.setInfoCardVisibility(false);
          break;
        case 'ArrowLeft':
          this.controls.rotateLeft(0.1);
          break;
        case 'ArrowRight':
          this.controls.rotateLeft(-0.1);
          break;
        case 'ArrowUp':
          this.controls.rotateUp(0.1);
          break;
        case 'ArrowDown':
          this.controls.rotateUp(-0.1);
          break;
        case '+':
        case '=':
          this.controls.dollyIn(1.15);
          break;
        case '-':
        case '_':
          this.controls.dollyOut(1.15);
          break;
        case 'y':
        case 'Y':
          const tlBtn = document.getElementById('btn-timeline');
          if (tlBtn) tlBtn.click();
          break;
        case '1': this.selectCelestialBody('sun'); break;
        case '2': this.selectCelestialBody('cygnus_beacon'); break;
        case '3': this.selectCelestialBody('vulcanus'); break;
        case '4': this.selectCelestialBody('terra_nova'); break;
        case '5': this.selectCelestialBody('ares_crimson'); break;
        case '6': this.selectCelestialBody('zeus_major'); break;
        case '7': this.selectCelestialBody('chronos_magister'); break;
        case '8': this.selectCelestialBody('aether_cyan'); break;
        case '9': this.selectCelestialBody('hades_outpost'); break;
      }
    });
  }

  setupHudUi() {
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        playBtn.innerHTML = this.isPlaying 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      });
    }

    const speedSelect = document.getElementById('speed-select');
    if (speedSelect) {
      speedSelect.value = String(this.timeScale);
      speedSelect.addEventListener('change', (e) => {
        this.timeScale = parseFloat(e.target.value);
        localStorage.setItem('solisix.speed', this.timeScale);
      });
    }

    // Camera Mode Selectors
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.setCameraMode(btn.dataset.mode);
      });
      if (btn.dataset.mode === this.cameraMode) {
        btn.classList.add('active');
      }
    });

    // Layer Toggles
    const orbitToggle = document.getElementById('toggle-orbits');
    if (orbitToggle) {
      orbitToggle.checked = this.showOrbits;
      orbitToggle.addEventListener('change', (e) => {
        this.showOrbits = e.target.checked;
        localStorage.setItem('solisix.layers.orbits', this.showOrbits);
        this.orbitMeshes.forEach(m => m.visible = this.showOrbits);
        this.orbitPulses.forEach(p => p.mesh.visible = this.showOrbits);
      });
    }

    const hudToggle = document.getElementById('toggle-hud');
    if (hudToggle) {
      hudToggle.checked = this.showHudLabels;
      hudToggle.addEventListener('change', (e) => {
        this.showHudLabels = e.target.checked;
        localStorage.setItem('solisix.layers.hud', this.showHudLabels ? 'true' : 'false');
        if (!this.showHudLabels) {
          this.hudContainer.style.display = 'none';
          this.svgLinesContainer.innerHTML = '';
        } else {
          this.updateHudPositions();
        }
      });
    }

    const infoToggle = document.getElementById('toggle-info');
    if (infoToggle) {
      infoToggle.checked = this.showInfoCard;
      infoToggle.addEventListener('change', (e) => {
        this.setInfoCardVisibility(e.target.checked);
      });
    }

    const infoBtn = document.getElementById('btn-toggle-info');
    if (infoBtn) {
      infoBtn.classList.toggle('active', this.showInfoCard);
      infoBtn.addEventListener('click', () => {
        this.setInfoCardVisibility(!this.showInfoCard);
      });
    }

    const gridToggle = document.getElementById('toggle-grid');
    if (gridToggle) {
      gridToggle.checked = this.showGrid;
      gridToggle.addEventListener('change', (e) => {
        this.showGrid = e.target.checked;
        localStorage.setItem('solisix.layers.grid', this.showGrid);
        if (this.gridGroup) this.gridGroup.visible = this.showGrid;
      });
    }

    const trailsToggle = document.getElementById('toggle-trails');
    if (trailsToggle) {
      trailsToggle.checked = this.showTrails;
      trailsToggle.addEventListener('change', (e) => {
        this.showTrails = e.target.checked;
        localStorage.setItem('solisix.layers.trails', this.showTrails);
        this.orbitalTrails.forEach(t => t.line.visible = this.showTrails);
      });
    }

    const eventsToggle = document.getElementById('toggle-events');
    if (eventsToggle) {
      eventsToggle.checked = this.showEvents;
      eventsToggle.addEventListener('change', (e) => {
        this.showEvents = e.target.checked;
        localStorage.setItem('solisix.layers.events', this.showEvents);
      });
    }

    const constToggle = document.getElementById('toggle-constellations');
    if (constToggle) {
      constToggle.checked = this.showConstellations;
      constToggle.addEventListener('change', (e) => {
        this.showConstellations = e.target.checked;
        localStorage.setItem('solisix.layers.constellations', this.showConstellations);
        if (this.constellationsGroup) this.constellationsGroup.visible = this.showConstellations;
      });
    }

    const nebulaToggle = document.getElementById('toggle-nebula');
    if (nebulaToggle) {
      nebulaToggle.checked = this.showNebula;
      nebulaToggle.addEventListener('change', (e) => {
        this.showNebula = e.target.checked;
        localStorage.setItem('solisix.layers.nebula', this.showNebula);
        if (this.nebulaSkybox) this.nebulaSkybox.visible = this.showNebula;
      });
    }

    // Top action buttons
    const audioBtn = document.getElementById('btn-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isPlaying = window.cosmicAudio ? window.cosmicAudio.toggle() : false;
        audioBtn.classList.toggle('active', isPlaying);
        localStorage.setItem('solisix.audio', isPlaying);
      });
    }

    const tourBtn = document.getElementById('btn-auto-tour');
    if (tourBtn) {
      tourBtn.addEventListener('click', () => {
        this.isAutoTouring = !this.isAutoTouring;
        tourBtn.classList.toggle('active', this.isAutoTouring);
        if (this.isAutoTouring) {
          this.tourIndex = 0;
          this.tourTimer = 0;
          this.selectCelestialBody(this.planets[this.tourIndex].data.id);
        }
      });
    }

    const captureBtn = document.getElementById('btn-capture');
    if (captureBtn) {
      captureBtn.addEventListener('click', () => this.captureScreenshot());
    }

    const thermalBtn = document.getElementById('btn-thermal');
    if (thermalBtn) {
      thermalBtn.addEventListener('click', () => this.toggleThermalMode());
    }

    const searchBtn = document.getElementById('btn-search');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.openCommandPalette());
    }

    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCamera());
    }

    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.currentLanguage = this.currentLanguage === 'bn' ? 'en' : 'bn';
        localStorage.setItem('solisix.lang', this.currentLanguage);
        langBtn.textContent = this.currentLanguage === 'bn' ? 'English' : 'বাংলা';
        this.updateLanguageTexts();
      });
    }

    // Scale Compare & JSON buttons
    const scaleBtn = document.getElementById('btn-scale-compare');
    if (scaleBtn) {
      scaleBtn.addEventListener('click', () => this.openScaleComparison());
    }
    const scaleCloseBtn = document.getElementById('scale-close-btn');
    if (scaleCloseBtn) {
      scaleCloseBtn.addEventListener('click', () => this.closeScaleComparison());
    }

    const exportBtn = document.getElementById('btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportAstrometricJson());
    }

    // Command palette search input
    const cmdInput = document.getElementById('cmd-palette-input');
    if (cmdInput) {
      cmdInput.addEventListener('input', (e) => this.filterCommandPalette(e.target.value));
    }
    const cmdBackdrop = document.getElementById('cmd-palette-modal');
    if (cmdBackdrop) {
      cmdBackdrop.addEventListener('click', (e) => {
        if (e.target === cmdBackdrop) this.closeCommandPalette();
      });
    }

    const closeTel = document.getElementById('tel-close');
    if (closeTel) {
      closeTel.addEventListener('click', () => {
        this.setInfoCardVisibility(false);
      });
    }

    this.updateLanguageTexts();
  }

  setupTimeline() {
    const timelineBtn = document.getElementById('btn-timeline');
    const timelineDrawer = document.getElementById('timeline-drawer');
    const closeBtn = document.getElementById('tl-close-btn');
    const playPauseBtn = document.getElementById('tl-play-pause-btn');
    const sliderInput = document.getElementById('tl-slider-input');
    const nodes = document.querySelectorAll('.timeline-node');

    if (timelineBtn && timelineDrawer) {
      timelineBtn.addEventListener('click', () => {
        this.isTimelineOpen = !this.isTimelineOpen;
        timelineDrawer.classList.toggle('visible', this.isTimelineOpen);
        timelineBtn.classList.toggle('active', this.isTimelineOpen);
        if (window.cosmicAudio && this.isTimelineOpen) {
          window.cosmicAudio.playSelect();
        }
      });
    }

    if (closeBtn && timelineDrawer && timelineBtn) {
      closeBtn.addEventListener('click', () => {
        this.isTimelineOpen = false;
        timelineDrawer.classList.remove('visible');
        timelineBtn.classList.remove('active');
        if (this.isTimelineAutoPlaying) {
          this.toggleTimelineAutoPlay();
        }
      });
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        this.toggleTimelineAutoPlay();
      });
    }

    if (sliderInput) {
      sliderInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val)) {
          this.applyEpoch(val, true);
        }
      });
    }

    nodes.forEach(node => {
      node.addEventListener('click', () => {
        const epochIdx = parseInt(node.dataset.epoch, 10);
        if (!isNaN(epochIdx)) {
          this.applyEpoch(epochIdx, true);
        }
      });
    });
  }

  toggleTimelineAutoPlay() {
    this.isTimelineAutoPlaying = !this.isTimelineAutoPlaying;
    const playPauseBtn = document.getElementById('tl-play-pause-btn');
    const isBn = this.currentLanguage === 'bn';

    if (playPauseBtn) {
      playPauseBtn.textContent = this.isTimelineAutoPlaying
        ? (isBn ? '⏸ থামান' : '⏸ Pause Epochs')
        : (isBn ? '▶ চালান' : '▶ Play Epochs');
      playPauseBtn.classList.toggle('active', this.isTimelineAutoPlaying);
    }
    this.timelineAutoPlayTimer = 0;
    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
    }
  }

  applyEpoch(index, playSound = true) {
    if (typeof TIMELINE_EPOCHS === 'undefined' || !TIMELINE_EPOCHS.length) return;
    index = Math.max(0, Math.min(index, TIMELINE_EPOCHS.length - 1));
    this.currentEpochIndex = index;
    localStorage.setItem('solisix.epoch', index);

    if (playSound && window.cosmicAudio) {
      window.cosmicAudio.playTemporalWarp();
    }

    const epoch = TIMELINE_EPOCHS[index];
    const isBn = this.currentLanguage === 'bn';

    // Update Scrubber Range & Progress
    const sliderInput = document.getElementById('tl-slider-input');
    if (sliderInput) sliderInput.value = index;

    const progressFill = document.getElementById('tl-progress-fill');
    if (progressFill) {
      progressFill.style.width = ((index / (TIMELINE_EPOCHS.length - 1)) * 100) + '%';
    }

    document.querySelectorAll('.timeline-node').forEach(node => {
      const nIdx = parseInt(node.dataset.epoch, 10);
      node.classList.toggle('active', nIdx === index);
    });

    // Update Title, Badge, and Summary Lore
    const titleEl = document.getElementById('tl-epoch-title');
    if (titleEl) titleEl.textContent = isBn ? epoch.name : epoch.nameEn;

    const badgeEl = document.getElementById('tl-epoch-badge');
    if (badgeEl) badgeEl.textContent = epoch.badge;

    const descEl = document.getElementById('tl-lore-desc');
    if (descEl) descEl.textContent = isBn ? epoch.summary : epoch.summaryEn;

    const changesGrid = document.getElementById('tl-changes-grid');
    if (changesGrid && epoch.planetChanges) {
      changesGrid.innerHTML = epoch.planetChanges.map(c => `
        <div class="change-chip">
          <span class="chip-planet">${c.id.replace('_', ' ').toUpperCase()}:</span>
          <span>${isBn ? c.descBn : c.descEn}</span>
        </div>
      `).join('');
    }

    // Cached Textures Helper
    if (!this.cachedTextures) this.cachedTextures = {};
    const getTex = (key, fn) => {
      if (!this.cachedTextures[key]) {
        this.cachedTextures[key] = fn();
      }
      return this.cachedTextures[key];
    };

    // Update Sun
    const sunPlanet = this.planets.find(p => p.data.id === 'sun');
    if (sunPlanet && epoch.sunState) {
      const s = epoch.sunState.scale || 1.0;
      sunPlanet.mesh.scale.set(s, s, s);
      if (this.sunCorona) {
        this.sunCorona.scale.set(sunPlanet.data.size * 5.4 * s, sunPlanet.data.size * 5.4 * s, 1);
      }
      if (this.sunLight) {
        this.sunLight.color.setHex(epoch.sunState.lightColor);
        this.sunLight.intensity = epoch.sunState.lightIntensity;
      }
    }

    // Planetary Nebula Ring
    if (this.planetaryNebulaRing) {
      this.planetaryNebulaRing.visible = (epoch.id === 'white_dwarf');
    }

    // Chronos Rings Opacity
    if (this.chronosRingMesh) {
      if (epoch.id === 'white_dwarf') {
        this.chronosRingMesh.material.opacity = 0.22;
      } else if (epoch.id === 'primordial') {
        this.chronosRingMesh.material.opacity = 0.45;
      } else {
        this.chronosRingMesh.material.opacity = 0.94;
      }
    }

    // Update Terra Nova
    const terra = this.planets.find(p => p.data.id === 'terra_nova');
    if (terra && terra.mesh) {
      let tTex;
      if (epoch.id === 'primordial') {
        tTex = getTex('molten_earth', () => TextureGenerator.createIoTexture());
      } else if (epoch.id === 'red_giant') {
        tTex = getTex('scorched_earth', () => TextureGenerator.createScorchedEarthTexture());
      } else if (epoch.id === 'white_dwarf') {
        tTex = getTex('frozen_earth', () => TextureGenerator.createFrozenEarthTexture());
      } else {
        tTex = getTex('normal_earth', () => TextureGenerator.createEarthTexture());
      }
      if (!this.isThermalMode) {
        terra.mesh.material.map = tTex;
        terra.mesh.material.needsUpdate = true;
      }
      if (terra.originalMaterial) {
        terra.originalMaterial.map = tTex;
        terra.originalMaterial.needsUpdate = true;
      }
    }

    // Update Ares Crimson
    const ares = this.planets.find(p => p.data.id === 'ares_crimson');
    if (ares && ares.mesh) {
      let aTex;
      if (epoch.id === 'primordial') {
        aTex = getTex('molten_ares', () => TextureGenerator.createRockyTexture(512, 256, 0.08));
      } else if (epoch.id === 'ancient') {
        aTex = getTex('ancient_ares', () => TextureGenerator.createAncientMarsTexture());
      } else if (epoch.id === 'terraformed') {
        aTex = getTex('terraformed_ares', () => TextureGenerator.createTerraformedMarsTexture());
      } else if (epoch.id === 'white_dwarf') {
        aTex = getTex('frozen_earth', () => TextureGenerator.createFrozenEarthTexture());
      } else {
        aTex = getTex('normal_ares', () => TextureGenerator.createMarsTexture());
      }
      if (!this.isThermalMode) {
        ares.mesh.material.map = aTex;
        ares.mesh.material.needsUpdate = true;
      }
      if (ares.originalMaterial) {
        ares.originalMaterial.map = aTex;
        ares.originalMaterial.needsUpdate = true;
      }
    }

    // Update Moons: Europa & Titan
    const europa = this.moons.find(m => m.data.id === 'zeus_europa');
    if (europa && europa.mesh) {
      let eTex;
      if (epoch.id === 'red_giant') {
        eTex = getTex('tropical_moon', () => TextureGenerator.createTropicalOceanTexture());
      } else {
        eTex = getTex('normal_europa', () => TextureGenerator.createEuropaTexture());
      }
      europa.mesh.material.map = eTex;
      europa.mesh.material.needsUpdate = true;
    }

    const titan = this.moons.find(m => m.data.id === 'chronos_titan');
    if (titan && titan.mesh) {
      let tiTex;
      if (epoch.id === 'red_giant') {
        tiTex = getTex('tropical_moon', () => TextureGenerator.createTropicalOceanTexture());
      } else if (epoch.id === 'white_dwarf') {
        tiTex = getTex('frozen_earth', () => TextureGenerator.createFrozenEarthTexture());
      } else {
        tiTex = getTex('normal_titan', () => TextureGenerator.createTitanTexture());
      }
      titan.mesh.material.map = tiTex;
      titan.mesh.material.needsUpdate = true;
    }
  }

  updateLanguageTexts() {
    const isBn = this.currentLanguage === 'bn';
    const dict = STRINGS[this.currentLanguage] || STRINGS.en;

    const elIds = {
      'header-title': dict.title,
      'header-subtitle': dict.subtitle,
      'audio-lbl': dict.audio,
      'tour-lbl': dict.tour,
      'info-lbl': dict.info,
      'capture-lbl': dict.capture,
      'thermal-lbl': dict.thermal,
      'search-lbl': dict.search,
      'toggle-info-lbl': dict.info,
      'toggle-orbits-lbl': dict.orbits,
      'toggle-hud-lbl': dict.hud,
      'toggle-grid-lbl': dict.grid,
      'toggle-trails-lbl': dict.trails,
      'toggle-events-lbl': dict.events,
      'toggle-const-lbl': dict.constellations,
      'toggle-nebula-lbl': dict.nebula,
      'btn-scale-compare': dict.scaleCompare,
      'btn-export-json': dict.exportJson,
      'scale-title-text': dict.scaleTitle,
      'scale-sub-text': dict.scaleSubtitle,
      'solar-flare-alert-text': dict.solarFlareAlert
    };

    for (const [id, txt] of Object.entries(elIds)) {
      const el = document.getElementById(id);
      if (el) el.textContent = txt;
    }

    const searchInput = document.getElementById('cmd-palette-input');
    if (searchInput) searchInput.placeholder = dict.searchPlaceholder;

    this.planets.forEach(p => {
      const hudItem = this.hudElements.get(p.data.id);
      if (hudItem) {
        const titleEl = hudItem.dom.querySelector('.hud-tag-title');
        if (titleEl) titleEl.textContent = isBn ? p.data.name : p.data.nameEn;
      }
    });

    if (this.selectedBody) {
      if (this.selectedBody.isMoon) {
        const moonObj = this.moons.find(m => m.data.id === this.selectedBody.data.id);
        if (moonObj) this.updateMoonTelemetryCard(moonObj.data, moonObj.parentPlanet);
      } else {
        this.updateTelemetryCard(this.selectedBody.data);
      }
    }

    // Update Timeline labels & lore texts
    const tlEpoch = (typeof TIMELINE_EPOCHS !== 'undefined') ? TIMELINE_EPOCHS[this.currentEpochIndex] : null;
    if (tlEpoch) {
      const tlTitle = document.getElementById('tl-epoch-title');
      if (tlTitle) tlTitle.textContent = isBn ? tlEpoch.name : tlEpoch.nameEn;
      const tlDesc = document.getElementById('tl-lore-desc');
      if (tlDesc) tlDesc.textContent = isBn ? tlEpoch.summary : tlEpoch.summaryEn;
      const tlBadge = document.getElementById('tl-epoch-badge');
      if (tlBadge) tlBadge.textContent = tlEpoch.badge;
      const changesGrid = document.getElementById('tl-changes-grid');
      if (changesGrid && tlEpoch.planetChanges) {
        changesGrid.innerHTML = tlEpoch.planetChanges.map(c => `
          <div class="change-chip">
            <span class="chip-planet">${c.id.replace('_', ' ').toUpperCase()}:</span>
            <span>${isBn ? c.descBn : c.descEn}</span>
          </div>
        `).join('');
      }
    }
    const tlPlayBtn = document.getElementById('tl-play-pause-btn');
    if (tlPlayBtn) {
      tlPlayBtn.textContent = this.isTimelineAutoPlaying
        ? (isBn ? '⏸ থামান' : '⏸ Pause Epochs')
        : (isBn ? '▶ চালান' : '▶ Play Epochs');
    }
    const tlLbl = document.getElementById('timeline-lbl');
    if (tlLbl) {
      tlLbl.textContent = dict.timeline || (isBn ? '⏳ টাইমলাইন' : '⏳ Timeline');
    }
  }

  updatePerfMonitor() {
    if (!this.perfVisible) return;
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsUpdate >= 500) {
      this.fps = Math.round((this.frameCount * 1000) / (now - this.lastFpsUpdate));
      this.frameCount = 0;
      this.lastFpsUpdate = now;

      const perfEl = document.getElementById('perf-monitor');
      if (perfEl && this.renderer) {
        const info = this.renderer.info;
        const dc = info.render.calls;
        const tris = Math.round(info.render.triangles / 1000);
        const col = this.fps >= 50 ? '#22c55e' : (this.fps >= 30 ? '#f59e0b' : '#ef4444');
        perfEl.style.color = col;
        perfEl.innerHTML = `FPS: ${this.fps} | DC: ${dc} | Tris: ${tris}k | Mode: ${this.cameraMode.toUpperCase()}`;
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = 0.016;

    if (this.isPlaying) {
      this.time += delta * this.timeScale;
      // 1 sim-day per 10 real seconds at 1x
      this.simTimeDays += (delta * this.timeScale) * 0.1;

      // Update Simulation Clock
      const clockEl = document.getElementById('sim-clock-display');
      if (clockEl) {
        const epochYear = (2349.117 + this.simTimeDays / 365.25).toFixed(3);
        clockEl.textContent = `T+ ${this.simTimeDays.toFixed(2)} d | EPOCH ${epochYear} CE | ${this.timeScale.toFixed(2)}× RT`;
      }

      this.planets.forEach(p => {
        const data = p.data;

        if (p.mesh) {
          p.mesh.rotation.y += data.rotationSpeed * this.timeScale;
        }

        if (data.orbitRadius > 0) {
          p.angle += data.orbitSpeed * this.timeScale * 0.4;

          const a = data.orbitRadius;
          const b = data.orbitRadius * (1 - (data.eccentricity || 0));
          const inc = data.inclination || 0;

          const x = Math.cos(p.angle) * a;
          const z = Math.sin(p.angle) * b;
          const y = Math.sin(p.angle) * a * Math.sin(inc);

          p.group.position.set(x, y, z);
        }
      });

      // Update Comet Halcyon-C Dual Tails
      if (this.cometSystem) {
        const comet = this.cometSystem;
        const p = this.planets.find(pl => pl.data.id === comet.data.id);
        if (p) {
          const cPos = new THREE.Vector3();
          p.group.getWorldPosition(cPos);

          const sunDist = cPos.length();
          const isTailActive = sunDist < 85;
          comet.ionTail.visible = isTailActive;
          comet.dustTail.visible = isTailActive;

          if (isTailActive) {
            const awayDir = cPos.clone().normalize();
            const ionAttr = comet.ionTail.geometry.attributes.position;
            const dustAttr = comet.dustTail.geometry.attributes.position;

            for (let i = 0; i < 400; i++) {
              const dIon = (i / 400) * 22;
              const spread = (Math.random() - 0.5) * (dIon * 0.08);
              ionAttr.setXYZ(
                i,
                cPos.x + awayDir.x * dIon + spread,
                cPos.y + awayDir.y * dIon + spread,
                cPos.z + awayDir.z * dIon + spread
              );

              const dDust = (i / 400) * 16;
              const curve = Math.pow(i / 400, 1.8) * 4.5;
              dustAttr.setXYZ(
                i,
                cPos.x + awayDir.x * dDust + curve * 0.6,
                cPos.y + awayDir.y * dDust + (Math.random() - 0.5) * 0.8,
                cPos.z + awayDir.z * dDust - curve * 0.4
              );
            }
            ionAttr.needsUpdate = true;
            dustAttr.needsUpdate = true;
          }
        }
      }

      this.moons.forEach(m => {
        m.angle += m.speed * this.timeScale * 0.5;
        m.mesh.position.set(
          Math.cos(m.angle) * m.data.distance,
          0,
          Math.sin(m.angle) * m.data.distance
        );
        m.mesh.rotation.y += 0.01 * this.timeScale;
      });

      this.orbitPulses.forEach(pulse => {
        pulse.progress = (pulse.progress + pulse.data.orbitSpeed * 0.5 * this.timeScale) % 1.0;
        const theta = pulse.progress * Math.PI * 2;
        const a = pulse.data.orbitRadius;
        const b = pulse.data.orbitRadius * (1 - (pulse.data.eccentricity || 0));
        const inc = pulse.data.inclination || 0;

        pulse.mesh.position.set(
          Math.cos(theta) * a,
          Math.sin(theta) * a * Math.sin(inc),
          Math.sin(theta) * b
        );
      });

      if (this.solarWindParticles) {
        const pos = this.solarWindParticles.mesh.geometry.attributes.position.array;
        const vels = this.solarWindParticles.velocities;
        for (let i = 0; i < this.solarWindParticles.count; i++) {
          vels[i].dist += vels[i].speed * this.timeScale;
          if (vels[i].dist > 115) {
            vels[i].dist = 6 + Math.random() * 2;
          }
          pos[i * 3] = vels[i].dir.x * vels[i].dist;
          pos[i * 3 + 1] = vels[i].dir.y * vels[i].dist;
          pos[i * 3 + 2] = vels[i].dir.z * vels[i].dist;
        }
        this.solarWindParticles.mesh.geometry.attributes.position.needsUpdate = true;
      }

      if (this.asteroidBelt) {
        this.asteroidBelt.rotation.y += 0.0006 * this.timeScale;
      }

      if (this.nebulaSkybox) {
        this.nebulaSkybox.rotation.y += 0.0001;
      }

      this.updateWaveRings(delta * this.timeScale);
      this.updateOrbitalTrails();
      this.updateSolarFlare(delta * this.timeScale);

      if (this.isAutoTouring) {
        this.tourTimer += delta;
        if (this.tourTimer > 8.0) {
          this.tourTimer = 0;
          this.tourIndex = (this.tourIndex + 1) % this.planets.length;
          this.selectCelestialBody(this.planets[this.tourIndex].data.id);
        }
      }

      // Cosmic Timeline Auto-Play Evolution Scrubber
      if (this.isTimelineAutoPlaying && typeof TIMELINE_EPOCHS !== 'undefined') {
        this.timelineAutoPlayTimer += delta;
        if (this.timelineAutoPlayTimer >= 6.5) {
          this.timelineAutoPlayTimer = 0;
          const nextEpoch = (this.currentEpochIndex + 1) % TIMELINE_EPOCHS.length;
          this.applyEpoch(nextEpoch, true);
        }
      }

      // Rotate Planetary Nebula Ring in White Dwarf epoch
      if (this.planetaryNebulaRing && this.planetaryNebulaRing.visible) {
        this.planetaryNebulaRing.rotation.z += 0.0012 * this.timeScale;
      }
    }

    /**
     * CAMERA MODES & ZERO-DRIFT TRACKING
     */
    if (this.cameraMode === 'orbit' && !this.cameraAnimation) {
      const angle = 0.008 * this.timeScale;
      const offset = this.camera.position.clone().sub(this.controls.target);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
      this.camera.position.copy(this.controls.target).add(offset);
    } else if (this.cameraMode === 'fly' && this.selectedBody && !this.cameraAnimation) {
      this.flySinTime = (this.flySinTime || 0) + delta * 0.45 * this.timeScale;
      const radius = Math.max(this.selectedBody.data.size * 5, 14);
      const targetPos = new THREE.Vector3();
      this.selectedBody.group.getWorldPosition(targetPos);
      const fx = Math.cos(this.flySinTime) * radius;
      const fy = Math.sin(this.flySinTime * 1.4) * (radius * 0.35);
      const fz = Math.sin(this.flySinTime) * radius;
      this.camera.position.set(targetPos.x + fx, targetPos.y + fy, targetPos.z + fz);
    }

    if (this.isTracking && this.selectedBody) {
      const currentTargetPos = new THREE.Vector3();
      this.selectedBody.group.getWorldPosition(currentTargetPos);

      if (this.lastTrackedTargetPos) {
        const deltaPos = currentTargetPos.clone().sub(this.lastTrackedTargetPos);
        this.camera.position.add(deltaPos);

        if (this.cameraAnimation) {
          this.cameraAnimation.toPos.add(deltaPos);
          this.cameraAnimation.toTarget.add(deltaPos);
        }
      }

      this.controls.target.copy(currentTargetPos);
      this.lastTrackedTargetPos = currentTargetPos.clone();

      if (this.focusSpotlight && this.focusSpotlight.visible) {
        const sz = this.selectedBody.data.size || 2.0;
        this.focusSpotlight.position.copy(currentTargetPos).add(new THREE.Vector3(sz * 2, sz * 3, sz * 2.5));
      }
      if (this.selectionReticle && this.selectionReticle.visible) {
        this.selectionReticle.position.copy(currentTargetPos);
        this.selectionReticle.lookAt(this.camera.position);
        this.selectionReticle.rotation.z += 0.01;
      }
    } else {
      this.lastTrackedTargetPos = null;
    }

    this.updateCameraAnimation();
    this.controls.update();
    this.updateHudPositions();
    this.updatePerfMonitor();
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.simulation = new CelestialSimulation();
});
