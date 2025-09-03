<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { _ } from '../lib/i18n.js';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  // Import Font Awesome icons if using Font Awesome
  import { faGithub, faLinkedin, faGoogle } from "@fortawesome/free-brands-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  
  let isMenuOpen = false;
  let isMobile = false;
  
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };
  
  const closeMenu = () => {
    isMenuOpen = false;
  };
  
  const checkMobile = () => {
    isMobile = window.innerWidth < 768;
    if (!isMobile) {
      isMenuOpen = false;
    }
  };
  
  onMount(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  });
</script>

<!-- Mobile hamburger button -->
<button 
  class="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md shadow-lg"
  on:click={toggleMenu}
  aria-label="Toggle menu"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {#if isMenuOpen}
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    {:else}
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
    {/if}
  </svg>
</button>

<!-- Mobile overlay -->
{#if isMenuOpen && isMobile}
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    on:click={closeMenu}
    role="button"
    tabindex="0"
    on:keydown={(e) => e.key === 'Enter' && closeMenu()}
  ></div>
{/if}

<nav class="fixed top-0 left-0 h-full w-60 bg-gray-800 text-white p-6 shadow-lg flex flex-col justify-between z-40 transform transition-transform duration-300 ease-in-out {isMobile ? (isMenuOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'} md:translate-x-0">
  <div>
    <h2 class="text-2xl font-bold mb-10">Harry Chang</h2>
     <!-- Profile Icons at the Bottom -->
   <div class="mt-8 mb-8 flex justify-center space-x-6"> <!-- Increased top margin from mt-8 to mt-16 and space between icons -->
        <!-- Placeholder Image Icons (adjust as needed) -->
    <img src="/logos/go-mascot.jpg" alt="Profile 1" class="w-32 h-32 rounded-full bg-gray-800 my-4">
    </div>
    <ul class="space-y-4">
      <li>
        <a href="#introduction" on:click={() => { goto('/#introduction'); closeMenu(); }} class="block text-lg hover:text-blue-400 py-2 px-2 rounded transition-colors">
          {$_('nav.introduction')}
        </a>
      </li>
      <li>
        <a href="#experience" on:click={() => { goto('/#experience'); closeMenu(); }} class="block text-lg hover:text-blue-400 py-2 px-2 rounded transition-colors">
          {$_('nav.experience')}
        </a>
      </li>
      <li>
        <a href="#projects" on:click={() => { goto('/#projects'); closeMenu(); }} class="block text-lg hover:text-blue-400 py-2 px-2 rounded transition-colors">
          {$_('nav.projects')}
        </a>
      </li>
      <li>
        <a href="#skills" on:click={() => { goto('/#skills'); closeMenu(); }} class="block text-lg hover:text-blue-400 py-2 px-2 rounded transition-colors">
          {$_('nav.skills')}
        </a>
      </li>
      <li>
        <a href="#blog" on:click={() => { goto('/blog'); closeMenu(); }} class="block text-lg hover:text-blue-400 py-2 px-2 rounded transition-colors">
          {$_('nav.blog')}
        </a>
      </li>
    </ul>
    
    <!-- Language Switcher -->
    <div class="mt-8">
      <LanguageSwitcher />
    </div>
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
