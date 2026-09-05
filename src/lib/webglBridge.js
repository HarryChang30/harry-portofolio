// @ts-nocheck
// Tiny bridge from DOM components to the WebGL layer (decoupled via window
// events — components don't need to know whether the 3D layer is running).
// All handlers are no-ops when the WebGL layer isn't mounted.

function emit(type, detail) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(type, { detail }));
}

const lastBurst = {};
const BURST_MIN_GAP = 600; // ms — hover storms shouldn't flood the scene

/** request a short pulse burst near a section's cluster (hover/focus moments) */
export function webglPulse(cluster, strength = 1) {
  const now = performance.now();
  if (now - (lastBurst[cluster] || 0) < BURST_MIN_GAP) return;
  lastBurst[cluster] = now;
  emit('webgl:pulse', { cluster, strength });
}

/** mirror a 0..1 progress value into a section's cluster (e.g. timeline fill) */
export function webglEnergy(cluster, value) {
  emit('webgl:energy', { cluster, value: Math.max(0, Math.min(1, value)) });
}

/** highlight a constellation group (skills category hover/focus) */
export function webglHighlight(index, active) {
  emit('webgl:highlight', { index, active });
}
