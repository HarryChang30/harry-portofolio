<script lang="ts">
    import { _, json } from '../lib/i18n.js';
    import { currentLanguage } from '../stores/languageStore.js';

    const experienceKeys = [
        'nafas',
        'prakerja',
        'kuncie',
        'grabovo',
        'binus'
    ];

    const companyLogos: Record<string, string> = {
        nafas: "/logos/nafas.png",
        prakerja: "/logos/prakerja.jpg",
        kuncie: "/logos/kuncie.png",
        grabovo: "/logos/grab-ovo-logo.jpg",
        binus: "/logos/it-binus.jpg"
    };

    $: currentLang = $currentLanguage;
</script>

<section id="experience" class="py-20 md:py-28 bg-cream-50 border-y border-line">
  <div class="max-w-5xl mx-auto px-6 sm:px-8">
    <div class="mb-14 md:mb-20">
      <div class="fable-eyebrow mb-4">— {$_('sections.experience.title')}</div>
      <h2 class="text-display-lg font-serif font-medium text-ink-400 max-w-3xl">
        A trail of teams, problems, and the things I learned to leave behind.
      </h2>
    </div>

    <div class="relative">
      <div class="absolute left-0 md:left-[140px] top-0 bottom-0 w-px bg-line"></div>

      <div class="space-y-12 md:space-y-16">
        {#each experienceKeys as experienceKey, index}
          <article class="relative grid md:grid-cols-[140px_1fr] gap-6 md:gap-12 pl-8 md:pl-0">
            <div class="absolute left-0 md:left-[140px] top-2 -translate-x-1/2 w-2.5 h-2.5 bg-cream-50 border-2 border-sienna-300 rounded-full z-10"></div>

            <div class="md:pt-1">
              <div class="font-mono text-xs uppercase tracking-wider text-ink-50">
                {$_(`experience.companies.${experienceKey}.duration`)}
              </div>
            </div>

            <div>
              <div class="flex items-start gap-4 mb-4">
                <img
                  src={companyLogos[experienceKey]}
                  alt={$_(`experience.companies.${experienceKey}.company`)}
                  class="w-11 h-11 rounded-lg object-cover ring-1 ring-line flex-shrink-0"
                />
                <div>
                  <h3 class="text-xl md:text-2xl font-serif text-ink-400 leading-snug">
                    {$_(`experience.companies.${experienceKey}.position`)}
                  </h3>
                  <p class="text-sienna-400 text-sm font-medium mt-0.5">
                    {$_(`experience.companies.${experienceKey}.company`)}
                  </p>
                </div>
              </div>
              <ul class="space-y-2 text-ink-100 text-[15px] leading-relaxed max-w-prose">
                {#each $json(`experience.companies.${experienceKey}.description`) as point}
                  <li class="flex gap-3">
                    <span class="text-sienna-300 mt-2 select-none">·</span>
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
