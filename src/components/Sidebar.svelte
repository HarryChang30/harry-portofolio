<script>
  import { onMount } from 'svelte';
  import { _ } from '../lib/i18n.js';
  import LanguageSwitcher from './LanguageSwitcher.svelte';
  import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
  import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
  import { FontAwesomeIcon } from "@fortawesome/svelte-fontawesome";

  let isMenuOpen = false;
  let scrolled = false;
  let dark = false;

  const toggleMenu = () => { isMenuOpen = !isMenuOpen; };
  const closeMenu = () => { isMenuOpen = false; };

  const toggleTheme = () => {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  };

  const handleScroll = () => { scrolled = window.scrollY > 20; };

  onMount(() => {
    dark = document.documentElement.classList.contains('dark');
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const navItems = [
    { key: 'introduction', href: '#introduction' },
    { key: 'experience', href: '#experience' },
    { key: 'projects', href: '#projects' },
    { key: 'skills', href: '#skills' },
    { key: 'blog', href: '/blog', external: true }
  ];
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-soft {scrolled ? 'bg-frost-100/85 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'}">
  <nav class="max-w-6xl mx-auto px-6 sm:px-8">
    <div class="flex items-center justify-between h-16 md:h-20">
      <a href="/" class="flex items-center gap-3 group" on:click={closeMenu}>
        <img
          src="/logos/go-mascot.jpg"
          alt="Harry Chang"
          class="w-9 h-9 rounded-full object-cover ring-1 ring-line group-hover:ring-azure-200 transition-all duration-300"
        />
        <span class="font-serif text-lg text-ink-400 hidden sm:block group-hover:text-azure-400 transition-colors">
          Harry Chang
        </span>
      </a>

      <div class="hidden md:flex items-center gap-1">
        {#each navItems as item}
          <a
            href={item.href}
            class="px-3.5 py-2 text-sm text-ink-100 hover:text-ink-400 font-medium transition-colors duration-200 relative group"
          >
            {$_(`nav.${item.key}`)}
            <span class="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-azure-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-soft origin-left"></span>
          </a>
        {/each}
      </div>

      <div class="hidden md:flex items-center gap-3">
        <a href="https://github.com/HarryChang30" target="_blank" rel="noopener noreferrer" class="p-2 text-ink-50 hover:text-ink-400 transition-colors" aria-label="GitHub">
          <FontAwesomeIcon icon={faGithub} class="w-[18px] h-[18px]" />
        </a>
        <a href="https://linkedin.com/in/harrychang12" target="_blank" rel="noopener noreferrer" class="p-2 text-ink-50 hover:text-ink-400 transition-colors" aria-label="LinkedIn">
          <FontAwesomeIcon icon={faLinkedin} class="w-[18px] h-[18px]" />
        </a>
        <a href="mailto:harrychang120@gmail.com" class="p-2 text-ink-50 hover:text-ink-400 transition-colors" aria-label="Email">
          <FontAwesomeIcon icon={faEnvelope} class="w-[18px] h-[18px]" />
        </a>
        <div class="w-px h-5 bg-line mx-1"></div>
        <button on:click={toggleTheme} class="p-2 text-ink-50 hover:text-ink-400 transition-colors" aria-label="Toggle dark mode">
          {#if dark}
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          {:else}
            <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          {/if}
        </button>
        <LanguageSwitcher />
      </div>

      <button
        class="md:hidden p-2 text-ink-200 hover:text-ink-400 transition-colors"
        on:click={toggleMenu}
        aria-label="Toggle menu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if isMenuOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          {/if}
        </svg>
      </button>
    </div>

    {#if isMenuOpen}
      <div class="md:hidden bg-frost-50 border-t border-line -mx-6 sm:-mx-8 px-6 sm:px-8 pb-6">
        <div class="space-y-1 pt-4">
          {#each navItems as item}
            <a href={item.href} on:click={closeMenu} class="block px-3 py-3 text-sm text-ink-100 hover:text-ink-400 font-medium transition-colors">
              {$_(`nav.${item.key}`)}
            </a>
          {/each}
        </div>
        <div class="flex items-center gap-2 mt-4 pt-4 border-t border-line">
          <a href="https://github.com/HarryChang30" target="_blank" rel="noopener noreferrer" class="p-2 text-ink-50 hover:text-ink-400" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} class="w-[18px] h-[18px]" />
          </a>
          <a href="https://linkedin.com/in/harrychang12" target="_blank" rel="noopener noreferrer" class="p-2 text-ink-50 hover:text-ink-400" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} class="w-[18px] h-[18px]" />
          </a>
          <a href="mailto:harrychang120@gmail.com" class="p-2 text-ink-50 hover:text-ink-400" aria-label="Email">
            <FontAwesomeIcon icon={faEnvelope} class="w-[18px] h-[18px]" />
          </a>
          <div class="ml-auto flex items-center gap-2">
            <button on:click={toggleTheme} class="p-2 text-ink-50 hover:text-ink-400" aria-label="Toggle dark mode">
              {#if dark}
                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
              {:else}
                <svg class="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
              {/if}
            </button>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    {/if}
  </nav>
</header>
