// @ts-nocheck
// Subtle 3D parallax tilt for cards. Transform-only (zero layout shift),
// keyboard-focus aware, and a strict no-op under prefers-reduced-motion or on
// coarse (touch) pointers. Usage: <div use:tilt={{ max: 4 }}>
export function tilt(node, opts = {}) {
  const { max = 4, scale = 1.01, perspective = 900, speed = 7 } = opts;

  if (typeof window === 'undefined') return { destroy() {} };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduced || coarse) return { destroy() {}, update() {} };

  let rx = 0, ry = 0, sc = 1; // current
  let trx = 0, try_ = 0, tsc = 1; // target
  let raf = 0;

  function frame() {
    raf = 0;
    const k = 0.16;
    rx += (trx - rx) * k;
    ry += (try_ - ry) * k;
    sc += (tsc - sc) * k;
    node.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg) scale(${sc.toFixed(4)})`;
    const settled =
      Math.abs(trx - rx) < 0.01 && Math.abs(try_ - ry) < 0.01 && Math.abs(tsc - sc) < 0.001;
    if (!settled) raf = requestAnimationFrame(frame);
    else if (trx === 0 && try_ === 0 && tsc === 1) {
      node.style.transform = ''; // fully idle — drop the inline transform
      node.style.willChange = '';
    }
  }
  const kick = () => {
    node.style.willChange = 'transform';
    if (!raf) raf = requestAnimationFrame(frame);
  };

  const onMove = (e) => {
    const r = node.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    trx = -py * max * 2;
    try_ = px * max * 2;
    tsc = scale;
    kick();
  };
  const onLeave = () => {
    trx = 0; try_ = 0; tsc = 1;
    kick();
  };
  // keyboard parity: a gentle lift, no directional tilt without a pointer
  const onFocus = () => { tsc = scale; kick(); };
  const onBlur = onLeave;

  node.addEventListener('pointermove', onMove);
  node.addEventListener('pointerleave', onLeave);
  node.addEventListener('focusin', onFocus);
  node.addEventListener('focusout', onBlur);

  return {
    update(next = {}) {
      Object.assign(opts, next);
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      node.removeEventListener('focusin', onFocus);
      node.removeEventListener('focusout', onBlur);
      node.style.transform = '';
      node.style.willChange = '';
    },
  };
}
