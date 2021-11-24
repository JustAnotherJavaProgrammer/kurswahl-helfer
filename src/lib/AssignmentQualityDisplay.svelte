<script lang="ts">
    import type { AssignmentQuality } from "src/assignCourses";

    export let quality: AssignmentQuality;
</script>

<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Wahl Nr.</th>
                <th>Schülern zugeteilt</th>
            </tr>
        </thead>
        <tbody>
            {#each quality.gotChoice as studentCount, choiceNo}
                <tr>
                    <td>
                        {choiceNo == quality.gotChoice.length - 1
                            ? "Keine"
                            : choiceNo + 1}
                    </td>
                    <td>{studentCount}</td>
                </tr>
            {/each}
        </tbody>
        <tfoot>
            <tr>
                <th>Durchschnitt</th>
                <th>{(quality.avg + 1).toFixed(2).replace(".", ",")}</th>
            </tr>
        </tfoot>
    </table>
</div>
