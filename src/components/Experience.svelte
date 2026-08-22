<script lang="ts">
  import { _, json } from '../lib/i18n.js';
  import { currentLanguage } from '../stores/languageStore.js';
  import { onMount } from 'svelte';

  const experienceKeys = ['nafas', 'prakerja', 'kuncie', 'grabovo', 'binus'];

  const companyLogos: Record<string, string> = {
    nafas: "/logos/nafas.png",
    prakerja: "/logos/prakerja.jpg",
    kuncie: "/logos/kuncie.png",
    grabovo: "/logos/grab-ovo-logo.jpg",
    binus: "/logos/it-binus.jpg"
  };

  // Per-company environmental motif (subtle CSS class hint)
  const motifs: Record<string, string> = {
    nafas: 'MQTT · TELEMETRY · IoT MESH',
    prakerja: 'API GATEWAY · ID · 18.4M USERS',
    kuncie: 'PAYMENT FLOW · CONTENT DELIVERY',
    grabovo: 'LENDING ORIGINATION · MICROSERVICES',
    binus: 'UNIVERSITY PLATFORM · LEGACY SYSTEMS'
  };

  $: currentLang = $currentLanguage;

  let entries = [];
  onMount(() => {
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
    return () => observer.disconnect();
  });

  onMount(() => {
    entries = experienceKeys.map((key) => ({ key, visible: false }));
  });
</script>

<section id="experience" class="relative py-28 md:py-40">
  <!-- Section header -->
  <div class="max-w-5xl mx-auto px-6 sm:px-8 mb-16 md:mb-24">
    <div class="overflow-hidden">
      <div class="sys-eyebrow mb-5">01 — EXPERIENCE</div>
    </div>
    <h2 class="sys-display text-display-lg max-w-3xl" style="line-height: 1.08">
      A trail of teams, problems, and the things I learned to leave behind.
    </h2>
  </div>

  <!-- Timeline -->
  <div class="max-w-5xl mx-auto px-6 sm:px-8">
    <div class="relative">
      <!-- Vertical line -->
      <div class="absolute left-[7px] md:left-[180px] top-0 bottom-0 w-px bg-line"></div>

      <div class="space-y-16 md:space-y-20">
        {#each experienceKeys as experienceKey, index}
          <article
            data-exp
            data-idx={index}
            class="relative grid md:grid-cols-[180px_1fr] gap-6 md:gap-10 pl-12 md:pl-0 transition-all duration-700 ease-soft"
            style="opacity: {entries[index]?.visible ? '1' : '0'}; transform: translateY({entries[index]?.visible ? '0' : '24px'})}"
          >
            <!-- Timeline dot -->
            <div class="absolute left-[7px] md:left-[180px] top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-accent-400/80 ring-4 ring-surface-0 z-10"></div>

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
                {motifs[experienceKey]}
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
