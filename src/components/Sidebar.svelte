<script>
  import { onMount } from 'svelte';
  import { _ } from '../lib/i18n.js';
  import LanguageSwitcher from './LanguageSwitcher.svelte';

  let scrolled = false;
  let dark = true;
  let isMenuOpen = false;
  let progress = 0;

  const toggleTheme = () => {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
  };

  const handleScroll = () => {
    scrolled = window.scrollY > 40;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
  };

  onMount(() => {
    dark = document.documentElement.classList.contains('dark');
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const navItems = [
    { key: 'experience', href: '#experience', num: '01' },
    { key: 'projects', href: '#projects', num: '02' },
    { key: 'systems', href: '#skills', num: '03' },
    { key: 'contact', href: '#contact', num: '04' },
  ];

  const closeMenu = () => { isMenuOpen = false; };

  $: headerClass = scrolled
    ? 'bg-surface-0/70 backdrop-blur-xl border-b border-line'
    : 'bg-transparent border-b border-transparent';
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-soft {headerClass}">
  <!-- Reading progress — a signal tracing the page -->
  <div class="absolute top-0 left-0 right-0 h-px bg-accent-400/50 origin-left" style="transform: scaleX({progress})"></div>
  <nav class="max-w-6xl mx-auto px-6 sm:px-8">
    <div class="flex items-center justify-between h-14 md:h-16">
      <a href="/" class="flex items-center gap-2.5 group" on:click={closeMenu}>
        <span class="font-display text-sm font-medium text-ink-300 tracking-tight group-hover:text-accent-400 transition-colors">
          HARRY CHANG
        </span>
      </a>

      <div class="hidden md:flex items-center gap-0.5">
        {#each navItems as item}
          <a
            href={item.href}
            class="px-3 py-1.5 text-[13px] font-mono text-ink-100 hover:text-accent-400 transition-colors duration-200 tracking-wide"
          >
            <span class="text-ink-50 mr-1.5">{item.num}</span>{$_(`nav.${item.key}`).toUpperCase()}
          </a>
        {/each}
      </div>

      <div class="hidden md:flex items-center gap-1">
        <button
          on:click={toggleTheme}
          class="p-2 text-ink-100 hover:text-accent-400 transition-colors"
          aria-label="Toggle theme"
        >
          {#if dark}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
          {/if}
        </button>
        <LanguageSwitcher />
      </div>

      <button
        class="md:hidden p-2 text-ink-200 hover:text-ink-400 transition-colors"
        on:click={() => isMenuOpen = !isMenuOpen}
        aria-label="Toggle menu"
      >
        {#if isMenuOpen}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/></svg>
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/></svg>
        {/if}
      </button>
    </div>

    {#if isMenuOpen}
      <div class="md:hidden surface-overlay border-t border-line -mx-6 sm:-mx-8 px-6 sm:px-8 pb-6">
        <div class="space-y-1 pt-4">
          {#each navItems as item}
            <a href={item.href} on:click={closeMenu} class="block px-3 py-3 text-sm font-mono text-ink-200 hover:text-accent-400 transition-colors">
              <span class="text-ink-50 mr-2">{item.num}</span>{$_(`nav.${item.key}`).toUpperCase()}
            </a>
          {/each}
        </div>
        <div class="flex items-center gap-2 mt-4 pt-4 border-t border-line">
          <button on:click={toggleTheme} class="p-2 text-ink-100 hover:text-accent-400" aria-label="Toggle theme">
            {#if dark}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
            {:else}
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
            {/if}
          </button>
          <LanguageSwitcher />
        </div>
      </div>
    {/if}
  </nav>
</header>

<style>
  .surface-overlay {
    background-color: rgba(var(--surface-1), 0.95);
    backdrop-filter: blur(24px);
  }
</style>
