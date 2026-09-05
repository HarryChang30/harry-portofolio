// @ts-nocheck
// Shared WebGL bootstrap: renderer + scene + camera + frame loop with
// visibility pausing and full disposal. Client-only — always import()ed.
// Returns null when WebGL is unusable so the caller can fall back to 2D.

const FRAME_DT_CAP = 0.05; // s — clamp the first frame after tab switches

export async function createWebGLRenderer(canvas, {
  fov = 50,
  near = 0.1,
  far = 220,
  dprMax = 2,
} = {}) {
  let THREE;
  try {
    THREE = await import('three');
  } catch (err) {
    console.warn('[webgl] three failed to load', err);
    return null;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true, // transparent clear — the CSS background/fog shows through
      antialias: false, // postprocessing (Phase 5) supersedes MSAA
      powerPreference: 'high-performance',
    });
  } catch (err) {
    console.warn('[webgl] context creation failed', err);
    return null;
  }
  if (!renderer.getContext()) return null;

  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, near, far);

  // ── sizing ─────────────────────────────────────────────
  // Canvas is a replaced element: without explicit CSS size it displays at its
  // attribute size, which would feed a ResizeObserver loop (buffer doubles every
  // fire). Pin style + attributes to the viewport on window resize instead —
  // the same pattern SystemCanvas uses.
  function applySize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
    renderer.setSize(w, h); // updateStyle — display size must track the buffer
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', applySize);
  applySize();

  // ── frame loop ─────────────────────────────────────────
  const frameCbs = new Set();
  let rafId = 0;
  let last = 0;
  let elapsed = 0;
  let running = false;
  let pageVisible = true;
  let canvasVisible = true;
  let disposed = false;

  function tick(now) {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, FRAME_DT_CAP);
    last = now;
    elapsed += dt;
    for (const cb of frameCbs) cb(dt, elapsed);
    renderer.render(scene, camera);
  }

  function updateRunning() {
    const should = pageVisible && canvasVisible && !disposed;
    if (should && !running) {
      running = true;
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    } else if (!should && running) {
      running = false;
      cancelAnimationFrame(rafId);
    }
  }

  const onVisibility = () => {
    pageVisible = document.visibilityState === 'visible';
    updateRunning();
  };
  const io = new IntersectionObserver(([entry]) => {
    canvasVisible = entry.isIntersecting;
    updateRunning();
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', onVisibility);

  function dispose() {
    disposed = true;
    cancelAnimationFrame(rafId);
    running = false;
    window.removeEventListener('resize', applySize);
    io.disconnect();
    document.removeEventListener('visibilitychange', onVisibility);
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
      for (const m of mats) {
        for (const value of Object.values(m)) {
          if (value && value.isTexture) value.dispose();
        }
        m.dispose();
      }
    });
    scene.clear();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  // One composed frame, no loop — the prefers-reduced-motion path.
  function renderStatic() {
    for (const cb of frameCbs) cb(0, elapsed);
    renderer.render(scene, camera);
  }

  return {
    THREE,
    renderer,
    scene,
    camera,
    onFrame: (cb) => frameCbs.add(cb),
    start: updateRunning,
    renderStatic,
    dispose,
  };
}
