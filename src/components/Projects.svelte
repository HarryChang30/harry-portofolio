<script lang="ts">
  import { _, json } from '../lib/i18n.js';
  import { currentLanguage } from '../stores/languageStore.js';
  import { onMount } from 'svelte';
  import { tilt } from '../lib/actions/tilt.js';
  import { webglPulse } from '../lib/webglBridge.js';

  const projectKeys = [
    'nafas_residential',
    'idxplore',
    'prakerja_dashboard', 'prakerja_job', 'prakerja_api',
    'kuncie_mobile', 'kuncie_catalog', 'kuncie_package',
    'ovo_paylater', 'ovo_modal',
    'binusmaya',
    'portfolio',
    'smart_refrigerator',
    'space_shooter'
  ];

  const projectThumbnails: Record<string, string> = {
    nafas_residential: "/projects/nafas-residential.png",
    idxplore: "/projects/idxplore-dashboard.png",
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
    nafas_residential: "https://nafas.com/id-en/residential",
    idxplore: "https://builder-dashboard-three.vercel.app/",
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

  $: idxplorePipeline = $json('projects.idxplore_pipeline');

  $: currentLang = $currentLanguage;

  // $_() returns the raw key when a translation is missing — treat that as "no
  // endYear" and show the "now" label instead.
  $: endYearLabel = (key) => {
    const endKey = `projects.items.${key}.endYear`;
    const end = $_(endKey);
    return end === endKey ? $_('projects.now') : end;
  };

  $: sortedKeys = [...projectKeys].sort((a, b) => {
    const endYearA = Number($_(`projects.items.${a}.endYear`)) || new Date().getFullYear();
    const endYearB = Number($_(`projects.items.${b}.endYear`)) || new Date().getFullYear();
    return endYearB - endYearA;
  });

  $: featuredKey = sortedKeys[0];
  // idxplore is the hardcoded featured case study above; everything else,
  // including projects that sort above it (current work), stays in the index.
  $: otherKeys = sortedKeys.filter((k) => k !== 'idxplore');

  let visibleEls = new Set();
  let sectionVisible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            visibleEls.add(e.target.dataset.idx || e.target.dataset.key);
            visibleEls = visibleEls;
            if (e.target.dataset.section === 'projects-header') sectionVisible = true;
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('[data-observe]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
</script>

<section id="projects" class="relative py-28 md:py-40">
  <!-- Section header -->
  <div class="max-w-6xl mx-auto px-6 sm:px-8 mb-16 md:mb-24">
    <div
      data-observe
      data-section="projects-header"
      class="transition-all duration-700 ease-soft"
      style="opacity: {sectionVisible ? '1' : '0'}; transform: translateY({sectionVisible ? '0' : '16px'})"
    >
      <div class="sys-eyebrow mb-5">{$_('sections.projects.eyebrow')}</div>
      <h2 class="sys-display text-display-lg max-w-3xl mb-4" style="line-height: 1.08">
        {$_('sections.projects.heading')}
      </h2>
      <p class="text-ink-200 text-lg leading-relaxed max-w-prose">
        {$_('sections.projects.subheading')}
      </p>
    </div>
  </div>

  <!-- IDXplore — hero case study -->
  <div class="max-w-6xl mx-auto px-6 sm:px-8 mb-20 md:mb-32">
    <article
      data-observe
      data-key="idxplore"
      class="transition-all duration-1000 ease-soft"
      style="opacity: {visibleEls.has('idxplore') ? '1' : '0'}; transform: translateY({visibleEls.has('idxplore') ? '0' : '32px'})}"
    >
      <div class="grid lg:grid-cols-12 gap-8 lg:gap-10">
        <!-- Visual -->
        <div class="lg:col-span-7 group">
          <a
            href={projectUrls.idxplore}
            target="_blank"
            rel="noopener noreferrer"
            class="block relative overflow-hidden rounded-lg border border-line"
            use:tilt={{ max: 3.5, scale: 1.004 }}
            on:mouseenter={() => webglPulse('projects', 1)}
            on:focusin={() => webglPulse('projects', 1)}
          >
            <div class="aspect-[16/10] overflow-hidden bg-surface-1">
              <img
                src={projectThumbnails.idxplore}
                alt="IDXplore Dashboard"
                class="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-soft"
              />
            </div>
            <!-- Pipeline overlay — steps light up in sequence like a signal passing through -->
            <div class="absolute bottom-0 left-0 right-0 p-3 md:p-4 bg-gradient-to-t from-surface-0/90 to-transparent">
              <div class="flex items-center gap-2 flex-wrap">
                {#each idxplorePipeline as step, i}
                  <span
                    class="font-mono text-[9px] md:text-[10px] text-ink-100 tracking-wider transition-all duration-500 ease-soft"
                    style="opacity: {visibleEls.has('idxplore') ? '1' : '0'}; transform: translateY({visibleEls.has('idxplore') ? '0' : '6px'}); transition-delay: {300 + i * 160}ms"
                  >{step}</span>
                  {#if i < idxplorePipeline.length - 1}
                    <span
                      class="text-accent-400/60 text-[10px] transition-opacity duration-500"
                      style="opacity: {visibleEls.has('idxplore') ? '1' : '0'}; transition-delay: {300 + i * 160 + 110}ms"
                    >→</span>
                  {/if}
                {/each}
              </div>
            </div>
          </a>
        </div>

        <!-- Text -->
        <div class="lg:col-span-5 flex flex-col justify-center">
          <div class="sys-label mb-3">{$_('sections.projects.featured')}</div>
          <h3 class="text-2xl md:text-3xl font-display text-ink-400 font-medium mb-2">
            {$_(`projects.items.idxplore.name`)}
          </h3>
          <div class="font-mono text-xs text-ink-50 tracking-wider mb-5 uppercase">
            Python ETL · Bun/TypeScript · Next.js · TiDB
          </div>
          <p class="text-ink-200 text-[15px] leading-relaxed mb-6">
            {$_(`projects.items.idxplore.description`)}
          </p>
          <a href={projectUrls.idxplore} target="_blank" rel="noopener noreferrer" class="group inline-flex items-center gap-2 text-sm font-mono text-accent-400 hover:gap-3 transition-all duration-300">
            {$_('sections.projects.view_system')}
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
        </div>
      </div>
    </article>
  </div>

  <!-- Other projects — cinematic index -->
  <div class="max-w-6xl mx-auto px-6 sm:px-8">
    <div class="space-y-0">
      {#each otherKeys as projectKey, index}
        <article
          data-observe
          data-idx={index}
          class="group border-t border-line py-7 md:py-8 transition-all duration-700 ease-soft"
          style="opacity: {visibleEls.has(String(index)) ? '1' : '0'}; transform: translateY({visibleEls.has(String(index)) ? '0' : '16px'}); transition-delay: {index * 80}ms"
        >
          <a
            href={projectUrls[projectKey]}
            target="_blank"
            rel="noopener noreferrer"
            class="grid md:grid-cols-12 gap-4 md:gap-8 items-center"
            on:mouseenter={() => webglPulse('projects', 0.6)}
            on:focusin={() => webglPulse('projects', 0.6)}
          >
            <div class="md:col-span-1">
              <span class="font-mono text-xs text-ink-50">{String(index + 1).padStart(2, '0')}</span>
            </div>
            <!-- Thumbnail -->
            <div class="md:col-span-2 md:row-span-1" use:tilt={{ max: 6, scale: 1.02 }}>
              <div class="aspect-[16/10] rounded-md overflow-hidden border border-line bg-surface-1">
                <img
                  src={projectThumbnails[projectKey]}
                  alt={$_(`projects.items.${projectKey}.name`)}
                  class="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-soft"
                  loading="lazy"
                />
              </div>
            </div>
            <div class="md:col-span-3">
              <h3 class="text-lg font-display text-ink-300 group-hover:text-accent-400 transition-colors duration-300">
                {$_(`projects.items.${projectKey}.name`)}
              </h3>
            </div>
            <div class="md:col-span-4">
              <p class="text-ink-200 text-sm leading-relaxed line-clamp-2">
                {$_(`projects.items.${projectKey}.description`)}
              </p>
            </div>
            <div class="md:col-span-1">
              <span class="font-mono text-[10px] text-ink-50 tracking-wider uppercase">
                {$_(`projects.items.${projectKey}.startYear`)} — {endYearLabel(projectKey)}
              </span>
            </div>
            <div class="md:col-span-1 flex justify-end">
              <svg class="w-4 h-4 text-ink-500 group-hover:text-accent-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </div>
          </a>
        </article>
      {/each}
    </div>
  </div>
</section>
