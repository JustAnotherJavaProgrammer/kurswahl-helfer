import type { AssignmentData } from "./assignCourses";

export default function parse(csv: string, separator = ","): string[][] {
    // regex to match the separator, if it is not surrounded by quotes or escaped

    // A simple one-liner is enough for my purposes, but a slightly more complex solution might become necessary in the future
    return csv.split(/\r?\n/g).map(line => line.trim()).map(line => {
        // create an array of strings, each representing a cell
        let cells: string[] = [];
        let currentCell = "";
        let inQuotes = false;
        let escaped = false;
        for (let i = 0; i < line.length; i++) {
            let currentChar = line[i];
            if (currentChar === '"') {
                if (escaped) {
                    currentCell += currentChar;
                    escaped = false;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (currentChar === "\\") {
                if (escaped) {
                    currentCell += currentChar;
                    escaped = false;
                } else {
                    escaped = true;
                }
            } else if (currentChar === separator && !inQuotes) {
                cells.push(currentCell);
                currentCell = "";
            } else {
                currentCell += currentChar;
                escaped = false;
            }
        }
        cells.push(currentCell);
        return cells;
        // The code above was created by GitHub Copilot. Thanks, Copilot!
    }).filter(line => line.some(cell => cell.length > 0));
}

const separator = ";";

export function exportToCsv(assignmentData: AssignmentData, assignmentNo: number, columnVisible: boolean[], courseOrder: number[], studentOrder: number[][]): string {
    const lineBreak = "\n";
    let csv = "";
    for (const courseNo of courseOrder) {
        csv += lineBreak;
        csv += quotes(assignmentData.courses[courseNo]);
        csv += lineBreak;
        if (studentOrder[courseNo].length > 0) {
            for (const [columnNo, visible] of columnVisible.entries()) {
                if (visible) {
                    csv += quotes(assignmentData.rawData[0][columnNo]);
                    csv += separator;
                }
            }
            csv += lineBreak;
            for (const studentNo of studentOrder[courseNo]) {
                for (const [columnNo, visible] of columnVisible.entries()) {
                    if (visible) {
                        csv += quotes(assignmentData.people[studentNo].rawData[columnNo]);
                        csv += separator;
                    }
                }
                csv += lineBreak;
            }
            csv += "Kursgr\u00f6\u00dfe" + separator + studentOrder[courseNo].length;
            csv += lineBreak;
        } else {
            csv += quotes("Dieser Kurs findet nicht statt.");
            csv += lineBreak;
        }
        csv += lineBreak;
    }
    return csv.trim();
}

function quotes(str: string): string {
    if (str == null)
        return "";
    if (!str.includes(separator))
        return str;
    return "\"" + str.replace(/"/g, "\"\"") + "\"";
}