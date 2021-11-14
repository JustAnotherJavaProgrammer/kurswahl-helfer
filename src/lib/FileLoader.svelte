<script type="ts">
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
    let input: HTMLInputElement;
    let button: HTMLButtonElement;
    let errorMessage: HTMLSpanElement;

    function openFileSelectionDialog() {
        if (input) input.click();
    }

    function preventDefaultPropagation(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();
    }

    function onFileDrop(event: Event) {
        preventDefaultPropagation(event as DragEvent);
        loadFile(event);
    }

    function loadFile(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                dispatch("file-loaded", reader.result);
            };
            reader.onerror = () => {
                setDisabled(false);
                if (errorMessage) errorMessage.classList.remove("hidden");
            };
            reader.readAsText(file, "windows-1252");
            setDisabled(true);
        }
    }

    function setDisabled(disabled: boolean) {
        if (input) input.disabled = disabled;
        if (button) button.disabled = disabled;
    }
</script>

<section id="outer" class="limited-width">
    <h1>Schritt 1: CSV-Datei laden</h1>
    <p>
        Bitte klicken Sie jetzt auf "Detei laden" und wählen Sie die exportierte
        CSV-Datei aus.<br />
        <a
            href="https://iserv.de/doc/modules/course-selection/#export"
            target="blank"
            >Wie exportiere ich die Daten aus dem Kurswahl-Menü?</a
        ><br />
    </p>
    <section id="privacy" class="info-box">
        <h3>Hinweis zum Datenschutz</h3>
        Sämtliche Datenverarbeitung findet auf Ihrem Gerät statt. Es werden keine
        Daten dauerhaft gespeichert oder an Server gesendet.
    </section>
    <span>
        <input
            type="file"
            accept=".csv"
            bind:this={input}
            on:change={loadFile}
        />
        <button
            class="btn-upload"
            on:click={openFileSelectionDialog}
            on:dragenter={preventDefaultPropagation}
            on:dragover={preventDefaultPropagation}
            on:drop={onFileDrop}
            bind:this={button}>Datei laden</button
        >
        <span class="hidden error" bind:this={errorMessage}
            >Beim Laden der Datei ist ein Fehler aufgetreten. Bitte versuchen
            Sie es erneut.</span
        >
    </span>
</section>

<style>
    #outer {
        display: flex;
        flex-direction: column;
    }

    button {
        align-self: center;
    }

    input {
        display: none;
    }
</style>
