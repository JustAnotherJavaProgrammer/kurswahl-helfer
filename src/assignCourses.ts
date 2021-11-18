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
    for(const courseSizes of courseSizeGenerator(constraints)) {

    }
}

function* courseSizeGenerator(constraints: Pick<Constraints, "legalSizes" | "sum">) {
    const state = constraints.legalSizes.map(arr => 0);
    do {
        const cSizes = mapToValueAtIndex(state, constraints.legalSizes);
        const sum = cSizes.reduce(reduceToSum, 0);
        if (sum == constraints.sum) { // Check for sum criteria
            yield cSizes;
        }
        for(let i = 0; i < state.length; i++) {
            if(state[i]+1 < constraints.legalSizes[i].length) {
                state[i]++;
                break;
            }
            if(state[i] == constraints.legalSizes[i].length-1) {
                for(let j = 0; j < state.length; j++) {
                    state[j] = 0;
                }
                break;
            }
            state[i] = 0;
        }
    } while (state.some(num => num != num));
}

function evaluateAssignment(assignment: number[][], data: AnnotatedData): AssignmentQuality {
    const gotChoice = [0, ...data.courses[0].choices.map(choice => 0)];
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
    const avg = gotChoice.reduce(reduceToSum,0) / gotChoice.length;
    return { gotChoice, avg };
}

function mapToValueAtIndex<T>(indexArr: number[], referenceArr: T[][]): T[] {
    return indexArr.map((index, i) => referenceArr[i][index]);
}

function reduceToSum(acc: number, curr: number):number {
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