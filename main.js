/**
 * CELESTIAL MECHANICS 3D SIMULATION ENGINE
 * High-precision Three.js astronomical orrery and interactive sci-fi HUD
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
    this.orbitMeshes = [];
    this.orbitPulses = [];
    this.asteroidBelt = null;
    this.gridGroup = null;

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
    this.hoveredBody = null;

    // HUD DOM elements
    this.hudElements = new Map();
    this.selectionRing = null;

    this.init();
  }

  init() {
    this.setupThree();
    this.setupLighting();
    this.setupStarfield();
    this.setupCoordinateGrid();
    this.buildSolarSystem();
    this.buildAsteroidBelt();
    this.setupEvents();
    this.setupHudUi();

    // Start render loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    console.log("Celestial 3D Simulation initialized successfully.");
  }

  setupThree() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x02040b, 0.0012);

    // Camera
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 2500);
    this.camera.position.copy(this.defaultCameraPos);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
      alpha: false
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.container.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 6;
    this.controls.maxDistance = 650;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.15; // Allow viewing slightly from below plane
    this.controls.target.copy(this.defaultTarget);
  }

  setupLighting() {
    // Ambient starlight
    const ambientLight = new THREE.AmbientLight(0x1a243a, 0.7);
    this.scene.add(ambientLight);

    // Sun Core PointLight
    const sunLight = new THREE.PointLight(0xffeedd, 3.0, 900, 1.2);
    sunLight.position.set(0, 0, 0);
    this.scene.add(sunLight);

    // Secondary subtle directional light for planet depth definition
    const dirLight = new THREE.DirectionalLight(0x6688aa, 0.4);
    dirLight.position.set(50, 100, 50);
    this.scene.add(dirLight);
  }

  setupStarfield() {
    const starCount = 3800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    const colorChoices = [
      new THREE.Color(0xaaccff), // Blue-white
      new THREE.Color(0xffffff), // Pure white
      new THREE.Color(0xffe2aa), // Warm amber
      new THREE.Color(0x77ddff)  // Cyan
    ];

    for (let i = 0; i < starCount; i++) {
      // Distribute stars on a large sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 900 + Math.random() * 800;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      const col = colorChoices[Math.floor(Math.random() * colorChoices.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 2.2 + 0.6;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1.8,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const starPoints = new THREE.Points(geometry, material);
    this.scene.add(starPoints);

    // Ambient space dust particles
    const dustCount = 600;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount * 3; i += 3) {
      dustPos[i] = (Math.random() - 0.5) * 350;
      dustPos[i + 1] = (Math.random() - 0.5) * 60;
      dustPos[i + 2] = (Math.random() - 0.5) * 350;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 1.2,
      color: 0x3377aa,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    this.scene.add(new THREE.Points(dustGeo, dustMat));
  }

  setupCoordinateGrid() {
    this.gridGroup = new THREE.Group();

    // Concentric celestial distance rings
    const radii = [10, 15, 23, 32, 44, 58, 72, 86, 110];
    radii.forEach((r, idx) => {
      const ringGeo = new THREE.BufferGeometry();
      const segments = 128;
      const positions = new Float32Array((segments + 1) * 3);
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * r;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(theta) * r;
      }
      ringGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      const ringMat = new THREE.LineBasicMaterial({
        color: idx % 2 === 0 ? 0x1a456c : 0x0f2d48,
        transparent: true,
        opacity: 0.28
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
        color: 0x133856,
        transparent: true,
        opacity: 0.2
      });
      this.gridGroup.add(new THREE.Line(spokeGeo, spokeMat));
    }

    // Central Blueprint Compass Reticle
    const reticleGeo = new THREE.RingGeometry(6.8, 7.2, 64);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0x3ab0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.rotation.x = Math.PI / 2;
    this.gridGroup.add(reticleMesh);

    this.scene.add(this.gridGroup);
  }

  buildSolarSystem() {
    CELESTIAL_DATA.forEach(data => {
      // Planet mesh setup
      let mesh;
      const group = new THREE.Group();

      if (data.id === 'sun') {
        // Sun Sphere with procedural texture
        const geo = new THREE.SphereGeometry(data.size, 64, 64);
        const tex = TextureGenerator.createSunTexture();
        const mat = new THREE.MeshBasicMaterial({
          map: tex
        });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        // Radiant Corona Sprite
        const coronaTex = TextureGenerator.createCoronaTexture('#ffaa33', 512);
        const coronaMat = new THREE.SpriteMaterial({
          map: coronaTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.95
        });
        const coronaSprite = new THREE.Sprite(coronaMat);
        coronaSprite.scale.set(data.size * 5.2, data.size * 5.2, 1);
        group.add(coronaSprite);

      } else if (data.id === 'cygnus_beacon') {
        // Luminous Secondary Beacon Node
        const geo = new THREE.SphereGeometry(data.size, 32, 32);
        const mat = new THREE.MeshStandardMaterial({
          color: 0xffaa44,
          emissive: 0xff6600,
          emissiveIntensity: 1.5,
          roughness: 0.2
        });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        const beaconTex = TextureGenerator.createBeaconTexture();
        const spriteMat = new THREE.SpriteMaterial({
          map: beaconTex,
          blending: THREE.AdditiveBlending,
          transparent: true,
          opacity: 0.85
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(data.size * 6.5, data.size * 6.5, 1);
        group.add(sprite);

        // Secondary Point Light
        const beaconLight = new THREE.PointLight(0xff8833, 1.2, 80, 1.5);
        group.add(beaconLight);

      } else {
        // Standard Planets with custom procedural textures
        const geo = new THREE.SphereGeometry(data.size, 48, 48);
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
          tex = TextureGenerator.createRockyTexture(512, 256, data.color === '#b56238' ? 0.7 : 0.5);
        }

        const mat = new THREE.MeshStandardMaterial({
          map: tex,
          roughness: 0.75,
          metalness: 0.1
        });
        mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);

        // Planet Rings (if applicable - Saturn-like Chronos)
        if (data.hasRings) {
          const ringGeo = new THREE.RingGeometry(data.ringInner, data.ringOuter, 96);
          const ringTex = TextureGenerator.createSaturnRingTexture();
          
          // Align UVs for ring radial mapping
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
            opacity: 0.92,
            blending: THREE.NormalBlending
          });
          const ringMesh = new THREE.Mesh(ringGeo, ringMat);
          ringMesh.rotation.x = Math.PI / 2 + (data.ringTilt || 0.4);
          group.add(ringMesh);
        }

        // Orbiting Moon (if applicable)
        if (data.hasMoon) {
          const moonGroup = new THREE.Group();
          const moonGeo = new THREE.SphereGeometry(data.moonSize, 24, 24);
          const moonTex = TextureGenerator.createRockyTexture(256, 128, 0.5);
          const moonMat = new THREE.MeshStandardMaterial({
            map: moonTex,
            roughness: 0.9
          });
          const moonMesh = new THREE.Mesh(moonGeo, moonMat);
          moonMesh.position.x = data.moonDistance;
          moonGroup.add(moonMesh);
          group.add(moonGroup);
          group.userData.moonGroup = moonGroup;
        }
      }

      group.userData.bodyData = data;
      this.scene.add(group);

      // Create Orbit Path Line & Travelling Pulse
      if (data.orbitRadius > 0) {
        const orbitCurve = this.createOrbitGeometry(data);
        const orbitLine = new THREE.Line(orbitCurve.geometry, orbitCurve.material);
        this.scene.add(orbitLine);
        this.orbitMeshes.push(orbitLine);

        // Signal Pulse bead on orbit line
        const pulseGeo = new THREE.SphereGeometry(0.35, 12, 12);
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

      // Create 2D HUD Label Tag
      this.createHudLabel(data);
    });

    // Selection Reticle Marker in 3D
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
      color: new THREE.Color(data.color).multiplyScalar(0.7),
      transparent: true,
      opacity: 0.42
    });

    return { geometry, material };
  }

  buildAsteroidBelt() {
    const count = 1350;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);

    const minR = 36.5;
    const maxR = 41.5;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = minR + Math.random() * (maxR - minR);
      const y = (Math.random() - 0.5) * 2.8;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      const shade = 0.4 + Math.random() * 0.4;
      colors[i * 3] = shade * 0.9;
      colors[i * 3 + 1] = shade * 0.85;
      colors[i * 3 + 2] = shade * 0.8;

      scales[i] = Math.random() * 0.7 + 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.9,
      vertexColors: true,
      transparent: true,
      opacity: 0.75
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

      // Project 3D vector to screen space
      tempV.project(this.camera);

      // Check if behind camera
      const isBehind = tempV.z > 1.0;
      if (isBehind) {
        hudItem.dom.style.display = 'none';
        return;
      }

      // Convert normalized screen coords (-1 to +1) to pixels
      const screenX = (tempV.x * 0.5 + 0.5) * width;
      const screenY = (-tempV.y * 0.5 + 0.5) * height;

      // Distance from camera for depth fading
      const dist = this.camera.position.distanceTo(worldPos);
      if (dist > 350 || dist < 8) {
        hudItem.dom.style.opacity = '0.2';
      } else {
        hudItem.dom.style.opacity = '1.0';
      }

      hudItem.dom.style.display = 'block';
      // Offset tag slightly up and right
      const tagOffsetX = 35;
      const tagOffsetY = -30;
      const tagX = screenX + tagOffsetX;
      const tagY = screenY + tagOffsetY;

      hudItem.dom.style.left = `${tagX}px`;
      hudItem.dom.style.top = `${tagY}px`;

      // Draw high-tech SVG leader line from planet center to tag
      const elbowX = screenX + 18;
      const elbowY = tagY + 12;
      svgLines.push(`
        <circle cx="${screenX}" cy="${screenY}" r="3" fill="${p.data.color}" opacity="0.8" />
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

    // Trigger procedural audio
    if (window.cosmicAudio) {
      window.cosmicAudio.playSelect();
      window.cosmicAudio.playWhoosh();
    }

    // Update Telemetry Panel
    this.updateTelemetryCard(planetObj.data);

    // Smooth camera glide to target
    const targetWorldPos = new THREE.Vector3();
    planetObj.group.getWorldPosition(targetWorldPos);

    const offsetDist = Math.max(planetObj.data.size * 3.5, 12);
    const cameraTargetPos = targetWorldPos.clone().add(new THREE.Vector3(offsetDist * 0.8, offsetDist * 0.5, offsetDist));

    this.startCameraAnimation(cameraTargetPos, targetWorldPos, 1200);

    // Update Active HUD tag styling
    document.querySelectorAll('.hud-tag').forEach(tag => tag.classList.remove('active'));
    const activeTag = document.getElementById(`tag-${bodyId}`);
    if (activeTag) activeTag.classList.add('active');
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

    // Smooth cubic easing
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
  }

  setupEvents() {
    window.addEventListener('resize', () => {
      const width = this.container.clientWidth;
      const height = this.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });

    // Raycast on click
    this.container.addEventListener('pointerdown', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshesToTest = this.planets.map(p => p.mesh).filter(Boolean);
      const intersects = this.raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const hitPlanet = this.planets.find(p => p.mesh === hitMesh);
        if (hitPlanet) {
          this.selectCelestialBody(hitPlanet.data.id);
        }
      }
    });

    // Cursor hover effect
    this.container.addEventListener('pointermove', (e) => {
      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const meshesToTest = this.planets.map(p => p.mesh).filter(Boolean);
      const intersects = this.raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    });
  }

  setupHudUi() {
    // Play/Pause
    const playBtn = document.getElementById('btn-play-pause');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.isPlaying = !this.isPlaying;
        playBtn.innerHTML = this.isPlaying 
          ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`
          : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
      });
    }

    // Speed Controls
    const speedSelect = document.getElementById('speed-select');
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => {
        this.timeScale = parseFloat(e.target.value);
      });
    }

    // Orbits Toggle
    const orbitToggle = document.getElementById('toggle-orbits');
    if (orbitToggle) {
      orbitToggle.addEventListener('change', (e) => {
        this.showOrbits = e.target.checked;
        this.orbitMeshes.forEach(m => m.visible = this.showOrbits);
        this.orbitPulses.forEach(p => p.mesh.visible = this.showOrbits);
      });
    }

    // HUD Labels Toggle
    const hudToggle = document.getElementById('toggle-hud');
    if (hudToggle) {
      hudToggle.addEventListener('change', (e) => {
        this.showHudLabels = e.target.checked;
      });
    }

    // Grid Toggle
    const gridToggle = document.getElementById('toggle-grid');
    if (gridToggle) {
      gridToggle.addEventListener('change', (e) => {
        this.showGrid = e.target.checked;
        if (this.gridGroup) this.gridGroup.visible = this.showGrid;
      });
    }

    // Audio Toggle
    const audioBtn = document.getElementById('btn-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isPlaying = window.cosmicAudio ? window.cosmicAudio.toggle() : false;
        audioBtn.classList.toggle('active', isPlaying);
      });
    }

    // Auto Tour
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

    // Reset View
    const resetBtn = document.getElementById('btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetCamera());
    }

    // Language Toggle
    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.currentLanguage = this.currentLanguage === 'bn' ? 'en' : 'bn';
        langBtn.textContent = this.currentLanguage === 'bn' ? 'English' : 'বাংলা';
        this.updateLanguageTexts();
      });
    }

    // Close Telemetry Card
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
      this.updateTelemetryCard(this.selectedBody.data);
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = 0.016;

    if (this.isPlaying) {
      this.time += delta * this.timeScale;

      // Update planetary orbital positions & self rotations
      this.planets.forEach(p => {
        const data = p.data;

        // Axial Rotation
        if (p.mesh) {
          p.mesh.rotation.y += data.rotationSpeed * this.timeScale;
        }

        // Orbit Revolution
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

        // Moon Orbit
        if (p.group.userData.moonGroup) {
          p.group.userData.moonGroup.rotation.y += 0.03 * this.timeScale;
        }
      });

      // Update signal pulses along orbit lines
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

      // Slow asteroid belt rotation
      if (this.asteroidBelt) {
        this.asteroidBelt.rotation.y += 0.0006 * this.timeScale;
      }

      // Auto Tour logic
      if (this.isAutoTouring) {
        this.tourTimer += delta;
        if (this.tourTimer > 7.5) {
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

    // Update Camera Animation transition
    this.updateCameraAnimation();

    // Controls update
    this.controls.update();

    // Project 2D HUD overlays
    this.updateHudPositions();

    // Render 3D Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Instantiate upon DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.simulation = new CelestialSimulation();
});
