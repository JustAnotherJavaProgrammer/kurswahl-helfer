<script lang="ts">
    import type { AppContext } from "src/App.svelte";
    import type { AssignmentData } from "src/assignCourses";
    import type { AnnotatedData } from "src/collectAnnotatedData";
    import { getContext } from "svelte";

    const { goToOptions, showResults } = getContext(
        "kurswahl-helfer-triggers"
    ) as AppContext;
    const { close } = getContext("simple-modal");

    export let assignmentData: AssignmentData;

    function options() {
        close();
        goToOptions(assignmentData.rawData);
    }

    function view() {
        close();
        showResults(assignmentData);
    }
</script>

<section>
    <h1>Wie möchten Sie fortfahren?</h1>
    <p>
        Die Daten wurden erfolgreich geladen. Sie haben nun die Möglichkeit, die
        Rohdaten erneut zu verarbeiten und von vorn zu beginnen oder die bereits
        berechneten Kurszuteilungen jetzt anzuzeigen.
    </p>
    <b>Möchten Sie die Kurszuteilungen anzeigen?</b>
    <p class="button-list">
        <button on:click={options}>Erneut konfigurieren</button>
        <button class="btn-right" on:click={view}>Zuteilungen anzeigen</button>
    </p>
</section>

<style>
    section {
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .button-list {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .btn-right {
        background-color: var(--orange);
        border-color: var(--magic-magenta);
    }

    .btn-right:hover {
        background-color: var(--dark-orange);
        border-color: var(--magic-magenta);
    }

    .btn-right:active {
        background-color: var(--magic-magenta);
        border-color: var(--orange);
    }
</style>
