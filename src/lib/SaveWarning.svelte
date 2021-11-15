<script type="ts">
    import type { AppContext } from "src/App.svelte";

    import type { AnnotatedData } from "src/collectAnnotatedData";
    import { getContext } from "svelte";
    import { exportData as exportAnnotatedData } from "../collectAnnotatedData";
    const { close} = getContext("simple-modal");

    export let annotatedData: AnnotatedData;

    function exportData() {
        exportAnnotatedData(
            annotatedData,
            "Kurswahl-Helfer_Zwischenstand.json"
        );
    }

    const { startAssignment } = getContext(
        "kurswahl-helfer-triggers"
    ) as AppContext;
    function triggerAssignment() {
        close();
        startAssignment(annotatedData);
    }
</script>

<section>
    <h1>Bevor es weiter geht...</h1>
    <p>
        Das Zuteilen der Kurse kann einige Zeit in Anspruch nehmen. Deshalb
        empfehlen wir Ihnen, Ihren aktuellen Arbeitsstand zwischenzuspeichern.<br
        />So können Sie die Berechnung auch später durchführen oder mit den
        gleichen Einstellungen wiederholen, sollte ein Fehler auftreten.
    </p>
    <b> Möchten Sie jetzt Zwischenspeichern? </b>
    <p class="button-list">
        <button class="btn-save" on:click={exportData}>Zwischenspeichern</button
        >
        <button class="btn-right" on:click={triggerAssignment}
            >Kurse zuteilen</button
        >
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
