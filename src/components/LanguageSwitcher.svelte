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

<div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
  <button
    on:click={handleLanguageToggle}
    disabled={isChanging}
    class="px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 {$currentLanguage === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
  >
    EN
  </button>
  <button
    on:click={handleLanguageToggle}
    disabled={isChanging}
    class="px-3 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 {$currentLanguage === 'zh' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}"
  >
    中
  </button>
</div>
