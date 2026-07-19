<script>
  import "../app.css";
  import { onMount } from 'svelte';
  import { locale, translationsReady } from '../lib/i18n.js';
  import { initializeLanguage } from '../stores/languageStore.js';

  if (typeof window !== 'undefined') {
    onMount(() => {
      initializeLanguage();
    });
  } else {
    locale.set('en');
  }
</script>

<div class="min-h-screen flex flex-col">
  <slot />
  <footer class="mt-auto border-t border-line">
    <div class="max-w-6xl mx-auto px-6 sm:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div class="font-mono text-xs uppercase tracking-[0.18em] text-ink-50">
        © {new Date().getFullYear()} · Harry Chang
      </div>
      <div class="font-serif text-sm text-ink-100 italic">
        Built quietly, kept running.
      </div>
    </div>
  </footer>
</div>
