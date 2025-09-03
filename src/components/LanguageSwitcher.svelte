<script>
  import { onMount } from 'svelte';
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

<div class="language-switcher">
  <button
    on:click={handleLanguageToggle}
    disabled={isChanging}
    class="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    title={$currentLanguage === 'en' ? 'Switch to Chinese' : 'Switch to English'}
  >
    <!-- Language Icons -->
    <div class="flex items-center space-x-1">
      <span class="text-sm font-medium {$currentLanguage === 'en' ? 'text-blue-600' : 'text-gray-400'}">
        EN
      </span>
      <div class="w-8 h-5 bg-gray-300 rounded-full relative transition-colors duration-200 {$currentLanguage === 'zh' ? 'bg-blue-500' : ''}">
        <div class="w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform duration-200 {$currentLanguage === 'zh' ? 'translate-x-3' : 'translate-x-0.5'}">
        </div>
      </div>
      <span class="text-sm font-medium {$currentLanguage === 'zh' ? 'text-blue-600' : 'text-gray-400'}">
        中
      </span>
    </div>
    
    <!-- Loading indicator -->
    {#if isChanging}
      <div class="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    {/if}
  </button>
</div>

<style>
  .language-switcher {
    user-select: none;
  }
</style>