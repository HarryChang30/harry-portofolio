<script>
    import { _ } from '../lib/i18n.js';
    import { currentLanguage } from '../stores/languageStore.js';
    
    // Define project keys that correspond to the locale files
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
    
    // Project thumbnails mapping
    const projectThumbnails = {
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
    
    // Project URLs mapping
    const projectUrls = {
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
    
    // Reactive statement to detect language changes
    $: currentLang = $currentLanguage;
    
    // Log language changes for debugging (optional)
    $: if (currentLang) {
        console.log('Language changed to:', currentLang);
    }
    
    // Function to get sorted project keys by end year (descending)
    function getSortedProjectKeys() {
        return projectKeys.sort((a, b) => {
            const endYearA = $_(`projects.items.${a}.endYear`) || new Date().getFullYear();
            const endYearB = $_(`projects.items.${b}.endYear`) || new Date().getFullYear();
            return endYearB - endYearA;
        });
    }
</script>

<section id="projects" class="mb-8 md:mb-12">
  <h2 class="text-2xl md:text-3xl font-semibold text-gray-800 mb-4 md:mb-6">{$_('sections.projects.title')}</h2>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
    {#each getSortedProjectKeys() as projectKey}
      <div class="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <a href={projectUrls[projectKey]} target="_blank" rel="noopener noreferrer" class="block">
          <img 
            src={projectThumbnails[projectKey]} 
            alt={$_(`projects.items.${projectKey}.name`)} 
            class="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform duration-300" 
          />
        </a>
        <div class="p-4 md:p-5">
          <a 
            href={projectUrls[projectKey]} 
            target="_blank" 
            rel="noopener noreferrer" 
            class="text-lg md:text-xl font-semibold text-blue-600 hover:underline block mb-2"
          >
            {$_(`projects.items.${projectKey}.name`)} ({$_(`projects.items.${projectKey}.startYear`)} - {$_(`projects.items.${projectKey}.endYear`) || "Present"})
          </a>
          <p class="text-sm md:text-base text-gray-700 leading-relaxed">{$_(`projects.items.${projectKey}.description`)}</p>
        </div>
      </div>
    {/each}
  </div>
</section>