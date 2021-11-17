<script type="ts">
    import type { AnnotatedData } from "src/collectAnnotatedData";
    import collect from "../collectAnnotatedData";
    import { createEventDispatcher, getContext } from "svelte";
    import { fade } from "svelte/transition";
    import SaveWarning from "./SaveWarning.svelte";

    const errAOK = "Alles in Ordnung!";
    const dispatch = createEventDispatcher();
    function returnToLoader() {
        dispatch("returnToLoader");
    }

    function sanityCheck() {
        return (
            !(rawData == null && annotatedData == null) ||
            rawData.length < 2 ||
            rawData[0].length == 0
        );
    }

    function checkPartOne(): boolean {
        // Check for double selections or jumps in the numbers
        let result = !choiceNos
            .filter((no) => no > 0)
            .sort((a, b) => a - b)
            // .filter((no, i, arr) => {
            //     if (i === 0) console.log(arr);
            //     return true;
            // })
            .some((no, i, arr) => {
                if ((i === 0 && no !== 1) || (i > 0 && no - arr[i - 1] !== 1)) {
                    if (i === 0) {
                        errorMessage = `Es gibt keine Erstwahl.`;
                    } else {
                        switch (no - arr[i - 1]) {
                            case 0:
                                errorMessage = `Es gibt mehrere ${no}. Wahlen.`;
                                break;
                            default:
                                errorMessage = `Es gibt eine ${no}. Wahl, aber keine ${
                                    arr[i - 1] + 1
                                }. Wahl.`;
                        }
                    }
                    return true;
                }
                return false;
            });
        if (result && !choiceNos.some((no) => no > 0)) {
            errorMessage = `Es gibt keine Erstwahl.`;
            result = false;
        }
        if (result) errorMessage = errAOK;
        return result;
    }

    function checkPartTwo(): boolean {
        let result = !annotatedData.courses.some((course) => {
            if (course.minCapacity > course.maxCapacity) {
                errorMessage = `Die minimale Auslastung von "${course.name}" liegt mit ${course.minCapacity} höher als die maximale Auslastung des Kurses von ${course.maxCapacity}.`;
                return true;
            }
        });
        if (
            result &&
            (annotatedData.courses.length == 0 ||
                annotatedData.people.length == 0)
        ) {
            errorMessage = `Es gibt keine ${
                annotatedData.courses.length == 0 ? "Kurse" : "Personen"
            }!`;
            result = false;
        } else if (
            result &&
            annotatedData.courses.reduce(
                (acc, course) => acc + course.maxCapacity,
                0
            ) < annotatedData.people.length
        ) {
            errorMessage = "Es gibt mehr Schüler als Kursplätze.";
            result = false;
        }
        if (result) errorMessage = errAOK;
        return result;
    }

    function goToPartTwo() {
        if (checkPartOne()) {
            partOne = false;
            annotatedData = collect(rawData, choiceNos);
            checkPartTwo();
        }
    }

    function goBackToPartOne() {
        partOne = true;
        checkPartOne();
    }

    const { open } = getContext("simple-modal");
    function showWarningBeforeContinue() {
        if (checkPartTwo) {
            open(SaveWarning, { annotatedData });
        }
    }

    export let annotatedData: AnnotatedData = null;
    export let rawData: string[][] =
        annotatedData == null ? null : annotatedData.rawData;
    let partOne = true;
    let choiceNos: number[] = [];

    for (const raw of rawData[0]) {
        if (raw.endsWith("wunsch")) {
            if (raw === "Erstwunsch") {
                choiceNos.push(1);
                continue;
            }
            if (raw === "Zweitwunsch") {
                choiceNos.push(2);
                continue;
            }
            if (raw === "Drittwunsch") {
                choiceNos.push(3);
                continue;
            }
        }
        choiceNos.push(0);
    }

    let errorMessage = errAOK;
    checkPartOne();
</script>

