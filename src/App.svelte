<script lang="ts">
  import FileLoader from "./lib/FileLoader.svelte";
  import Home from "./lib/Home.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import { fly } from "svelte/transition";
  import ParallelRunner from "simple-web-worker";
  import parseCSV from "./csvParser";
  import LoadingScreen from "./lib/LoadingScreen.svelte";

  const transitionInOptions = {
    duration: 250,
    delay: 250,
    x: document.documentElement.clientWidth / 3,
  };
  const transitionOutOptions = {
    duration: 250,
    x: -document.documentElement.clientWidth / 3,
  };

  let state = 0;
  let rawData: string[][];

  function leaveHome() {
    state = 1;
  }

  function goToOptions(event: CustomEvent<string>) {
    state = 2;
    ParallelRunner.run(parseCSV, [event.detail, ";"])
      .then((raw: string[][]) => {
        rawData = raw;
        state = 3;
      })
      .catch((e: any) => {
        console.error(e);
        leaveHome();
      });
  }
</script>

<main>
  <Navbar />
  <article class="content">
    {#if state < 1}
      <div out:fly={transitionOutOptions}>
        <Home on:moveToNext={leaveHome} />
      </div>
    {:else if state < 2}
      <div in:fly={transitionInOptions} out:fly={transitionOutOptions}>
        <FileLoader on:file-loaded={goToOptions} />
      </div>
    {:else if state < 3}
      <div in:fly={transitionInOptions} out:fly={transitionOutOptions}>
        <LoadingScreen>
          <h1 slot="title">Schritt 2: Extrahiere Daten aus Datei...</h1>
        </LoadingScreen>
      </div>
      {:else if  state < 4}
        TODO: create options page
    {/if}
  </article>
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
    height: 100%;
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
    padding: 1em;
  }

  :global(button, .btn) {
    background: var(--light-blue);
    color: white;
    border: medium solid var(--dark-green);
    padding: 1em;
    margin: 0.2em;
    border-radius: 0.1em;
    font-family: "Montserrat", sans-serif;
    font-weight: bold;
    font-size: 1em;
    cursor: pointer;
    transition: all 0.2s;
  }

  :global(.btn-right::after, .btn-upload::after) {
    font-family: "Material Icons Round";
    margin-left: 0.5em;
    font-size: 1.1em;
    vertical-align: text-top;
  }

  :global(.btn-right::after) {
    content: "\f1df";
  }

  :global(.btn-upload::after) {
    content: "\e2c6";
  }

  :global(button:hover, .btn:hover) {
    background: var(--dark-blue);
    color: white;
  }

  :global(button:active, .btn:active) {
    background: var(--magic-magenta);
    color: white;
  }

  :global(button:disabled, .btn:disabled) {
    background-color: #95a3a8;
    border-color: #81847d;
    cursor: progress;
  }

  :global(h1) {
    font-family: "Merriweather Sans", sans-serif;
    font-weight: bold;
    font-size: 2em;
    margin-top: 0.3em;
    margin-bottom: 0.3em;
  }

  :global(.limited-width) {
    max-width: 60em;
  }

  :global(.info-box) {
    max-width: 40em;
    border: medium solid var(--magic-magenta);
    border-radius: 0.1em;
    padding: 1em;
    align-self: center;
    margin: 0.2em;
  }

  :global(h3) {
    margin-top: 0;
    margin-bottom: 0.5em;
  }

  :global(a) {
    font-weight: bold;
    color: var(--orange);
  }

  :global(.hidden) {
    display: none !important; /* I sincerely apologize to the CSS gods for using !important. */
  }

  :global(.error) {
    background-color: var(--magic-magenta);
    border-radius: 0.1em;
    padding: 0.1em;
    color: var(--fresh-yellow);
    display: inline-block;
  }
</style>
