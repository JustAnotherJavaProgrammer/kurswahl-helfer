import type { AnnotatedData } from "./collectAnnotatedData";

export default function assignCourses(data: AnnotatedData): AnnotatedData {
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
    // Step 2: identify overcrowded courses
    const overcrowded = new Map<number, number[]>(); // Map<courseIndex, personIndex>
    for (const [i, course] of data.courses.entries()) {
        if (course.choices[0].length > course.maxCapacity) {
            overcrowded.set(i, []);
        }
    }
    // Step 3: identify courses where there are too few people
    const underpopulated = new Map<number, number[]>();
    for (const [i, course] of data.courses.entries()) {
        if (course.choices[0].length < course.minCapacity) {
            underpopulated.set(i, []);
        }
    }
    // Step 4: identify people in overcrowded courses who have chosen an underpopulated course as their second choice
    // TODO: implement the step described above
    // TODO: implement the other steps required to finish the process

    return data;
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

function deleteElementAt(arr: any[], index: number) {
    arr.splice(index, 1);
}