<script>
  // @ts-nocheck
  import { _ } from '../lib/i18n.js';
  import { onMount } from 'svelte';

  let visible = false;
  let section;
  let eyebrowEl;
  let mascotY = 0;
  let reducedMotion = false;

  const GLYPHS = '01<>/#{}[]·+*_;:';

  function scrambleTo(el, finalText, duration = 900) {
    const start = performance.now();
    const len = finalText.length;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const locked = Math.floor(t * len);
      let out = finalText.slice(0, locked);
      for (let i = locked; i < len; i++) {
        const ch = finalText[i];
        out += ch === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      el.textContent = out;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // decode the eyebrow whenever it becomes visible — or when the language flips
  $: if (visible && eyebrowEl && typeof window !== 'undefined') {
    const text = $_('hero.eyebrow');
    if (reducedMotion) {
      eyebrowEl.textContent = text;
    } else {
      scrambleTo(eyebrowEl, text);
    }
  }

  let rafId = 0;
  function updateParallax() {
    rafId = 0;
    mascotY = Math.min(48, window.scrollY * 0.06);
  }
  function onScroll() {
    if (reducedMotion || rafId) return;
    rafId = requestAnimationFrame(updateParallax);
  }

  onMount(() => {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) visible = true; },
      { threshold: 0.1 }
    );
    observer.observe(section);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  });
</script>

<section id="introduction" bind:this={section} class="relative min-h-screen flex items-center justify-center px-6 sm:px-8">
  <div class="max-w-5xl mx-auto w-full py-32 md:py-40">
    <div class="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
      <!-- Text -->
      <div class="md:col-span-7">
        <!-- Eyebrow -->
        <div
          class="overflow-hidden mb-8"
          style="opacity: {visible ? '1' : '0'}"
        >
          <div
            class="sys-eyebrow transition-all duration-700 ease-soft"
            style="transition-delay: 0.2s; transform: translateY({visible ? '0' : '100%'})"
          >
            <span class="inline-block w-8 h-px bg-accent-400/60 align-middle mr-3"></span>
            <span bind:this={eyebrowEl}>{$_('hero.eyebrow')}</span>
          </div>
        </div>

        <!-- Main statement -->
        <div class="space-y-2 mb-10">
          <div class="overflow-hidden">
            <h1
              class="sys-display text-display-xl transition-all duration-1000 ease-soft"
              style="transition-delay: 0.4s; transform: translateY({visible ? '0' : '105%'})"
            >
              {$_('hero.title_line1')}
            </h1>
          </div>
          <div class="overflow-hidden">
            <p
              class="sys-display text-display-xl text-ink-300 transition-all duration-1000 ease-soft"
              style="transition-delay: 0.7s; transform: translateY({visible ? '0' : '105%'})"
            >
              {$_('hero.title_line2')}
            </p>
          </div>
          <div class="overflow-hidden">
            <p
              class="sys-display text-display-xl text-ink-100 transition-all duration-1000 ease-soft"
              style="transition-delay: 0.9s; transform: translateY({visible ? '0' : '105%'})"
            >
              {$_('hero.title_line3')}
            </p>
          </div>
        </div>

        <!-- Bio -->
        <div
          class="max-w-prose space-y-4 transition-all duration-1000 ease-soft"
          style="transition-delay: 1.2s; opacity: {visible ? '1' : '0'}; transform: translateY({visible ? '0' : '20px'})"
        >
          <p class="text-ink-200 text-base md:text-lg leading-relaxed">{$_('bio.paragraph1')}</p>
          <p class="text-ink-200 text-base md:text-lg leading-relaxed">{$_('bio.paragraph2')}</p>
        </div>

        <!-- CTAs -->
        <div
          class="flex flex-wrap gap-4 mt-12 transition-all duration-1000 ease-soft"
          style="transition-delay: 1.5s; opacity: {visible ? '1' : '0'}; transform: translateY({visible ? '0' : '16px'})"
        >
          <a href="#projects" class="group inline-flex items-center gap-2.5 px-6 py-3 border border-line-bright rounded-full text-sm font-mono text-ink-300 hover:border-accent-400 hover:text-accent-400 transition-all duration-300">
            {$_('hero.cta_work')}
            <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a href="#experience" class="group inline-flex items-center gap-2.5 px-6 py-3 text-sm font-mono text-ink-100 hover:text-accent-400 transition-colors duration-300">
            {$_('hero.cta_experience')}
            <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
        </div>
      </div>

      <!-- Go mascot image -->
      <div class="md:col-span-5 flex justify-center md:justify-end">
        <div
          class="relative transition-all duration-1000 ease-soft will-change-transform"
          style="transition-delay: 1.0s; opacity: {visible ? '1' : '0'}; transform: translateY(calc({visible ? '0' : '24px'} + {mascotY}px))"
        >
          <div class="absolute -inset-3 border border-line-bright rounded-xl rotate-2"></div>
          <img
            src="/logos/go-mascot.jpg"
            alt="Harry Chang"
            class="relative w-48 h-48 sm:w-64 sm:h-64 rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div
    class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-1000"
    style="transition-delay: 2s; opacity: {visible ? '1' : '0'}"
  >
    <span class="sys-label text-ink-50">{$_('hero.scroll')}</span>
    <div class="relative w-px h-10 bg-line overflow-hidden">
      <span class="absolute left-0 top-0 w-px h-3 bg-accent-400 animate-drip"></span>
    </div>
  </div>
</section>
