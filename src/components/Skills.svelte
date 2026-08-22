<script lang="ts">
  import { _ } from '../lib/i18n.js';
  import { onMount } from 'svelte';

  const skillCategories = [
    {
      name: "Languages",
      skills: ["Go", "TypeScript", "Python", "Java", "C++"]
    },
    {
      name: "Services",
      skills: ["REST", "gRPC", "MQTT"]
    },
    {
      name: "Data",
      skills: ["PostgreSQL", "MySQL", "Redis", "MongoDB", "Elasticsearch"]
    },
    {
      name: "Messaging",
      skills: ["Kafka", "NSQ", "RabbitMQ"]
    },
    {
      name: "Infrastructure",
      skills: ["Docker", "Kubernetes", "AWS", "GCP", "AliCloud"]
    },
    {
      name: "AI Engineering",
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
      <div class="sys-eyebrow mb-5">03 — SYSTEMS</div>
      <h2 class="sys-display text-display-lg max-w-3xl mb-4" style="line-height: 1.08">
        The systems I work with.
      </h2>
      <p class="text-ink-200 text-lg leading-relaxed max-w-prose">
        Technologies and tools I use to build scalable applications.
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
          on:mouseenter={() => hoveredCat = cat.name}
          on:mouseleave={() => hoveredCat = ''}
        >
          <h3 class="font-mono text-xs uppercase tracking-[0.2em] text-accent-400 mb-5 pb-3 border-b border-line">
            {cat.name}
          </h3>
          <ul class="space-y-3">
            {#each cat.skills as skill}
              <li
                class="font-display text-[15px] transition-colors duration-200"
                class:text-accent-400={hoveredCat === cat.name}
                class:text-ink-300={hoveredCat !== cat.name}
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
