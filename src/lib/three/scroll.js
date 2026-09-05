// @ts-nocheck
// Phase 3 — scroll choreography: lenis smooth scroll + a damped camera dolly
// through the Orbital Network, with per-section cluster ignition via
// ScrollTrigger. No DOM content changes; the page keeps its native layout and
// SSR, the camera path lives entirely in the 3D layer.
//
// Waypoints come from the hero scene's cluster anchors — one camera frame per
// section, reached when that section's midpoint crosses the viewport center
// (piecewise mapping, so tall sections don't skew the timing).

export async function createScrollDirector({ app, scene, reducedMotion }) {
  if (reducedMotion) return { dispose() {} };

  const sections = ['introduction', 'experience', 'projects', 'skills', 'contact']
    .map((id) => document.getElementById(id));
  if (sections.some((s) => !s)) return { dispose() {} };

  const [{ gsap }, { ScrollTrigger }, { default: Lenis }, THREE] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
    import('lenis'),
    import('three'),
  ]);
  gsap.registerPlugin(ScrollTrigger);

  // ── camera path from cluster anchors ──────────────────
  // First waypoint = the hero's resting frame; the rest pull back and offset
  // from each cluster so the section content stays readable on top.
  const a = scene.anchors;
  const camPath = new THREE.CatmullRomCurve3([
    scene.rig.base.clone(),                    // introduction
    new THREE.Vector3(a.experience.x - 2, a.experience.y + 3, a.experience.z + 19),
    new THREE.Vector3(a.projects.x + 4, a.projects.y + 2, a.projects.z + 17),
    new THREE.Vector3(a.skills.x + 0, a.skills.y + 4, a.skills.z + 15),
    new THREE.Vector3(a.contact.x - 2, a.contact.y + 4, a.contact.z + 13),
  ], false, 'catmullrom', 0.6);
  const lookPath = new THREE.CatmullRomCurve3([
    scene.rig.look.clone(),
    a.experience.clone(), a.projects.clone(), a.skills.clone(), a.contact.clone(),
  ], false, 'catmullrom', 0.6);

  // ── smooth scroll ─────────────────────────────────────
  const html = document.documentElement;
  const prevSmooth = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto'; // CSS smooth-scroll fights lenis

  const lenis = new Lenis({ duration: 1.1 });
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  // Sidebar/CTA anchor links scroll through lenis (hash nav still works).
  // SvelteKit's replaceState keeps the router happy (raw history.* warns).
  const { replaceState } = await import('$app/navigation');
  const onClick = (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash.length > 1 && document.querySelector(hash)) {
      e.preventDefault();
      lenis.scrollTo(hash, { offset: 0 });
      replaceState(hash, {});
    }
  };
  document.addEventListener('click', onClick);

  // ── piecewise scroll → path progress ──────────────────
  let tops = [];
  let scrollable = 1;
  function measure() {
    const sy = window.scrollY;
    tops = sections.map((s) => s.getBoundingClientRect().top + sy);
    scrollable = Math.max(1, html.scrollHeight - window.innerHeight);
  }

  let targetP = 0;
  function progressAt(sy) {
    const center = sy + window.innerHeight * 0.5;
    let i = 0;
    for (let k = 0; k < tops.length; k++) if (center >= tops[k]) i = k;
    const span = i < tops.length - 1
      ? tops[i + 1] - tops[i]
      : scrollable + window.innerHeight * 0.5 - tops[i];
    const t = Math.min(1, Math.max(0, (center - tops[i]) / Math.max(1, span)));
    return Math.min(1, (i + t) / (tops.length - 1));
  }

  const onScroll = () => {
    targetP = progressAt(window.scrollY);
    ScrollTrigger.update();
  };
  lenis.on('scroll', onScroll);

  // ── cluster ignition (scroll-triggered brightness) ────
  const order = ['introduction', 'experience', 'projects', 'skills', 'contact'];
  const triggers = order.map((id) => ScrollTrigger.create({
    trigger: '#' + id,
    start: 'top 60%',
    end: id === 'contact' ? 'max' : 'bottom 60%',
    onToggle: (self) => scene.setSectionFocus(id, self.isActive),
  }));

  // section offsets drift with resize and with en/zh content height
  const { locale } = await import('../i18n.js');
  let refreshTimer = 0;
  const localeUnsub = locale.subscribe(() => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => { measure(); ScrollTrigger.refresh(); }, 250);
  });
  ScrollTrigger.addEventListener('refresh', measure);
  measure();
  ScrollTrigger.refresh();
  targetP = progressAt(window.scrollY); // honor a restored scroll position

  // ── damped camera follow ──────────────────────────────
  const offFrame = app.onFrame((dt) => {
    const k = 1 - Math.exp(-dt * 3.2);
    scene.rig.base.lerp(camPath.getPointAt(targetP), k);
    scene.rig.look.lerp(lookPath.getPointAt(targetP), k);
  });

  function dispose() {
    offFrame();
    clearTimeout(refreshTimer);
    localeUnsub();
    ScrollTrigger.removeEventListener('refresh', measure);
    triggers.forEach((t) => t.kill());
    document.removeEventListener('click', onClick);
    gsap.ticker.remove(raf);
    lenis.destroy();
    html.style.scrollBehavior = prevSmooth || '';
  }

  return { dispose };
}
