<script>
  import { onMount } from 'svelte';
  import { _ } from '../../lib/i18n.js';
  import { initializeLanguage } from '../../stores/languageStore.js';

  let posts = [];

  onMount(() => {
    initializeLanguage();
    (async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        posts = data.posts;
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    })();
  });
</script>

<svelte:head>
  <title>{$_('blog.title')} — Harry Chang</title>
</svelte:head>

<main class="min-h-screen pt-28 pb-20">
  <article class="max-w-3xl mx-auto px-6 sm:px-8">
    <a href="/" class="fable-eyebrow inline-flex items-center gap-2 mb-12 hover:text-azure-400 transition-colors">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      {$_('blog.back')}
    </a>

    <div class="mb-16">
      <div class="fable-eyebrow mb-4">{$_('blog.eyebrow')}</div>
      <h1 class="text-display-lg font-serif font-medium text-ink-400 mb-4">
        {$_('blog.title')}
      </h1>
      <p class="text-ink-100 text-lg leading-relaxed max-w-prose">
        {$_('blog.description')}
      </p>
    </div>

    {#if posts.length === 0}
      <p class="text-ink-50 font-mono text-sm">{$_('blog.empty')}</p>
    {:else}
      <div class="space-y-10">
        {#each posts as post}
          <article class="fable-card p-8">
            {@html post.content}
          </article>
        {/each}
      </div>
    {/if}
  </article>
</main>
