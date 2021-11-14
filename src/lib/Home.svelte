<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import UploadButton from "./UploadButton.svelte";
  const dispatch = createEventDispatcher();
  let summary: HTMLElement;

  function next() {
    dispatch("moveToNext");
  }

  function expandMoreOptions(e: Event) {
    e.preventDefault();
    summary.click();
  }
</script>

<h1>Willkommen zum Kurswahl-Helfer!</h1>
<p>
  Dieser Assistent wird sie durch die Zuteilung der Kurse begleiten.<br />
  Klicken Sie auf "Start", um zu beginnen.
</p>
<button class="btn-right" on:click={next}>Start</button>
<details>
  <summary bind:this={summary}>
    <button on:click={expandMoreOptions}>Weitere Optionen</button>
  </summary>
  <p class="info-box">
    Wenn Sie nach Schritt 3 (Daten annotieren) die Möglichkeit genutzt haben,
    zwischenzuspeichern, können Sie die .json-Datei laden und fortfahren.
    <UploadButton
      accept=".json"
      on:file-loaded={(event) => {
        dispatch("save-loaded", event.detail);
      }}>Zwischengespeicherte Daten importieren</UploadButton
    >
  </p>
</details>

<style>
  details {
    display: flex;
    flex-direction: column;
    align-content: center;
  }

  summary {
    display: block;
    user-select: none;
    width: 100%;
  }
</style>
