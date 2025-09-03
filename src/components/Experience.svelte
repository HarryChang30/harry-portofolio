<script>
    import { _, json } from '../lib/i18n.js';
    import { currentLanguage } from '../stores/languageStore.js';
    
    // Define experience keys that correspond to the locale files
    const experienceKeys = [
        'nafas',
        'prakerja', 
        'kuncie',
        'grabovo',
        'binus'
    ];
    
    // Company logos mapping
    const companyLogos = {
        nafas: "/logos/nafas.png",
        prakerja: "/logos/prakerja.jpg",
        kuncie: "/logos/kuncie.png",
        grabovo: "/logos/grab-ovo-logo.jpg",
        binus: "/logos/it-binus.jpg"
    };
    
    // Reactive statement to detect language changes
    $: currentLang = $currentLanguage;
    
    // Log language changes for debugging (optional)
    $: if (currentLang) {
        console.log('Language changed to:', currentLang);
    }
</script>

<section id="experience" class="mb-8 md:mb-12">
  <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">{$_('sections.experience.title')}</h2>
  
  <div class="space-y-4 md:space-y-6">
    {#each experienceKeys as experienceKey}
      <div class="flex flex-col sm:flex-row items-start p-4 md:p-6 bg-white shadow-lg rounded-lg">
        <div class="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4 md:mr-6">
          <img 
            src={companyLogos[experienceKey]} 
            alt={$_(`experience.companies.${experienceKey}.company`)} 
            class="{companyLogos[experienceKey].includes('grab-ovo-logo.jpg') ? 'w-12 h-10 sm:w-16 sm:h-13' : 'w-12 h-12 sm:w-16 sm:h-16'} rounded-full object-cover" 
          />
        </div>

        <div class="flex-1 min-w-0">
          <h3 class="text-lg md:text-xl font-semibold text-gray-600 mb-1">
            {$_(`experience.companies.${experienceKey}.position`)}
          </h3>
          <p class="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
            {$_(`experience.companies.${experienceKey}.company`)} | {$_(`experience.companies.${experienceKey}.duration`)}
          </p>
          <ul class="list-disc list-inside text-gray-700 space-y-1 md:space-y-2">
            {#each $json(`experience.companies.${experienceKey}.description`) as point}
              <li class="text-sm md:text-base leading-relaxed">{point}</li>
            {/each}
          </ul>
        </div>
      </div>
    {/each}
  </div>
</section>