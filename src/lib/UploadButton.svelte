<script lang="ts">
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    let input: HTMLInputElement;
    let errorMessage: HTMLSpanElement;
    let button: HTMLButtonElement;
    export let textFormat = "utf-8";
    export let accept = "*";

    export let loader = (
        event: Event,
        setDisabled: (disabled: boolean) => void,
        onError: () => void
    ) => {
        const file = (event.target as HTMLInputElement).files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                dispatch("file-loaded", reader.result);
            };
            reader.onerror = onError;
            reader.readAsText(file, textFormat);
            setDisabled(true);
        }
    };

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
        setDisabled(true);
        loader(event, setDisabled, () => {
            errorMessage.classList.remove("hidden");
            setDisabled(false);
        });
    }

    function setDisabled(disabled: boolean) {
        if (input) input.disabled = disabled;
        if (button) button.disabled = disabled;
    }
</script>

<span>
    <input type="file" accept={accept} bind:this={input} on:change={loadFile} />
    <button
        class="btn-upload"
        on:click={openFileSelectionDialog}
        on:dragenter={preventDefaultPropagation}
        on:dragover={preventDefaultPropagation}
        on:drop={onFileDrop}
        bind:this={button}
    >
        <slot>Datei laden</slot>
    </button>
    <span class="hidden error" bind:this={errorMessage}>
        >Beim Laden der Datei ist ein Fehler aufgetreten. Bitte versuchen Sie es
        erneut.</span
    >
</span>

<style>
    input {
        display: none;
    }
</style>
