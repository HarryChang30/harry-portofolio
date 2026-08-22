<script>
  import { onMount, onDestroy } from 'svelte';

  let canvas;
  let ctx;
  let raf;
  let w, h;
  let reducedMotion = false;
  let dpr = 1;

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
    const count = Math.max(12, Math.floor((w * h) / 28000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: 1.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
    }));

    // telemetry labels — sparse, random positions
    const labelCount = Math.min(5, Math.floor(w / 280));
    telemetryLabels = Array.from({ length: labelCount }, () => ({
      x: 40 + Math.random() * (w - 200),
      y: 60 + Math.random() * (h - 120),
      text: TELEMETRY[Math.floor(Math.random() * TELEMETRY.length)],
      alpha: 0,
      targetAlpha: 0,
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

    // move nodes
    for (const n of nodes) {
      n.x += n.vx * dt;
      n.y += n.vy * dt;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    // connection lines
    ctx.strokeStyle = 'rgba(120, 190, 220, 0.06)';
    ctx.lineWidth = 0.5;
    const maxDist = 160;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < maxDist) {
          ctx.globalAlpha = (1 - d / maxDist) * 0.5;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;

    // nodes
    for (const n of nodes) {
      const glow = 0.5 + 0.5 * Math.sin(ts * 0.001 + n.phase);
      ctx.fillStyle = `rgba(120, 190, 220, ${0.2 + glow * 0.3})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // pulses
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

      ctx.fillStyle = `rgba(120, 190, 220, ${fade * 0.6})`;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fill();

      // faint trail
      ctx.strokeStyle = `rgba(120, 190, 220, ${fade * 0.15})`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(p.ax, p.ay);
      ctx.lineTo(px, py);
      ctx.stroke();
    }

    // telemetry labels
    for (const label of telemetryLabels) {
      const target = 0.15 + 0.15 * Math.sin(ts * 0.0004 + label.phase);
      label.alpha += (target - label.alpha) * 0.02;
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = `rgba(120, 190, 220, ${label.alpha})`;
      ctx.fillText(label.text, label.x, label.y);
    }

    raf = requestAnimationFrame(draw);
  }

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    ctx = canvas.getContext('2d');
    resize();
    initNodes();

    if (reducedMotion) {
      // draw one static frame
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
      window.removeEventListener('resize', resize);
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 z-0 pointer-events-none"
  aria-hidden="true"
></canvas>
