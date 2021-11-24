<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { AssignmentData } from "./assignCourses";
    import AssignmentQualityDisplay from "./lib/AssignmentQualityDisplay.svelte";

    const dispatch = createEventDispatcher();
    export let assignmentData: AssignmentData = null;
    let assignmentNo = -1;
    const columnVisible: boolean[] = assignmentData?.rawData[0]?.map((name) =>
        name.toLowerCase().includes("name")
    );

    console.log(assignmentData.assignments);
    if (assignmentData != null && assignmentData.assignments.length == 1)
        assignmentNo = 0;

    function goToHome() {
        dispatch("goToHome");
    }

    function changeColumnVisibility(column: number, visible: boolean) {
        columnVisible[column] = visible;
    }

    // TODO: implement sorting
</script>

<section class="outer-section">
    <h1>Schritt 5: Kurszuteilungen anzeigen</h1>
    {#if assignmentData == null || assignmentData.assignments.length == 0}
        <p class="info-box">
            Bei der Kurszuteilung scheint ein Fehler aufgetreten zu sein.
        </p>
        <button class="btn-home" on:click={goToHome}>Zurück zum Start</button>
    {:else if assignmentNo < 0}
        TODO
    {:else}
        <h3>Allgemeine Informationen</h3>
        <AssignmentQualityDisplay
            quality={assignmentData.assignments[assignmentNo].quality}
        />
        <section class="info-box">
            <h3>Anzeigeoptionen</h3>
            <h4>Spalten zum Anzeigen auswählen:</h4>
            <div id="columnList">
                {#each assignmentData.rawData[0] as columnName, columnIndex}
                    <input
                        type="checkbox"
                        id="dataColumn-{columnName}"
                        checked={columnVisible[columnIndex]}
                        on:change={(e) => {
                            changeColumnVisibility(
                                columnIndex,
                                e.currentTarget.checked
                            );
                        }}
                    />
                    <label for="dataColumn-{columnName}">{columnName}</label>
                    <br />
                {/each}
            </div>
            <h4>Sortierung</h4>
            <div id="sorting-list">
                <span>
                    <label for="course-order">Kurse sortieren nach: </label>
                    <select id="course-order">
                        <option>Kursgröße</option>
                        <option>Kursname (alphabetisch)</option>
                    </select>
                </span>
                <br />
                <span>
                    <label for="student-order"
                        >Kursteilnehmer sortieren nach:
                    </label>
                    <select id="student-order">
                        {#each assignmentData.rawData[0] as column, columnIndex}
                            <option value={columnIndex}>{column}</option>
                        {/each}
                    </select>
                </span>
            </div>
        </section>
        <h2>Kurslisten</h2>
        {#each assignmentData.assignments[assignmentNo].courseAssignments as course, courseIndex}
            <h3>{assignmentData.courses[courseIndex]}</h3>
            {#if course.length > 0}
                {#if columnVisible.some((visible) => visible)}
                    <table>
                        <thead>
                            <tr>
                                {#each columnVisible as visible, index}
                                    {#if visible}
                                        <th
                                            >{assignmentData.rawData[0][
                                                index
                                            ]}</th
                                        >
                                    {/if}
                                {/each}
                            </tr>
                        </thead>
                        <tbody>
                            {#each course as studentIndex}
                                <tr>
                                    {#each columnVisible as visible, index}
                                        {#if visible}
                                            <td
                                                >{assignmentData.people[
                                                    studentIndex
                                                ].rawData[index]}</td
                                            >
                                        {/if}
                                    {/each}
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                {:else}
                    <p class="info-box">
                        Dieser Kurs hat {course.length} Teilnehmer. Bitte wählen
                        Sie in den Anzeigeoptionen Spalten zum Anzeigen aus, um mehr
                        Informationen zu erhalten.
                    </p>
                {/if}
            {:else}
                <p class="info-box">Dieser Kurs findet nicht statt.</p>
            {/if}
        {/each}
    {/if}
</section>

<style>
    .outer-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        margin: 0 auto;
        flex-wrap: nowrap;
        max-width: 100%;
    }

    #columnList,
    #sorting-list {
        text-align: left;
    }
</style>
