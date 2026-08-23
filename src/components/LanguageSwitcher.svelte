<script>
  import { currentLanguage, changeLanguage } from '../stores/languageStore.js';

  const setLanguage = (lang) => changeLanguage(lang);
</script>

<div class="flex items-center gap-0.5 text-xs font-mono">
  <button
    on:click={() => setLanguage('en')}
    class="px-2 py-1 rounded transition-colors duration-200 {$currentLanguage === 'en' ? 'text-ink-400' : 'text-ink-50 hover:text-ink-200'}"
    aria-label="Switch to English"
  >
    EN
  </button>
  <span class="text-line">/</span>
  <button
    on:click={() => setLanguage('zh')}
    class="px-2 py-1 rounded transition-colors duration-200 {$currentLanguage === 'zh' ? 'text-ink-400' : 'text-ink-50 hover:text-ink-200'}"
    aria-label="Switch to Chinese"
  >
    中
  </button>
</div>
