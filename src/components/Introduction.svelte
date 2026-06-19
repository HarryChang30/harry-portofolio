<script>
  import { _ } from '../lib/i18n.js';
</script>

<section id="introduction" class="min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] flex items-center py-20 md:py-24">
  <div class="max-w-6xl mx-auto px-6 sm:px-8 w-full">
    <div class="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
      <div class="order-2 md:order-1 md:col-span-7">
        <div class="fable-eyebrow mb-6">
          <span class="inline-block w-8 h-px bg-sienna-300 align-middle mr-3"></span>
          Backend Software Engineer
        </div>
        <h1 class="text-display-xl font-serif font-medium text-ink-400 mb-6">
          Hi, I'm <span class="italic text-sienna-400">Harry</span>.
          <br class="hidden sm:block" />
          I build quiet systems
          <span class="text-ink-50">that keep running.</span>
        </h1>
        <div class="max-w-prose space-y-4 text-ink-100 text-base md:text-lg leading-relaxed">
          <p>{$_('bio.paragraph1')}</p>
          <p>{$_('bio.paragraph2')}</p>
          <p>{$_('bio.paragraph3')}</p>
        </div>
        <div class="flex flex-wrap gap-3 mt-10">
          <a href="#projects" class="fable-btn-primary">
            View My Work
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </a>
          <a href="#experience" class="fable-btn-ghost">Experience</a>
        </div>
      </div>

      <div class="order-1 md:order-2 md:col-span-5 flex justify-center md:justify-end">
        <div class="relative">
          <div class="absolute -inset-3 border border-sienna-200 rounded-2xl rotate-3"></div>
          <img
            src="/logos/go-mascot.jpg"
            alt="Harry Chang"
            class="relative w-56 h-56 sm:w-72 sm:h-72 rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</section>
