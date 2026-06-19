<script context="module" lang="ts">
    import kit from '@sveltejs/kit';

    interface PostMetaData {
        title: string;
        date: string;
        thumbnail?: string;
        author: string;
    }

    export async function load({ params }: kit.LoadEvent) {
    const post = await import(`../../posts/${params.slug}.html`);
    return {
      props: {
        post: post.default as string,
        metadata: post.metadata as PostMetaData,
      },
    };
  }
  </script>

  <script>
    export let post;
    export let metadata;
  </script>

  <main class="min-h-screen pt-28 pb-20">
    <article class="max-w-3xl mx-auto px-6 sm:px-8">
      <a href="/blog" class="fable-eyebrow inline-flex items-center gap-2 mb-12 hover:text-sienna-400 transition-colors">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        Back to writing
      </a>

      <header class="mb-12">
        <div class="fable-eyebrow mb-4">{metadata.date} · {metadata.author}</div>
        <h1 class="text-display-lg font-serif font-medium text-ink-400 leading-tight">
          {metadata.title}
        </h1>
      </header>

      {#if metadata.thumbnail}
        <img src={metadata.thumbnail} alt="{metadata.title}" class="w-full rounded-2xl mb-12 border border-line" />
      {/if}

      <div class="prose max-w-none">
        {@html post}
      </div>
    </article>
  </main>
