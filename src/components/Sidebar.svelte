<script>
  import { onMount } from 'svelte';
  import { _ } from '../lib/i18n.js';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
  import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";
  
  let isMenuOpen = false;
  let scrolled = false;
  
  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };
  
  const closeMenu = () => {
    isMenuOpen = false;
  };
  
  const handleScroll = () => {
    scrolled = window.scrollY > 20;
  };
  
  onMount(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
  
  const navItems = [
    { key: 'introduction', href: '#introduction' },
    { key: 'experience', href: '#experience' },
    { key: 'projects', href: '#projects' },
    { key: 'skills', href: '#skills' },
    { key: 'blog', href: '/blog', external: true }
  ];
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">
      <!-- Logo / Name -->
      <a href="/" class="flex items-center space-x-3 group" on:click={closeMenu}>
        <img 
          src="/logos/go-mascot.jpg" 
          alt="Harry Chang" 
          class="w-10 h-10 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
        />
        <span class="font-bold text-xl text-gray-800 hidden sm:block">
          Harry Chang
        </span>
      </a>

      <!-- Desktop Navigation -->
      <div class="hidden md:flex items-center space-x-1">
        {#each navItems as item}
          <a 
            href={item.href} 
            class="px-4 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200"
          >
            {$_(`nav.${item.key}`)}
          </a>
        {/each}
      </div>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center space-x-4">
        <div class="flex items-center space-x-3">
          <a 
            href="https://github.com/HarryChang30" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            aria-label="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} class="w-5 h-5" />
          </a>
          <a 
            href="https://linkedin.com/in/harrychang12" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-gray-100 transition-all duration-200"
            aria-label="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} class="w-5 h-5" />
          </a>
          <a 
            href="mailto:harrychang120@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-100 transition-all duration-200"
            aria-label="Email"
          >
            <FontAwesomeIcon icon={faEnvelope} class="w-5 h-5" />
          </a>
        </div>
        <div class="w-px h-8 bg-gray-300"></div>
        <div class="flex-shrink-0">
          <LanguageSwitcher />
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <button 
        class="md:hidden p-2 rounded-lg {scrolled ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-700'} transition-all duration-200"
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
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
      <div class="md:hidden bg-white border-t border-gray-100 shadow-lg -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4">
        <div class="space-y-1 pt-2">
          {#each navItems as item}
            <a 
              href={item.href}
              on:click={closeMenu}
              class="block px-4 py-3 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200"
            >
              {$_(`nav.${item.key}`)}
            </a>
          {/each}
        </div>
        <div class="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-100">
          <a 
            href="https://github.com/HarryChang30" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="GitHub"
          >
            <FontAwesomeIcon icon={faGithub} class="w-5 h-5" />
          </a>
          <a 
            href="https://linkedin.com/in/harrychang12" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-lg text-gray-600 hover:text-blue-700 hover:bg-gray-100"
            aria-label="LinkedIn"
          >
            <FontAwesomeIcon icon={faLinkedin} class="w-5 h-5" />
          </a>
          <a 
            href="mailto:harrychang120@gmail.com" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-2 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-100"
            aria-label="Email"
          >
            <FontAwesomeIcon icon={faEnvelope} class="w-5 h-5" />
          </a>
          <div class="ml-auto">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    {/if}
  </nav>
</header>
