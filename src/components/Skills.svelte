<script lang="ts">
    import { _ } from '../lib/i18n.js';

    const skillCategories = [
        {
            name: "Languages",
            skills: [
                { name: "Go", icon: "/icons/go-icon.png" },
                { name: "TypeScript", icon: "/icons/typescript-icon.png" },
                { name: "JavaScript", icon: "/icons/js-icon.png" },
                { name: "Python", icon: "/icons/python-icon.png" },
                { name: "Java", icon: "/icons/java-icon.png" },
                { name: "C++", icon: "/icons/c++-icon.png" },
            ]
        },
        {
            name: "Frameworks",
            skills: [
                { name: "Node.js", icon: "/icons/node-js-icon.png" },
                { name: "Echo", icon: "/icons/echo-framework-icon.png" },
            ]
        },
        {
            name: "Protocols",
            skills: [
                { name: "REST", icon: "/icons/rest-api-icon.png" },
                { name: "gRPC", icon: "/icons/grpc-icon.png" },
                { name: "MQTT", icon: "/icons/mqtt-icon.png" },
            ]
        },
        {
            name: "Datastores",
            skills: [
                { name: "MySQL", icon: "/icons/mysql-icon.png" },
                { name: "PostgreSQL", icon: "/icons/postgresql-icon.png" },
                { name: "Elasticsearch", icon: "/icons/elasticsearch-icon.png" },
                { name: "MongoDB", icon: "/icons/mongodb-icon.png" },
                { name: "Redis", icon: "/icons/redis-icon.png" },
            ]
        },
        {
            name: "Messaging",
            skills: [
                { name: "RabbitMQ", icon: "/icons/rabbitmq-icon.png" },
                { name: "NSQ", icon: "/icons/nsq-icon.png" },
                { name: "Kafka", icon: "/icons/kafka-icon.png" },
            ]
        },
        {
            name: "Infra & Cloud",
            skills: [
                { name: "Docker", icon: "/icons/docker-icon.png" },
                { name: "Kubernetes", icon: "/icons/kubernetes-icon.png" },
                { name: "GitHub", icon: "/icons/github-icon.png" },
                { name: "GitLab", icon: "/icons/gitlab-icon.png" },
                { name: "Kong", icon: "/icons/kong-icon.png" },
                { name: "AWS", icon: "/icons/aws-icon.png" },
                { name: "GCP", icon: "/icons/gcp-icon.png" },
                { name: "AliCloud", icon: "/icons/alicloud-icon.png" },
            ]
        },
        {
            name: "AI Coding Agents",
            skills: [
                { name: "Codex", icon: "/icons/openai-icon.png" },
                { name: "Claude Code", icon: "/icons/anthropic-icon.png" },
                { name: "Pi.dev", icon: "/icons/pi-icon.png" },
                { name: "OpenCode", icon: "/icons/opencode-icon.png" },
            ]
        },
        {
            name: "AI Agent SDKs",
            skills: [
                { name: "OpenAI-compatible", icon: "/icons/openai-icon.png" },
                { name: "Mastra", icon: "/icons/mastra-icon.png" },
                { name: "Anthropic SDK", icon: "/icons/anthropic-icon.png" },
            ]
        }
    ];
</script>

<section id="skills" class="py-20 md:py-28 bg-frost-50 border-y border-line">
  <div class="max-w-6xl mx-auto px-6 sm:px-8">
    <div class="mb-14 md:mb-20 max-w-3xl">
      <div class="fable-eyebrow mb-4">— {$_('sections.skills.title')}</div>
      <h2 class="text-display-lg font-serif font-medium text-ink-400 mb-5">
        Tools I reach for, plus the ones I'm still learning.
      </h2>
      <p class="text-ink-100 text-lg leading-relaxed max-w-prose">
        Technologies and tools I use to build scalable applications.
      </p>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12">
      {#each skillCategories as category}
        <div>
          <h3 class="font-mono text-xs uppercase tracking-[0.18em] text-azure-400 mb-5 pb-3 border-b border-line">
            {category.name}
          </h3>
          <ul class="space-y-3">
            {#each category.skills as skill}
              <li class="flex items-center gap-3 text-ink-200">
                {#if skill.icon}
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    class="w-5 h-5 object-contain opacity-90"
                  />
                {:else}
                  <span class="w-5 h-5 inline-flex items-center justify-center text-azure-400 font-mono text-sm leading-none">+</span>
                {/if}
                <span class="text-[15px]">{skill.name}</span>
              </li>
            {/each}
          </ul>
        </div>
      {/each}
    </div>
  </div>
</section>
