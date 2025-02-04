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
  
  <div class="prose max-w-none prose-img:rounded-lg prose-img:w-full">
    <h1 class="text-4xl font-bold">{metadata.title}</h1>
    <p class="text-sm text-gray-500">{metadata.date} by {metadata.author}</p>
    {#if metadata.thumbnail}
      <img src={metadata.thumbnail} alt="{metadata.title} Thumbnail" class="rounded-lg my-4" />
    {/if}
    {@html post} <!-- Renders the raw HTML from the markdown content -->
  </div>