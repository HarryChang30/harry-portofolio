<script>
    export let skills = [
        {
            name: "Go",
            icon: "/icons/go-icon.png",
            category: "Programming Languages",
        },
        {
            name: "Typescript",
            icon: "/icons/typescript-icon.png",
            category: "Programming Languages",
        },
        {
            name: "Javascript",
            icon: "/icons/js-icon.png",
            category: "Programming Languages",
        },
        {
            name: "Python",
            icon: "/icons/python-icon.png",
            category: "Programming Languages",
        },
        {
            name: "Java 8",
            icon: "/icons/java-icon.png",
            category: "Programming Languages",
        },
        {
            name: "C++",
            icon: "/icons/c++-icon.png",
            category: "Programming Languages",
        },
        {
            name: "Node.js",
            icon: "/icons/node-js-icon.png",
            category: "Backend Framework",
        },
        {
            name: "Echo",
            icon: "/icons/echo-framework-icon.png",
            category: "Backend Framework",
        },
        {
            name: "Gin",
            icon: "/icons/gin-icon.jpg",
            category: "Backend Framework",
        },
        {
            name: "Rest API",
            icon: "/icons/rest-api-icon.png",
            category: "Protocols",
        },
        {
            name: "gRPC",
            icon: "/icons/grpc-icon.png",
            category: "Protocols",
        },
        {
            name: "Docker",
            icon: "/icons/docker-icon.png",
            category: "Container",
        },
        {
            name: "Kubernetes",
            icon: "/icons/kubernetes-icon.png",
            category: "Container",
        },
        {
            name: "Github",
            icon: "/icons/github-icon.png",
            category: "SCM",
        },
        {
            name: "Gitlab",
            icon: "/icons/gitlab-icon.png",
            category: "SCM",
        },
        {
            name: "MySQL",
            icon: "/icons/mysql-icon.png",
            category: "RDBMS",
        },
        {
            name: "PostgreSQL",
            icon: "/icons/postgresql-icon.png",
            category: "RDBMS",
        },
        {
            name: "Elasticsearch",
            icon: "/icons/elasticsearch-icon.png",
            category: "NoSQL",
        },
        {
            name: "MongoDB",
            icon: "/icons/mongodb-icon.png",
            category: "NoSQL",
        },
        {
            name: "Redis",
            icon: "/icons/redis-icon.png",
            category: "In Memory Database",
        },
        {
            name: "RabiitMQ",
            icon: "/icons/rabbitmq-icon.png",
            category: "Message Broker",
        },
        {
            name: "NSQ",
            icon: "/icons/nsq-icon.png",
            category: "Pub/Sub",
        },
        {
            name: "Apache Kafka",
            icon: "/icons/kafka-icon.png",
            category: "Message Broker",
        },
        {
            name: "Kong",
            icon: "/icons/kong-icon.png",
            category: "API Gateway",
        },
    ];
</script>

<section id="skills" class="mb-12">
  <h2 class="text-3xl font-semibold text-gray-800 mb-6">Technology Stack</h2>

  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {#each skills as skill}
      <div class="flex flex-col items-center p-4 bg-white shadow-md rounded-lg text-center hover:shadow-lg transition-shadow">
        <img
            src={skill.icon}
            alt={skill.name}
            class="{skill.icon.includes('kubernetes-icon.png') ? 'w-16 h-10' : 'w-12 h-12'} mb-2"
        />
        <h3 class="text-lg font-semibold text-gray-800">{skill.name}</h3>
        <p class="text-sm text-gray-500">{skill.category}</p>
      </div>
    {/each}
  </div>
</section>