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