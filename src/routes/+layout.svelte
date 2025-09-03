<script>
    import "../app.css";
    import { onMount } from 'svelte';
    import { locale } from '../lib/i18n.js';
    import { initializeLanguage } from '../stores/languageStore.js';
    
    // Initialize i18n immediately
    import '../lib/i18n.js';
    
    onMount(() => {
      // Initialize language from storage or browser preference
      initializeLanguage();
    });
  </script>
  
  <slot />