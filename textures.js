/**
 * HIGH-FIDELITY PROCEDURAL TEXTURE GENERATOR FOR THREE.JS
 * Generates ultra-detailed astronomical surfaces, ring systems, atmospheric clouds,
 * and planetary moons entirely in canvas memory.
 */

const TextureGenerator = {
  // Fast hash-based pseudo random
  noise2D(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  },

  // Interpolated smooth noise
  smoothNoise(x, y) {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    const s = fx * fx * (3 - 2 * fx);
    const t = fy * fy * (3 - 2 * fy);

    const n00 = this.noise2D(i, j);
    const n10 = this.noise2D(i + 1, j);
    const n01 = this.noise2D(i, j + 1);
    const n11 = this.noise2D(i + 1, j + 1);

    const nx0 = n00 * (1 - s) + n10 * s;
    const nx1 = n01 * (1 - s) + n11 * s;

    return nx0 * (1 - t) + nx1 * t;
  },

  // Fractional Brownian Motion (fBm) multi-octave noise
  fbm(x, y, octaves = 5) {
    let val = 0;
    let amp = 0.5;
    let freq = 1;
    for (let o = 0; o < octaves; o++) {
      val += amp * this.smoothNoise(x * freq, y * freq);
      amp *= 0.5;
      freq *= 2.0;
    }
    return val;
  },

  // Voronoi / Cellular noise for craters and volcanic calderas
  cellular(x, y) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    let minDist = 1.0;
    for (let j = -1; j <= 1; j++) {
      for (let i = -1; i <= 1; i++) {
        const cx = xi + i;
        const cy = yi + j;
        const rx = cx + this.noise2D(cx, cy);
        const ry = cy + this.noise2D(cy, cx);
        const dx = rx - x;
        const dy = ry - y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < minDist) minDist = d;
      }
    }
    return minDist;
  },

  // 1. Ultra-detailed Sun with granulation, sunspots, and fiery convection
  createSunTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const v = y / height;
      for (let x = 0; x < width; x++) {
        const u = x / width;
        // Granulation cells
        const cell = this.cellular(u * 32, v * 16);
        const gran = this.fbm(u * 20, v * 10, 5);
        const flare = this.fbm(u * 45 + gran * 2, v * 22 + gran * 2, 4);

        // Sunspots (cool dark magnetic regions)
        const spotNoise = this.fbm(u * 6 + 1.2, v * 3 + 0.8, 3);
        const isSunspot = spotNoise > 0.68 ? (spotNoise - 0.68) * 3.5 : 0;

        let r = 255;
        let g = Math.floor(185 * (0.6 + gran * 0.4) + flare * 40);
        let b = Math.floor(50 * (0.4 + gran * 0.6) + flare * 80);

        // Darken sunspot umbra & penumbra
        if (isSunspot > 0) {
          const darkFactor = Math.min(1.0, isSunspot);
          r = Math.floor(r * (1.0 - darkFactor * 0.75));
          g = Math.floor(g * (1.0 - darkFactor * 0.85));
          b = Math.floor(b * (1.0 - darkFactor * 0.9));
        }

        const idx = (y * width + x) * 4;
        data[idx] = Math.min(255, Math.max(0, r));
        data[idx + 1] = Math.min(255, Math.max(0, g));
        data[idx + 2] = Math.min(255, Math.max(0, b));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 2. High-Fidelity Gas Giant (Jupiter / Zeus Major)
  createJupiterTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      // 16 alternating atmospheric jet stream currents
      const bandWave = Math.sin(ny * 44 + Math.sin(ny * 16) * 2.5);
      const microBand = Math.cos(ny * 96) * 0.25;

      for (let x = 0; x < width; x++) {
        const nx = x / width;
        // Coriolis turbulence & wave shears
        const shear = Math.sin(ny * 28) * 0.08;
        const turbulent = this.fbm((nx + shear) * 24 + bandWave * 0.5, ny * 14, 5);
        const fineEddy = this.fbm(nx * 50, ny * 35, 3) * 0.15;

        // Great Red Spot vortex simulation at ny ~ 0.64, nx ~ 0.52
        const dx = (nx - 0.52) * 8.0;
        const dy = (ny - 0.64) * 16.0;
        const distSpot = Math.sqrt(dx * dx + dy * dy);
        const inSpot = distSpot < 1.0 ? (1.0 - distSpot) : 0;
        // Turbulent storm wake trailing behind the spot
        const wakeX = nx - 0.52;
        const inWake = (wakeX > 0.05 && wakeX < 0.35 && Math.abs(ny - 0.64) < 0.06) 
          ? (1.0 - (wakeX - 0.05) / 0.3) * (1.0 - Math.abs(ny - 0.64) / 0.06) : 0;

        // Base atmospheric palette (reddish brown, ochre, cream, tan)
        let r = 215 + Math.floor(bandWave * 32 + microBand * 20 + turbulent * 25);
        let g = 155 + Math.floor(bandWave * 28 + microBand * 15 + turbulent * 20);
        let b = 105 + Math.floor(bandWave * 20 + microBand * 10 + turbulent * 15);

        // Apply Great Red Spot
        if (inSpot > 0) {
          // Swirling spiral angle in spot
          const angle = Math.atan2(dy, dx);
          const spiral = Math.sin(angle * 3.0 + distSpot * 6.0) * 0.15;
          r = Math.min(255, Math.floor(220 + (inSpot + spiral) * 55));
          g = Math.max(35, Math.floor(100 - inSpot * 60));
          b = Math.max(25, Math.floor(70 - inSpot * 50));
        }

        // Apply storm wake ripples
        if (inWake > 0) {
          const ripple = Math.sin(nx * 80) * inWake * 30;
          r = Math.floor(r + ripple);
          g = Math.floor(g + ripple * 0.5);
        }

        const idx = (y * width + x) * 4;
        data[idx] = Math.min(255, Math.max(0, r));
        data[idx + 1] = Math.min(255, Math.max(0, g));
        data[idx + 2] = Math.min(255, Math.max(0, b));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 3. High-Fidelity Ringed Planet Body (Chronos / Saturn-like)
  createSaturnTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      const lat = Math.abs(ny - 0.5) * 2;
      const band = Math.sin(ny * 52) * 0.35 + Math.cos(ny * 24) * 0.45;
      
      // Hexagonal Polar Storm at North Pole (ny near 0.05)
      const isNorthPole = ny < 0.12 ? (1.0 - ny / 0.12) : 0;

      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const micro = this.fbm(nx * 14, ny * 6, 4) * 0.18;
        let val = band + micro;

        if (isNorthPole > 0) {
          // Hexagon modulation
          const hexAngle = nx * Math.PI * 2;
          const hex = Math.cos(hexAngle * 6) * 0.25;
          val += hex * isNorthPole;
        }

        const r = Math.floor(230 + val * 24);
        const g = Math.floor(205 + val * 20);
        const b = Math.floor(165 + val * 22);

        const idx = (y * width + x) * 4;
        data[idx] = Math.min(255, Math.max(0, r));
        data[idx + 1] = Math.min(255, Math.max(0, g));
        data[idx + 2] = Math.min(255, Math.max(0, b));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 4. Ultra-Detailed Saturn Ring System (Multiple concentric divisions)
  createSaturnRingTexture(size = 2048) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, size, 0);
    // Inner D ring (extremely faint)
    grad.addColorStop(0.00, 'rgba(120, 100, 80, 0.0)');
    grad.addColorStop(0.08, 'rgba(140, 120, 95, 0.18)');
    // C ring (Crepe ring)
    grad.addColorStop(0.12, 'rgba(165, 140, 110, 0.42)');
    grad.addColorStop(0.24, 'rgba(180, 155, 125, 0.55)');
    // B ring (Dense, wide, brilliant)
    grad.addColorStop(0.26, 'rgba(235, 215, 175, 0.92)');
    grad.addColorStop(0.40, 'rgba(250, 235, 205, 0.98)');
    grad.addColorStop(0.56, 'rgba(230, 210, 170, 0.90)');
    // Cassini Division (Wide dark gap)
    grad.addColorStop(0.58, 'rgba(30, 24, 16, 0.08)');
    grad.addColorStop(0.64, 'rgba(20, 15, 10, 0.04)');
    // A ring
    grad.addColorStop(0.66, 'rgba(215, 195, 160, 0.88)');
    grad.addColorStop(0.78, 'rgba(200, 180, 145, 0.82)');
    // Encke Gap
    grad.addColorStop(0.84, 'rgba(40, 30, 20, 0.15)');
    grad.addColorStop(0.86, 'rgba(190, 170, 135, 0.78)');
    // F ring & outer edge
    grad.addColorStop(0.94, 'rgba(140, 120, 90, 0.35)');
    grad.addColorStop(0.97, 'rgba(180, 160, 125, 0.60)');
    grad.addColorStop(1.00, 'rgba(80, 60, 40, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, 64);

    // Add fine micro-ringlets lines
    ctx.fillStyle = 'rgba(255, 245, 220, 0.12)';
    for (let i = 0; i < size; i += 4) {
      if (Math.random() > 0.4) {
        ctx.fillRect(i, 0, 1, 64);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  },

  // 5. High-Resolution Terra Nova (Earth-like with detailed continents & coastal reefs)
  createEarthTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      const lat = Math.abs(ny - 0.5) * 2;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const continent = this.fbm(nx * 6, ny * 3.5, 6);
        const mountain = this.fbm(nx * 18, ny * 12, 4);

        let r, g, b;

        if (lat > 0.84) {
          // Polar ice caps
          const iceTexture = this.fbm(nx * 15, ny * 8, 3);
          r = Math.floor(235 + iceTexture * 20);
          g = Math.floor(242 + iceTexture * 13);
          b = 255;
        } else if (continent > 0.51) {
          // Landmass with elevation shading
          const elevation = (continent - 0.51) * 2.2;
          if (elevation > 0.6) {
            // Mountain peak / alpine rock
            r = Math.floor(135 + mountain * 70);
            g = Math.floor(115 + mountain * 60);
            b = Math.floor(95 + mountain * 50);
          } else if (lat < 0.28 && elevation < 0.3) {
            // Tropical rainforest
            r = Math.floor(30 + elevation * 40);
            g = Math.floor(115 + elevation * 55);
            b = Math.floor(40 + elevation * 25);
          } else if (elevation < 0.25 && lat > 0.35 && lat < 0.6) {
            // Arid / desert savanna
            r = Math.floor(175 + elevation * 60);
            g = Math.floor(145 + elevation * 50);
            b = Math.floor(85 + elevation * 30);
          } else {
            // Temperate woodlands / plains
            r = Math.floor(65 + elevation * 70);
            g = Math.floor(130 + elevation * 50);
            b = Math.floor(60 + elevation * 30);
          }
        } else {
          // Oceans with continental shelves
          const depth = continent / 0.51;
          if (depth > 0.92) {
            // Shallow turquoise coastal reef
            r = 25; g = 145; b = 185;
          } else {
            // Deep abyssal sapphire ocean
            r = Math.floor(12 + depth * 20);
            g = Math.floor(45 + depth * 55);
            b = Math.floor(135 + depth * 85);
          }
        }

        const idx = (y * width + x) * 4;
        data[idx] = Math.min(255, Math.max(0, r));
        data[idx + 1] = Math.min(255, Math.max(0, g));
        data[idx + 2] = Math.min(255, Math.max(0, b));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 6. Dynamic 3D Volumetric Cloud Shell Texture with Hurricane Spirals
  createEarthCloudsTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const cloudNoise = this.fbm(nx * 10, ny * 5, 5);
        const wisps = this.fbm(nx * 24, ny * 14, 3) * 0.25;

        // Cyclone vortex at nx ~ 0.35, ny ~ 0.4
        const dx = (nx - 0.35) * 10;
        const dy = (ny - 0.4) * 18;
        const distCyc = Math.sqrt(dx * dx + dy * dy);
        let cyclone = 0;
        if (distCyc < 1.0) {
          const cycAngle = Math.atan2(dy, dx);
          cyclone = Math.sin(cycAngle * 4.0 + distCyc * 8.0) * (1.0 - distCyc);
        }

        const val = cloudNoise + wisps + cyclone * 0.3;
        let alpha = 0;
        if (val > 0.52) {
          alpha = Math.min(255, Math.floor((val - 0.52) * 480));
        }

        const idx = (y * width + x) * 4;
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
        data[idx + 3] = alpha;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 7. Ares / Mars (Canyons, Volcano caldera, Polar spirals)
  createMarsTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      const lat = Math.abs(ny - 0.5) * 2;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const terrain = this.fbm(nx * 10, ny * 5, 5);
        const crater = this.cellular(nx * 16, ny * 8);

        // Valles Marineris Canyon system (long horizontal rift)
        const inCanyon = (nx > 0.35 && nx < 0.65 && Math.abs(ny - 0.54) < 0.035) 
          ? (1.0 - Math.abs(ny - 0.54) / 0.035) : 0;

        let r, g, b;

        if (lat > 0.86) {
          // Polar dry ice cap with spiral channels
          const spiral = Math.sin(nx * 12 + ny * 20) * 0.15;
          r = Math.floor(235 + spiral * 20);
          g = Math.floor(240 + spiral * 15);
          b = 245;
        } else {
          // Iron oxide desert
          r = Math.floor(195 + terrain * 55 - (1.0 - crater) * 25);
          g = Math.floor(85 + terrain * 35 - (1.0 - crater) * 15);
          b = Math.floor(45 + terrain * 25 - (1.0 - crater) * 10);

          if (inCanyon > 0) {
            // Dark shadow in deep canyon trench
            r = Math.floor(r * (1.0 - inCanyon * 0.45));
            g = Math.floor(g * (1.0 - inCanyon * 0.55));
            b = Math.floor(b * (1.0 - inCanyon * 0.55));
          }
        }

        const idx = (y * width + x) * 4;
        data[idx] = Math.min(255, Math.max(0, r));
        data[idx + 1] = Math.min(255, Math.max(0, g));
        data[idx + 2] = Math.min(255, Math.max(0, b));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 8. Aquamarine Ice Giant (Aether Cyan / Uranus-like)
  createIceGiantTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const haze = this.fbm(nx * 6, ny * 3, 4);
        const streak = Math.sin(ny * 60) * 0.08;

        const r = Math.floor(65 + haze * 25 + streak * 30);
        const g = Math.floor(205 + haze * 35 + streak * 20);
        const b = Math.floor(235 + haze * 20 + streak * 10);

        const idx = (y * width + x) * 4;
        data[idx] = Math.min(255, Math.max(0, r));
        data[idx + 1] = Math.min(255, Math.max(0, g));
        data[idx + 2] = Math.min(255, Math.max(0, b));
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 9. Volcanic Sulfur Moon Texture (Io)
  createIoTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const ny = y / height;
        const sulfur = this.fbm(nx * 14, ny * 7, 4);
        const calderas = this.cellular(nx * 12, ny * 6);

        let r = Math.floor(235 + sulfur * 20);
        let g = Math.floor(190 + sulfur * 40);
        let b = Math.floor(40 + sulfur * 30);

        // Volcanic caldera pits (black/orange lava pools)
        if (calderas < 0.18) {
          r = 30; g = 18; b = 12;
        } else if (calderas < 0.32) {
          r = 210; g = 70; b = 20; // Red-orange sulfur ring
        }

        const idx = (y * width + x) * 4;
        data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 10. Cracked Ice Moon Texture (Europa)
  createEuropaTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const ny = y / height;
        const ice = this.fbm(nx * 16, ny * 8, 4);

        // Criss-crossing tidal fracture lineae
        const line1 = Math.abs(Math.sin(nx * 20 + ny * 15));
        const line2 = Math.abs(Math.cos(nx * 25 - ny * 18));
        const isCrack = (line1 < 0.08 || line2 < 0.08);

        let r = Math.floor(215 + ice * 35);
        let g = Math.floor(228 + ice * 24);
        let b = Math.floor(242 + ice * 13);

        if (isCrack) {
          // Reddish brown tholin mineral lines in ice fractures
          r = 165; g = 95; b = 65;
        }

        const idx = (y * width + x) * 4;
        data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 11. Titan Hydrocarbon Smog Texture
  createTitanTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const smog = this.fbm(nx * 8, ny * 4, 3);
        const polarHood = ny < 0.15 ? (1.0 - ny / 0.15) * 40 : 0;

        const r = Math.min(255, Math.floor(245 + smog * 10 - polarHood));
        const g = Math.max(0, Math.floor(160 + smog * 30 - polarHood));
        const b = Math.max(0, Math.floor(35 + smog * 20 - polarHood * 0.5));

        const idx = (y * width + x) * 4;
        data[idx] = r; data[idx + 1] = g; data[idx + 2] = b; data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 12. Standard Rocky / Moon Texture (Cratered regolith)
  createRockyTexture(width = 512, height = 256, baseHue = 0.5) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const ny = y / height;
        const crater = this.cellular(nx * 14, ny * 7);
        const maria = this.fbm(nx * 5, ny * 3, 3); // Dark basaltic plains

        let val = Math.floor(110 + crater * 90);
        if (maria < 0.42) {
          val = Math.floor(val * 0.75); // Dark lunar maria
        }

        const idx = (y * width + x) * 4;
        data[idx] = Math.floor(val * (1 + (baseHue - 0.5) * 0.3));
        data[idx + 1] = Math.floor(val * 0.96);
        data[idx + 2] = Math.floor(val * 0.94);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 13. Radiant Star Corona Glow Sprite
  createCoronaTexture(color = '#ffaa33', size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const half = size / 2;

    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.12, color);
    grad.addColorStop(0.35, 'rgba(255, 130, 40, 0.55)');
    grad.addColorStop(0.65, 'rgba(210, 70, 20, 0.2)');
    grad.addColorStop(1.00, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  },

  // 14. Secondary Beacon Node Glow
  createBeaconTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const half = size / 2;

    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.0, '#ffffff');
    grad.addColorStop(0.2, '#ffaa44');
    grad.addColorStop(0.5, 'rgba(255, 140, 20, 0.45)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  },

  // 15. Ethereal Nebula Cloud Sprite for Deep Space Ambience
  createNebulaTexture(color = '#4338ca', size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const half = size / 2;

    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.0, color);
    grad.addColorStop(0.4, color);
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Add wispy noise distortion
    const imgData = ctx.getImageData(0, 0, size, size);
    const d = imgData.data;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const u = x / size;
        const v = y / size;
        const n = this.fbm(u * 5, v * 5, 3);
        const idx = (y * size + x) * 4;
        d[idx + 3] = Math.floor(d[idx + 3] * n * 0.4);
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 16. Icy Volatile Comet Nucleus Texture
  createCometTexture(width = 512, height = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const d = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const u = x / width;
        const v = y / height;
        const n1 = this.fbm(u * 12, v * 12, 4);
        const n2 = this.fbm(u * 32, v * 32, 2);
        const crack = Math.abs(Math.sin(n1 * 14)) < 0.15 ? 1.0 : 0.0;

        // Dark silicate crust with icy cyan-white vents
        let r = 25 + n1 * 50;
        let g = 35 + n1 * 70;
        let b = 50 + n1 * 95;

        if (crack > 0.5) {
          r += 120 * n2;
          g += 200 * n2;
          b += 255 * n2;
        }

        const idx = (y * width + x) * 4;
        d[idx] = Math.min(255, r);
        d[idx + 1] = Math.min(255, g);
        d[idx + 2] = Math.min(255, b);
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 17. Scientific False-Color Thermal Infrared Heatmap Texture
  createThermalTexture(width = 512, height = 256, seedOffset = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const d = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const u = x / width;
        const v = y / height;
        const tempVal = this.fbm(u * 8 + seedOffset, v * 8, 4);

        let r = 0, g = 0, b = 0;
        // False color thermal gradient: Purple -> Blue -> Green -> Yellow -> Red -> White
        if (tempVal < 0.2) {
          const t = tempVal / 0.2;
          r = Math.floor(20 * (1 - t) + 10 * t);
          g = Math.floor(5 * (1 - t) + 40 * t);
          b = Math.floor(70 * (1 - t) + 160 * t);
        } else if (tempVal < 0.45) {
          const t = (tempVal - 0.2) / 0.25;
          r = Math.floor(10 * (1 - t) + 30 * t);
          g = Math.floor(40 * (1 - t) + 190 * t);
          b = Math.floor(160 * (1 - t) + 180 * t);
        } else if (tempVal < 0.7) {
          const t = (tempVal - 0.45) / 0.25;
          r = Math.floor(30 * (1 - t) + 245 * t);
          g = Math.floor(190 * (1 - t) + 190 * t);
          b = Math.floor(180 * (1 - t) + 20 * t);
        } else if (tempVal < 0.88) {
          const t = (tempVal - 0.7) / 0.18;
          r = Math.floor(245 * (1 - t) + 255 * t);
          g = Math.floor(190 * (1 - t) + 40 * t);
          b = Math.floor(20 * (1 - t) + 20 * t);
        } else {
          const t = (tempVal - 0.88) / 0.12;
          r = 255;
          g = Math.floor(40 * (1 - t) + 255 * t);
          b = Math.floor(20 * (1 - t) + 255 * t);
        }

        const idx = (y * width + x) * 4;
        d[idx] = r;
        d[idx + 1] = g;
        d[idx + 2] = b;
        d[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 18. Procedural Vast Celestial Nebula Skybox
  createNebulaSkyboxTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Base cosmic deep void
    ctx.fillStyle = '#02060f';
    ctx.fillRect(0, 0, width, height);

    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const u = x / width;
        const v = y / height;
        const nCyan = this.fbm(u * 4 + 1.2, v * 4, 3);
        const nMagenta = this.fbm(u * 5 - 2.1, v * 5 + 0.8, 3);

        const idx = (y * width + x) * 4;
        d[idx] = Math.min(255, d[idx] + Math.floor(nMagenta * 35));
        d[idx + 1] = Math.min(255, d[idx + 1] + Math.floor(nCyan * 25));
        d[idx + 2] = Math.min(255, d[idx + 2] + Math.floor((nCyan + nMagenta) * 48));
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  }
};
