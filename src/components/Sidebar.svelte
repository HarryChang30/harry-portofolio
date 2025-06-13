<style global>
  @import '../app.css';
</style>

<script>
  import { goto } from '$app/navigation';
  import { _ } from 'svelte-i18n';
  // Import Font Awesome icons if using Font Awesome
  import { faGithub, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  import LanguageSwitcher from './LanguageSwitcher.svelte';
</script>

<nav class="fixed top-0 left-0 h-full w-60 bg-gray-800 text-white p-6 shadow-lg flex flex-col justify-between">
  <div>
    <div class="flex justify-between items-center mb-10">
      <h2 class="text-2xl font-bold">Harry Chang</h2>
      <LanguageSwitcher />
    </div>
    <!-- Profile Icons at the Bottom -->
    <div class="mt-8 mb-8 flex justify-center space-x-6"> <!-- Increased top margin from mt-8 to mt-16 and space between icons -->
      <!-- Placeholder Image Icons (adjust as needed) -->
      <img src="/logos/go-mascot.jpg" alt="Profile 1" class="w-32 h-32 rounded-full bg-gray-800 my-4">
    </div>
    <ul class="space-y-4">
      <li>
        <a href="#introduction" on:click={() => goto('/#introduction')} class="block text-lg hover:text-blue-400">
          {$_('introduction_title')}
        </a>
      </li>
      <li>
        <a href="#experience" on:click={() => goto('/#experience')} class="block text-lg hover:text-blue-400">
          {$_('experience_title')}
        </a>
      </li>
      <li>
        <a href="#projects" on:click={() => goto('/#projects')} class="block text-lg hover:text-blue-400">
          {$_('project_title')}
        </a>
      </li>
      <li>
        <a href="#skills" on:click={() => goto('/#skills')} class="block text-lg hover:text-blue-400">
          {$_('skills_title')}
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
    <h3 class="text-xl font-semibold">{$_('connect_with_me')}</h3>
    <div class="flex space-x-4">
      <!-- GitHub Link -->
      <a href="https://github.com/HarryChang30" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white">
        <FontAwesomeIcon icon={faGithub} class="w-6 h-6" />
      </a>

      <!-- LinkedIn Link -->
      <a href="https://linkedin.com/in/harrychang12" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white">
        <FontAwesomeIcon icon={faLinkedin} class="w-6 h-6" />
      </a>

      <!-- Gmail Link -->
      <a href="mailto:harrychang120@gmail.com" target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-white">
        <FontAwesomeIcon icon={faGoogle} class="w-6 h-6" />
      </a>
    </div>
  </div>
</nav>
