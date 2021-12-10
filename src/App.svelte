<script context="module" lang="ts">
  export type AppContext = {
    startAssignment: (data: AnnotatedData) => void;
    goToOptions: (raw: string[][]) => void;
    showResults: (data: AssignmentData) => void;
  };
</script>

<script lang="ts">
  import FileLoader from "./lib/FileLoader.svelte";
  import Home from "./lib/Home.svelte";
  import Navbar from "./lib/Navbar.svelte";
  import { fly } from "svelte/transition";
  import ParallelRunner from "simple-web-worker";
  import parseCSV from "./csvParser";
  import LoadingScreen from "./lib/LoadingScreen.svelte";
  import Options from "./lib/Options.svelte";
  import Modal from "svelte-simple-modal";
  import { setContext } from "svelte";
  import type { AnnotatedData } from "./collectAnnotatedData";
  // import assignCourses, { AssignmentData } from "./assignCourses";
  import AssignmentDisplay from "./AssignmentDisplay.svelte";
  import type { AssignmentData } from "./assignCourses";
  import AssignmentProgress from "./lib/AssignmentProgress.svelte";

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
  let rawData: string[][] = null;
  let annotatedData: AnnotatedData = null;
  let assignedData: AssignmentData = null;

  function goToHome() {
    rawData = null;
    annotatedData = null;
    assignedData = null;
    state = 0;
  }

  function leaveHome() {
    state = 1;
  }

  function goToOptions(
    event: CustomEvent<{
      json: string;
      setDisabled: (disabled: boolean) => void;
    }>
  ) {
    state = 2;
    ParallelRunner.run(parseCSV, [event.detail.json, ";"])
      .then((raw: string[][]) => {
        rawData = raw;
        state = 3;
      })
      .catch((e: any) => {
        console.error(e);
        leaveHome();
        event.detail.setDisabled(false);
      });
  }

  function startAssignment(data: AnnotatedData) {
    rawData = null;
    annotatedData = data;
    state = 4;
  }

  function showResultsHandler(event: CustomEvent<AssignmentData>) {
    showResults(event.detail);
  }

  function showResults(data: AssignmentData) {
    rawData = null;
    assignedData = data;
    state = 5;
    annotatedData = null;
  }

  setContext("kurswahl-helfer-triggers", {
    startAssignment,
    goToOptions: (raw: string[][]) => {
      rawData = raw;
      annotatedData = null;
      state = 3;
    },
    showResults
  });
</script>

<main>
  <Navbar />
  <Modal>
    <article class="content">
      {#if state < 1}
        <div in:fly={transitionInOptions} out:fly={transitionOutOptions}>
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
      {:else if state < 4}
        <div in:fly={transitionInOptions} out:fly={transitionOutOptions}>
          <Options on:returnToLoader={leaveHome} {rawData} />
        </div>
      {:else if state < 5}
        <div in:fly={transitionInOptions} out:fly={transitionOutOptions}>
          <AssignmentProgress data={annotatedData} on:done={showResultsHandler} />
        </div>
      {:else if state < 6}
        <div in:fly={transitionInOptions} out:fly={transitionOutOptions}>
          <AssignmentDisplay
            on:goToHome={goToHome}
            assignmentData={assignedData}
          />
        </div>
      {/if}
    </article>
  </Modal>
</main>

<style>
  :global(body) {
    padding: 0;
    margin: 0;
    height: 100%;
    max-height: 100%;
  }

  :root {
    font-family: "Montserrat", sans-serif;
    --light-blue: #30bced;
    --fresh-yellow: #fde74c;
    --dark-green: #758e4f;
    --magic-magenta: #b95f89;
    --orange: #f26419;
    --dark-blue: #11aae1;
    --dark-orange: #d4520c;
    height: 100%;
    max-height: 100%;
    max-width: 100%;
  }

  @media (prefers-contrast: more) {
    :root {
      --light-blue: #108ebc;
      --dark-blue: #08475e;
    }
  }

  /* :global(body) {
    scrollbar-gutter: stable both-edges;;
  } */

  :global(#app) {
    height: 100%;
    max-width: 100%;
    max-height: 100%;
  }

  main {
    text-align: center;
    padding: 0;
    margin: 0;
    height: 100%;

    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-content: stretch;
    align-items: center;
    flex-shrink: 1;
    max-width: 100%;
    max-height: 100%;
  }

  .content {
    order: 0;
    flex: 1 1 auto;
    align-self: auto;
    padding: 1em;
    box-sizing: border-box;
    max-width: 100%;
    max-height: 100%;
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

  :global(.btn-right::after, .btn-upload::after, .btn-left::before, .btn-home::before, .btn-save::before, details
      > summary.btn::before, details > summary .btn::before, details
      > summary
      button::before) {
    font-family: "Material Icons Round";
    font-size: 1.1em;
    vertical-align: text-top;
  }

  :global(.btn-right::after, .btn-upload::after) {
    margin-left: 0.5em;
  }

  :global(.btn-left::before, .btn-home::before, .btn-save::before, details
      > summary.btn::before, details > summary .btn::before, details
      > summary
      button::before) {
    margin-right: 0.5em;
  }

  :global(.btn-right::after) {
    content: "\f1df";
  }

  :global(.btn-left::before) {
    content: "\f1e6";
  }

  :global(.btn-home::before) {
    content: "\e88a";
  }

  :global(.btn-upload::after) {
    content: "\e2c6";
  }

  :global(.btn-save::before) {
    content: "\e161";
  }

  :global(details > summary.btn::before, details > summary .btn::before, details
      > summary
      button::before) {
    content: "\e5cf";
  }

  :global(details[open] > summary.btn::before, details[open]
      > summary
      .btn::before, details[open] > summary button::before) {
    content: "\e5ce";
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

  :global(.limited-width, .width-limited) {
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

  :global(h2) {
    margin-top: 0;
    margin-bottom: 0.5em;
  }

  :global(h3) {
    margin-top: 0;
    margin-bottom: 0.5em;
  }

  :global(h4) {
    margin-top: 0;
    margin-bottom: 0.25em;
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

  :global(.table-container) {
    overflow: auto;
    max-width: 100%;
  }

  :global(table, th, td) {
    border: 0.2em solid var(--dark-green);
    border-collapse: collapse;
  }

  :global(th, td) {
    padding: 0.1em;
  }

  :global(thead th) {
    /* border-color: var(--orange);
        border-top-color: var(--dark-green); */
    background-color: var(--light-blue);
    color: white;
  }

  :global(tfoot th) {
    background-color: var(--magic-magenta);
    color: white;
  }

  /* :global(thead > tr > th:first-child) {
        border-left-color: var(--dark-green);
    }

    :global(thead > tr > th:last-child) {
        border-right-color: var(--dark-green);
    } */

  :global(table) {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }
</style>
