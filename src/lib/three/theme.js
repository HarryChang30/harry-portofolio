// @ts-nocheck
// Bridge between the CSS design tokens (.dark / .light on <html>) and THREE colors.
// Tokens in app.css are space-separated RGB triplets, e.g. "120 190 220" — parsed
// the same way SystemCanvas reads --accent-400, so the 3D layer and the 2D
// fallback always agree on color. Client-only: instantiate after `three` loads.

const TOKENS = {
  accent400: '--accent-400',
  accent300: '--accent-300',
  accent200: '--accent-200',
  surface0: '--surface-0',
  surface1: '--surface-1',
  surface2: '--surface-2',
  lineBright: '--line-bright',
};

// dt-correct smoothing — settles a theme cross-fade in roughly the same 300–700ms
// window as the CSS `transition-colors` on body.
const LERP_RATE = 6;

export function createThemeBridge(THREE) {
  const colors = {}; // live colors — lerped every frame toward targets
  const targets = {};
  const changeCbs = new Set();

  function read() {
    const style = getComputedStyle(document.documentElement);
    for (const [key, token] of Object.entries(TOKENS)) {
      const parts = style.getPropertyValue(token).trim().split(/\s+/).map(Number);
      if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) continue;
      const target = targets[key] ?? (targets[key] = new THREE.Color());
      // Token values are sRGB — declare the color space so the scene matches the page.
      target.setRGB(parts[0] / 255, parts[1] / 255, parts[2] / 255, THREE.SRGBColorSpace);
      if (!colors[key]) colors[key] = target.clone();
    }
  }

  const observer = new MutationObserver(() => {
    read();
    for (const cb of changeCbs) cb();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  read();

  return {
    colors,
    targets,

    /** advance the cross-fade; call once per frame with delta seconds */
    update(dt) {
      const a = 1 - Math.exp(-dt * LERP_RATE);
      for (const key of Object.keys(colors)) colors[key].lerp(targets[key], a);
    },

    /** jump to the current theme instantly (first paint, reduced motion) */
    snap() {
      for (const key of Object.keys(colors)) colors[key].copy(targets[key]);
    },

    onChange(cb) {
      changeCbs.add(cb);
    },

    dispose() {
      observer.disconnect();
      changeCbs.clear();
    },
  };
}
