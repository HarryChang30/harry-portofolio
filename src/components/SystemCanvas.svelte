<script>
  // @ts-nocheck
  import { onMount, onDestroy } from 'svelte';

  let canvas;
  let ctx;
  let raf;
  let w, h;
  let dpr = 1;

  let accent = [120, 190, 220];
  let themeObserver;

  function readTheme() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent-400').trim();
    const parsed = raw.split(/\s+/).map(Number);
    if (parsed.length === 3 && parsed.every((n) => !Number.isNaN(n))) accent = parsed;
  }

  const col = (a) => `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${a})`;

  let stars = [];

  function resize() {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initStars() {
    const count = Math.max(120, Math.floor((w * h) / 12000));
    stars = Array.from({ length: count }, () => {
      const depth = 0.3 + Math.random() * 0.7;
      return {
        x: Math.random() * w,
        y: Math.random() * h * 0.75,
        r: (0.6 + Math.random() * 1.6) * (0.5 + depth * 0.7),
        depth,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.4,
      };
    });
  }

  let lastFrame = 0;

  function draw(ts) {
    if (!ctx) return;
    const dt = Math.min((ts - lastFrame) / 16, 3);
    lastFrame = ts;

    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#040810');
    grad.addColorStop(0.4, '#0a1628');
    grad.addColorStop(0.75, '#142848');
    grad.addColorStop(1, '#1e4070');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const glow = ctx.createRadialGradient(w * 0.5, h * 0.85, 0, w * 0.5, h * 0.85, h * 0.5);
    glow.addColorStop(0, col(0.06));
    glow.addColorStop(1, col(0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      const tw = 0.55 + 0.45 * Math.sin(ts * 0.001 * s.speed + s.phase);
      ctx.fillStyle = `rgba(255, 255, 255, ${(0.2 + tw * 0.5) * (0.4 + s.depth * 0.6)})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    raf = requestAnimationFrame(draw);
  }

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctx = canvas.getContext('2d');
    readTheme();

    themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    resize();
    initStars();

    if (reducedMotion) {
      lastFrame = performance.now();
      draw(lastFrame);
      return;
    }

    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      cancelAnimationFrame(raf);
      themeObserver?.disconnect();
      window.removeEventListener('resize', resize);
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 z-0 pointer-events-none"
  aria-hidden="true"
></canvas>
