<script lang="ts">
  import { _, json } from '../lib/i18n.js';
  import { currentLanguage } from '../stores/languageStore.js';
  import { onMount } from 'svelte';
  import { webglEnergy } from '../lib/webglBridge.js';

  const experienceKeys = ['nafas', 'prakerja', 'kuncie', 'grabovo', 'binus'];

  const companyLogos: Record<string, string> = {
    nafas: "/logos/nafas.png",
    prakerja: "/logos/prakerja.jpg",
    kuncie: "/logos/kuncie.png",
    grabovo: "/logos/grab-ovo-logo.jpg",
    binus: "/logos/it-binus.jpg"
  };

  $: currentLang = $currentLanguage;

  let entries = [];

  // timeline line draws itself as the section scrolls through the viewport
  let sectionEl;
  let lineProgress = 0;
  let lineRaf = 0;
  let mirrored = -1;

  function updateLine() {
    lineRaf = 0;
    if (!sectionEl) return;
    const rect = sectionEl.getBoundingClientRect();
    const vh = window.innerHeight || 1;
    lineProgress = Math.max(0, Math.min(1, (vh * 0.72 - rect.top) / rect.height));
    // mirror the fill fraction into the experience cluster's pulse gain
    if (Math.abs(lineProgress - mirrored) > 0.005) {
      mirrored = lineProgress;
      webglEnergy('experience', lineProgress);
    }
  }
  function onScroll() {
    if (lineRaf) return;
    lineRaf = requestAnimationFrame(updateLine);
  }

  onMount(() => {
    entries = experienceKeys.map((key) => ({ key, visible: false }));

    const observer = new IntersectionObserver(
      (items) => {
        items.forEach((e) => {
          if (e.isIntersecting) {
            const idx = parseInt(e.target.dataset.idx);
            entries[idx] = { ...entries[idx], visible: true };
            entries = entries;
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('[data-exp]').forEach((el) => observer.observe(el));

    updateLine();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (lineRaf) cancelAnimationFrame(lineRaf);
    };
  });
</script>

<section id="experience" bind:this={sectionEl} class="relative py-28 md:py-40">
  <!-- Section header -->
  <div class="max-w-5xl mx-auto px-6 sm:px-8 mb-16 md:mb-24">
    <div class="overflow-hidden">
      <div class="sys-eyebrow mb-5">{$_('sections.experience.eyebrow')}</div>
    </div>
    <h2 class="sys-display text-display-lg max-w-3xl" style="line-height: 1.08">
      {$_('sections.experience.heading')}
    </h2>
  </div>

  <!-- Timeline -->
  <div class="max-w-5xl mx-auto px-6 sm:px-8">
    <div class="relative">
      <!-- Vertical line: base track + accent line that draws in on scroll -->
      <div class="absolute left-[7px] md:left-[180px] top-0 bottom-0 w-px bg-line"></div>
      <div
        class="absolute left-[7px] md:left-[180px] top-0 w-px bg-gradient-to-b from-line-bright via-accent-400/40 to-accent-400 will-change-[height]"
        style="height: {lineProgress * 100}%"
      ></div>

      <div class="space-y-16 md:space-y-20">
        {#each experienceKeys as experienceKey, index}
          <article
            data-exp
            data-idx={index}
            class="relative grid md:grid-cols-[180px_1fr] gap-6 md:gap-10 pl-12 md:pl-0 transition-all duration-700 ease-soft"
            style="opacity: {entries[index]?.visible ? '1' : '0'}; transform: translateY({entries[index]?.visible ? '0' : '24px'})}"
          >
            <!-- Timeline dot with sonar pulse -->
            <div class="absolute left-[7px] md:left-[180px] top-1.5 -translate-x-1/2 w-2 h-2 z-10">
              <span class="absolute inset-0 rounded-full bg-accent-400/50 animate-signal"></span>
              <span class="absolute inset-0 rounded-full bg-accent-400/80 ring-4 ring-surface-0"></span>
            </div>

            <!-- Year -->
            <div class="md:pt-0">
              <div class="font-mono text-xs text-ink-50 tracking-wider">
                {$_(`experience.companies.${experienceKey}.duration`)}
              </div>
            </div>

            <!-- Content -->
            <div>
              <div class="flex items-start gap-4 mb-4">
                <img
                  src={companyLogos[experienceKey]}
                  alt={$_(`experience.companies.${experienceKey}.company`)}
                  class="w-10 h-10 rounded-md object-cover ring-1 ring-line flex-shrink-0"
                />
                <div>
                  <h3 class="text-xl md:text-2xl font-display text-ink-400 leading-snug font-medium">
                    {$_(`experience.companies.${experienceKey}.position`)}
                  </h3>
                  <p class="text-accent-400 text-sm mt-0.5">
                    {$_(`experience.companies.${experienceKey}.company`)}
                  </p>
                </div>
              </div>

              <!-- Environmental motif -->
              <div class="font-mono text-[10px] text-ink-50 tracking-wider mb-4 uppercase">
                {$_(`experience.motifs.${experienceKey}`)}
              </div>

              <ul class="space-y-2.5 text-ink-200 text-[15px] leading-relaxed max-w-prose">
                {#each $json(`experience.companies.${experienceKey}.description`) as point}
                  <li class="flex gap-3">
                    <span class="text-accent-400 mt-[9px] select-none text-xs">·</span>
                    <span>{point}</span>
                  </li>
                {/each}
              </ul>
            </div>
          </article>
        {/each}
      </div>
    </div>
  </div>
</section>
