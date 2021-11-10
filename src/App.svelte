<script lang="ts">
  import Home from "./lib/Home.svelte";
  import Navbar from "./lib/Navbar.svelte";
</script>

<main>
  <Navbar />
  <article class="content"><Home /></article>
</main>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
    height: 100%;
  }

  :root {
    font-family: "Montserrat", sans-serif;
    --light-blue: #30bced;
    --fresh-yellow: #fde74c;
    --dark-green: #758e4f;
    --magic-magenta: #b95f89;
    --orange: #f26419;
    --dark-blue: #11aae1;
    height: 100%;
  }

  :global(#app) {
    height:100%;
  }

  main {
    text-align: center;
    padding: 0;
    margin: 0;
    height: 100%;

    display: flex;
    flex-direction: column;
    -ms-flex-wrap: nowrap;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: center;
  }

  .content {
    order: 0;
    flex: 1 1 auto;
    align-self: auto;
  }

  :global(button) {
    background: var(--light-blue);
    color: white;
    border: medium solid var(--dark-green);
    padding: 1em;
    border-radius: 3px;
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
    transition: all 0.2s;
  }

  :global(button:hover) {
    background: var(--dark-blue);
    color: white;
  }

  :global(button:active) {
    background: var(--magic-magenta);
    color: white;
  }

  :global(h1) {
    font-family: "Merriweather Sans", sans-serif;
    font-weight: bold;
    font-size: 2em;
    margin-top: 0.3em;
    margin-bottom: 0.3em;
  }
</style>
