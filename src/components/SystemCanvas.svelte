<script>
  // @ts-nocheck
  import { onMount, onDestroy } from 'svelte';

  let canvas;
  let ctx;
  let raf;
  let w, h;
  let dpr = 1;

  // ── Theme ─────────────────────────────────────────────
  // Accent comes from the CSS vars so the canvas recolors on theme swap.
  let accent = [120, 190, 220];
  let themeObserver;

  function readTheme() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--accent-400').trim();
    const parsed = raw.split(/\s+/).map(Number);
    if (parsed.length === 3 && parsed.every((n) => !Number.isNaN(n))) accent = parsed;
  }

  const col = (a) => `rgba(${accent[0]}, ${accent[1]}, ${accent[2]}, ${a})`;

  // ── Pointer ───────────────────────────────────────────
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, glow: 0 };

  function onPointerMove(e) {
    pointer.tx = e.clientX;
    pointer.ty = e.clientY;
  }
  function onPointerOver() {
    pointer.tx = -9999;
    pointer.ty = -9999;
  }

  // ── Field ─────────────────────────────────────────────
  let nodes = [];
  let pulses = [];
  let telemetryLabels = [];

  const TELEMETRY = [
    'WORKER ACTIVE', 'QUEUE HEALTHY', 'LATENCY 18ms',
    'RETRY 0', 'SERVICE ONLINE', 'UPTIME 99.98%',
    'CONN POOL 12/50', 'GC 4ms', 'ROUTE /api/health 200'
  ];

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

  function initNodes() {
    const count = Math.max(14, Math.floor((w * h) / 24000));
    nodes = Array.from({ length: count }, () => {
      // depth 0.35 (far, small, slow) → 1 (near, bigger, faster)
      const depth = 0.35 + Math.random() * 0.65;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.15 * (0.4 + depth),
        vy: (Math.random() - 0.5) * 0.15 * (0.4 + depth),
        r: (1.2 + Math.random() * 1.4) * (0.55 + depth * 0.75),
        depth,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const labelCount = Math.min(5, Math.floor(w / 280));
    telemetryLabels = Array.from({ length: labelCount }, () => ({
      x: 40 + Math.random() * (w - 200),
      y: 60 + Math.random() * (h - 120),
      text: TELEMETRY[Math.floor(Math.random() * TELEMETRY.length)],
      alpha: 0,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  function spawnPulse() {
    if (nodes.length < 2) return;
    const a = nodes[Math.floor(Math.random() * nodes.length)];
    const b = nodes[Math.floor(Math.random() * nodes.length)];
    if (a === b) return;
    pulses.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, t: 0, speed: 0.003 + Math.random() * 0.004 });
  }

  let lastFrame = 0;
  let pulseTimer = 0;

  function draw(ts) {
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);

    const dt = Math.min((ts - lastFrame) / 16, 3);
    lastFrame = ts;

    // ease pointer toward target; glow fades out when idle/off-window
    pointer.x += (pointer.tx - pointer.x) * 0.12 * dt;
    pointer.y += (pointer.ty - pointer.y) * 0.12 * dt;
    const engaged = pointer.tx > -999;
    pointer.glow += ((engaged ? 1 : 0) - pointer.glow) * 0.06 * dt;

    // move nodes
    for (const n of nodes) {
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    // cursor spotlight — faint radial pool of accent light
    if (pointer.glow > 0.02) {
      const g = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 260);
      g.addColorStop(0, col(0.07 * pointer.glow));
      g.addColorStop(1, col(0));
      ctx.fillStyle = g;
      ctx.fillRect(pointer.x - 260, pointer.y - 260, 520, 520);
    }

    // connection lines; near-cursor links brighten as if energized
    ctx.lineWidth = 0.5;
    const maxDist = 160;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          let a = (1 - d / maxDist) * 0.5;
          if (pointer.glow > 0.05) {
            const mx = (nodes[i].x + nodes[j].x) / 2 - pointer.x;
            const my = (nodes[i].y + nodes[j].y) / 2 - pointer.y;
            const md = Math.sqrt(mx * mx + my * my);
            if (md < 260) a += (1 - md / 260) * 0.35 * pointer.glow;
          }
          ctx.strokeStyle = col(a);
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // nodes — brightness and radius breathe with depth
    for (const n of nodes) {
      const glow = 0.5 + 0.5 * Math.sin(ts * 0.001 + n.phase);
      ctx.fillStyle = col((0.14 + glow * 0.22) * (0.5 + n.depth * 0.6));
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // tether lines from cursor to nearby nodes
    if (pointer.glow > 0.05 && engaged) {
      ctx.lineWidth = 0.75;
      const reach = 200;
      for (const n of nodes) {
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < reach) {
          ctx.strokeStyle = col((1 - d / reach) * 0.3 * pointer.glow);
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
      }
    }

    // pulses — glowing packet with gradient trail
    pulseTimer += dt;
    if (pulseTimer > 18 && Math.random() < 0.3) {
      spawnPulse();
      pulseTimer = 0;
    }

    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i];
      p.t += p.speed * dt;
      if (p.t >= 1) { pulses.splice(i, 1); continue; }

      const px = p.ax + (p.bx - p.ax) * p.t;
      const py = p.ay + (p.by - p.ay) * p.t;
      const fade = Math.sin(p.t * Math.PI);

      const trail = ctx.createLinearGradient(p.ax, p.ay, px, py);
      trail.addColorStop(0, col(0));
      trail.addColorStop(1, col(fade * 0.3));
      ctx.strokeStyle = trail;
      ctx.lineWidth = 0.75;
      ctx.beginPath();
      ctx.moveTo(p.ax, p.ay);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.fillStyle = col(fade * 0.25);
      ctx.beginPath();
      ctx.arc(px, py, 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = col(fade * 0.75);
      ctx.beginPath();
      ctx.arc(px, py, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // telemetry labels
    for (const label of telemetryLabels) {
      const target = 0.15 + 0.15 * Math.sin(ts * 0.0004 + label.phase);
      label.alpha += (target - label.alpha) * 0.02;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = col(label.alpha);
      ctx.fillText(label.text, label.x, label.y);
    }

    raf = requestAnimationFrame(draw);
  }

  onMount(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctx = canvas.getContext('2d');
    readTheme();

    // recolor when the .light/.dark class flips on <html>
    themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    resize();
    initNodes();

    if (reducedMotion) {
      lastFrame = performance.now();
      draw(lastFrame);
      return;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerOver);
    raf = requestAnimationFrame(draw);
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      cancelAnimationFrame(raf);
      themeObserver?.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerOver);
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 z-0 pointer-events-none"
  aria-hidden="true"
></canvas>
