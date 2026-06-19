<script>
  import Sidebar from '../components/Sidebar.svelte';
  import Introduction from '../components/Introduction.svelte';
  import Experience from '../components/Experience.svelte';
  import Projects from '../components/Projects.svelte';
  import Skills from '../components/Skills.svelte';
</script>

<Sidebar />

<main class="pt-16 md:pt-20">
  <Introduction />
  <Experience />
  <Projects />
  <Skills />
</main>