<article>
    <section class="width-limited">
        <h1>Schritt 3: Daten annotieren</h1>
        {#if !sanityCheck()}
            <span class="error"
                >Es sind keine Daten geladen. Bitte kehren gehen Sie zurück, um
                Daten zu laden.</span
            ><br />
            <button class="btn-left" on:click={returnToLoader}>Zurück</button>
        {:else if partOne}
            <section
                class="subsectionForFadeout"
                in:fade={{ delay: 400, duration: 400 }}
                out:fade={{ duration: 400 }}
            >
                In diesem Schritt geht es darum, den importierten Daten ihre
                Funktion zuzuteilen. Geben Sie dazu in der ersten Zeile jeweils
                an, ob es sich um eine Erstwahl, Zweitwahl, Drittwahl, usw.
                handelt. Lassen Sie das Zahlenfeld einfach auf 0, wenn es sich
                dabei nicht um einen Kurswunsch handelt.
                <br />
                Wenn Sie fertig sind, klicken Sie auf "Weiter". Der Kasten unter
                dieser Erklärung zeigt Ihnen, was Sie noch tun müssen.
                <div class="continue-wrapper">
                    <p class="info-box" id="errDisplayBoxPartOne">
                        {errorMessage}
                    </p>
                    <button
                        class="btn-right"
                        disabled={errorMessage !== errAOK}
                        on:click={goToPartTwo}>Weiter</button
                    >
                </div>
            </section>
        {:else}
            <section
                class="subsectionForFadeout"
                in:fade={{ delay: 400, duration: 400 }}
                out:fade={{ duration: 400 }}
            >
                Bitte bestimmen Sie jetzt die minimale und maximale Belegung der
                Kurse. Wenn Sie fertig sind, klicken Sie auf "Kurse zuteilen".<br
                />
                <section id="courses-listed-subsection" class="info-box">
                    <h3>Hinweis zu den angezeigten Kursen</h3>
                    Es kann vorkommen, dass manche angebotenen Kurse weder als Erst-
                    oder Zweitwahl, noch als Drittwahl (usw.) angeboten werden. Da
                    diese Kurse nicht in den exportierten Daten enthalten sind, werden
                    sie in der Tabelle unten nicht angezeigt.
                </section>
                <div class="continue-wrapper">
                    <button class="btn-left" on:click={goBackToPartOne}
                        >Zurück</button
                    >
                    <p class="info-box" id="errDisplayBoxPartTwo">
                        {errorMessage}
                    </p>
                    <button
                        class="btn-right"
                        disabled={errorMessage !== errAOK}
                        on:click={showWarningBeforeContinue}
                        >Kurse zuteilen</button
                    >
                </div>
            </section>
        {/if}
    </section>
    {#if sanityCheck()}
        <div class="table-container">
            {#if partOne}
                <table
                    in:fade={{ delay: 400, duration: 400 }}
                    out:fade={{ duration: 400 }}
                >
                    <thead
                        ><tr>
                            {#each rawData[0] as column, cIndex}
                                <th>
                                    {column}<br />
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        bind:value={choiceNos[cIndex]}
                                        on:change={checkPartOne}
                                        placeholder="0"
                                    />
                                </th>
                            {/each}
                        </tr></thead
                    >
                    <tbody>
                        {#each rawData as cells, rowIndex}
                            {#if rowIndex != 0}
                                <tr>
                                    {#each cells as cell}
                                        <td>{cell}</td>
                                    {/each}
                                </tr>
                            {/if}
                        {/each}
                    </tbody>
                </table>
            {:else}
                <table
                    in:fade={{ delay: 400, duration: 400 }}
                    out:fade={{ duration: 400 }}
                >
                    <thead>
                        <tr>
                            <th>Kursname</th>
                            <th>min. Belegung</th>
                            <th>max. Belegung</th>
                            {#each annotatedData.choiceIndices as choiceNo, i}
                                <th>{i + 1}. Wahl</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each annotatedData.courses as course}
                            <tr>
                                <td>{course.name}</td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        max="500"
                                        bind:value={course.minCapacity}
                                        on:change={checkPartTwo}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        min="1"
                                        max="500"
                                        bind:value={course.maxCapacity}
                                        on:change={checkPartTwo}
                                    />
                                </td>
                                {#each course.choices as indexList}
                                    <td>{indexList.length}</td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colspan="3">Summe</th>
                            {#each annotatedData.choiceIndices as choiceNo, i}
                                <th
                                    >{annotatedData.courses.reduce(
                                        (prev, currVal) =>
                                            prev + currVal.choices[i].length,
                                        0
                                    )}</th
                                >
                            {/each}
                        </tr>
                    </tfoot>
                </table>
            {/if}
        </div>
    {/if}
    <!-- {choiceNos.toString()} -->
</article>

<style>
    article {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        max-width: 100%;
    }

    section {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
    }

    .continue-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
    }

    .table-container {
        overflow: auto;
        max-width: 100%;
    }

    table,
    th,
    td {
        border: 0.2em solid var(--dark-green);
        border-collapse: collapse;
    }

    th,
    td {
        padding: 0.1em;
    }

    thead th {
        /* border-color: var(--orange);
        border-top-color: var(--dark-green); */
        background-color: var(--light-blue);
        color: white;
    }

    tfoot th {
        background-color: var(--magic-magenta);
        color: white;
    }

    /* thead > tr > th:first-child {
        border-left-color: var(--dark-green);
    }

    thead > tr > th:last-child {
        border-right-color: var(--dark-green);
    } */

    table {
        margin-top: 0.5em;
        margin-bottom: 0.5em;
    }

    #errDisplayBoxPartOne,
    #errDisplayBoxPartTwo {
        display: inline-block;
    }

    input::placeholder {
        color: black;
        opacity: 1;
    }

    button:disabled {
        cursor: default;
    }
</style>
