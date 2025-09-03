<script>
    import "../app.css";
    import { onMount } from 'svelte';
    import { locale, translationsReady } from '../lib/i18n.js';
    import { initializeLanguage } from '../stores/languageStore.js';
    
    // Initialize language immediately for SSR compatibility
    if (typeof window !== 'undefined') {
      // Client-side initialization
      onMount(() => {
        initializeLanguage();
      });
    } else {
      // Server-side initialization with default language
      locale.set('en');
    }
  </script>
  
  <slot />