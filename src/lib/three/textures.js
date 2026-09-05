// @ts-nocheck
// Small procedural textures shared by the 3D scenes. Client-only (uses document).

/** Soft radial disc for round points/particles — avoids the default square sprite. */
export function makeDiscTexture(THREE, size = 64) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Mono uppercase text sprite texture — telemetry-style decorative micro-copy. */
export function makeTextTexture(THREE, text, {
  font = '500 24px "JetBrains Mono", monospace',
  pad = 16,
} = {}) {
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = font;
  const w = Math.ceil(measure.measureText(text).width) + pad * 2;
  const h = 48;
  const c = document.createElement('canvas');
  c.width = Math.max(2, w);
  c.height = h;
  const ctx = c.getContext('2d');
  ctx.font = font;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, pad, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
