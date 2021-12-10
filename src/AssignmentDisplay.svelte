<script lang="ts">
    import { createEventDispatcher } from "svelte";

    import type { AssignmentData } from "./assignCourses";
    import { exportAssignedData, exportToFile } from "./collectAnnotatedData";
    import { exportToCsv } from "./csvParser";
    import AssignmentQualityDisplay from "./lib/AssignmentQualityDisplay.svelte";

    const dispatch = createEventDispatcher();
    export let assignmentData: AssignmentData = null;
    let assignmentNo = -1;
    const columnVisible: boolean[] = assignmentData?.rawData[0]?.map((name) =>
        name.toLowerCase().includes("name")
    );

    if (assignmentData != null && assignmentData.assignments.length == 1)
        assignmentNo = 0;

    function goToHome() {
        dispatch("goToHome");
    }

    function setAssignment(
        event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }
    ) {
        assignmentNo = parseInt(event.currentTarget.value);
    }

    function changeColumnVisibility(column: number, visible: boolean) {
        columnVisible[column] = visible;
    }

    function saveAllJson() {
        exportAssignedData(
            assignmentData,
            "Kurszuteilungen_Kurswahl-Helfer.json"
        );
    }

    function exportCsv() {
        exportToFile(
            "\ufeff" +
                exportToCsv(
                    assignmentData,
                    assignmentNo,
                    columnVisible,
                    courseOrder,
                    studentOrder
                ),
            `Kurszuteilung${
                assignmentData.assignments.length > 1
                    ? "_" + (assignmentNo + 1)
                    : ""
            }.csv`,
            "text/csv;charset=utf-8;"
        );
    }

    let courseSortBy: 0 | 1;
    let courseOrder: number[];
    $: courseOrder = assignmentData?.courses
        .map((name, index) => ({ name, index }))
        .sort((a, b) => {
            if (courseSortBy == 0) {
                const assignments =
                    assignmentData?.assignments.at(
                        assignmentNo
                    ).courseAssignments;
                return (
                    assignments[b.index].length - assignments[a.index].length
                );
            }
            return a.name.localeCompare(b.name);
        })
        .map((course) => course.index);
    let studentsSortBy: number;
    let studentOrder: number[][];
    console.log(assignmentData);
    $: {
        // console.log(studentsSortBy);
        studentOrder = assignmentData?.assignments
            .at(assignmentNo)
            .courseAssignments.map((courseList) =>
                courseList
                    .map((studentId) => ({
                        id: studentId,
                        value:
                            assignmentData?.people[studentId].rawData[
                                studentsSortBy ?? 0
                                // (() => {
                                //     console.log(studentsSortBy);
                                //     return 0;
                                // })()
                            ] ?? "0",
                    }))
                    .sort((a, b) => a.value.localeCompare(b.value))
                    .map((student) => student.id)
            );
    }
</script>

<section class="outer-section">
    <h1>Schritt 5: Kurszuteilungen anzeigen</h1>
    {#if assignmentData == null || assignmentData.assignments.length == 0}
        <p class="info-box">
            Bei der Kurszuteilung scheint ein Fehler aufgetreten zu sein.
        </p>
        <button class="btn-home" on:click={goToHome}>Zurück zum Start</button>
    {:else}
        <nav class="assignment-list">
            {#if assignmentNo >= 0}
                <button class="btn-left" value={-1} on:click={setAssignment}>
                    Zurück
                </button>
            {/if}
            <button class="btn-home" on:click={goToHome}
                >Zurück zum Start</button
            >
            <button class="btn-save" on:click={saveAllJson}
                >Zuteilungen speichern</button
            >
            {#if assignmentNo >= 0}
                <button class="btn-save" on:click={exportCsv}
                    >Zuteilung als .csv-Datei exportieren</button
                >
            {/if}
        </nav>
        {#if assignmentNo < 0}
            <p class="info-box">
                Es wurden mehrere gute Kurszuteilungen gefunden. Bitte wählen
                Sie nach Ihren Maßstäben eine Zuteilung aus, um sie anzuzeigen.<br
                />Keine Sorge, über den "Zurück"-Knopf können Sie jederzeit zu
                dieser Übersicht zurückkehren.
            </p>
            <div class="assignment-list">
                {#each assignmentData.assignments as assignment, assNo}
                    <div class="assignment-overview-box">
                        <AssignmentQualityDisplay
                            quality={assignment.quality}
                        />
                        <button value={assNo} on:click={setAssignment}
                            >Zuteilung anzeigen</button
                        >
                    </div>
                {/each}
            </div>
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
                        <label for="dataColumn-{columnName}">{columnName}</label
                        >
                        <br />
                    {/each}
                </div>
                <h4>Sortierung</h4>
                <div id="sorting-list">
                    <span>
                        <label for="course-order">Kurse sortieren nach: </label>
                        <select id="course-order" bind:value={courseSortBy}>
                            <option value="0" selected>Kursgröße</option>
                            <option value="1">Kursname (alphabetisch)</option>
                        </select>
                    </span>
                    <br />
                    <span>
                        <label for="student-order"
                            >Kursteilnehmer sortieren nach:
                        </label>
                        <select id="student-order" bind:value={studentsSortBy}>
                            {#each assignmentData.rawData[0] as column, columnIndex}
                                <option
                                    value={columnIndex}
                                    selected={columnIndex == 0}>{column}</option
                                >
                            {/each}
                        </select>
                    </span>
                </div>
            </section>
            <h2>Kurslisten</h2>
            {#each courseOrder as courseIndex}
                <h3>{assignmentData.courses[courseIndex]}</h3>
                {#if assignmentData.assignments[assignmentNo].courseAssignments[courseIndex].length > 0}
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
                                {#each studentOrder[courseIndex] as studentIndex}
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
                            <tfoot>
                                <tr>
                                    <th>Kursgröße</th>
                                    <th
                                        colspan={Math.max(
                                            columnVisible.reduce(
                                                (acc, curr) =>
                                                    acc + (curr ? 1 : 0),
                                                0
                                            ) - 1,
                                            1
                                        )}
                                    >
                                        {assignmentData.assignments[
                                            assignmentNo
                                        ].courseAssignments[courseIndex].length}
                                    </th>
                                </tr>
                            </tfoot>
                        </table>
                    {:else}
                        <p class="info-box">
                            Dieser Kurs hat {assignmentData.assignments[
                                assignmentNo
                            ].courseAssignments[courseIndex].length} Teilnehmer.
                            Bitte wählen Sie in den Anzeigeoptionen Spalten zum Anzeigen
                            aus, um mehr Informationen zu erhalten.
                        </p>
                    {/if}
                {:else}
                    <p class="info-box">Dieser Kurs findet nicht statt.</p>
                {/if}
            {/each}
        {/if}
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

    .assignment-list {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        max-width: 100%;
    }

    .assignment-overview-box {
        margin: 1em;
        text-align: center;
    }
</style>
