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
        const [{ createWebGLRenderer }, { createThemeBridge }, { createHeroScene }] = await Promise.all([
          import('../../lib/three/renderer.js'),
          import('../../lib/three/theme.js'),
          import('../../lib/three/scenes/hero.js'),
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

        const onContextLost = (e) => {
          e.preventDefault();
          fallback('webgl context lost');
        };
        canvas.addEventListener('webglcontextlost', onContextLost);

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
