<!-- src/components/Introduction.svelte -->
<script>
    import { _ } from '../lib/i18n.js';
</script>

<section id="introduction" class="mb-6 md:mb-12">
    <h2 class="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">{$_('sections.introduction.title')}</h2>
    <div class="space-y-4">
        <p class="text-base md:text-lg leading-relaxed text-gray-600">{$_('bio.paragraph1')}</p>
        <p class="text-base md:text-lg leading-relaxed text-gray-600">{$_('bio.paragraph2')}</p>
        <p class="text-base md:text-lg leading-relaxed text-gray-600">{$_('bio.paragraph3')}</p>
    </div>
</section>
