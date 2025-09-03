<script>
  import Sidebar from '../components/Sidebar.svelte';
  import Introduction from '../components/Introduction.svelte';
  import Experience from '../components/Experience.svelte';
  import Projects from '../components/Projects.svelte';
  import Skills from '../components/Skills.svelte';
</script>

<Sidebar />

<main class="ml-0 md:ml-64 pt-16 md:pt-8 px-4 md:px-8 pb-8 bg-gray-100 min-h-screen transition-all duration-300">
  <!-- Introduction with a button to toggle visibility -->
  <Introduction />
  <Experience />
  <Projects />
  <Skills />
</main>
