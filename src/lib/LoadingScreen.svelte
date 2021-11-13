<script type="ts">
</script>

<section class="limited-width">
    <slot name="title"><h1>Bitte warten Sie einen Moment...</h1></slot>
    <p><slot>Dies kann einen Moment dauern...</slot></p>
    <slot name="progress">
        <div class="spinner" />
    </slot>
</section>

<style>
    section {
        display: flex;
        align-items: center;
        flex-direction: column;
        align-content: center;
    }

    .spinner {
        border: 1.5em solid var(--light-blue);
        border-top-color: var(--magic-magenta);
        border-right-color: var(--fresh-yellow);
        border-bottom-color: var(--dark-green);
        width: 10em;
        height: 10em;
        border-radius: 50%;
        border-style: solid;
        animation: spin 10s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    }

    .spinner::before {
        content: "";
        position: absolute;
        border: 2em solid var(--light-blue);
        border-top-color: var(--magic-magenta);
        border-right-color: var(--fresh-yellow);
        border-bottom-color: var(--dark-green);
        top: 15%;
        left: 15%;
        right: 15%;
        bottom: 15%;
        border-radius: 50%;
        border-style: solid;
        animation: spin 5s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite
            reverse;
    }

    .spinner::after {
        content: "";
        background-color: var(--orange);
        position: absolute;
        border-radius: 50%;
        width: 1.5em;
        height: 1.5em;
        left: 4.25em;
        top: 4.25em;
        /* transform: translate(0, 4.25em); */
        animation: translated-spin 15s cubic-bezier(0.68, -0.55, 0.265, 1.55)
            infinite reverse;
    }

    @keyframes translated-spin {
        from {
            transform: rotate(0deg) translate(0, 4.25em);
        }

        to {
            transform: rotate(360deg) translate(0, 4.25em);
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }
</style>
