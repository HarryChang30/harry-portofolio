<script>
  import "../app.css";
  import { init, register, waitLocale } from 'svelte-i18n';

  register('en', () => import('../locales/en.json'));
  register('zh', () => import('../locales/zh.json'));

  init({
    fallbackLocale: 'en',
    initialLocale: 'en',
  });

  // Wait for locale data to be loaded
  const loaded = waitLocale();
</script>

{#await loaded}
  <p>Loading...</p>
{:then}
  <slot />
{/await}