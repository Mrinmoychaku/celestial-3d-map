/**
 * CELESTIAL MECHANICS 3D SIMULATION ENGINE - ENHANCED VISUAL EDITION
 * Ultra-detailed planetary textures, comprehensive moon systems (উপগ্রহ মণ্ডল),
 * volumetric nebulae, solar wind particles, atmospheric glow, and astrometric blueprint HUD.
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
    this.cloudsMesh = null; // Terra Nova cloud shell

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

    // Layer visibility
    this.showOrbits = true;
    this.showHudLabels = true;
    this.showGrid = true;
    this.showAsteroids = true;

    // Raycaster for click/hover
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // HUD DOM elements
    this.hudElements = new Map();
    this.selectionRing = null;

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

    console.log("Celestial 3D Simulation initialized with full visual details and moon systems.");
  }

  setupThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040b, 0.0011);

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 3000);
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
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 3.5;
    this.controls.maxDistance = 750;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.18;
    this.controls.target.copy(this.defaultTarget);
  }

  setupLighting() {
    // Ambient deep cosmic light
    const ambientLight = new THREE.AmbientLight(0x18243c, 0.85);
    this.scene.add(ambientLight);

    // Sun Primary PointLight
    const sunLight = new THREE.PointLight(0xfff0dc, 3.4, 1200, 1.1);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    // Secondary fill light for 3D sphere relief
    const dirLight = new THREE.DirectionalLight(0x7090b8, 0.45);
    dirLight.position.set(45, 90, 45);
    this.scene.add(dirLight);
  }

  setupStarfield() {
    const starCount = 4200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorChoices = [
      new THREE.Color(0xaaccff), // Blue-white
      new THREE.Color(0xffffff), // Pure white
      new THREE.Color(0xffe4b5), // Warm gold
      new THREE.Color(0x70e0ff), // Cyan
      new THREE.Color(0xffb07c)  // Terracotta
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
    // Soft volumetric nebula clouds in background
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
    // Radiant particles streaming outward from the Sun
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

    // Concentric celestial distance rings
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

    // Radial coordinate spokes
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

    // Central Blueprint Compass Reticle
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
    // Oscillating waveform line seen in the reference blueprint (mid-left)
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
        // High-res Sun Sphere
        const geo = new THREE.SphereGeometry(data.size, 64, 64);
        const tex = TextureGenerator.createSunTexture();
        const mat = new THREE.MeshBasicMaterial({ map: tex });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        // Multi-tier Radiant Corona Sprites
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

        // Secondary white-hot glare core
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
        // Secondary Luminous Beacon Node
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
        // Standard Planets with custom procedural textures
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
          roughness: 0.7,
          metalness: 0.12
        });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        // 3D Atmosphere Glow Rim Shell
        if (data.hasAtmosphereGlow) {
          const atmoGeo = new THREE.SphereGeometry(data.size * 1.055, 36, 36);
          const atmoMat = new THREE.MeshBasicMaterial({
            color: data.atmosphereColor || 0x00f0ff,
            transparent: true,
            opacity: 0.24,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
          });
          const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
          group.add(atmoMesh);
        }

        // Terra Nova: Separate 3D Volumetric Swirling Cloud Layer
        if (data.hasClouds) {
          const cloudGeo = new THREE.SphereGeometry(data.size * 1.022, 48, 48);
          const cloudTex = TextureGenerator.createEarthCloudsTexture();
          const cloudMat = new THREE.MeshStandardMaterial({
            map: cloudTex,
            transparent: true,
            opacity: 0.85,
            blending: THREE.NormalBlending,
            depthWrite: false
          });
          this.cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
          group.add(this.cloudsMesh);
        }

        // Saturn-like Chronos Magister Rings
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

        // Uranus-like Aether Cyan Vertical Dust Rings
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

        // Comprehensive Moon Systems (উপগ্রহ মণ্ডল)
        if (data.moons && data.moons.length > 0) {
          data.moons.forEach(m => {
            const moonPivot = new THREE.Group();
            moonPivot.rotation.x = m.orbitTilt || 0;

            // Moon circular orbit track
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

            // Moon sphere mesh with custom procedural texture
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

      // Create Primary Orbit Path Line & Travelling Signal Pulse
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

    // 3D Selection Reticle Ring
    const retGeo = new THREE.RingGeometry(1.2, 1.35, 32);
    const retMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.selectionRing = new THREE.Mesh(retGeo, retMat);
    this.selectionRing.visible = false;
    this.scene.add(this.selectionRing);
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
      opacity: 0.44
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

  selectCelestialBody(bodyId) {
    const planetObj = this.planets.find(p => p.data.id === bodyId);
    if (!planetObj) return;

    this.selectedBody = planetObj;
    this.isTracking = true;

    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
      window.cosmicAudio.playWhoosh();
    }

    this.updateTelemetryCard(planetObj.data);

    const targetWorldPos = new THREE.Vector3();
    planetObj.group.getWorldPosition(targetWorldPos);

    const offsetDist = Math.max(planetObj.data.size * 3.6, 12);
    const cameraTargetPos = targetWorldPos.clone().add(new THREE.Vector3(offsetDist * 0.8, offsetDist * 0.5, offsetDist));

    this.startCameraAnimation(cameraTargetPos, targetWorldPos, 1200);

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

    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
      window.cosmicAudio.playWhoosh();
    }

    this.updateMoonTelemetryCard(moonEntry.data, moonEntry.parentPlanet);

    const targetWorldPos = new THREE.Vector3();
    moonEntry.mesh.getWorldPosition(targetWorldPos);

    const offsetDist = Math.max(moonEntry.data.size * 4.5, 3.8);
    const cameraTargetPos = targetWorldPos.clone().add(new THREE.Vector3(offsetDist * 0.8, offsetDist * 0.4, offsetDist));

    this.startCameraAnimation(cameraTargetPos, targetWorldPos, 1100);
  }

  startCameraAnimation(toPos, toTarget, duration = 1000) {
    this.cameraAnimation = {
      fromPos: this.camera.position.clone(),
      toPos: toPos,
      fromTarget: this.controls.target.clone(),
      toTarget: toTarget,
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
    this.startCameraAnimation(this.defaultCameraPos, this.defaultTarget, 1400);

    document.querySelectorAll('.hud-tag').forEach(tag => tag.classList.remove('active'));
    document.getElementById('telemetry-card').classList.remove('visible');
    
    if (window.cosmicAudio) {
      window.cosmicAudio.playWhoosh();
    }
  }

  updateTelemetryCard(data) {
    const card = document.getElementById('telemetry-card');
    card.classList.add('visible');

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

    // Render Sub-Moons List inside Telemetry Card
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
  }

  updateMoonTelemetryCard(moonData, parentPlanet) {
    const card = document.getElementById('telemetry-card');
    card.classList.add('visible');

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

    // Raycast on click for Planets & Moons
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
        // Check if planet
        const hitPlanet = this.planets.find(p => p.mesh === hitMesh);
        if (hitPlanet) {
          this.selectCelestialBody(hitPlanet.data.id);
          return;
        }
        // Check if moon
        const hitMoon = this.moons.find(m => m.mesh === hitMesh);
        if (hitMoon) {
          this.selectMoon(hitMoon);
        }
      }
    });

    // Hover cursor
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

    const hudToggle = document.getElementById('toggle-hud');
    if (hudToggle) {
      hudToggle.addEventListener('change', (e) => {
        this.showHudLabels = e.target.checked;
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
        document.getElementById('telemetry-card').classList.remove('visible');
        this.isTracking = false;
        this.selectedBody = null;
      });
    }
  }

  updateLanguageTexts() {
    const isBn = this.currentLanguage === 'bn';
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

      // Update planetary axial rotations and orbital revolutions
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

      // Terra Nova: Independent atmospheric cloud shell rotation
      if (this.cloudsMesh) {
        this.cloudsMesh.rotation.y += 0.0018 * this.timeScale;
      }

      // Update Moons revolving around parent planets
      this.moons.forEach(m => {
        m.angle += m.speed * this.timeScale * 0.5;
        m.mesh.position.set(
          Math.cos(m.angle) * m.data.distance,
          0,
          Math.sin(m.angle) * m.data.distance
        );
        m.mesh.rotation.y += 0.01 * this.timeScale;
      });

      // Orbit signal pulses
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

      // Solar wind particle animation
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

      // Asteroid belt drift
      if (this.asteroidBelt) {
        this.asteroidBelt.rotation.y += 0.0006 * this.timeScale;
      }

      // Auto Tour logic
      if (this.isAutoTouring) {
        this.tourTimer += delta;
        if (this.tourTimer > 8.0) {
          this.tourTimer = 0;
          this.tourIndex = (this.tourIndex + 1) % this.planets.length;
          this.selectCelestialBody(this.planets[this.tourIndex].data.id);
        }
      }
    }

    // Camera follow / tracking
    if (this.isTracking && this.selectedBody && !this.cameraAnimation) {
      const targetPos = new THREE.Vector3();
      this.selectedBody.group.getWorldPosition(targetPos);
      this.controls.target.copy(targetPos);
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
