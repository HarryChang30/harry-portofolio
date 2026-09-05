// @ts-nocheck
// Phase 6 — adaptive quality governor. Measures rolling frame rate and steps
// between three tiers so the cinematic look degrades gracefully instead of
// stuttering:
//   A — DPR 2, full bloom, full particle pool (default desktop)
//   B — DPR 1.5, bloom scaled to 0.55, 60% pulses (default mobile / start)
//   C — DPR 1, bloom off, 35% pulses, no constellation
// Step down after ~3s sustained under the fps floor; step up only after ~10s
// consistently healthy (no thrash). Exposed via console.debug with ?debug=1.

const TIERS = [
  { name: 'A', dpr: 2, bloom: true, bloomScale: 1, pool: 1, constellation: true },
  { name: 'B', dpr: 1.5, bloom: true, bloomScale: 0.55, pool: 0.6, constellation: true },
  { name: 'C', dpr: 1, bloom: false, bloomScale: 0, pool: 0.35, constellation: false },
];
const DOWNGRADE_AFTER = 3; // consecutive bad seconds
const UPGRADE_AFTER = 10; // consecutive healthy seconds

export function createQualityGovernor({
  app,
  post,
  scene,
  initialTier = 0,
  fpsFloor = 45,
  debug = false,
}) {
  let tier = Math.max(0, Math.min(TIERS.length - 1, initialTier));
  let frames = 0;
  let bucketTime = 0;
  let badSeconds = 0;
  let goodSeconds = 0;

  function apply() {
    const t = TIERS[tier];
    app.setDPR(t.dpr);
    post?.setQuality({ bloom: t.bloom, bloomScale: t.bloomScale });
    scene?.setQualityTier?.(t);
    if (debug) console.debug('[webgl:quality]', t.name);
  }
  apply();

  const offFrame = app.onFrame((dt) => {
    frames++;
    bucketTime += dt;
    if (bucketTime < 1) return;
    const fps = frames / bucketTime;
    frames = 0;
    bucketTime = 0;

    if (fps < fpsFloor) { badSeconds++; goodSeconds = 0; }
    else { goodSeconds++; badSeconds = 0; }

    if (badSeconds >= DOWNGRADE_AFTER && tier < TIERS.length - 1) {
      tier++;
      badSeconds = 0;
      goodSeconds = 0;
      apply();
    } else if (goodSeconds >= UPGRADE_AFTER && tier > 0) {
      tier--;
      goodSeconds = 0;
      apply();
    }
  });

  return {
    forceTier(i) {
      tier = Math.max(0, Math.min(TIERS.length - 1, i));
      badSeconds = 0;
      goodSeconds = 0;
      apply();
    },
    get tier() {
      return TIERS[tier].name;
    },
    dispose: offFrame,
  };
}
