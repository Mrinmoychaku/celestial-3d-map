/**
 * PROCEDURAL TEXTURE GENERATOR FOR THREE.JS
 * Generates high-res textures entirely in canvas memory.
 * Zero external asset dependencies, 100% offline and crisp.
 */

const TextureGenerator = {
  // Helper noise function
  noise2D(x, y) {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  },

  // Perlin-style smooth interpolated noise
  smoothNoise(x, y) {
    const i = Math.floor(x);
    const j = Math.floor(y);
    const fx = x - i;
    const fy = y - j;

    const s = (fx * fx * (3 - 2 * fx));
    const t = (fy * fy * (3 - 2 * fy));

    const n00 = this.noise2D(i, j);
    const n10 = this.noise2D(i + 1, j);
    const n01 = this.noise2D(i, j + 1);
    const n11 = this.noise2D(i + 1, j + 1);

    const nx0 = n00 * (1 - s) + n10 * s;
    const nx1 = n01 * (1 - s) + n11 * s;

    return nx0 * (1 - t) + nx1 * t;
  },

  fbm(x, y, octaves = 4) {
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

  // 1. Sun Texture
  createSunTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const u = x / width;
        const v = y / height;
        const n = this.fbm(u * 12, v * 6, 5);
        const flare = this.fbm(u * 28 + n * 2, v * 14 + n * 2, 3);

        const r = Math.min(255, Math.floor(255 * (0.85 + flare * 0.25)));
        const g = Math.min(255, Math.floor(180 * (0.55 + n * 0.5)));
        const b = Math.min(255, Math.floor(60 * (0.3 + flare * 0.7)));

        const idx = (y * width + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 2. Gas Giant Texture (Jupiter-style banded storm texture)
  createJupiterTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      const bandWave = Math.sin(ny * 32 + Math.sin(ny * 12) * 2);
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const turbulent = this.fbm(nx * 18 + bandWave * 0.4, ny * 10, 4);

        // Great Red Spot vortex simulation at ny ~ 0.65, nx ~ 0.55
        const dx = (nx - 0.55) * 6;
        const dy = (ny - 0.65) * 14;
        const distSpot = Math.sqrt(dx * dx + dy * dy);
        const inSpot = distSpot < 1.0 ? (1.0 - distSpot) : 0;

        let r = 210 + Math.floor(bandWave * 30 + turbulent * 25);
        let g = 150 + Math.floor(bandWave * 25 + turbulent * 20);
        let b = 100 + Math.floor(bandWave * 20 + turbulent * 15);

        if (inSpot > 0) {
          r = Math.min(255, Math.floor(r + inSpot * 55));
          g = Math.max(40, Math.floor(g - inSpot * 60));
          b = Math.max(30, Math.floor(b - inSpot * 50));
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

  // 3. Saturn Body Texture (Smooth elegant golden/ochre banding)
  createSaturnTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      const band = Math.sin(ny * 40) * 0.3 + Math.cos(ny * 18) * 0.5;
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const micro = this.fbm(nx * 10, ny * 4, 3) * 0.15;
        const val = band + micro;

        const r = Math.floor(225 + val * 25);
        const g = Math.floor(195 + val * 20);
        const b = Math.floor(150 + val * 22);

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

  // 4. Saturn Ring Texture (concentric alpha bands with Cassini division)
  createSaturnRingTexture(size = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, size, 0);
    // Inner C ring
    grad.addColorStop(0.00, 'rgba(160, 140, 110, 0.0)');
    grad.addColorStop(0.12, 'rgba(175, 150, 120, 0.45)');
    // B ring (bright dense)
    grad.addColorStop(0.25, 'rgba(235, 215, 175, 0.95)');
    grad.addColorStop(0.50, 'rgba(245, 230, 195, 0.98)');
    grad.addColorStop(0.58, 'rgba(215, 190, 150, 0.85)');
    // Cassini division (dark gap)
    grad.addColorStop(0.60, 'rgba(40, 30, 20, 0.08)');
    grad.addColorStop(0.66, 'rgba(30, 25, 15, 0.05)');
    // A ring
    grad.addColorStop(0.68, 'rgba(205, 185, 150, 0.85)');
    grad.addColorStop(0.85, 'rgba(185, 165, 130, 0.75)');
    // Encke gap & outer ring edge
    grad.addColorStop(0.92, 'rgba(120, 100, 75, 0.3)');
    grad.addColorStop(1.00, 'rgba(80, 60, 40, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  },

  // 5. Earth / Terra Nova (Ocean + Continents + Swirling Clouds)
  createEarthTexture(width = 1024, height = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
      const ny = y / height;
      const lat = Math.abs(ny - 0.5) * 2; // 0 at equator, 1 at poles
      for (let x = 0; x < width; x++) {
        const nx = x / width;
        const continent = this.fbm(nx * 5, ny * 3, 5);
        const cloud = this.fbm(nx * 9 + 0.3, ny * 4.5, 4);

        let r, g, b;

        // Polar ice caps
        if (lat > 0.82) {
          r = 230; g = 240; b = 250;
        } else if (continent > 0.52) {
          // Landmass (green/ochre/mountains)
          const elevation = (continent - 0.52) * 2.2;
          r = Math.floor(45 + elevation * 110);
          g = Math.floor(115 + elevation * 70);
          b = Math.floor(55 + elevation * 30);
        } else {
          // Ocean (deep azure blue)
          const depth = continent / 0.52;
          r = Math.floor(10 + depth * 25);
          g = Math.floor(45 + depth * 65);
          b = Math.floor(140 + depth * 90);
        }

        // Swirling Clouds overlay
        if (cloud > 0.58) {
          const cloudAlpha = (cloud - 0.58) * 2.2;
          r = Math.floor(r * (1 - cloudAlpha) + 245 * cloudAlpha);
          g = Math.floor(g * (1 - cloudAlpha) + 250 * cloudAlpha);
          b = Math.floor(b * (1 - cloudAlpha) + 255 * cloudAlpha);
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

  // 6. Mars / Ares (Rusty red, canyons, dust dunes)
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
        const terrain = this.fbm(nx * 8, ny * 4, 5);

        let r, g, b;
        if (lat > 0.88) {
          // Ice cap
          r = 230; g = 235; b = 240;
        } else {
          r = Math.floor(190 + terrain * 55);
          g = Math.floor(80 + terrain * 40);
          b = Math.floor(40 + terrain * 30);
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

  // 7. Ice Giant (Cyan Aether)
  createIceGiantTexture(width = 512, height = 256) {
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
        const softHaze = this.fbm(nx * 4, ny * 2, 3);
        const r = Math.floor(60 + softHaze * 25);
        const g = Math.floor(195 + softHaze * 40);
        const b = Math.floor(215 + softHaze * 35);

        const idx = (y * width + x) * 4;
        data[idx] = r;
        data[idx + 1] = g;
        data[idx + 2] = b;
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 8. Rocky / Moon Texture (Craters and Regolith)
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
        const crater = this.fbm(nx * 12, ny * 6, 4);
        const val = Math.floor(90 + crater * 95);

        const idx = (y * width + x) * 4;
        data[idx] = Math.floor(val * (1 + (baseHue - 0.5) * 0.4));
        data[idx + 1] = Math.floor(val * 0.95);
        data[idx + 2] = Math.floor(val * 0.92);
        data[idx + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    return new THREE.CanvasTexture(canvas);
  },

  // 9. Radiant Star Corona Glow Sprite
  createCoronaTexture(color = '#ffaa33', size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const half = size / 2;

    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.00, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.12, color);
    grad.addColorStop(0.35, 'rgba(255, 120, 30, 0.45)');
    grad.addColorStop(0.65, 'rgba(200, 60, 20, 0.15)');
    grad.addColorStop(1.00, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  },

  // 10. Secondary Beacon Node Glow
  createBeaconTexture(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const half = size / 2;

    const grad = ctx.createRadialGradient(half, half, 0, half, half, half);
    grad.addColorStop(0.0, '#ffffff');
    grad.addColorStop(0.2, '#ffaa44');
    grad.addColorStop(0.5, 'rgba(255, 140, 20, 0.35)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }
};
