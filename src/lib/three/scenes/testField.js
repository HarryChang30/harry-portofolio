// @ts-nocheck
// Phase 1 pipeline test: a drifting accent-colored point field with depth falloff
// and theme-following fog. Proves renderer + theme bridge end-to-end.
// Replaced by scenes/hero.js in Phase 2.

import { makeDiscTexture } from '../textures.js';

const COUNT = 240;
const BOUNDS = { x: 34, y: 20, zNear: 6, zFar: -46 };

export function createTestField(THREE, app, theme) {
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const points = [];

  for (let i = 0; i < COUNT; i++) {
    const x = (Math.random() * 2 - 1) * BOUNDS.x;
    const y = (Math.random() * 2 - 1) * BOUNDS.y;
    const z = BOUNDS.zFar + Math.random() * (BOUNDS.zNear - BOUNDS.zFar);
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    // 0 = far/dim → 1 = near/bright
    const depth = (z - BOUNDS.zFar) / (BOUNDS.zNear - BOUNDS.zFar);
    points.push({
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      phase: Math.random() * Math.PI * 2,
      depth,
    });
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true,
    map: makeDiscTexture(THREE),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    opacity: 0.9,
  });

  const cloud = new THREE.Points(geo, mat);
  cloud.frustumCulled = false; // points move in JS — avoid pop-out at bounds
  app.scene.add(cloud);

  app.scene.fog = new THREE.FogExp2(0x000000, 0.016); // color follows the theme each frame

  function update(dt, t) {
    for (let i = 0; i < COUNT; i++) {
      const p = points[i];
      let x = positions[i * 3] + p.vx * dt;
      let y = positions[i * 3 + 1] + p.vy * dt + Math.sin(t * 0.6 + p.phase) * dt * 0.35;
      // wrap at bounds
      if (x > BOUNDS.x) x = -BOUNDS.x; else if (x < -BOUNDS.x) x = BOUNDS.x;
      if (y > BOUNDS.y) y = -BOUNDS.y; else if (y < -BOUNDS.y) y = BOUNDS.y;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;

      const k = (0.3 + 0.7 * p.depth) * (0.75 + 0.25 * Math.sin(t * 0.8 + p.phase));
      const c = theme.colors.accent400;
      colors[i * 3] = c.r * k;
      colors[i * 3 + 1] = c.g * k;
      colors[i * 3 + 2] = c.b * k;
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.color.needsUpdate = true;
    app.scene.fog.color.copy(theme.colors.surface0);
  }

  function dispose() {
    geo.dispose();
    mat.map?.dispose();
    mat.dispose();
  }

  return { update, dispose };
}
