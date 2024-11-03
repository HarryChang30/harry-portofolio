<!-- src/components/Introduction.svelte -->
<script>
  import { onDestroy, onMount } from 'svelte'

  export let bio = "";

  const fetchBio = async () => {
    const response = await fetch('/introduction/bio.txt')
    bio = await response.text();
  };

  onMount(async () => {
    fetchBio();
  })

  onDestroy(() => {});

  // Split bio by newline characters into paragraphs
  $: paragraphs = bio.split(/\n\s*\n/); // Split by two newlines
</script>

<section id="introduction" class="mb-12">
  <h2 class="text-3xl font-semibold text-gray-800 mb-4">Introduction</h2>
  {#each paragraphs as paragraph}
    <p class="text-gray-600 mt-2 leading-relaxed">{paragraph}</p>
  {/each}
</section>
