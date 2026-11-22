/**
 * CELESTIAL MECHANICS 3D SIMULATION ENGINE - HIGH-PRECISION SURFACE & TARGET FOCUS EDITION
 * Fixes:
 * 1. Removed atmospheric haze/wind particle obscurities to render ultra-sharp planetary surfaces & terrain.
 * 2. Strictly honors the Labels toggle (OFF by default, persistent in localStorage, never re-opens if turned off).
 * 3. Rock-solid camera tracking (delta-position lock so camera never drifts while planet orbits) + High-intensity Planet Highlighting (Spotlight & HUD Lock Reticle).
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

    // Simulation state
    this.time = 0;
    this.timeScale = 1.0;
    this.isPlaying = true;
    this.currentLanguage = 'bn'; // 'bn' or 'en'
    this.selectedBody = null;
    this.isTracking = false;
    this.isAutoTouring = false;
    this.tourIndex = 0;
    this.tourTimer = 0;

    // Camera animation state
    this.cameraAnimation = null;
    this.defaultCameraPos = new THREE.Vector3(0, 85, 135);
    this.defaultTarget = new THREE.Vector3(0, 0, 0);

    // Layer visibility (Labels & Info Card OFF by default to keep planet view clean!)
    this.showOrbits = true;
    const savedHud = localStorage.getItem('showHudLabels');
    this.showHudLabels = savedHud === 'true'; // false by default
    const savedInfo = localStorage.getItem('showInfoCard');
    this.showInfoCard = savedInfo === 'true'; // false by default as requested!
    this.showGrid = true;
    this.showAsteroids = true;

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
    this.setupSolarWind();
    this.setupCoordinateGrid();
    this.setupGravitationalWaveTrack();
    this.buildSolarSystem();
    this.buildAsteroidBelt();
    this.setupEvents();
    this.setupHudUi();

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    console.log("Celestial 3D Simulation initialized (Surface Detail & Target Lock Edition).");
  }

  setupThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040b, 0.0011);

    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.5, 3000);
    this.camera.position.copy(this.defaultCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.35;
    this.container.appendChild(this.renderer.domElement);

    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.minDistance = 2.2;
    this.controls.maxDistance = 750;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.18;
    this.controls.target.copy(this.defaultTarget);
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x22304d, 0.95);
    this.scene.add(ambientLight);

    // Primary Sun PointLight
    const sunLight = new THREE.PointLight(0xfff5e6, 3.6, 1400, 1.0);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    const dirLight = new THREE.DirectionalLight(0x80a0cc, 0.5);
    dirLight.position.set(45, 90, 45);
    this.scene.add(dirLight);

    // Dedicated Dynamic Focus Spotlight for selected planet highlighting
    this.focusSpotlight = new THREE.PointLight(0xffffff, 0, 80, 1.2);
    this.scene.add(this.focusSpotlight);
  }

  setupStarfield() {
    const starCount = 4200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

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

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.5 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.88
    });

    const starPoints = new THREE.Points(geometry, material);
    this.scene.add(starPoints);
  }

  setupNebulae() {
    const nebulaColors = ['#2e1065', '#1e3a8a', '#065f46', '#701a75'];
    nebulaColors.forEach((col, idx) => {
      const tex = TextureGenerator.createNebulaTexture(col, 512);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.28
      });
      const sprite = new THREE.Sprite(mat);
      const angle = (idx / nebulaColors.length) * Math.PI * 2 + 0.4;
      const dist = 320 + idx * 40;
      sprite.position.set(
        Math.cos(angle) * dist,
        (Math.random() - 0.5) * 80,
        Math.sin(angle) * dist
      );
      sprite.scale.set(240, 240, 1);
      this.scene.add(sprite);
      this.nebulaClouds.push(sprite);
    });
  }

  setupSolarWind() {
    const count = 350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5),
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5)
      ).normalize();

      const dist = 6 + Math.random() * 90;
      positions[i * 3] = dir.x * dist;
      positions[i * 3 + 1] = dir.y * dist;
      positions[i * 3 + 2] = dir.z * dist;

      velocities.push({
        dir: dir,
        speed: 0.25 + Math.random() * 0.35,
        dist: dist
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffcc66,
      size: 1.2,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });

    this.solarWindParticles = {
      mesh: new THREE.Points(geometry, material),
      velocities: velocities,
      count: count
    };
    this.scene.add(this.solarWindParticles.mesh);
  }

  setupCoordinateGrid() {
    this.gridGroup = new THREE.Group();

    const radii = [10, 15, 23, 32, 44, 58, 72, 86, 110];
    radii.forEach((r, idx) => {
      const ringGeo = new THREE.BufferGeometry();
      const segments = 160;
      const positions = new Float32Array((segments + 1) * 3);
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * r;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(theta) * r;
      }
      ringGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const ringMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x1b4b75 : 0x10314f,
        transparent: true,
        opacity: 0.32
      });
      this.gridGroup.add(new THREE.Line(ringGeo, ringMat));
    });

    const spokeCount = 12;
    for (let i = 0; i < spokeCount; i++) {
      const angle = (i / spokeCount) * Math.PI * 2;
      const spokeGeo = new THREE.BufferGeometry();
      const positions = new Float32Array([
        0, 0, 0,
        Math.cos(angle) * 115, 0, Math.sin(angle) * 115
      ]);
      spokeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const spokeMat = new THREE.LineBasicMaterial({
        color: 0x143c60,
        transparent: true,
        opacity: 0.22
      });
      this.gridGroup.add(new THREE.Line(spokeGeo, spokeMat));
    }

    const reticleGeo = new THREE.RingGeometry(6.8, 7.2, 64);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.rotation.x = Math.PI / 2;
    this.gridGroup.add(reticleMesh);

    this.scene.add(this.gridGroup);
  }

  setupGravitationalWaveTrack() {
    const points = [];
    const count = 120;
    const startX = -35;
    const endX = 2;
    const baseZ = 18;

    for (let i = 0; i <= count; i++) {
      const t = i / count;
      const x = startX + t * (endX - startX);
      const wave = Math.sin(t * Math.PI * 8) * 1.8 * Math.sin(t * Math.PI);
      points.push(new THREE.Vector3(x, wave, baseZ + t * 4));
    }

    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: 0xff9933,
      transparent: true,
      opacity: 0.65
    });
    const waveLine = new THREE.Line(geo, mat);
    this.gridGroup.add(waveLine);
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

      } else {
        // High-Precision Surface Spheres with direct crystal-clear rendering
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
    const segments = 160;
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
    const count = 1450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const minR = 36.0;
    const maxR = 41.8;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = minR + Math.random() * (maxR - minR);
      const y = (Math.random() - 0.5) * 3.2;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      const shade = 0.45 + Math.random() * 0.45;
      colors[i * 3] = shade * 0.95;
      colors[i * 3 + 1] = shade * 0.88;
      colors[i * 3 + 2] = shade * 0.80;

      scales[i] = Math.random() * 0.8 + 0.35;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.95,
      vertexColors: true,
      transparent: true,
      opacity: 0.78
    });

    this.asteroidBelt = new THREE.Points(geometry, material);
    this.scene.add(this.asteroidBelt);
  }

  createHudLabel(data) {
    const el = document.createElement('div');
    el.className = 'hud-tag';
    el.id = `tag-${data.id}`;
    el.innerHTML = `
      <div class="hud-tag-header">
        <span class="hud-tag-indicator" style="background: ${data.color}"></span>
        <span class="hud-tag-title">${this.currentLanguage === 'bn' ? data.name : data.nameEn}</span>
      </div>
      <div class="hud-tag-sub">${data.type.split(' ')[0]} // ${data.distanceAu}</div>
    `;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      this.selectCelestialBody(data.id);
    });

    this.hudContainer.appendChild(el);
    this.hudElements.set(data.id, {
      dom: el,
      data: data
    });
  }

  /**
   * STRICT HUD LABEL POSITIONING
   * If this.showHudLabels is false, NEVER renders tags or SVG lines!
   */
  updateHudPositions() {
    if (!this.showHudLabels) {
      this.hudContainer.style.display = 'none';
      this.svgLinesContainer.innerHTML = '';
      return;
    }
    this.hudContainer.style.display = 'block';

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const svgLines = [];
    const tempV = new THREE.Vector3();

    this.planets.forEach(p => {
      const hudItem = this.hudElements.get(p.data.id);
      if (!hudItem) return;

      p.group.getWorldPosition(tempV);
      const worldPos = tempV.clone();

      tempV.project(this.camera);

      const isBehind = tempV.z > 1.0;
      if (isBehind) {
        hudItem.dom.style.display = 'none';
        return;
      }

      const screenX = (tempV.x * 0.5 + 0.5) * width;
      const screenY = (-tempV.y * 0.5 + 0.5) * height;

      const dist = this.camera.position.distanceTo(worldPos);
      if (dist > 380 || dist < 7) {
        hudItem.dom.style.opacity = '0.2';
      } else {
        hudItem.dom.style.opacity = '1.0';
      }

      hudItem.dom.style.display = 'block';
      const tagOffsetX = 35;
      const tagOffsetY = -30;
      const tagX = screenX + tagOffsetX;
      const tagY = screenY + tagOffsetY;

      hudItem.dom.style.left = `${tagX}px`;
      hudItem.dom.style.top = `${tagY}px`;

      const elbowX = screenX + 18;
      const elbowY = tagY + 12;
      svgLines.push(`
        <circle cx="${screenX}" cy="${screenY}" r="3" fill="${p.data.color}" opacity="0.85" />
        <polyline points="${screenX},${screenY} ${elbowX},${elbowY} ${tagX},${elbowY}" 
                  fill="none" stroke="${p.data.color}" stroke-width="1.2" stroke-opacity="0.45" stroke-dasharray="3,2" />
      `);
    });

    this.svgLinesContainer.innerHTML = svgLines.join('');
  }

  /**
   * SELECT & HIGHLIGHT CELESTIAL BODY
   * Locks the camera directly onto the planet, illuminates surface, and focuses reticle.
   */
  selectCelestialBody(bodyId) {
    const planetObj = this.planets.find(p => p.data.id === bodyId);
    if (!planetObj) return;

    this.selectedBody = planetObj;
    this.isTracking = true;

    // Reset tracked position to current planet position
    const targetWorldPos = new THREE.Vector3();
    planetObj.group.getWorldPosition(targetWorldPos);
    this.lastTrackedTargetPos = targetWorldPos.clone();

    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
      window.cosmicAudio.playWhoosh();
    }

    this.updateTelemetryCard(planetObj.data);

    // Position camera focused directly in front of the planet
    const offsetDist = Math.max(planetObj.data.size * 3.2, 11);
    const cameraTargetPos = targetWorldPos.clone().add(new THREE.Vector3(offsetDist * 0.8, offsetDist * 0.45, offsetDist));

    this.startCameraAnimation(cameraTargetPos, targetWorldPos, 1000);

    // HIGHLIGHT THE FOCUSED PLANET
    this.highlightBody(planetObj.data, targetWorldPos);

    document.querySelectorAll('.hud-tag').forEach(tag => tag.classList.remove('active'));
    const activeTag = document.getElementById(`tag-${bodyId}`);
    if (activeTag) activeTag.classList.add('active');
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
  }

  highlightBody(data, worldPos) {
    // 1. Spotlight directly onto the planet's surface
    if (this.focusSpotlight) {
      this.focusSpotlight.color.set(data.color || 0xffffff);
      this.focusSpotlight.intensity = 3.2;
      this.focusSpotlight.distance = Math.max(data.size * 8, 40);
      this.focusSpotlight.position.copy(worldPos).add(new THREE.Vector3(data.size * 2, data.size * 3, data.size * 2.5));
      this.focusSpotlight.visible = true;
    }

    // 2. Astrometric HUD Target Reticle
    if (this.selectionReticle) {
      const scale = (data.size || 2.0) * 1.35;
      this.selectionReticle.scale.set(scale, scale, 1);
      this.selectionReticle.position.copy(worldPos);
      this.selectionReticle.material.color.set(data.color || 0x00f0ff);
      this.selectionReticle.visible = true;
    }

    // 3. Highlight selected orbit line, dim non-selected orbits
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
    localStorage.setItem('showInfoCard', this.showInfoCard ? 'true' : 'false');

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
        // If nothing is selected, focus on Terra Nova so user sees info immediately
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
      speedSelect.addEventListener('change', (e) => {
        this.timeScale = parseFloat(e.target.value);
      });
    }

    const orbitToggle = document.getElementById('toggle-orbits');
    if (orbitToggle) {
      orbitToggle.addEventListener('change', (e) => {
        this.showOrbits = e.target.checked;
        this.orbitMeshes.forEach(m => m.visible = this.showOrbits);
        this.orbitPulses.forEach(p => p.mesh.visible = this.showOrbits);
      });
    }

    // STRICT HUD LABELS TOGGLE WITH LOCALSTORAGE PERSISTENCE
    const hudToggle = document.getElementById('toggle-hud');
    if (hudToggle) {
      hudToggle.checked = this.showHudLabels;
      hudToggle.addEventListener('change', (e) => {
        this.showHudLabels = e.target.checked;
        localStorage.setItem('showHudLabels', this.showHudLabels ? 'true' : 'false');
        if (!this.showHudLabels) {
          this.hudContainer.style.display = 'none';
          this.svgLinesContainer.innerHTML = '';
        } else {
          this.updateHudPositions();
        }
      });
    }

    // INFO CARD TOGGLE (OFF by default to keep planet view clean)
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
      gridToggle.addEventListener('change', (e) => {
        this.showGrid = e.target.checked;
        if (this.gridGroup) this.gridGroup.visible = this.showGrid;
      });
    }

    const audioBtn = document.getElementById('btn-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isPlaying = window.cosmicAudio ? window.cosmicAudio.toggle() : false;
        audioBtn.classList.toggle('active', isPlaying);
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

    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCamera());
    }

    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.currentLanguage = this.currentLanguage === 'bn' ? 'en' : 'bn';
        langBtn.textContent = this.currentLanguage === 'bn' ? 'English' : 'বাংলা';
        this.updateLanguageTexts();
      });
    }

    const closeTel = document.getElementById('tel-close');
    if (closeTel) {
      closeTel.addEventListener('click', () => {
        // Closing info card dismisses popup without unselecting or breaking 3D focus
        this.setInfoCardVisibility(false);
      });
    }
  }

  updateLanguageTexts() {
    const isBn = this.currentLanguage === 'bn';

    const infoLbl = document.getElementById('info-lbl');
    if (infoLbl) infoLbl.textContent = isBn ? 'তথ্য' : 'Info';
    const toggleInfoLbl = document.getElementById('toggle-info-lbl');
    if (toggleInfoLbl) toggleInfoLbl.textContent = isBn ? 'তথ্য' : 'Info';

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
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = 0.016;

    if (this.isPlaying) {
      this.time += delta * this.timeScale;

      this.planets.forEach(p => {
        const data = p.data;

        // Axial surface rotation
        if (p.mesh) {
          p.mesh.rotation.y += data.rotationSpeed * this.timeScale;
        }

        // Orbital revolution
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

      if (this.isAutoTouring) {
        this.tourTimer += delta;
        if (this.tourTimer > 8.0) {
          this.tourTimer = 0;
          this.tourIndex = (this.tourIndex + 1) % this.planets.length;
          this.selectCelestialBody(this.planets[this.tourIndex].data.id);
        }
      }
    }

    /**
     * ROCK-SOLID CAMERA TARGET LOCKING
     * Automatically applies planet delta-movement to both camera position & controls target.
     * Prevents the camera from drifting or pivoting around the wrong location!
     */
    if (this.isTracking && this.selectedBody) {
      const currentTargetPos = new THREE.Vector3();
      this.selectedBody.group.getWorldPosition(currentTargetPos);

      if (this.lastTrackedTargetPos) {
        const deltaPos = currentTargetPos.clone().sub(this.lastTrackedTargetPos);
        // Move camera position in lockstep with the orbiting planet
        this.camera.position.add(deltaPos);

        if (this.cameraAnimation) {
          this.cameraAnimation.toPos.add(deltaPos);
          this.cameraAnimation.toTarget.add(deltaPos);
        }
      }

      this.controls.target.copy(currentTargetPos);
      this.lastTrackedTargetPos = currentTargetPos.clone();

      // Update position of highlight spotlight & reticle
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
    this.renderer.render(this.scene, this.camera);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.simulation = new CelestialSimulation();
});
