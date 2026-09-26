// @ts-nocheck
// Scroll choreography: lenis smooth scroll + a damped camera dolly
// through the night sky, with per-section brightness via ScrollTrigger.
// The camera tilts upward through the star field, then settles back.

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

  const a = scene.anchors;
  const camPath = new THREE.CatmullRomCurve3([
    scene.rig.base.clone(),
    new THREE.Vector3(a.experience.x, a.experience.y, a.experience.z),
    new THREE.Vector3(a.projects.x, a.projects.y, a.projects.z),
    new THREE.Vector3(a.skills.x, a.skills.y, a.skills.z),
    new THREE.Vector3(a.contact.x, a.contact.y, a.contact.z),
  ], false, 'catmullrom', 0.6);
  const lookPath = new THREE.CatmullRomCurve3([
    scene.rig.look.clone(),
    new THREE.Vector3(0, 15, -10),
    new THREE.Vector3(0, 22, -20),
    new THREE.Vector3(0, 30, -30),
    new THREE.Vector3(0, 12, -5),
  ], false, 'catmullrom', 0.6);

  const html = document.documentElement;
  const prevSmooth = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';

  const lenis = new Lenis({ duration: 1.1 });
  const raf = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

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

  const order = ['introduction', 'experience', 'projects', 'skills', 'contact'];
  const triggers = order.map((id) => ScrollTrigger.create({
    trigger: '#' + id,
    start: 'top 60%',
    end: id === 'contact' ? 'max' : 'bottom 60%',
    onToggle: (self) => scene.setSectionFocus(id, self.isActive),
  }));

  const { locale } = await import('../i18n.js');
  let refreshTimer = 0;
  const localeUnsub = locale.subscribe(() => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => { measure(); ScrollTrigger.refresh(); }, 250);
  });
  ScrollTrigger.addEventListener('refresh', measure);
  measure();
  ScrollTrigger.refresh();
  targetP = progressAt(window.scrollY);

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
