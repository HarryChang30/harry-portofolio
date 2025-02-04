<script lang="ts">
  export let posts: { slug: string; content: string; title: string; date: string; thumbnail?: string; author: string }[];

  console.log('Blog posts:', posts);
</script>

<section style="max-width: 800px; margin: 0 auto; padding: 16px;">
  <div style="display: flex; flex-direction: column; gap: 24px;">
    {#each posts as post}
      <div style="padding: 24px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); background-color: white; transition: background-color 0.3s;">
        <a href={`/blog/${post.slug}`} style="text-decoration: none; color: inherit;">
          <h2 style="font-size: 2rem; font-weight: 600; margin-bottom: 8px;">{post.title}</h2>
        </a>
        <p style="font-size: 0.875rem; color: gray; margin-bottom: 16px;">{post.date} by {post.author}</p>
        {#if post.thumbnail}
          <img src={post.thumbnail} alt="{post.title} Thumbnail" style="border-radius: 8px; margin-bottom: 16px; width: 100%; object-fit: cover;" />
        {/if}
        <div style="margin-top: 16px;">{@html post.content}</div>
      </div>
    {/each}
  </div>
</section>