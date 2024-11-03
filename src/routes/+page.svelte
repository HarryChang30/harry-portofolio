<style global>
  @import '../app.css';
</style>


<script>
  import Sidebar from '../components/Sidebar.svelte';
  import Introduction from '../components/Introduction.svelte';
  import Experience from '../components/Experience.svelte';
  import Projects from '../components/Projects.svelte';
  import Skills from '../components/Skills.svelte';
</script>

<Sidebar />

<main class="ml-64 p-8 bg-gray-100 min-h-screen">
  <!-- Introduction with a button to toggle visibility -->
  <Introduction />
  <Experience />
  <Projects />
  <Skills />

  <section id="blog" class="mb-12">
    <h2 class="text-3xl font-semibold text-gray-800 mb-4">Blog</h2>
    <p class="text-gray-700">Content for Blog Section goes here...</p>
  </section>
</main>
