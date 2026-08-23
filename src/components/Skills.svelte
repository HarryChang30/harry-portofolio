<script lang="ts">
  import { _ } from '../lib/i18n.js';
  import { onMount } from 'svelte';

  const skillCategories = [
    {
      key: "languages",
      skills: ["Go", "TypeScript", "Python", "Java", "C++"]
    },
    {
      key: "services",
      skills: ["REST", "gRPC", "MQTT"]
    },
    {
      key: "data",
      skills: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "Elasticsearch"]
    },
    {
      key: "messaging",
      skills: ["Kafka", "NSQ", "RabbitMQ"]
    },
    {
      key: "infrastructure",
      skills: ["Docker", "Kubernetes", "AWS", "GCP", "AliCloud"]
    },
    {
      key: "ai",
      skills: ["Codex", "Claude Code", "OpenCode", "Mastra", "OpenAI-compatible SDKs"]
    }
  ];

  let hoveredCat = '';
  let visible = false;

  onMount(() => {
    const el = document.getElementById('skills');
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) visible = true; },
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
  });
</script>

<section id="skills" class="relative py-28 md:py-40">
  <div class="max-w-6xl mx-auto px-6 sm:px-8">
    <!-- Header -->
    <div class="mb-16 md:mb-24">
      <div class="sys-eyebrow mb-5">{$_('sections.skills.eyebrow')}</div>
      <h2 class="sys-display text-display-lg max-w-3xl mb-4" style="line-height: 1.08">
        {$_('sections.skills.heading')}
      </h2>
      <p class="text-ink-200 text-lg leading-relaxed max-w-prose">
        {$_('sections.skills.subheading')}
      </p>
    </div>

    <!-- Categories -->
    <div
      class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 transition-all duration-1000 ease-soft"
      style="opacity: {visible ? '1' : '0'}; transform: translateY({visible ? '0' : '24px'})}"
    >
      {#each skillCategories as cat, i}
        <div
          class="transition-all duration-500"
          style="transition-delay: {i * 80}ms"
          role="group"
          on:mouseenter={() => hoveredCat = cat.key}
          on:mouseleave={() => hoveredCat = ''}
        >
          <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-accent-400 mb-5 pb-3 border-b border-line">
            {$_(`skills.categories.${cat.key}`)}
          </h3>
          <ul class="space-y-3">
            {#each cat.skills as skill}
              <li
                class="font-display text-[15px] transition-colors duration-200"
                class:text-accent-400={hoveredCat === cat.key}
                class:text-ink-300={hoveredCat !== cat.key}
              >
                {skill}
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>
