<style global>
  @import '../app.css';

  main {
    display: flex;
    flex-direction: column;
    margin-left: 0;
    padding: 8px;
    background-color: #f7fafc;
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
  }

  .sidebar {
    display: none;
  }

  @media (min-width: 768px) {
    main {
      margin-left: 16rem; /* 64px */
      padding: 8px;
    }

    .sidebar {
      display: block;
      width: 16rem; /* 64px */
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      background-color: #fff;
      box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }
  }
</style>


<script>
  import Sidebar from '../components/Sidebar.svelte';
  import Introduction from '../components/Introduction.svelte';
  import Experience from '../components/Experience.svelte';
  import Projects from '../components/Projects.svelte';
  import Skills from '../components/Skills.svelte';
  import Blog from '../components/Blog.svelte';
</script>

<Sidebar />

<main class="ml-64 p-8 bg-gray-100 min-h-screen">
  <!-- Introduction with a button to toggle visibility -->
  <Introduction />
  <Experience />
  <Projects />
  <Skills />
</main>
