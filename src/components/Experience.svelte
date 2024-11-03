<script>
    export let experiences = [
        {
            company: "Coordinating Ministry for Economic Affairs - Prakerja",
            logo: "/logos/prakerja.jpg",
            position: "Senior Software Engineer Backend",
            duration: "Jul 2023 - Dec 2024",
            description: [
                "Developed backend microservices in Go and NodeJS, contributing to scalable microservices architecture",
                "Contributing into system design and backend architecture",
                "Improving unit test, security and refactoring codebase",
                "Provide support on-call 24/7 for production issues and initiate the root cause analysis",
                "Provide support for partner integration in module fraud engine to prevent any fraud users",
            ]
        },
        {
            company: "Kuncie - EdTech",
            logo: "/logos/kuncie.png",
            position: "Software Engineer Backend",
            duration: "Nov 2021 - Jun 2023",
            description: [
                "Developed backend microservices in Go and NodeJS, contributing to scalable microservices architecture",
                "Contributing into system design, serverless architecture and microservices architecture",
                "Improving unit test, security, design pattern and refactoring codebase",
                "Working on migration of legacy system into the new microservices",
                "Provide support on-call 24/7 for production issues and initiate the root cause analysis",
            ]
        },
        {
          company: "Grab - OVO",
          logo: "/logos/grab-ovo-logo.jpg",
          position: "Senior Software Engineer Backend",
          duration: "Jan 2019 - Oct 2021",
          description: [
            "Developed backend microservices in Go and NodeJS, contributing to scalable microservices architecture",
            "Contributing into system design and microservices architecture",
            "Improving unit test, security, design pattern and refactoring codebases",
            "Working on migration of legacy monolithic applications break down into microservices",
            "Provide support on-call 24/7 for production issues and initiate the root cause analysis",
          ]
        },
        {
          company: "IT Division - Binus University",
          logo: "/logos/it-binus.jpg",
          duration: "Feb 2016 - Dec 2018",
          description: [
            "Developed features and module of web applications using technology PHP CodeIgniter, JS/Jquery and AJAX for main CMS module",
            "Developed features and moduel of web applications using ASP.Net MVC for some university internal modules",
            "Contributing in system design and architecture of web applications in exam scheduling and scoring module",
            "Refactoring and Optimized existing code and queries for improved performance in exam scheduling, monitoring and student attendance",
            "Contributing in research area of IoT projects for building the web APIs using CodeIgniter RestServer and Arduino Web Client for smart refrigerator projects",
          ]
        },
    ];
</script>

<section id="experience" class="mb-12">
  <h2 class="text-3xl font-semibold text-gray-800 mb-6">Working Experience</h2>
  
  <div class="space-y-6">
    {#each experiences as experience}
      <div class="flex items-start p-4 bg-white shadow-lg rounded-lg">
        <img src={experience.logo} alt={experience.company} class="{experience.logo.includes('grab-ovo-logo.jpg') ? 'w-16 h-13' : 'w-16 h-16'} rounded-full mr-4" />

        <div>
          <h3 class="text-xl font-semibold text-gray-600">{experience.position}</h3>
          <p class="text-sm text-gray-500 mb-1">{experience.company} | {experience.duration}</p>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            {#each experience.description as point}
              <li>{point}</li>
            {/each}
          </ul>
        </div>
      </div>
    {/each}
  </div>
</section>