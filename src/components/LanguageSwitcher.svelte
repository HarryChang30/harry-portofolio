<script>
  import { currentLanguage, changeLanguage } from '../stores/languageStore.js';

  let isChanging = false;

  const handleLanguageToggle = async () => {
    if (isChanging) return;
    isChanging = true;
    const newLanguage = $currentLanguage === 'en' ? 'zh' : 'en';
    try {
      await changeLanguage(newLanguage);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      isChanging = false;
    }
  };
</script>

<div class="flex items-center gap-0.5 text-xs font-mono">
  <button
    on:click={handleLanguageToggle}
    disabled={isChanging}
    class="px-2 py-1 rounded transition-colors duration-200 {$currentLanguage === 'en' ? 'text-ink-400' : 'text-ink-50 hover:text-ink-200'}"
    aria-label="Switch to English"
  >
    EN
  </button>
  <span class="text-line">/</span>
  <button
    on:click={handleLanguageToggle}
    disabled={isChanging}
    class="px-2 py-1 rounded transition-colors duration-200 {$currentLanguage === 'zh' ? 'text-ink-400' : 'text-ink-50 hover:text-ink-200'}"
    aria-label="Switch to Chinese"
  >
    中
  </button>
</div>
