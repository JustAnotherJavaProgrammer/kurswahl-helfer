<script lang="ts">
    import type { AppContext } from "src/App.svelte";
    import type { AnnotatedData } from "src/collectAnnotatedData";
    import { getContext } from "svelte";

    const { goToOptions, startAssignment } = getContext(
        "kurswahl-helfer-triggers"
    ) as AppContext;
    const { close } = getContext("simple-modal");

    export let annotatedData: AnnotatedData;

    function options() {
        close();
        goToOptions(annotatedData.rawData);
    }

    function assign() {
        close();
        startAssignment(annotatedData);
    }
</script>

<section>
    <h1>Wie möchten Sie fortfahren?</h1>
    <p>
        Die Daten wurden erfolgreich geladen. Sie haben nun die Möglichkeit, die
        bereits vorgenommenen Einstellungen aus Schritt 3 (Daten annotieren) zu
        verwerfen und dort zu beginnen, oder die Zuteilung der Kurse mit den
        gespeicherten Einstellungen jetzt zu starten.<br />
        Die Zuteilung der Kurse kann einige Zeit in Anspruch nehmen.
    </p>
    <b> Möchten Sie jetzt Zwischenspeichern? </b>
    <p class="button-list">
        <button class="btn-save" on:click={options}>Erneut konfigurieren</button
        >
        <button class="btn-right" on:click={assign}>Kurse zuteilen</button>
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
