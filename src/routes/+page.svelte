<script>
  import Sidebar from '../components/Sidebar.svelte';
  import WebGLLayer from '../components/webgl/WebGLLayer.svelte';
  import Introduction from '../components/Introduction.svelte';
  import Experience from '../components/Experience.svelte';
  import Projects from '../components/Projects.svelte';
  import Skills from '../components/Skills.svelte';
  import { _ } from '../lib/i18n.js';
</script>

<WebGLLayer />
<Sidebar />

<main class="relative z-10">
  <Introduction />
  <Experience />
  <Projects />
  <Skills />
</main>

<!-- Footer / Contact -->
<footer id="contact" class="relative z-10 border-t border-line">
  <!-- Cinematic closing -->
  <div class="max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-40 text-center">
    <p class="sys-eyebrow mb-6">{$_('contact.eyebrow')}</p>
    <h2 class="sys-display text-display-xl mb-6">{$_('contact.heading')}</h2>
    <p class="text-ink-100 text-lg max-w-md mx-auto mb-12">
      {$_('contact.subtitle')}
    </p>

    <div class="flex items-center justify-center gap-6 mb-16">
      <a href="mailto:harrychang120@gmail.com" class="group inline-flex items-center gap-2.5 px-6 py-3 border border-line-bright rounded-full text-sm font-mono text-ink-300 hover:border-accent-400 hover:text-accent-400 transition-all duration-300">
        harrychang120@gmail.com
        <svg class="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
      </a>
    </div>

    <div class="flex items-center justify-center gap-8 mb-16">
      <a href="https://github.com/HarryChang30" target="_blank" rel="noopener noreferrer" class="text-ink-100 hover:text-accent-400 transition-colors font-mono text-sm" aria-label="GitHub">
        GitHub
      </a>
      <a href="https://linkedin.com/in/harrychang122" target="_blank" rel="noopener noreferrer" class="text-ink-100 hover:text-accent-400 transition-colors font-mono text-sm" aria-label="LinkedIn">
        LinkedIn
      </a>
    </div>
  </div>

  <!-- Bottom bar -->
  <div class="border-t border-line">
    <div class="max-w-6xl mx-auto px-6 sm:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-50">
        © {new Date().getFullYear()} · Harry Chang
      </div>
      <div class="font-display text-sm text-ink-100 italic">
        {$_('contact.tagline')}
      </div>
    </div>
  </div>
</footer>
