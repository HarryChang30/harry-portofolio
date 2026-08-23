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

  // Keep <html lang> in sync with the active locale
  $: if (typeof document !== 'undefined') {
    document.documentElement.lang = $locale === 'zh' ? 'zh' : 'en';
  }
</script>

<div class="min-h-screen flex flex-col">
  <slot />
</div>
