import MultiSetPermutationIterator from "multiset-permutation";
import type { AnnotatedData, Course } from "./collectAnnotatedData";

type Constraints = {
    sum: number,
    legalSizes: number[][],
    students: number[],
}

type AssignmentQuality = {
    gotChoice: number[],
    avg: number,
}

export default function assignCourses(data: AnnotatedData): AnnotatedData {
    {
        const alreadyAssigned = new Set<number>();
        // Step 1: Assign people to courses, where there definitely are enough members and not too many.
        for (const course of data.courses) {
            if (course.choices[0].length >= course.minCapacity && course.choices[0].length <= course.maxCapacity) {
                course.assigned = course.choices[0];
                for (const personId of course.assigned) {
                    alreadyAssigned.add(personId);
                    data.people[personId].assignedCourse = course.name;
                }
            }
        }
        purgeSet(data, alreadyAssigned);
        alreadyAssigned.clear();
    }
    const constraints = generateConstraints(data);
    const possibleAssignments = bruteForce(data, constraints);
    console.log(possibleAssignments);
    return data; // TODO: create type AssignedData and allow for an array of solutions
}

function purgeSet(data: AnnotatedData, alreadyAssigned: Set<number>): AnnotatedData {
    for (const course of data.courses) {
        if (!course.assigned) {
            for (const choices of course.choices) {
                for (let i = 0; i < choices.length; i++) {
                    if (alreadyAssigned.has(choices[i])) {
                        deleteElementAt(choices, i);
                        i--;
                    }
                }
            }
        }
    }
    return data;
}

function getOvercrowdedCourses(courses: Course[]): number[] {
    return courses.filter(course => course.choices[0].length > course.maxCapacity).map(course => courses.findIndex(c => c.name == course.name));
}

function getUnderpopulatedCourses(courses: Course[]): number[] {
    return courses.filter(course => course.choices[0].length < course.minCapacity).map(course => courses.findIndex(c => c.name == course.name));
}

function generateConstraints(data: AnnotatedData): Constraints {
    // identify overcrowded courses
    const overcrowded = getOvercrowdedCourses(data.courses);
    // identify courses where there are too few people
    const underpopulated = getUnderpopulatedCourses(data.courses);
    const students = data.people.map((person, i) => person.assignedCourse ? -1 : i).filter(person => person != -1);
    const sum = students.length;
    const legalSizes = data.courses.map((course, i) => {
        if (overcrowded.includes(i)) {
            return [course.maxCapacity];
        }
        if (underpopulated.includes(i)) {
            if (sum < course.minCapacity) {
                return [0];
            }
            return [0, ...arrayFromTo(course.minCapacity, Math.min(course.maxCapacity + 1, sum + 1))];
        }
        return arrayFromTo(0, Math.min(course.maxCapacity + 1 - course.assigned.length, sum + 1));
    });
    return { sum, legalSizes, students };
}

function bruteForce(data: AnnotatedData, constraints: Constraints): { courseAssignments: number[][], quality: AssignmentQuality }[] | void {
    let counter = 0n;
    const bestAssignments = [null, null, null];
    for (const courseSizes of courseSizeGenerator(constraints)) {
        for (const assignment of assignmentGenerator(courseSizes, constraints.students)) {
            const obj = { courseAssignments: assignment, quality: evaluateAssignment(assignment, data) };
            if (bestAssignments[0] == null || cmpAvgQuality(bestAssignments[0], obj.quality) > 0) {
                bestAssignments[0] = obj;
            }
            if (bestAssignments[1] == null || cmpMostFirstChoices(bestAssignments[1], obj.quality) > 0) {
                bestAssignments[1] = obj;
            }
            if (bestAssignments[2] == null || cmpLeastBad(bestAssignments[2], obj.quality) > 0) {
                bestAssignments[2] = obj;
            }
            counter++;
        }
    }
    // Remove possible duplicates
    return bestAssignments.filter((assignment, i) => i == bestAssignments.indexOf(assignment));
}

function* courseSizeGenerator(constraints: Pick<Constraints, "legalSizes" | "sum">) {
    const state = constraints.legalSizes.map(mapToZero);
    do {
        const cSizes = mapToValueAtIndex(state, constraints.legalSizes);
        const sum = cSizes.reduce(reduceToSum, 0);
        if (sum == constraints.sum) { // Check for sum criteria
            yield cSizes;
        }
        for (let i = 0; i < state.length; i++) {
            if (state[i] + 1 < constraints.legalSizes[i].length) {
                state[i]++;
                break;
            }
            if (state[i] == constraints.legalSizes[i].length - 1) {
                for (let j = 0; j < state.length; j++) {
                    state[j] = 0;
                }
                break;
            }
            state[i] = 0;
        }
    } while (state.some(num => num != num));
}

function* assignmentGenerator(courseSizes: number[], students: number[]) {
    const assignedIds = [];
    for (const [size, i] of courseSizes.entries()) {
        for (let i = 0; i < size; i++) {
            assignedIds.push(i);
        }
    }
    const permGen = new MultiSetPermutationIterator(assignedIds);
    while (permGen.hasNext()) {
        const arr = [];
        for (let i = 0; i < courseSizes.length; i++) {
            arr.push([]);
        }
        const permNext = permGen.next();
        for (const [studentNo, courseId] of permNext.entries()) {
            arr[courseId].push(students[studentNo]);
        }
        yield arr;
    }
}

function evaluateAssignment(assignment: number[][], data: AnnotatedData): AssignmentQuality {
    const gotChoice = [0, ...data.courses[0].choices.map(mapToZero)];
    for (const [courseId, students] of assignment.entries()) {
        for (const student of students) {
            const choiceIndex = data.people[student].choices.indexOf(courseId);
            if (choiceIndex >= 0) {
                gotChoice[choiceIndex]++;
                continue;
            }
            gotChoice[gotChoice.length - 1]++;
        }
    }
    const avg = gotChoice.reduce(reduceToSum, 0) / gotChoice.length;
    return { gotChoice, avg };
}

function cmpAvgQuality(a: AssignmentQuality, b: AssignmentQuality) {
    return a.avg - b.avg;
}

function cmpMostFirstChoices(a: AssignmentQuality, b: AssignmentQuality) {
    for (let i = 0; i < a.gotChoice.length; i++) {
        if (a.gotChoice[i] > b.gotChoice[i]) {
            return -1;
        }
        if (b.gotChoice[i] > a.gotChoice[i]) {
            return 1;
        }
    }
    return 0;
}

function cmpLeastBad(a: AssignmentQuality, b: AssignmentQuality) {
    for (let i = a.gotChoice.length - 1; i <= 0; i++) {
        if (a.gotChoice[i] < b.gotChoice[i]) {
            return -1;
        }
        if (b.gotChoice[i] < a.gotChoice[i]) {
            return 1;
        }
    }
    return 0;
}

function mapToZero() { return 0; }

function mapToSelf<T>(elem: T) { return elem; }

function mapToValueAtIndex<T>(indexArr: number[], referenceArr: T[][]): T[] {
    return indexArr.map((index, i) => referenceArr[i][index]);
}

function reduceToSum(acc: number, curr: number): number {
    return acc + curr;
}

function deleteElementAt(arr: any[], index: number) {
    arr.splice(index, 1);
}

function arrayFromTo(from: number, to: number): number[] {
    const arr = [];
    for (let i = from; i < to; i++) {
        arr.push(i);
    }
    return arr;
}