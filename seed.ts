import "dotenv/config";
import { faker } from "@faker-js/faker";
import { db } from "#/server/db/db";
import * as schema from "#/server/db/schema";
import { passwordHasher } from "#/server/modules/auth/services/password_hasher.service";


faker.seed(123);

const SCHOOL_NAME = "El Maarifa School";

function randomDateString(from: Date, to: Date) {
    return faker.date.between({ from, to }).toISOString().slice(0, 10);
}


async function main() {
    console.log("🌱 Seeding database...");

    await db.transaction(async (tx) => {
        // Optional cleanup. Keep this order because of foreign keys.
        await tx.delete(schema.studentMarksTable);
        await tx.delete(schema.assessmentsTable);
        await tx.delete(schema.assessmentPeriodsTable);
        await tx.delete(schema.resourcesTable);
        await tx.delete(schema.eventsTable);
        await tx.delete(schema.teacherAssignmentsTable);
        await tx.delete(schema.gradeSubjectsTable);
        await tx.delete(schema.studentsTable);
        await tx.delete(schema.teachersTable);
        await tx.delete(schema.subjectsTable);
        await tx.delete(schema.classesTable);
        await tx.delete(schema.gradesTable);
        await tx.delete(schema.adminsTable);
        await tx.delete(schema.sessionsTable);
        await tx.delete(schema.usersTable);

        // -------------------------
        // 1. Admin user
        // -------------------------
        const passwordHash = await passwordHasher.hashPassword("hashed-password")
        const [adminUser] = await tx
            .insert(schema.usersTable)
            .values({
                username: "Admin User",
                email: "admin@school.test",
                emailVerified: true,
                image: faker.image.avatar(),
                passwordHash,
                telNumber: faker.phone.number(),
                role: schema.UserRoleEnum.ADMIN,
                gender: schema.UserGenderEnum.MALE,
            })
            .returning();

        const [school] = await tx
            .insert(schema.adminsTable)
            .values({
                userId: adminUser.id,
                schoolName: SCHOOL_NAME,
                numberStudents: 80,
                numberTeachers: 8,
            })
            .returning();

        // -------------------------
        // 2. Grades
        // -------------------------
        const grades = await tx
            .insert(schema.gradesTable)
            .values([
                { schoolId: school.id, name: "1AM", levelOrder: 1, status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "2AM", levelOrder: 2, status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "3AM", levelOrder: 3, status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "4AM", levelOrder: 4, status: schema.StatusEnum.ACTIVE },
            ])
            .returning();

        // -------------------------
        // 3. Classes
        // -------------------------
        const classes = await tx
            .insert(schema.classesTable)
            .values(
                grades.flatMap((grade) =>
                    ["A", "B"].map((name) => ({
                        schoolId: school.id,
                        gradeId: grade.id,
                        name,
                        status: schema.StatusEnum.ACTIVE,
                    }))
                )
            )
            .returning();

        // -------------------------
        // 4. Subjects
        // -------------------------
        const subjects = await tx
            .insert(schema.subjectsTable)
            .values([
                { schoolId: school.id, name: "Mathematics", code: "MATH", status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "Physics", code: "PHY", status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "Arabic", code: "ARB", status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "French", code: "FR", status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "English", code: "ENG", status: schema.StatusEnum.ACTIVE },
                { schoolId: school.id, name: "History", code: "HIST", status: schema.StatusEnum.ACTIVE },
            ])
            .returning();

        // -------------------------
        // 5. Grade subjects
        // -------------------------
        await tx.insert(schema.gradeSubjectsTable).values(
            grades.flatMap((grade) =>
                subjects.map((subject) => ({
                    schoolId: school.id,
                    gradeId: grade.id,
                    subjectId: subject.id,
                    coefficient: faker.number.int({ min: 1, max: 5 }),
                    weeklyHours: faker.number.int({ min: 2, max: 6 }),
                    status: schema.StatusEnum.ACTIVE,
                }))
            )
        );

        // -------------------------
        // 6. Teacher users + teachers
        // -------------------------
        const teacherUsers = await tx
            .insert(schema.usersTable)
            .values(
                Array.from({ length: 8 }).map((_, i) => {
                    const firstName = faker.person.firstName();
                    const lastName = faker.person.lastName();

                    return {
                        username: `${firstName} ${lastName}`,
                        email: `teacher${i + 1}@school.test`,
                        emailVerified: true,
                        image: faker.image.avatar(),
                        passwordHash,
                        telNumber: faker.phone.number(),
                        role: schema.UserRoleEnum.TEACHER,
                        gender: faker.helpers.arrayElement([
                            schema.UserGenderEnum.MALE,
                            schema.UserGenderEnum.FEMALE,
                        ]),
                    };
                })
            )
            .returning();

        const teachers = await tx
            .insert(schema.teachersTable)
            .values(
                teacherUsers.map((user) => ({
                    schoolId: school.id,
                    userId: user.id,
                    address: faker.location.streetAddress(),
                    dateOfBirth: randomDateString(new Date("1975-01-01"), new Date("1998-01-01")),
                    about: faker.person.bio(),
                    joiningDate: randomDateString(new Date("2015-01-01"), new Date()),
                    status: schema.StatusEnum.ACTIVE,
                }))
            )
            .returning();

        // -------------------------
        // 7. Teacher assignments
        // -------------------------
        const teacherAssignments = await tx
            .insert(schema.teacherAssignmentsTable)
            .values(
                classes.flatMap((classRow, classIndex) =>
                    subjects.slice(0, 4).map((subject, subjectIndex) => {
                        const teacher = teachers[(classIndex + subjectIndex) % teachers.length];

                        return {
                            schoolId: school.id,
                            teacherId: teacher.id,
                            subjectId: subject.id,
                            classId: classRow.id,
                            gradeId: classRow.gradeId,
                            isPrimaryTeacher: subjectIndex === 0,
                            status: schema.StatusEnum.ACTIVE,
                        };
                    })
                )
            )
            .returning();

        // -------------------------
        // 8. Student users + students
        // -------------------------
        const studentUsers = await tx
            .insert(schema.usersTable)
            .values(
                Array.from({ length: 80 }).map((_, i) => {
                    const firstName = faker.person.firstName();
                    const lastName = faker.person.lastName();

                    return {
                        username: `${firstName} ${lastName}`,
                        email: `student${i + 1}@school.test`,
                        emailVerified: faker.datatype.boolean(),
                        image: faker.image.avatar(),
                        passwordHash,
                        telNumber: faker.phone.number(),
                        role: schema.UserRoleEnum.STUDENT,
                        gender: faker.helpers.arrayElement([
                            schema.UserGenderEnum.MALE,
                            schema.UserGenderEnum.FEMALE,
                        ]),
                    };
                })
            )
            .returning();

        const students = await tx
            .insert(schema.studentsTable)
            .values(
                studentUsers.map((user, i) => {
                    const classRow = classes[i % classes.length];

                    return {
                        schoolId: school.id,
                        userId: user.id,
                        classId: classRow.id,
                        parentPhoneNumber: faker.phone.number(),
                        parentName: faker.person.fullName(),
                        status: schema.StatusEnum.ACTIVE,
                        address: faker.location.streetAddress(),
                        dateOfBirth: randomDateString(new Date("2008-01-01"), new Date("2015-01-01")),
                        enrollmentDate: randomDateString(new Date("2020-09-01"), new Date()),
                    };
                })
            )
            .returning();

        // -------------------------
        // 9. Assessment periods
        // -------------------------
        const periods = await tx
            .insert(schema.assessmentPeriodsTable)
            .values([
                {
                    schoolId: school.id,
                    name: "Trimester 1",
                    code: "T1",
                    startDate: new Date("2025-09-01"),
                    endDate: new Date("2025-12-15"),
                    status: schema.StatusEnum.ACTIVE,
                },
                {
                    schoolId: school.id,
                    name: "Trimester 2",
                    code: "T2",
                    startDate: new Date("2026-01-05"),
                    endDate: new Date("2026-03-20"),
                    status: schema.StatusEnum.ACTIVE,
                },
                {
                    schoolId: school.id,
                    name: "Trimester 3",
                    code: "T3",
                    startDate: new Date("2026-04-01"),
                    endDate: new Date("2026-06-20"),
                    status: schema.StatusEnum.ACTIVE,
                },
            ])
            .returning();

        // -------------------------
        // 10. Assessments
        // -------------------------
        const assessments = await tx
            .insert(schema.assessmentsTable)
            .values(
                classes.flatMap((classRow) =>
                    subjects.slice(0, 3).flatMap((subject) =>
                        periods.map((period) => {
                            const assignment = teacherAssignments.find(
                                (a) => a.classId === classRow.id && a.subjectId === subject.id
                            );

                            return {
                                schoolId: school.id,
                                classId: classRow.id,
                                subjectId: subject.id,
                                teacherAssignmentId: assignment?.id ?? null,
                                periodId: period.id,
                                title: `${subject.name} Test - ${period.name}`,
                                type: faker.helpers.arrayElement(["Homework", "Quiz", "Test", "Exam"] as const),
                                maxScore: 20,
                                weight: faker.number.int({ min: 1, max: 3 }),
                                assessmentDate: faker.date.between({
                                    from: period.startDate,
                                    to: period.endDate,
                                }),
                                notes: faker.lorem.sentence(),
                                status: schema.StatusEnum.ACTIVE,
                            };
                        })
                    )
                )
            )
            .returning();

        // -------------------------
        // 11. Student marks
        // -------------------------
        await tx.insert(schema.studentMarksTable).values(
            assessments.flatMap((assessment) => {
                const classStudents = students.filter((s) => s.classId === assessment.classId);

                return classStudents.map((student) => {
                    const absent = faker.datatype.boolean({ probability: 0.08 });

                    return {
                        schoolId: school.id,
                        assessmentId: assessment.id,
                        studentId: student.id,
                        score: absent ? null : faker.number.int({ min: 5, max: 20 }),
                        absent,
                        excused: absent ? faker.datatype.boolean() : false,
                        comment: faker.helpers.maybe(() => faker.lorem.sentence(), {
                            probability: 0.25,
                        }),
                    };
                });
            })
        );

        // -------------------------
        // 12. Events
        // -------------------------
        await tx.insert(schema.eventsTable).values(
            Array.from({ length: 20 }).map((_, i) => {
                const classRow = faker.helpers.arrayElement(classes);
                const subject = faker.helpers.arrayElement(subjects);
                const teacher = faker.helpers.arrayElement(teachers);
                const start = faker.date.soon({ days: 60 });
                const end = new Date(start.getTime() + 60 * 60 * 1000);

                return {
                    schoolId: school.id,
                    classId: classRow.id,
                    teacherId: teacher.id,
                    subjectId: subject.id,
                    title: `${subject.name} Session ${i + 1}`,
                    description: faker.lorem.sentence(),
                    color: faker.color.rgb(),
                    start,
                    end,
                    allDay: false,
                    repeatWeekly: faker.datatype.boolean({ probability: 0.3 }),
                    isClass: true,
                    status: schema.StatusEnum.ACTIVE,
                };
            })
        );

        // -------------------------
        // 13. Resources
        // -------------------------
        await tx.insert(schema.resourcesTable).values(
            Array.from({ length: 20 }).map((_, i) => {
                const subject = faker.helpers.arrayElement(subjects);
                const classRow = faker.helpers.arrayElement(classes);
                const teacher = faker.helpers.arrayElement(teachers);
                const type = faker.helpers.arrayElement(Object.values(schema.ResourceTypeEnum));

                return {
                    schoolId: school.id,
                    subjectId: subject.id,
                    classId: classRow.id,
                    teacherId: teacher.id,
                    fileName: `${subject.code.toLowerCase()}-resource-${i + 1}.${type}`,
                    type,
                    size: `${faker.number.int({ min: 1, max: 50 })} MB`,
                    fileUrl: faker.internet.url(),
                    description: faker.lorem.sentence(),
                    visibility: "class",
                    status: schema.StatusEnum.ACTIVE,
                };
            })
        );
    });

    console.log("✅ Database seeded successfully");
}

main()
    .catch((error) => {
        console.error("❌ Seed failed");
        console.error(error);
        process.exit(1);
    })

// await db.update(schema.usersTable).set({
//     image: null
// }).then(() => console.log("HELLO"))