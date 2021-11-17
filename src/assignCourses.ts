import type { AnnotatedData, Course } from "./collectAnnotatedData";

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
    const overcrowded = getOvercrowdedCourses(data.courses);
    // Step 3: identify courses where there are too few people
    const underpopulated = getUnderpopulatedCourses(data.courses);
    // Step 4: identify people in overcrowded courses who have chosen an underpopulated course as their second choice
    

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

function getOvercrowdedCourses(courses: Course[]): number[] {
    return courses.filter(course => course.choices[0].length > course.maxCapacity).map(course => courses.findIndex(c => c.name == course.name));
}

function getUnderpopulatedCourses(courses: Course[]): number[] {
    return courses.filter(course => course.choices[0].length < course.minCapacity).map(course => courses.findIndex(c => c.name == course.name));
}

function deleteElementAt(arr: any[], index: number) {
    arr.splice(index, 1);
}