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

<section id="experience" class="py-16 md:py-24 bg-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 md:mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{$_('sections.experience.title')}</h2>
      <div class="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
    </div>
    
    <div class="relative">
      <div class="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 via-indigo-500 to-purple-500 transform md:-translate-x-1/2"></div>
      
      <div class="space-y-8 md:space-y-12">
        {#each experienceKeys as experienceKey, index}
          <div class="relative flex items-center {index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}">
            <div class="absolute left-4 md:left-1/2 w-4 h-4 bg-white border-4 border-blue-600 rounded-full transform -translate-x-1/2 z-10"></div>
            
            <div class="ml-12 md:ml-0 md:w-5/12 {index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}">
              <div class="bg-gray-50 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div class="flex items-center {index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-4 mb-3">
                  <img 
                    src={companyLogos[experienceKey]} 
                    alt={$_(`experience.companies.${experienceKey}.company`)} 
                    class="w-12 h-12 rounded-lg object-cover shadow-sm flex-shrink-0" 
                  />
                  <div>
                    <h3 class="text-lg font-bold text-gray-800">
                      {$_(`experience.companies.${experienceKey}.position`)}
                    </h3>
                    <p class="text-blue-600 font-medium text-sm">
                      {$_(`experience.companies.${experienceKey}.company`)}
                    </p>
                  </div>
                </div>
                <div class="flex items-center gap-2 text-gray-500 text-sm mb-3 {index % 2 === 0 ? 'md:flex-row-reverse' : ''}">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{$_(`experience.companies.${experienceKey}.duration`)}</span>
                </div>
                <ul class="space-y-2 text-gray-600 text-sm {index % 2 === 0 ? 'md:text-right' : ''}">
                  {#each $json(`experience.companies.${experienceKey}.description`) as point}
                    <li class="leading-relaxed">{point}</li>
                  {/each}
                </ul>
              </div>
            </div>
            
            <div class="hidden md:block md:w-5/12"></div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>
