<script>
  import language from '../stores/languageStore.js';
  
  function toggleLanguage() {
    $language = $language === 'en' ? 'zh' : 'en';
  }
</script>

<button 
  on:click={toggleLanguage}
  class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-white text-sm flex items-center"
>
  {$language === 'en' ? '中文' : 'English'}
</button>