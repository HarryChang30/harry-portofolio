# Prompt Pack — 3D Cinematic WebGL Rebuild

Copy-paste prompts for rebuilding the portfolio's UI/UX animation from the current 2D
`SystemCanvas` into a 3D cinematic WebGL experience. Written for an AI coding agent
(ZCode / Cursor / Claude Code) working directly in this repo.

---

## How to use this pack

1. **Work one phase per session.** Start a fresh conversation for each phase and paste
   the **Master Context Block** plus that phase's prompt. Long sessions drift and
   forget constraints.
2. **Review, screenshot, and commit between phases.** One phase = one commit on the
   `webgl-cinematic` branch. Never stack unreviewed 3D work.
3. **Pick one concept before Phase 2** (see the Concept Menu). Put your choice on the
   `CONCEPT:` line in the Master Context Block.
4. **Don't skip Phase 1 or Phase 6.** Phase 1 is what makes the rest safe to iterate on;
   Phase 6 is what keeps it from shipping at 20fps on mobile.
5. Every phase ends with the agent running `npm run check && npm run build` and you
   verifying in `npm run preview` in **both themes**, on **desktop + mobile widths**.

---

## Master Context Block

> Paste this at the top of every prompt, filling in the `CONCEPT:` line.

```text
CONCEPT: Orbital Network   (see concept menu; do not change mid-project)

PROJECT — harry-portofolio (SvelteKit 2, Svelte 5, Tailwind 3, Vite, adapter-vercel).
Single-page portfolio + /blog route, English/Chinese i18n, dual cinematic theme.

Existing structure you must respect:
- src/routes/+page.svelte        — order: Introduction, Experience, Projects, Skills, footer#contact
- src/components/                — Introduction, Experience, Projects, Skills, Sidebar, Blog,
                                   SystemCanvas (current 2D canvas animation — will be replaced/augmented)
- Section anchors: #introduction, #experience, #projects, #skills, #contact
- src/lib/i18n.js + src/lib/locales/{en,zh}.json — i18n via $_(); do not touch keys or copy
- src/stores/languageStore.js    — language toggle (en/zh)
- src/app.css                    — design tokens as space-separated RGB triplets on :root,
                                   switched by `.dark` (default) / `.light` classes on <html>:
                                   --surface-0..3, --ink-50..400, --accent-200..400, --line, --line-bright
                                   dark accent = phosphor cyan #78bedc · light accent = azure #5fa5e6
- Existing 2D canvas (SystemCanvas.svelte) reads --accent-400 via getComputedStyle —
  the WebGL layer must use the same mechanism.

Aesthetic to preserve and amplify ("distributed systems, cinematic"):
near-black graphite surfaces, phosphor/azure accent, font-mono uppercase eyebrow labels
with wide tracking, light-weight display type, generous whitespace, telemetry-style micro-copy.

HARD RULES (every phase):
1. All text stays in the DOM. Never render copy inside WebGL. This protects i18n, SEO,
   selection, and screen readers. The 3D layer is backdrop + objects only, aria-hidden.
2. Three.js is client-only: dynamic import() inside onMount (or `{#if browser}`). SSR must
   not break — `npm run build` must pass at the end of every phase.
3. Allowed new dependencies ONLY: three, gsap (ScrollTrigger), lenis. Ask before adding more.
4. Preserve content, routes, i18n, theme class system, DOM structure of all sections, and
   prefers-reduced-motion handling.
5. The current SystemCanvas 2D canvas stays as the fallback: it renders when WebGL is
   unavailable, the WebGL bundle fails, or reduced motion is requested.
6. Performance budgets: ≤ 16ms frame on desktop mid-range GPU, ≥ 30fps on a modern phone,
   DPR clamped ≤ 2, renderer paused when tab hidden or canvas off-screen, full dispose()
   of geometries/materials/textures/renderer on destroy (no context leaks, HMR-safe).
7. Work on branch `webgl-cinematic`, one commit per phase, commit message "webgl: <phase>".
8. Match existing code style: Svelte stores (not runes), Tailwind utility classes,
   font-mono micro-labels, spacing and borders consistent with current components.

Finish every phase by running `npm run check && npm run build`, fixing what fails,
and listing which acceptance criteria from the phase you verified.
```

---

## Concept Menu — pick one before Phase 2

| Concept | The 3D scene | Why pick it |
|---|---|---|
| **A. Orbital Network** *(recommended, default)* | A 3D distributed-systems graph floating in dark space: instanced glowing service nodes, curved connection lines with light pulses traveling along them (data packets), depth fog, slow orbital camera drift with mouse parallax. Scrolling dollies the camera through the network; each section anchor is a cluster that ignites as you reach it. | Direct evolution of your current 2D node canvas — keeps the distributed-systems identity, zero new art direction to explain. |
| **B. Data Volumetrics** | Cinematic volumetric fog and god-rays over an animated particle flow-field (topographic streams of data), camera gliding through. | Most "film-like"; heavier GPU cost, less literal connection to your content. |
| **C. Crystal Terminal** | Floating glass/iridescent slabs in 3D (projects as physical cards), reflective floor, bloom, cursor-lit reflections. | Most interactive/tactile; needs real project artwork to not look empty. |

Set the line in the Master Context Block accordingly.

---

## Phase 1 — WebGL foundation & safety layer

```text
[Paste Master Context Block]

TASK — Build the WebGL foundation. Nothing "beautiful" yet; this phase is the skeleton
that every later phase hangs on, and it must be safe to keep merged even alone.

Deliverables:
1. src/lib/three/renderer.js — a reusable bootstrap that:
   - dynamically imports three, creates WebGLRenderer (antialias off — postprocessing
     comes later; powerPreference 'high-performance'), DPR = min(devicePixelRatio, 2),
     correct resize handling, setAnimationLoop driven, and pauses rendering when
     document.hidden or when the canvas is out of the viewport (IntersectionObserver).
   - exposes start(scene, camera), onFrame(cb), and dispose() that disposes renderer,
     geometries, materials and textures with no leaks (verify via repeated HMR).
2. src/lib/three/theme.js — a theme bridge:
   - reads --accent-400 / --accent-300 / --surface-0 / --surface-2 from computed style
     (they are space-separated RGB triplets — parse like SystemCanvas does),
   - exposes THREE.Color uniforms + a subscribe mechanism,
   - watches <html> class changes (MutationObserver) and lerps the colors over ~600ms
     so the 3D scene cross-fades with the CSS theme transition instead of snapping.
3. src/components/webgl/WebGLLayer.svelte — fixed, full-viewport, z-indexed BEHIND all
   content (same layer SystemCanvas occupies), aria-hidden="true", pointer-events none
   except where a phase explicitly opts in.
   - Feature flag via ?webgl=1 query param or VITE_WEBGL env for staged rollout.
   - Detection order: reduced-motion → SystemCanvas 2D fallback; no WebGL context /
     context lost / import failure → SystemCanvas 2D fallback; otherwise WebGL layer.
   - Canvas fades in only after the first frame renders (no blank flash over the CSS bg).
4. A minimal test scene to prove the pipeline: ~200 instanced points (InstancedMesh or
   THREE.Points) using the accent color from the theme bridge, drifting slowly, plus a
   fog that uses --surface-0. No postprocessing yet.
5. Remove nothing. SystemCanvas stays importable and is selected by the fallback path.

Constraints: budget three's bundle cost — import three only inside the lazy path and
report the resulting gzipped JS delta for the initial route (must stay under ~200KB gz
added, rest is deferred until after first paint).

Acceptance criteria:
- npm run check && npm run build pass; SSR build unaffected.
- Toggling .dark/.light on <html> recolors the 3D scene within ~600ms with a smooth lerp.
- prefers-reduced-motion: scene renders one static frame, no RAF loop.
- Tab hidden → no frames rendered (verify in DevTools Performance).
- Unmount/HMR x5 → no WebGL context warnings, memory flat in the Memory panel.
- WebGL disabled (or ?fallback) → identical experience to today's SystemCanvas.
```

---

## Phase 2 — Hero scene: CONCEPT build

```text
[Paste Master Context Block]

TASK — Build the hero set-piece for CONCEPT: Orbital Network on top of Phase 1.
(If your CONCEPT line differs, build that concept instead with the same quality bar.)

Scene (src/lib/three/scenes/hero.js + src/lib/three/systems/network.js):
1. ~40–70 "service nodes": instanced glowing meshes (icosahedron/sphere, emissive accent),
   arranged in loose clusters with depth spread (z from -40 to +10). Node size/brightness
   varies with depth. Subtle idle float (per-instance phase offset).
2. Connections: curved lines (QuadraticBezier / CatmullRom) between cluster members,
   rendered as faint lines (color: --line-bright, opacity low).
3. Pulses: short bright light packets traveling along connections via a custom
   ShaderMaterial or Points-with-positions-update — this is the "distributed system is
   alive" effect. Pulse spawn rate modest (do not turn it into a screensaver).
4. 4–6 named clusters positioned so that, in Phase 3, each maps to a page section
   (introduction, experience, projects, skills, contact). Export their world positions.
5. A handful of floating mono-style "telemetry" sprite labels reusing the TELEMETRY
   strings from SystemCanvas (render via canvas-texture sprites, English only, decorative,
   aria-hidden — NOT content).
6. Camera: slow orbital drift + mouse parallax (lerped, max ~2–3° tilt, no nausea).
   Camera state lives in a store/params object so Phase 3's scroll can drive it.
7. Look: fog matching --surface-0, bloom-friendly emissive intensities (bloom added in
   Phase 5), subtle idle rotation of the whole graph.

Text layer: hero DOM (Introduction.svelte) stays exactly as is — verify no visual
collision at 1280/1440/1920 widths; add a very subtle scrim behind the headline only if
contrast needs it.

Acceptance criteria:
- 60fps on integrated-GPU laptop at DPR 2, 1440px (verify with Stats or Performance panel).
- Hero headline remains fully readable in both themes over the animated scene.
- Mouse parallax is smooth and does not fight native scroll.
- Pulse count/scene complexity scales down automatically below ~900px viewport width.
- npm run check && npm run build pass.
```

---

## Phase 3 — Scroll choreography & camera path

```text
[Paste Master Context Block]

TASK — Turn the page scroll into a cinematic camera move through the Orbital Network,
without changing any DOM content or layout.

Deliverables:
1. src/lib/three/scroll.js — choreography module:
   - lenis for smooth scrolling (respect prefers-reduced-motion → disable lenis,
     native scroll), wired to gsap ScrollTrigger via lenis.on('scroll', ScrollTrigger.update).
   - A camera path: CatmullRomCurve3 through the cluster positions exported in Phase 2,
     mapped to document scroll progress (scrub: true, light smoothing ~0.5s catch-up).
     Waypoints: #introduction wide shot → #experience dolly into cluster 2 →
     #projects lateral glide past cluster 3 → #skills pull-back reveal → #contact slow
     rise + graph silhouette. Tune feels over coordinates; add comments for each waypoint.
   - Per-section cluster ignition: when a section crosses 50% viewport, its cluster's
     node brightness/pulse rate eases up, others dim slightly. Use one ScrollTrigger per
     section, onToggle.
2. Section-level DOM motion stays tasteful and existing (do not rewrite the sections'
   scroll-triggered CSS animations — coordinate timing with them where trivially possible).
3. Reduced motion: camera path disabled (fixed hero framing), cluster ignition becomes
   instant state changes, no scrub.
4. Mobile: keep the same narrative but simplify — path with fewer waypoints, lower
   damping, and the intersection-safe pause from Phase 1 still applies.

Guardrails: scrolling must never feel hijacked (no pinning that traps scroll, no
scroll-jacking of hero), URL/hash navigation (Sidebar links) must still work — test
every nav link after the change.

Acceptance criteria:
- Every section anchor still scrolls to the right place; Sidebar nav works.
- Scroll progress and camera position stay in sync after resize and after language toggle
  (content height can change with en/zh — verify with ScrollTrigger.refresh() on that).
- No jank when scrolling fast end-to-end (test 20 rapid full-page scrolls).
- npm run check && npm run build pass.
```

---

## Phase 4 — Section set-pieces & micro-interactions

```text
[Paste Master Context Block]

TASK — Add per-section 3D moments and micro-interactions. Small, performant, and
reversible. All text remains DOM.

1. Projects (Projects.svelte): on card hover, a subtle 3D parallax tilt on the DOM card
   (CSS transform perspective — not WebGL) synced with a local "spotlight" pulse in the
   WebGL layer near that section's cluster. Keyboard focus (:focus-visible) triggers the
   same response as hover. Cards animate in with a staggered clip/fade on first view.
2. Experience (Experience.svelte): the timeline gains a drawn progress line (SVG/CSS)
   that fills with scroll, each entry lighting up as it passes; the WebGL cluster behind
   mirrors the same progress (pulse density follows the fill fraction).
3. Skills (Skills.svelte): skill groups float as a light constellation — DOM chips remain
   the accessible content; the WebGL layer shows a faint particle constellation whose
   layout loosely echoes the group structure (simple generative placement, no per-skill
   3D objects needed).
4. Contact/footer: closing shot — camera continues its slow rise (from Phase 3), the
   network settles into a calm "all systems nominal" state; a single slow pulse travels
   one prominent connection line every few seconds.
5. Add a reusable src/lib/actions/tilt.js (or equivalent) with the tilt/parallax math so
   hover effects share one implementation, and a prefers-reduced-motion guard that
   disables all of it.

Guardrails: no hover effect may shift layout (transform only); all effects must work with
keyboard-only navigation; en/zh content untouched.

Acceptance criteria:
- Lighthouse a11y score does not drop; focus indicators remain visible over the canvas.
- 60fps while hovering cards rapidly during scroll.
- Every effect collapses to static/instant under prefers-reduced-motion.
- npm run check && npm run build pass.
```

---

## Phase 5 — Cinematic post-processing & art direction

```text
[Paste Master Context Block]

TASK — Make it cinematic. This is the art-direction pass; be opinionated but restrained.

1. Post chain (three/postprocessing): RenderPass → UnrealBloomPass (low threshold,
   restrained strength; emissive nodes glow, text-adjacent areas never bloom) →
   film grain + vignette (custom final ShaderPass; grain animated, opacity ~2-4%,
   vignette subtle) → optional very low chromatic aberration at edges only.
2. Theme-aware grade: dark theme = deeper fog + slightly stronger bloom; light theme =
   softer bloom, brighter fog tint toward --surface-1. Grade constants live in
   src/lib/three/grade.js with comments so values are tunable in one place.
3. Loader: a minimal cinematic intro — page renders instantly with CSS bg (no blank
   white/black), then the WebGL layer fades in ~600ms after first frame; a one-time
   0.8s "boot" micro-sequence in the hero (nodes power on in stagger, one telemetry
   label flickers) using the existing mono eyebrow aesthetic. Skippable: reduced motion
   and repeat visits (sessionStorage) skip straight to steady state.
4. Camera grain of truth: re-tune hero framing, fog density, and bloom for both themes
   at 1280, 1440, 1920, and 390px wide; fix any contrast issue with scrims, not by
   dimming the whole scene.

Acceptance criteria:
- Screenshot comparison dark vs light: both read as intentional, graded films.
- Postprocessing off (fallback path) leaves the site fully usable and handsome.
- Frame budget holds with post chain active (same GPUs as Phase 2 acceptance).
- npm run check && npm run build pass.
```

---

## Phase 6 — Performance, mobile & accessibility hardening

```text
[Paste Master Context Block]

TASK — Harden for production. This phase ships or breaks the project; treat its
acceptance criteria as blocking.

1. Adaptive quality governor (src/lib/three/quality.js): measure rolling frame time;
   tiers — Tier A (full: DPR 2, bloom, full particles) → Tier B (DPR 1.5, bloom reduced,
   half particles) → Tier C (DPR 1, no bloom, minimal scene). Step down after ~3s of
   sustained missed budget, step up cautiously after ~10s healthy. Report current tier
   via console.debug (behind ?debug=1).
2. Mobile pass at 390×844 (and a small Android profile in DevTools): start at Tier B,
   verify touch scrolling is smooth with lenis, parallax uses touch position only if
   cheap (or skip on touch), and battery-friendly pauses engage.
3. Accessibility audit:
   - canvas aria-hidden, all content reachable by keyboard, focus order unchanged.
   - Contrast: sample worst-case text-over-canvas combinations in both themes; add scrims
     where needed. Target WCAG AA for body text.
   - prefers-reduced-motion: full static experience verified end-to-end (no scrub, no
     drift, no pulses; loader skipped).
4. Resource discipline: verify three/gsap/lenis are all in the lazy chunk, initial route
   JS delta vs main branch reported; no layout shift from canvas mount (CLS ~0);
   memory stable over a 5-minute interactive session.
5. Failure drills: WebGL context lost event → graceful switch to SystemCanvas fallback;
   three import failure → fallback; rapid theme/language toggling under load → no leaks.
6. SEO/build: npm run build output unchanged for routes; lighthouse performance ≥
   pre-change baseline (record both numbers in the commit message).

Acceptance criteria: every item above demonstrably passes; summarize results in a
short table in your final message.
```

---

## Phase 7 — Final polish & launch

```text
[Paste Master Context Block]

TASK — Last mile. Polish details, then prepare merge.

1. Micro-polish sweep: cursor-reactive accent glow (subtle), selection color harmony,
   scrollbar styling consistent with theme, favicon/status "system online" easter egg
   (optional, tiny), 404 of /blog untouched but themed consistently.
2. Cross-checks: en AND zh full walkthrough (every section, both themes, both widths);
   blog route still perfect; all external links correct; OG/meta tags intact.
3. Housekeeping: remove dead code paths from SystemCanvas integration (keep the
   fallback itself), tidy comments at every waypoint/tier/grade constant, update README
   with a "3D layer" section (flag, fallback behavior, how to force tiers for testing).
4. Ship prep: squash-merge strategy note from `webgl-cinematic` → `main`; deploy preview
   (Vercel) and verify production build with the feature flag ON; keep ?webgl=0 escape
   hatch documented for users.

Acceptance criteria: you personally re-ran the Phase 6 checklist at HEAD, both themes,
both languages, both device classes — and the branch is merge-ready.
```

---

## Global acceptance checklist (run before merging to main)

- [ ] `npm run check && npm run build` clean; no new build warnings
- [ ] Dark + light themes, en + zh: full manual walkthrough
- [ ] Desktop 1280/1440/1920 and mobile 390×844: layout, fps, readability
- [ ] `prefers-reduced-motion`: static but complete experience
- [ ] WebGL disabled / context-lost / JS-chunk failure: falls back to SystemCanvas
- [ ] Sidebar nav, anchor links, mailto, GitHub/LinkedIn links all work
- [ ] Lighthouse: perf ≥ baseline, a11y ≥ 95, no new console errors
- [ ] Rollback proven: `git checkout main` restores today's site exactly
