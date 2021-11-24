<script lang="ts">
    import type { AssignmentData } from "src/assignCourses";
    import assignCourses from "../assignCourses";
    import type { AnnotatedData } from "src/collectAnnotatedData";

    import { createEventDispatcher } from "svelte";
    import LoadingScreen from "./LoadingScreen.svelte";
    import AssignmentWorker from "../assignCourses?worker";

    const dispatch = createEventDispatcher();
    export let data: AnnotatedData;
    let progress = 0n;

    if (window.Worker) {
        const assignmentWorker = new AssignmentWorker();
        assignmentWorker.addEventListener("message", (e) => {
            if (e.data.type === 0) {
                done(e.data.result);
            } else if (e.data.type == 1) {
                progress = e.data.counter;
            }
        });
        assignmentWorker.addEventListener("error", (e) => {
            console.error(e);
            done(null);
        });
        assignmentWorker.postMessage(data);
    } else {
        setTimeout(() => {
            try {
                done(assignCourses(data));
            } catch (e) {
                console.error(e);
                done(null);
            }
        });
    }

    function done(data: AssignmentData) {
        dispatch("done", data);
    }
</script>

<LoadingScreen>
    <h1 slot="title">Schritt 4: Kurse zuteilen</h1>
    {#if progress > 0}
        {progress} Möglichkeit{progress == 1n ? "" : "en"} berechnet...
    {/if}
</LoadingScreen>
