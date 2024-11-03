<style global>
  @import '../app.css';
</style>

<script>
  import { goto } from '$app/navigation';
  // Import Font Awesome icons if using Font Awesome
  import { faGithub, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
</script>

<nav class="fixed top-0 left-0 h-full w-60 bg-gray-800 text-white p-6 shadow-lg flex flex-col justify-between">
  <div>
    <h2 class="text-2xl font-bold mb-10">Harry Chang</h2>
     <!-- Profile Icons at the Bottom -->
   <div class="mt-8 mb-8 flex justify-center space-x-6"> <!-- Increased top margin from mt-8 to mt-16 and space between icons -->
        <!-- Placeholder Image Icons (adjust as needed) -->
    <img src="/logos/gopher.jpg" alt="Profile 1" class="w-32 h-32 rounded-full bg-gray-800 my-4">
    </div>
    <ul class="space-y-4">
      <li>
        <a href="#introduction" on:click={() => goto('/#introduction')} class="block text-lg hover:text-blue-400">
          Introduction
        </a>
      </li>
      <li>
        <a href="#experience" on:click={() => goto('/#experience')} class="block text-lg hover:text-blue-400">
          Working Experience
        </a>
      </li>
      <li>
        <a href="#projects" on:click={() => goto('/#projects')} class="block text-lg hover:text-blue-400">
          Projects
        </a>
      </li>
      <li>
        <a href="#skills" on:click={() => goto('/#skills')} class="block text-lg hover:text-blue-400">
          Technology
        </a>
      </li>
      <li>
        <a href="#blog" on:click={() => goto('/blog')} class="block text-lg hover:text-blue-400">
          Blog
        </a>
      </li>
    </ul>
  </div>

  <!-- Social Links Section -->
  <div class="mt-8 space-y-4">
    <h3 class="text-xl font-semibold">Connect with me</h3>
    <div class="flex space-x-4">
      <!-- GitHub Link -->
      <a href="https://github.com/HarryChang30" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white">
        <!-- Using Heroicons -->
        <!-- <GithubIcon class="w-6 h-6" /> -->
        <!-- Using Font Awesome -->
        <FontAwesomeIcon icon={faGithub} class="w-6 h-6" />
      </a>

      <!-- LinkedIn Link -->
      <a href="https://linkedin.com/in/harrychang12" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white">
        <!-- Using Heroicons -->
        <!-- <LinkedinIcon class="w-6 h-6" /> -->
        <!-- Using Font Awesome -->
        <FontAwesomeIcon icon={faLinkedin} class="w-6 h-6" />
      </a>

      <!-- Gmail Link -->
      <a href="mailto:harrychang120@gmail.com" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white">
        <!-- Using Heroicons -->
        <!-- <LinkedinIcon class="w-6 h-6" /> -->
        <!-- Using Font Awesome -->
        <FontAwesomeIcon icon={faGoogle} class="w-6 h-6" />
      </a>
      
    </div>
  </div>
</nav>
