# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Websites

Link URL : https://harry-portofolio.vercel.app/

## 3D layer (WebGL cinematic background)

The portfolio has a 3D "Orbital Network" background — a distributed-systems graph
(instanced service nodes, curved connections, traveling light pulses) with a
scroll-driven camera dolly, bloom + film-grain grade, and Lenis smooth scrolling. Built with three.js + GSAP ScrollTrigger + Lenis, all in
lazy client-only chunks.

```
src/lib/three/
  renderer.js        # WebGL bootstrap: DPR clamp, resize, visibility pausing, dispose
  theme.js           # CSS design tokens (.dark/.light) → THREE.Color bridge with lerp
  scenes/hero.js     # the Orbital Network scene (nodes, pulses, constellation, camera rig)
  scroll.js          # lenis + camera path + per-section cluster ignition (ScrollTrigger)
  post.js / grade.js # bloom + film grain + vignette; theme grade constants live here
  quality.js         # adaptive quality governor (tiers A/B/C)
src/components/webgl/WebGLLayer.svelte  # canvas layer + fallback decision tree
src/lib/webglBridge.js                  # DOM → scene events (hover pulses, timeline mirror)
src/lib/actions/tilt.js                 # card tilt action (reduced-motion / touch safe)
```

Behavior & controls:

- **Fallbacks** — no WebGL, WebGL context loss, or a failed chunk load falls back to
  the original 2D `SystemCanvas`. `?webgl=0` forces the 2D fallback (escape hatch);
  `VITE_WEBGL=0` does the same at build time.
- **Reduced motion** — `prefers-reduced-motion` renders exactly one static 3D frame
  (no loop, no scroll hijack, no smooth scrolling).
- **Quality governor** — steps between tiers A (DPR 2, bloom, full pulses),
  B (DPR 1.5, bloom ×0.55, 60% pulses; default on mobile) and C (DPR 1, no bloom,
  minimal scene) based on measured fps. Debug with `?debug=1` — tier logs to
  console and `window.__webglTier` exposes `tier` / `forceTier(n)` for testing.
- **Boot timing** — the 3D layer starts on `load` + idle so first paint/TTI stay
  clean (Lighthouse perf 100, TBT 0); the canvas fades in over 1s.
- Tune the look in `grade.js` (bloom/grain/vignette per theme) and camera waypoints
  in `scroll.js` (framed against the cluster anchors exported by `hero.js`).
- All copy remains in the DOM (i18n en/zh intact); the 3D layer is `aria-hidden`
  backdrop only.