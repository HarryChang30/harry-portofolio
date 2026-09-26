// @ts-nocheck
// Phase 5 — art-direction constants + the final display-space grade shader.
// All numbers here are the tuning surface for the whole cinematic look; change
// them in one place. The grade pass runs AFTER OutputPass so grain/vignette
// operate in display space (what the eye sees), not linear light.

export const GRADES = {
  // night sky — sharper bloom, deeper vignette, calmer grain
  dark: { bloomStrength: 0.75, fogDensity: 0.008, grain: 0.022, vignette: 0.3, aberration: 0.8 },
  // deep navy + azure — softer glow, calmer grain
  light: { bloomStrength: 0.5, fogDensity: 0.01, grain: 0.018, vignette: 0.26, aberration: 0.65 },
};

export const GradeShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0.035 },
    uVignette: { value: 0.26 },
    uAberration: { value: 0.9 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uAberration;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7)) + uTime * 43.7) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;
      vec2 d = uv - 0.5;
      float r2 = dot(d, d);

      // chromatic aberration — edges only, essentially invisible at center
      vec2 off = d * r2 * uAberration * 0.008;
      vec3 col;
      col.r = texture2D(tDiffuse, uv + off).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - off).b;

      // vignette — corners only, center untouched
      float vig = 1.0 - uVignette * smoothstep(0.3, 1.0, r2 * 2.4);
      col *= vig;

      // animated film grain
      float g = (hash(uv * vec2(1920.0, 1080.0)) - 0.5) * uGrain;
      col += g;

      gl_FragColor = vec4(col, texture2D(tDiffuse, uv).a);
    }
  `,
};
