<script lang="ts">
  import { importData } from "../collectAnnotatedData";
  import { createEventDispatcher, getContext } from "svelte";
  import LoadingSaveOptions from "./LoadingSaveOptions.svelte";
  import UploadButton from "./UploadButton.svelte";
  const { open } = getContext("simple-modal");
  const dispatch = createEventDispatcher();
  let summary: HTMLElement;

  function next() {
    dispatch("moveToNext");
  }

  function expandMoreOptions(e: Event) {
    e.preventDefault();
    summary.click();
  }

  function openJsonLoadOptions(
    event: CustomEvent<{
      json: string;
      setDisabled: (disabled: boolean) => void;
    }>
  ) {
    const data = importData(event.detail.json);
    open(LoadingSaveOptions, { annotatedData: data });
    event.detail.setDisabled(false);
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
    <UploadButton accept=".json" on:file-loaded={openJsonLoadOptions}
      >Zwischengespeicherte Daten importieren</UploadButton
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
