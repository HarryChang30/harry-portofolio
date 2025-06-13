<!-- src/components/Introduction.svelte -->
<script>
  import { onDestroy, onMount } from 'svelte'
  import { _ } from 'svelte-i18n';

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
  $: paragraphs = bio.split(/\n\s*\n/).filter(p => p.trim()); // Split by two newlines and remove empty paragraphs
</script>

<section id="introduction" class="mb-12">
  <h2 class="text-3xl font-semibold text-gray-800 mb-4">{$_('introduction_title')}</h2>
  <p class="text-gray-600 mt-2 leading-relaxed">{$_('bio')}</p>
</section>
