export default function collect(rawData: string[][], choiceNos: number[]): AnnotatedData {
    const data: Partial<AnnotatedData> = { rawData: rawData, people: [] };
    data.choiceIndices = [];
    const maxChoice = choiceNos.reduce((prev, curr) => Math.max(prev, curr), 0);
    for (let i = 1; i <= maxChoice; i++) {
        data.choiceIndices.push(choiceNos.indexOf(i));
    }
    const courses = new Map<string, Course>();
    const prePeople: { rawData: string[], choices: string[] }[] = [];
    for (const [index, row] of rawData.entries()) {
        // Ignore the column headers
        if (index == 0)
            continue;
        const person: typeof prePeople[number] = { rawData: row, choices: [] };
        for (const [choiceNo, choiceIndex] of data.choiceIndices.entries()) {
            person.choices.push(row[choiceIndex]);
            if (!courses.has(row[choiceIndex])) {
                courses.set(row[choiceIndex], generateCourse(row[choiceIndex], data.choiceIndices.length));
            }
            courses.get(row[choiceIndex]).choices[choiceNo].push(index-1);
        }
        prePeople.push(person);
    }
    data.courses = Array.from(courses.values()) /* One-liner to sort strings alphabetically (case-insensitive) found on StackOverflow: https://stackoverflow.com/a/67992215/13614747 */
        .sort((a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
    data.people = prePeople.map(person => ({ rawData: person.rawData, choices: person.choices.map(courseName => data.courses.findIndex(course => course.name == courseName)) }));
    // console.log(data);
    return data as AnnotatedData;
}

export function generateCourse(name: string, numberOfChoices: number): Course {
    return { name: name, choices: empty2DArray(numberOfChoices), minCapacity: 1, maxCapacity: 10 };
}

function empty2DArray(length: number) {
    const arr = [];
    for (let i = 0; i < length; i++) {
        arr.push([]);
    }
    return arr;
}

export function exportData(data: AnnotatedData, fileName: string) {
    const json = JSON.stringify({type: 0, data});
    const blob = new Blob([json], { type: 'text/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    triggerDownload(url, fileName);
    URL.revokeObjectURL(url);
}

export function triggerDownload(url: string, fileName: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
}

export function importData(json: string): AnnotatedData {
    const data = JSON.parse(json) as {type: number, data: AnnotatedData};
    if (data.type != 0)
        throw new Error('Invalid file type');
    return data.data;
}

export type AnnotatedData = {
    rawData: string[][],
    choiceIndices: number[],
    courses: Course[],
    people: Person[],
}

export type Course = {
    name: string,
    choices: number[][],
    assigned?: number[],
    minCapacity: number,
    maxCapacity: number
}

export type Person = {
    choices: number[],
    rawData: string[],
    assignedCourse?: string,
}