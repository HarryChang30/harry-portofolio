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

<section id="projects" class="py-20 md:py-28">
  <div class="max-w-6xl mx-auto px-6 sm:px-8">
    <div class="mb-14 md:mb-20 max-w-3xl">
      <div class="fable-eyebrow mb-4">— {$_('sections.projects.title')}</div>
      <h2 class="text-display-lg font-serif font-medium text-ink-400 mb-5">
        Things I shipped, mostly because someone needed them working on Monday.
      </h2>
      <p class="text-ink-100 text-lg leading-relaxed max-w-prose">
        Here are some of the projects I've worked on throughout my career as a Backend Software Engineer.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
      {#each getSortedProjectKeys() as projectKey}
        <a
          href={projectUrls[projectKey]}
          target="_blank"
          rel="noopener noreferrer"
          class="group fable-card overflow-hidden flex flex-col"
        >
          <div class="aspect-[4/3] overflow-hidden bg-cream-200 relative">
            <img
              src={projectThumbnails[projectKey]}
              alt={$_(`projects.items.${projectKey}.name`)}
              class="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-soft"
            />
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <div class="flex items-baseline justify-between gap-3 mb-3">
              <h3 class="text-lg font-serif text-ink-400 group-hover:text-sienna-400 transition-colors leading-snug">
                {$_(`projects.items.${projectKey}.name`)}
              </h3>
              <span class="font-mono text-[10px] uppercase tracking-wider text-ink-50 whitespace-nowrap">
                {$_(`projects.items.${projectKey}.startYear`)} · {$_(`projects.items.${projectKey}.endYear`) || "Now"}
              </span>
            </div>
            <p class="text-ink-100 text-sm leading-relaxed flex-1">
              {$_(`projects.items.${projectKey}.description`)}
            </p>
            <div class="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sienna-400 group-hover:gap-2.5 transition-all duration-300">
              <span>Read more</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
