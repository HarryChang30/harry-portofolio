// @ts-nocheck
// Phase 2 — "Orbital Network": the distributed-systems graph in 3D.
// Instanced glowing service nodes in loose clusters, curved connections,
// light pulses traveling between them, decorative telemetry sprites, and a
// drift + mouse-parallax camera. Cluster anchors are exported for Phase 3's
// scroll-driven camera path. All copy stays in the DOM — sprites are
// decorative English-only micro-copy, aria-hidden at the component level.

import { makeDiscTexture, makeTextTexture } from '../textures.js';

const TELEMETRY = [
  'WORKER ACTIVE', 'QUEUE HEALTHY', 'LATENCY 18ms',
  'RETRY 0', 'SERVICE ONLINE', 'UPTIME 99.98%',
  'CONN POOL 12/50', 'GC 4ms', 'ROUTE /api/health 200',
];

// Section → cluster anchor (world position). Phase 3's camera path frames these;
// keep them stable — the scroll choreography is tuned against them.
const CLUSTER_DEFS = [
  { id: 'introduction', center: [5, 0, -4], spread: 6.5, count: 12 },
  { id: 'experience', center: [-17, 4, -14], spread: 5.5, count: 10 },
  { id: 'projects', center: [15, -3, -24], spread: 6, count: 12 },
  { id: 'skills', center: [-11, 7, -34], spread: 5, count: 9 },
  { id: 'contact', center: [6, 10, -46], spread: 4.5, count: 8 },
];

