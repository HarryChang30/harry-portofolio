<script>
  import { onMount } from 'svelte';

  let posts = [];

  onMount(async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      posts = data.posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  });
</script>

<svelte:head>
  <title>Learning Blog — Harry Chang</title>
</svelte:head>

<main class="min-h-screen pt-28 pb-20">
  <article class="max-w-3xl mx-auto px-6 sm:px-8">
    <a href="/" class="fable-eyebrow inline-flex items-center gap-2 mb-12 hover:text-sienna-400 transition-colors">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      Back home
    </a>

    <div class="mb-16">
      <div class="fable-eyebrow mb-4">— Notes & Writing</div>
      <h1 class="text-display-lg font-serif font-medium text-ink-400 mb-4">
        Learning Blog
      </h1>
      <p class="text-ink-100 text-lg leading-relaxed max-w-prose">
        Thoughts on software development and technology.
      </p>
    </div>

    {#if posts.length === 0}
      <p class="text-ink-50 font-mono text-sm">No posts yet — check back soon.</p>
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
