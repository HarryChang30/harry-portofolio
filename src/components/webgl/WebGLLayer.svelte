<script>
  // @ts-nocheck
  // Fixed full-viewport 3D layer occupying the slot SystemCanvas used to own.
  // Decision order: explicit flag → no WebGL → falls back to SystemCanvas (2D);
  // otherwise the WebGL layer loads (three stays in a lazy chunk) and fades in
  // after its first rendered frame. prefers-reduced-motion renders exactly one
  // static frame — no RAF loop — and re-renders it when the theme flips.
  import { onMount, onDestroy } from 'svelte';
  import SystemCanvas from '../SystemCanvas.svelte';

  // 'pending' → deciding; 'webgl' → 3D layer; 'fallback' → 2D canvas
  let mode = 'pending';
  let canvas;
  let shown = false;
  let teardown = null;
  let post = null;
  let offResize = null;
  let governor = null;

  function fallback(reason) {
    if (import.meta.env.DEV && reason) console.info('[webgl] fallback:', reason);
    teardown?.();
    teardown = null;
    mode = 'fallback';
  }

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('webgl') === '0' || import.meta.env.VITE_WEBGL === '0') return fallback('disabled by flag');

    const probe = document.createElement('canvas');
    if (!probe.getContext('webgl2') && !probe.getContext('webgl')) return fallback('no webgl context');

    init();

    async function init() {
      try {
        const [{ createWebGLRenderer }, { createThemeBridge }, { createHeroScene }, { createScrollDirector }] = await Promise.all([
          import('../../lib/three/renderer.js'),
          import('../../lib/three/theme.js'),
          import('../../lib/three/scenes/hero.js'),
          import('../../lib/three/scroll.js'),
        ]);
        const THREE = await import('three');

        const app = await createWebGLRenderer(canvas);
        if (!app) return fallback('renderer unavailable');

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const theme = createThemeBridge(THREE);
        const scene = createHeroScene(THREE, app, theme, { reducedMotion });

        app.onFrame((dt, t) => {
          theme.update(dt);
          scene.update(dt, t);
        });

        // DOM → scene bridge: components emit webgl:* events via lib/webglBridge.js
        const onPulse = (e) => scene.pulseBurst?.(e.detail.cluster, e.detail.strength);
        const onEnergy = (e) => scene.setSectionEnergy?.(e.detail.cluster, e.detail.value);
        const onHighlight = (e) => scene.setConstellation?.(e.detail.index, e.detail.active);
        window.addEventListener('webgl:pulse', onPulse);
        window.addEventListener('webgl:energy', onEnergy);
        window.addEventListener('webgl:highlight', onHighlight);

        const onContextLost = (e) => {
          e.preventDefault();
          fallback('webgl context lost');
        };
        canvas.addEventListener('webglcontextlost', onContextLost);

        // scroll choreography (lenis + camera path) only on the animated path
        let scroll = null;
        if (!reducedMotion) {
          scroll = await createScrollDirector({ app, scene, reducedMotion });
        }

        // cinematic post chain (bloom + grade) owns the final render
        const { createPostChain } = await import('../../lib/three/post.js');
        post = await createPostChain(app, theme);
        offResize = app.onResize((w, h) => post.setSize(w, h));
        app.setRenderFrame(() => post.render());

        // adaptive quality: mobile starts at tier B, desktop at A
        const debug = new URLSearchParams(window.location.search).has('debug');
        const startTier = window.innerWidth < 900 || window.matchMedia('(pointer: coarse)').matches ? 1 : 0;
        const { createQualityGovernor } = await import('../../lib/three/quality.js');
        governor = createQualityGovernor({
          app,
          post,
          scene,
          initialTier: startTier,
          fpsFloor: startTier === 0 ? 45 : 28,
          debug,
        });
        if (debug) window.__webglTier = governor;

        if (reducedMotion) {
          theme.snap();
          scene.update(0, 0);
          app.renderStatic();
          theme.onChange(() => {
            theme.snap();
            scene.update(0, 0);
            app.renderStatic();
          });
        } else {
          app.start();
          requestAnimationFrame(() => (shown = true)); // fade in once pixels exist
        }

        teardown = () => {
          canvas?.removeEventListener('webglcontextlost', onContextLost);
          window.removeEventListener('webgl:pulse', onPulse);
          window.removeEventListener('webgl:energy', onEnergy);
          window.removeEventListener('webgl:highlight', onHighlight);
          offResize?.();
          post?.dispose();
          governor?.dispose();
          if (window.__webglTier) delete window.__webglTier;
          app.setRenderFrame(null);
          scroll?.dispose();
          theme.dispose();
          scene.dispose();
          app.dispose();
        };

        mode = 'webgl';
      } catch (err) {
        console.warn('[webgl] init failed', err);
        fallback('init failed');
      }
    }
  });

  onDestroy(() => teardown?.());
</script>

{#if mode !== 'fallback'}
  <canvas
    bind:this={canvas}
    class="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000 ease-out {shown ? 'opacity-100' : 'opacity-0'}"
    aria-hidden="true"
  ></canvas>
{/if}
{#if mode === 'fallback'}
  <SystemCanvas />
{/if}