export function createHeroScene(THREE, app, theme, { reducedMotion = false } = {}) {
  // Scales complexity down on small viewports (checked once at init).
  const narrow = window.innerWidth < 900;
  const sizeFactor = narrow ? 0.6 : 1;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const group = new THREE.Group();
  app.scene.add(group);
  app.scene.fog = new THREE.FogExp2(0x000000, 0.014); // color follows the theme each frame

  // ── service nodes (instanced) ─────────────────────────
  const nodes = [];
  const clusterOf = [];
  for (const def of CLUSTER_DEFS) {
    const n = Math.max(5, Math.round(def.count * sizeFactor));
    for (let i = 0; i < n; i++) {
      // random point in sphere, flattened slightly
      const r = def.spread * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      nodes.push({
        cluster: def.id,
        base: new THREE.Vector3(
          def.center[0] + r * Math.sin(phi) * Math.cos(theta) * 1.25,
          def.center[1] + r * Math.cos(phi) * 0.8,
          def.center[2] + r * Math.sin(phi) * Math.sin(theta)
        ),
        scale: 0.1 + Math.pow(Math.random(), 2.2) * 0.22,
        hub: Math.random() < 0.14,
        amp: 0.25 + Math.random() * 0.45,
        sp1: 0.3 + Math.random() * 0.4,
        sp2: 0.2 + Math.random() * 0.3,
        ph1: Math.random() * Math.PI * 2,
        ph2: Math.random() * Math.PI * 2,
        bright: 0.4 + Math.random() * 0.6,
      });
      clusterOf.push(def.id);
    }
  }

  const nodeGeo = new THREE.IcosahedronGeometry(1, 0);
  // Lambert + two lights gives the low-poly nodes faceted depth (basic material
  // reads as flat hexagons); instanceColor still drives theme + ignition brightness.
  const nodeMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(6, 10, 8);
  group.add(ambient, keyLight);
  const nodeMesh = new THREE.InstancedMesh(nodeGeo, nodeMat, nodes.length);
  nodeMesh.frustumCulled = false;
  group.add(nodeMesh);

  const dummy = new THREE.Object3D();
  const tmpColor = new THREE.Color();
  const white = new THREE.Color(1, 1, 1);
  const focus = {}; // cluster id → 0..1 ignition level (Phase 3 drives this)
  for (const def of CLUSTER_DEFS) focus[def.id] = 1;
  const focusTarget = {};
  for (const def of CLUSTER_DEFS) focusTarget[def.id] = 1;

  // ── connections (merged line segments) ────────────────
  const curves = [];
  const sceneParts = {};
  {
    const byId = {};
    for (const def of CLUSTER_DEFS) byId[def.id] = nodes.filter((_, i) => clusterOf[i] === def.id);

    const pts = [];
    const addCurve = (a, b, weight = 1) => {
      const mid = a.clone().add(b).multiplyScalar(0.5);
      const dir = b.clone().sub(a);
      const perp = new THREE.Vector3(-dir.y, dir.x, dir.z * 0.4).normalize();
      mid.add(perp.multiplyScalar(dir.length() * (0.12 + Math.random() * 0.18)));
      mid.y += (Math.random() - 0.5) * dir.length() * 0.1;
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      curve.userData = { weight };
      curves.push(curve);
      const sampled = curve.getPoints(14);
      for (let i = 0; i < sampled.length - 1; i++) {
        pts.push(sampled[i], sampled[i + 1]);
      }
    };

    for (const def of CLUSTER_DEFS) {
      const list = byId[def.id];
      for (let i = 0; i < list.length; i++) {
        const a = list[i].base, b = list[(i + 1) % list.length].base;
        addCurve(a, b);
        if (Math.random() < 0.35) addCurve(a, list[(i + 3) % list.length].base);
      }
    }
    // inter-cluster backbones — the "packets between services" routes
    for (let c = 0; c < CLUSTER_DEFS.length - 1; c++) {
      const A = byId[CLUSTER_DEFS[c].id], B = byId[CLUSTER_DEFS[c + 1].id];
      for (let k = 0; k < 2; k++) {
        addCurve(A[(Math.random() * A.length) | 0].base, B[(Math.random() * B.length) | 0].base, 3);
      }
    }

    const linePos = new Float32Array(pts.length * 3);
    pts.forEach((v, i) => v.toArray(linePos, i * 3));
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    const lineMat = new THREE.LineBasicMaterial({
      transparent: true,
      opacity: narrow ? 0.1 : 0.14,
      color: 0xffffff,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);
    sceneParts.lineMat = lineMat;
  }

  // ── pulses (light packets along curves) ───────────────
  const PULSE_POOL = narrow ? 14 : 34;
  const pulsePos = new Float32Array(PULSE_POOL * 3);
  const pulseCol = new Float32Array(PULSE_POOL * 3);
  const pulses = [];
  for (let i = 0; i < PULSE_POOL; i++) {
    pulses.push({ curve: null, t: Math.random(), v: 0, next: Math.random() * 2 });
  }
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
  pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseCol, 3));
  const pulseMat = new THREE.PointsMaterial({
    size: 0.85,
    sizeAttenuation: true,
    map: makeDiscTexture(THREE),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false, // additive + fog would haze; pulses fade via their color envelope
  });
  const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
  pulsePoints.frustumCulled = false;
  group.add(pulsePoints);

  function respawn(pulse) {
    // weight inter-cluster backbones (userData.weight) so packets travel between services
    let curve = curves[(Math.random() * curves.length) | 0];
    for (let tries = 0; tries < 4 && Math.random() > curve.userData.weight / 4; tries++) {
      curve = curves[(Math.random() * curves.length) | 0];
    }
    pulse.curve = curve;
    pulse.t = 0;
    pulse.v = (5 + Math.random() * 9) / curve.getLength();
  }

  // ── telemetry sprites (decorative) ────────────────────
  const labelCount = narrow ? 2 : 5;
  const labels = [];
  for (let i = 0; i < labelCount; i++) {
    const def = CLUSTER_DEFS[i % CLUSTER_DEFS.length];
    const tex = makeTextTexture(THREE, TELEMETRY[(Math.random() * TELEMETRY.length) | 0]);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      opacity: 0.1,
      depthWrite: false,
      color: 0xffffff,
    });
    const sprite = new THREE.Sprite(mat);
    const aspect = tex.image.width / tex.image.height;
    const hgt = narrow ? 1.1 : 1.5;
    sprite.scale.set(hgt * aspect, hgt, 1);
    sprite.position.set(
      def.center[0] + (Math.random() - 0.5) * def.spread * 2.4,
      def.center[1] + (Math.random() - 0.5) * def.spread * 1.6 + 1.5,
      def.center[2] + (Math.random() - 0.5) * def.spread
    );
    sprite.userData = { phase: Math.random() * Math.PI * 2, base: 0.07 + Math.random() * 0.07 };
    group.add(sprite);
    labels.push(sprite);
  }

  // ── camera rig (Phase 3 scroll drives base/look) ──────
  const rig = {
    base: new THREE.Vector3(0, 1.2, 24),
    look: new THREE.Vector3(1.5, 0, -6),
    mouse: { x: 0, y: 0, tx: 0, ty: 0 },
  };
  const onPointerMove = (e) => {
    rig.mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    rig.mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onPointerLeave = () => { rig.mouse.tx = 0; rig.mouse.ty = 0; };
  if (!coarse && !reducedMotion) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave);
  }

  // ── per-frame update ──────────────────────────────────

  function update(dt, t) {
    // theme colors
    app.scene.fog.color.copy(theme.colors.surface0);
    sceneParts.lineMat.color.copy(theme.colors.lineBright);

    // cluster ignition eases toward its target (Phase 3 toggles targets)
    for (const def of CLUSTER_DEFS) {
      focus[def.id] += (focusTarget[def.id] - focus[def.id]) * Math.min(1, dt * 2.2);
    }

    // nodes: idle float + per-cluster brightness
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      dummy.position.set(
        n.base.x + Math.sin(t * n.sp1 + n.ph1) * n.amp,
        n.base.y + Math.sin(t * n.sp2 + n.ph2) * n.amp * 0.8,
        n.base.z + Math.sin(t * n.sp1 * 0.7 + n.ph2) * n.amp * 0.5
      );
      const s = n.scale * (n.hub ? 2.1 : 1);
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      nodeMesh.setMatrixAt(i, dummy.matrix);

      const k = n.bright * (n.hub ? 1.5 : 1) * focus[n.cluster];
      tmpColor.copy(theme.colors.accent400).multiplyScalar(k);
      if (n.hub) tmpColor.lerp(white, 0.45);
      nodeMesh.setColorAt(i, tmpColor);
    }
    nodeMesh.instanceMatrix.needsUpdate = true;
    if (nodeMesh.instanceColor) nodeMesh.instanceColor.needsUpdate = true;

    // pulses
    for (let i = 0; i < pulses.length; i++) {
      const p = pulses[i];
      if (!p.curve) { respawn(p); }
      p.t += p.v * dt;
      if (p.t >= 1) { respawn(p); continue; }
      const pos = p.curve.getPoint(p.t);
      pulsePos[i * 3] = pos.x;
      pulsePos[i * 3 + 1] = pos.y;
      pulsePos[i * 3 + 2] = pos.z;
      const env = Math.sin(Math.PI * p.t); // fade in/out at the endpoints
      tmpColor.copy(theme.colors.accent300).multiplyScalar(env * 1.6);
      pulseCol[i * 3] = tmpColor.r;
      pulseCol[i * 3 + 1] = tmpColor.g;
      pulseCol[i * 3 + 2] = tmpColor.b;
    }
    pulseGeo.attributes.position.needsUpdate = true;
    pulseGeo.attributes.color.needsUpdate = true;

    // telemetry label breathing
    for (const sprite of labels) {
      const u = sprite.userData;
      sprite.material.opacity = u.base + 0.05 * Math.sin(t * 0.4 + u.phase);
      sprite.material.color.copy(theme.colors.accent300).lerp(white, 0.35);
    }

    // camera: drift + lerped parallax on top of the scroll-driven base
    const mk = 1 - Math.exp(-dt * 3);
    rig.mouse.x += (rig.mouse.tx - rig.mouse.x) * mk;
    rig.mouse.y += (rig.mouse.ty - rig.mouse.y) * mk;
    app.camera.position.set(
      rig.base.x + rig.mouse.x * 2.4 + Math.sin(t * 0.05) * 1.2,
      rig.base.y - rig.mouse.y * 1.6 + Math.cos(t * 0.04) * 0.8,
      rig.base.z
    );
    app.camera.lookAt(rig.look);
  }

  // ── Phase 3 hook: cluster ignition per section ────────
  function setSectionFocus(id, active) {
    if (id in focusTarget) focusTarget[id] = active ? 1 : 0.3;
  }

  function dispose() {
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    group.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
      for (const m of mats) {
        if (m.map) m.map.dispose();
        m.dispose();
      }
    });
    app.scene.remove(group);
    app.scene.fog = null;
  }

  return {
    update,
    dispose,
    setSectionFocus,
    anchors: Object.fromEntries(CLUSTER_DEFS.map((d) => [d.id, new THREE.Vector3(...d.center)])),
    rig, // Phase 3 rewrites rig.base / rig.look per scroll position
  };
}
