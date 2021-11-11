<script lang="ts">
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  function next() {
    dispatch("moveToNext");
  }
</script>

<h1>Willkommen zum Kurswahl-Helfer!</h1>
<p>
  Dieser Assistent wird sie durch die Zuteilung der Kurse begleiten.<br />
  Klicken Sie auf "Start", um zu beginnen.
</p>
<button class="btn-right" on:click={next}>Start</button>

<style>
  
</style>
