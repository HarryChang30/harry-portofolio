<script lang="ts">
    import { _ } from '../lib/i18n.js';
    
    const skillCategories = [
        {
            name: "Programming Languages",
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
            name: "Backend Frameworks",
            skills: [
                { name: "Node.js", icon: "/icons/node-js-icon.png" },
                { name: "Echo", icon: "/icons/echo-framework-icon.png" },
            ]
        },
        {
            name: "Protocols & APIs",
            skills: [
                { name: "REST API", icon: "/icons/rest-api-icon.png" },
                { name: "gRPC", icon: "/icons/grpc-icon.png" },
            ]
        },
        {
            name: "Databases",
            skills: [
                { name: "MySQL", icon: "/icons/mysql-icon.png" },
                { name: "PostgreSQL", icon: "/icons/postgresql-icon.png" },
                { name: "Elasticsearch", icon: "/icons/elasticsearch-icon.png" },
                { name: "MongoDB", icon: "/icons/mongodb-icon.png" },
                { name: "Redis", icon: "/icons/redis-icon.png" },
            ]
        },
        {
            name: "Message Brokers",
            skills: [
                { name: "RabbitMQ", icon: "/icons/rabbitmq-icon.png" },
                { name: "NSQ", icon: "/icons/nsq-icon.png" },
                { name: "Kafka", icon: "/icons/kafka-icon.png" },
            ]
        },
        {
            name: "DevOps & Cloud",
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
        }
    ];
</script>

<section id="skills" class="py-16 md:py-24 bg-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12 md:mb-16">
      <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{$_('sections.skills.title')}</h2>
      <div class="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
      <p class="mt-4 text-gray-600 max-w-2xl mx-auto">
        Technologies and tools I use to build scalable applications.
      </p>
    </div>

    <div class="space-y-12">
      {#each skillCategories as category}
        <div>
          <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <span class="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
            {category.name}
          </h3>
          <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {#each category.skills as skill}
              <div class="group flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 border border-transparent hover:border-gray-100">
                <div class="w-12 h-12 mb-3 flex items-center justify-center">
                  <img
                      src={skill.icon}
                      alt={skill.name}
                      class="max-w-full max-h-full object-contain"
                  />
                </div>
                <h4 class="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors text-center">{skill.name}</h4>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
