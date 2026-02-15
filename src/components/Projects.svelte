<script lang="ts">
    import { _ } from '../lib/i18n.js';
    import { currentLanguage } from '../stores/languageStore.js';
    
    const projectKeys = [
        'portfolio',
        'prakerja_dashboard',
        'prakerja_job', 
        'prakerja_api',
        'kuncie_mobile',
        'kuncie_catalog',
        'kuncie_package',
        'ovo_paylater',
        'ovo_modal',
        'binusmaya',
        'smart_refrigerator',
        'space_shooter'
    ];
    
    const projectThumbnails: Record<string, string> = {
        portfolio: "/projects/portofolio-websites.png",
        prakerja_dashboard: "/projects/prakerja-dashboard.png",
        prakerja_job: "/projects/prakerja-job-platform.png",
        prakerja_api: "/projects/prakerja-open-api.png",
        kuncie_mobile: "/projects/kuncie-playstore.png",
        kuncie_catalog: "/projects/kuncie-product-catalog.png",
        kuncie_package: "/projects/kuncie-course-package.png",
        ovo_paylater: "/projects/ovo-paylater-tokopedia.jpg",
        ovo_modal: "/projects/ovo-invoice-financing.png",
        binusmaya: "/projects/binusmaya-5.png",
        smart_refrigerator: "/projects/journal-science-technology.png",
        space_shooter: "/projects/space-shooter-console.png"
    };
    
    const projectUrls: Record<string, string> = {
        portfolio: "https://harry-portofolio.vercel.app/",
        prakerja_dashboard: "https://dashboard.prakerja.go.id/masuk?history=/",
        prakerja_job: "https://dashboard.prakerja.go.id/masuk?history=/",
        prakerja_api: "https://developer.prakerja.go.id",
        kuncie_mobile: "https://play.google.com/store/apps/details?id=com.kuncie.app&pli=1",
        kuncie_catalog: "https://www.kuncie.com/product-catalog/?page=1",
        kuncie_package: "https://www.kuncie.com/public-classes/course-package/",
        ovo_paylater: "https://www.tokopedia.com/blog/ovo-paylater/",
        ovo_modal: "https://www.ovofinansial.com/omu/landing/borrower",
        binusmaya: "https://binusmaya.binus.ac.id/login",
        smart_refrigerator: "https://drive.google.com/file/d/0B9tsy3xkLgLZU1NkMVV1cnZjWWs/view?resourcekey=0-Mu-Kl0j87-rPQMJluF7Lyg",
        space_shooter: "https://www.youtube.com/watch?v=XKv58jD25YI"
    };
    
    $: currentLang = $currentLanguage;
    
    function getSortedProjectKeys() {
        return projectKeys.sort((a, b) => {
            const endYearA = $_(`projects.items.${a}.endYear`) || new Date().getFullYear();
            const endYearB = $_(`projects.items.${b}.endYear`) || new Date().getFullYear();
            return Number(endYearB) - Number(endYearA);
        });
    }
</script>

<section id="projects" class="py-16 md:py-24 bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 md:mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{$_('sections.projects.title')}</h2>
      <div class="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
      <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
        Here are some of the projects I've worked on throughout my career as a Backend Software Engineer.
      </p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {#each getSortedProjectKeys() as projectKey}
        <div class="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
          <a href={projectUrls[projectKey]} target="_blank" rel="noopener noreferrer" class="block relative overflow-hidden">
            <div class="aspect-video bg-gray-200 relative">
              <img 
                src={projectThumbnails[projectKey]} 
                alt={$_(`projects.items.${projectKey}.name`)} 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span class="text-white font-medium flex items-center gap-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View Project
                </span>
              </div>
            </div>
          </a>
          <div class="p-5">
            <div class="flex items-center justify-between mb-2">
              <a 
                href={projectUrls[projectKey]} 
                target="_blank" 
                rel="noopener noreferrer" 
                class="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors"
              >
                {$_(`projects.items.${projectKey}.name`)}
              </a>
              <span class="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {$_(`projects.items.${projectKey}.startYear`)} - {$_(`projects.items.${projectKey}.endYear`) || "Present"}
              </span>
            </div>
            <p class="text-gray-600 text-sm leading-relaxed line-clamp-2">{$_(`projects.items.${projectKey}.description`)}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
