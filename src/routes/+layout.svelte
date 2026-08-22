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
</div>
