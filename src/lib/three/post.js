// @ts-nocheck
// Phase 5 — cinematic post chain: bloom → OutputPass → grade (grain/vignette/
// aberration in display space). Client-only, built after the scene exists.
// Theme mood is re-applied whenever the .light/.dark class flips.

import { GRADES, GradeShader } from './grade.js';

export async function createPostChain(app, theme) {
  const THREE = app.THREE;
  const [{ EffectComposer }, { RenderPass }, { UnrealBloomPass }, { OutputPass }, { ShaderPass }] =
    await Promise.all([
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
    ]);

  const composer = new EffectComposer(app.renderer);
  composer.addPass(new RenderPass(app.scene, app.camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.85, 0.55, 0.6);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  composer.addPass(grade);

  let bloomScale = 1; // Phase 6 quality tiers scale the mood's bloom strength
  function applyMood() {
    const isLight = document.documentElement.classList.contains('light');
    const g = isLight ? GRADES.light : GRADES.dark;
    bloom.strength = g.bloomStrength * bloomScale;
    if (app.scene.fog) app.scene.fog.density = g.fogDensity;
    grade.uniforms.uGrain.value = g.grain;
    grade.uniforms.uVignette.value = g.vignette;
    grade.uniforms.uAberration.value = g.aberration;
  }
  applyMood();
  theme.onChange(applyMood);

  return {
    /** swap in for the renderer's direct render — call once per frame */
    render() {
      grade.uniforms.uTime.value = (performance.now() / 1000) % 1000;
      composer.render();
    },

    /** Phase 6 quality tiers plug in here */
    setQuality(q) {
      if ('bloom' in q) bloom.enabled = !!q.bloom;
      if (typeof q.bloomScale === 'number') {
        bloomScale = q.bloomScale;
        applyMood(); // keep mood constants authoritative, scaled by tier
      }
    },

    setSize(w, h) {
      composer.setPixelRatio(app.renderer.getPixelRatio());
      composer.setSize(w, h);
      bloom.setSize(w, h);
    },

    dispose() {
      composer.dispose?.();
    },
  };
}
