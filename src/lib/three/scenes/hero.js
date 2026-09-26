// @ts-nocheck
// Night Sky — blue horizon, twinkling stars, shooting stars, moon.
// The camera sits low, looking up at the sky. Scrolling tilts the view upward
// through the star field, creating a cinematic journey through the night sky.
// All copy stays in the DOM — the 3D layer renders no text at all.

import { makeDiscTexture } from '../textures.js';

// Section → sky waypoint (camera position + look target).
// The scroll director builds a smooth path through these.
const SKY_WAYPOINTS = [
  { id: 'introduction', pos: [0, 2, 30], look: [0, 8, 0] },
  { id: 'experience', pos: [-3, 4, 28], look: [0, 15, -10] },
  { id: 'projects', pos: [3, 6, 26], look: [0, 22, -20] },
  { id: 'skills', pos: [0, 8, 24], look: [0, 30, -30] },
  { id: 'contact', pos: [0, 3, 30], look: [0, 12, -5] },
];

export function createHeroScene(THREE, app, theme, { reducedMotion = false } = {}) {
  const narrow = window.innerWidth < 900;
  const sizeFactor = narrow ? 0.6 : 1;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  const group = new THREE.Group();
  app.scene.add(group);
  app.scene.fog = new THREE.FogExp2(0x0a0e1a, 0.006);

  // ── Sky dome ─────────────────────────────────────────
  // Inverted sphere with vertical gradient shader.
  const skyGeo = new THREE.SphereGeometry(120, 48, 32);
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTopColor: { value: new THREE.Color(0x040810) },
      uMidColor: { value: new THREE.Color(0x0a1628) },
      uHorizonColor: { value: new THREE.Color(0x142848) },
      uGlowColor: { value: new THREE.Color(0x1e4070) },
      uTime: { value: 0 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uTopColor;
      uniform vec3 uMidColor;
      uniform vec3 uHorizonColor;
      uniform vec3 uGlowColor;
      uniform float uTime;
      varying vec3 vDir;

      void main() {
        float h = vDir.y;

        // Three-stop gradient: horizon → mid → zenith
        vec3 col;
        if (h < 0.15) {
          col = mix(uHorizonColor, uMidColor, smoothstep(-0.05, 0.15, h));
        } else {
          col = mix(uMidColor, uTopColor, smoothstep(0.15, 0.7, h));
        }

        // Horizon glow band
        float glow = 1.0 - smoothstep(0.0, 0.2, abs(h - 0.03));
        col = mix(col, uGlowColor, glow * 0.3);

        // Subtle aurora-like variation
        float aurora = sin(vDir.x * 3.0 + uTime * 0.1) * sin(vDir.z * 2.0 + uTime * 0.07) * 0.02;
        col += vec3(aurora * 0.3, aurora * 0.5, aurora * 0.8) * glow;

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  group.add(sky);

  // ── Stars ────────────────────────────────────────────
  const STAR_COUNT = Math.round((narrow ? 2500 : 5000) * sizeFactor);
  const starBaseCol = new Float32Array(STAR_COUNT * 3);
  const starPos = new Float32Array(STAR_COUNT * 3);
  const starPhase = new Float32Array(STAR_COUNT);
  const starSpeed = new Float32Array(STAR_COUNT);
  const starSize = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    // Upper hemisphere distribution
    const theta = Math.random() * Math.PI * 2;
    const y = Math.random() * 0.85 + 0.08;
    const r = Math.sqrt(1 - y * y);
    const dist = 70 + Math.random() * 30;

    starPos[i * 3] = r * Math.cos(theta) * dist;
    starPos[i * 3 + 1] = y * dist;
    starPos[i * 3 + 2] = r * Math.sin(theta) * dist;

    starPhase[i] = Math.random() * Math.PI * 2;
    starSpeed[i] = 0.3 + Math.random() * 1.8;
    starSize[i] = 0.3 + Math.pow(Math.random(), 3) * 2.5;

    // Color: mostly blue-white, some warm white, few bright white
    const c = Math.random();
    if (c < 0.5) {
      starBaseCol[i * 3] = 0.7 + Math.random() * 0.3;
      starBaseCol[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      starBaseCol[i * 3 + 2] = 1.0;
    } else if (c < 0.85) {
      starBaseCol[i * 3] = 1.0;
      starBaseCol[i * 3 + 1] = 0.85 + Math.random() * 0.15;
      starBaseCol[i * 3 + 2] = 0.6 + Math.random() * 0.3;
    } else {
      starBaseCol[i * 3] = 1.0;
      starBaseCol[i * 3 + 1] = 1.0;
      starBaseCol[i * 3 + 2] = 1.0;
    }
  }

  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  starGeo.setAttribute('color', new THREE.BufferAttribute(starBaseCol.slice(), 3));
  starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSize, 1));
  starGeo.setAttribute('aPhase', new THREE.BufferAttribute(starPhase, 1));
  starGeo.setAttribute('aSpeed', new THREE.BufferAttribute(starSpeed, 1));

  // Custom shader for twinkling stars — all animation on GPU
  const starMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: makeDiscTexture(THREE) },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aPhase;
      attribute float aSpeed;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float uTime;

      void main() {
        vColor = color;
        float tw = 0.55 + 0.45 * sin(uTime * aSpeed + aPhase);
        vTwinkle = tw;

        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * tw * (200.0 / -mv.z);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTexture;
      varying vec3 vColor;
      varying float vTwinkle;

      void main() {
        vec4 tex = texture2D(uTexture, gl_PointCoord);
        gl_FragColor = vec4(vColor * vTwinkle, tex.a);
      }
    `,
    vertexColors: true,
  });

  const stars = new THREE.Points(starGeo, starMat);
  stars.frustumCulled = false;
  group.add(stars);

  // ── Moon ─────────────────────────────────────────────
  const moonPos = new THREE.Vector3(35, 42, -55);
  const moonGeo = new THREE.CircleGeometry(2.5, 32);
  const moonMat = new THREE.MeshBasicMaterial({
    color: 0xf0e8d8,
    transparent: true,
    opacity: 0.85,
    fog: false,
  });
  const moon = new THREE.Mesh(moonGeo, moonMat);
  moon.position.copy(moonPos);
  moon.lookAt(0, 0, 0);
  group.add(moon);

  const moonGlowGeo = new THREE.CircleGeometry(5.5, 32);
  const moonGlowMat = new THREE.MeshBasicMaterial({
    color: 0xd8d0c0,
    transparent: true,
    opacity: 0.12,
    fog: false,
  });
  const moonGlow = new THREE.Mesh(moonGlowGeo, moonGlowMat);
  moonGlow.position.copy(moonPos).multiplyScalar(1.005);
  moonGlow.lookAt(0, 0, 0);
  group.add(moonGlow);

  // ── Shooting stars ───────────────────────────────────
  const SHOOTING_STAR_POOL = 6;
  const shootingStars = [];
  const shootingStarGeo = new THREE.BufferGeometry();
  const shootingStarPos = new Float32Array(SHOOTING_STAR_POOL * 3);
  const shootingStarCol = new Float32Array(SHOOTING_STAR_POOL * 3);
  shootingStarGeo.setAttribute('position', new THREE.BufferAttribute(shootingStarPos, 3));
  shootingStarGeo.setAttribute('color', new THREE.BufferAttribute(shootingStarCol, 3));
  const shootingStarMat = new THREE.PointsMaterial({
    size: 1.8,
    sizeAttenuation: true,
    map: makeDiscTexture(THREE),
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    fog: false,
  });
  const shootingStarPoints = new THREE.Points(shootingStarGeo, shootingStarMat);
  shootingStarPoints.frustumCulled = false;
  group.add(shootingStarPoints);

  function spawnShootingStar() {
    if (shootingStars.length >= SHOOTING_STAR_POOL) return;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.PI * 0.15 + Math.random() * Math.PI * 0.3;
    const r = 60 + Math.random() * 20;
    const start = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta)
    );
    const dir = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      -0.3 - Math.random() * 0.4,
      (Math.random() - 0.5) * 2
    ).normalize();
    shootingStars.push({
      pos: start,
      dir,
      speed: 40 + Math.random() * 30,
      life: 0,
      maxLife: 0.8 + Math.random() * 0.6,
    });
  }

  let shootingStarTimer = 2;

  // ── Horizon clouds ───────────────────────────────────
  const CLOUD_COUNT = narrow ? 4 : 8;
  const clouds = [];
  const cloudTex = makeDiscTexture(THREE, 64);
  for (let i = 0; i < CLOUD_COUNT; i++) {
    const cloudMat = new THREE.SpriteMaterial({
      map: cloudTex,
      color: 0x1a2840,
      transparent: true,
      opacity: 0.04 + Math.random() * 0.04,
      depthWrite: false,
      fog: false,
    });
    const cloud = new THREE.Sprite(cloudMat);
    const scale = 20 + Math.random() * 30;
    cloud.scale.set(scale, scale * 0.4, 1);
    cloud.position.set(
      (Math.random() - 0.5) * 100,
      -2 + Math.random() * 8,
      -40 - Math.random() * 30
    );
    clouds.push(cloud);
    group.add(cloud);
  }

  // ── Camera rig (scroll drives base/look) ─────────────
  const rig = {
    base: new THREE.Vector3(0, 2, 30),
    look: new THREE.Vector3(0, 8, 0),
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

  // ── Section focus (brightness per region) ────────────
  const focus = {};
  const focusTarget = {};
  for (const wp of SKY_WAYPOINTS) {
    focus[wp.id] = 1;
    focusTarget[wp.id] = 1;
  }

  // ── Boot micro-sequence ──────────────────────────────
  let bootT = 1;
  if (!reducedMotion) {
    try { bootT = sessionStorage.getItem('webgl-boot') ? 1 : 0; } catch (e) { /* private mode */ }
  }
  const bootEase = (x) => {
    const c = Math.max(0, Math.min(1, x));
    return c * c * (3 - 2 * c);
  };

  // ── Per-frame update ─────────────────────────────────
  function update(dt, t) {
    // Theme
    app.scene.fog.color.copy(theme.colors.surface0);

    // Focus easing
    for (const wp of SKY_WAYPOINTS) {
      focus[wp.id] += (focusTarget[wp.id] - focus[wp.id]) * Math.min(1, dt * 2.2);
    }

    // Sky shader time
    skyMat.uniforms.uTime.value = t;
    starMat.uniforms.uTime.value = t;

    // Stars — boot fade-in via shader time offset
    // (twinkle is handled entirely on GPU via uTime + per-star phase/speed)

    // Shooting stars
    shootingStarTimer -= dt;
    if (shootingStarTimer <= 0) {
      spawnShootingStar();
      shootingStarTimer = 3 + Math.random() * 5;
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.life += dt;
      s.pos.addScaledVector(s.dir, s.speed * dt);
      if (s.life >= s.maxLife) {
        shootingStars.splice(i, 1);
      }
    }
    for (let i = 0; i < SHOOTING_STAR_POOL; i++) {
      if (i < shootingStars.length) {
        const s = shootingStars[i];
        const fade = 1.0 - s.life / s.maxLife;
        shootingStarPos[i * 3] = s.pos.x;
        shootingStarPos[i * 3 + 1] = s.pos.y;
        shootingStarPos[i * 3 + 2] = s.pos.z;
        shootingStarCol[i * 3] = fade;
        shootingStarCol[i * 3 + 1] = fade * 0.95;
        shootingStarCol[i * 3 + 2] = fade * 0.85;
      } else {
        shootingStarCol[i * 3] = 0;
        shootingStarCol[i * 3 + 1] = 0;
        shootingStarCol[i * 3 + 2] = 0;
      }
    }
    shootingStarGeo.attributes.position.needsUpdate = true;
    shootingStarGeo.attributes.color.needsUpdate = true;

    // Clouds — slow drift
    for (let i = 0; i < clouds.length; i++) {
      clouds[i].position.x += Math.sin(t * 0.02 + i * 1.7) * 0.005;
    }

    // Moon — subtle glow pulse
    moonGlowMat.opacity = 0.1 + 0.04 * Math.sin(t * 0.3);

    // Boot clock
    if (bootT < 1) {
      bootT = Math.min(1, bootT + dt / 1.2);
      if (bootT >= 1) {
        try { sessionStorage.setItem('webgl-boot', '1'); } catch (e) { /* private mode */ }
      }
    }

    // Camera: drift + lerped parallax on top of the scroll-driven base
    const mk = 1 - Math.exp(-dt * 3);
    rig.mouse.x += (rig.mouse.tx - rig.mouse.x) * mk;
    rig.mouse.y += (rig.mouse.ty - rig.mouse.y) * mk;
    app.camera.position.set(
      rig.base.x + rig.mouse.x * 1.8 + Math.sin(t * 0.04) * 0.8,
      rig.base.y - rig.mouse.y * 1.2 + Math.cos(t * 0.03) * 0.5,
      rig.base.z
    );
    app.camera.lookAt(rig.look);
  }

  // ── Scroll-trigger hook: section brightness ─────────
  function setSectionFocus(id, active) {
    if (id in focusTarget) focusTarget[id] = active ? 1 : 0.3;
  }

  // ── DOM-driven hooks ────────────────────────────────
  function setSectionEnergy(id, value) {
    // Could control shooting star frequency per section
  }

  function pulseBurst(clusterId, strength = 1) {
    for (let n = 0; n < 3; n++) {
      spawnShootingStar();
    }
  }

  function setConstellation(index, active) {
    // Could control moon glow or a specific star region
  }

  // ── Quality tier hook ───────────────────────────────
  let poolFraction = 1;
  function setQualityTier(t) {
    poolFraction = t.pool ?? 1;
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
    setSectionEnergy,
    pulseBurst,
    setConstellation,
    setQualityTier,
    anchors: Object.fromEntries(SKY_WAYPOINTS.map((w) => [w.id, new THREE.Vector3(...w.pos)])),
    rig,
  };
}
