<script>
    export let projects = [
        {
            name: "Prakerja Dashboard",
            startYear: 2023,
            endYear: 2024,
            thumbnail: "/projects/prakerja-dashboard.png",
            url: "https://dashboard.prakerja.go.id/masuk?history=/",
            description: "Prakerja Dashboard Web Applications, let users going through the digital platform, register batch program and getting the course credits for joining and participate the training courses.",
        },
        {
            name: "Prakerja Job Platform",
            startYear: 2023,
            endYear: 2024,
            thumbnail: "/projects/prakerja-job-platform.png",
            url: "https://dashboard.prakerja.go.id/masuk?history=/",
            description: "Prakerja Job Platform, being integrated with the Prakerja dasboard allowing prakerja users for going through searching the jobs after join the training courses that already provided by Prakerja and Learning Partner. Help prakerja users find their jobs through the platform and provide relevant recommendation based on participation of training.", 
        },
        {
            name: "Prakerja Open API",
            startYear: 2023,
            endYear: 2024,
            thumbnail: "/projects/prakerja-open-api.png",
            url: "https://developer.prakerja.go.id",
            description: "Prakerja Open API platform, providing API specifications for learning partner do the seamless integrations between their system with Prakerja platform for any activities that support purchase, training and verification courses.",
        },
        {
            name: "Kuncie Mobile Apps",
            startYear: 2021,
            endYear: 2023,
            thumbnail: "/projects/kuncie-playstore.png",
            url: "https://play.google.com/store/apps/details?id=com.kuncie.app&pli=1",
            description: "Kuncie mobile applications, providing learning and education through mobile apps. Let students learn by watching the on demand video contents on mobile apps."
        },
        {
            name: "Kuncie Product Catalog - Commerce",
            startYear: 2022,
            endYear: 2023,
            thumbnail: "/projects/kuncie-product-catalog.png",
            url: "https://www.kuncie.com/product-catalog/?page=1",
            description: "Kuncie product catalog commerce. Marketplace for kuncie product and services, where student can purchase their interest course on Kuncie product catalog platform.",
        },
        {
            name: "Kuncie Course Package",
            startYear: 2021,
            endYear: 2023,
            thumbnail: "/projects/kuncie-course-package.png",
            url: "https://www.kuncie.com/public-classes/course-package/",
            description: "Kuncie course package, one of the kuncie generated revenue products integration between Kuncie and Telkomsel mobile network package providing internet quota for being able to watch video learning contents",
        },
        {
            name: "OVO Paylater - Tokopedia (MVP)",
            startYear: 2019,
            endYear: 2020,
            thumbnail: "/projects/ovo-paylater-tokopedia.jpg",
            url: "https://www.tokopedia.com/blog/ovo-paylater/",
            description: "Launching first MVP OVO BNPL Product partnering with the Tokopedia on 2019, gained more than 50k+ active users for doing purchase and transactions using virtual credit card on the Tokopedia ecommerce platforms. (Business Suspended) During the COVID - Pandemic years",
        },
        {
            name: "OVO Modal Usaha",
            startYear: 2020,
            endYear: 2021,
            thumbnail: "/projects/ovo-invoice-financing.png",
            url: "https://www.ovofinansial.com/omu/landing/borrower",
            description: "OVO Modal Usaha - (Invoice Financing) is one of the OVO lending product that funding done by pledging ongoing invoices as source of loan payments to help improving the company cash flow."
        },
        {
            name: "Binusmaya 5",
            startYear: 2016,
            endYear: 2018,
            thumbnail: "/projects/binusmaya-5.png",
            url: "https://binusmaya.binus.ac.id/login",
            description: "Binusmaya 5 - Web applications for universities providing students the LMS module for their learning activities in schools along with other student support services to support student activities in the universities."
        },
        {
            name: "Smart Refrigerator - Internet of Things Research",
            startYear: 2016,
            endYear: 2017,
            thumbnail: "/projects/journal-science-technology.png",
            url: "https://drive.google.com/file/d/0B9tsy3xkLgLZU1NkMVV1cnZjWWs/view?resourcekey=0-Mu-Kl0j87-rPQMJluF7Lyg",
            description: "Smart Refrigerator - Contribute on implementations for how the web services APIs on backend server can connected to the Arduino Client using the PHP CodeIgniter REST Server for Backend and Arduino for the Client."
        },
        {
            name: "Space Shooter - Desktop Console Shooting Games",
            startYear: 2015,
            endYear: 2015,
            thumbnail: "/projects/space-shooter-console.png",
            url: "https://www.youtube.com/watch?v=XKv58jD25YI",
            description: "Space Shooter - Console Games. Working as leading team of 5 members to develop the endless space shooting game with Simple Directmedia Layer (SDL 2.0.3) and C++ programming language to fullfill final Object Oriented Programming courses.",
        },
    ];
</script>

<section id="projects" class="mb-12">
  <h2 class="text-3xl font-semibold text-gray-800 mb-6">Projects</h2>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {#each projects.sort((a, b) => (b.endYear || new Date().getFullYear()) - (a.endYear || new Date().getFullYear())) as project}
      <div class="bg-white shadow-lg rounded-lg overflow-hidden">
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          <img src={project.thumbnail} alt={project.name} class="w-full h-48 object-cover" />
        </a>
        <div class="p-4">
          <a href={project.url} target="_blank" rel="noopener noreferrer" class="text-xl font-semibold text-blue-600 hover:underline">
            {project.name} ({project.startYear} - {project.endYear || "Present"})
          </a>
          <p class="text-gray-700 mt-2 leading-relaxed">{project.description}</p>
        </div>
      </div>
    {/each}
  </div>
</section>