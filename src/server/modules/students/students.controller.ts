import { db, type Database } from "#/server/db/db";
import { account, classesTable, gradesTable, StatusEnum, studentsTable, teachersTable, UserRoleEnum, users } from "#/server/db/schema";
import { and, asc, count, desc, eq, gte, ilike, lt, or, sql, SQL } from "drizzle-orm";
import generateId from "../../../lib/id_generator";
import { handlePassword } from "#/server/utils/handle-password";
import { DashboardPeriodEnum, StudentUserDto, type AddStudentType, type DashboardPeriod, type EditStudentType, type GetStudentsType, type StudentUser } from "#/types/studentTypes";
import type { ID } from "#/types/authTypes";


class StudentsController {
    constructor(private readonly db: Database) { }

    async listStudents({
        classe,
        grade,
        page,
        search,
        size,
        sortOrder,
        sortBy,
        status,
    }: GetStudentsType) {
        const safePage = Math.max(1, page ?? 1)
        const safeSize = Math.max(1, size ?? 10)
        const offset = (safePage - 1) * safeSize

        const conditions: SQL<unknown>[] = []

        const normalizedSearch = search?.trim()
        const normalizedStatus = status?.trim()
        const normalizedClass = classe?.trim()
        const normalizedGrade = grade?.trim()

        const sortColumn =
            sortBy === 'email'
                ? sql`lower(${users.email})`
                : sql`lower(${users.name})`

        const orderDirection =
            sortOrder === 'desc'
                ? desc(sortColumn)
                : asc(sortColumn)

        // search by student name/email
        if (normalizedSearch) {
            conditions.push(
                or(
                    ilike(users.name, `%${normalizedSearch}%`),
                    ilike(users.email, `%${normalizedSearch}%`)
                ) as SQL<unknown>
            )
        }

        // filter by status
        if (normalizedStatus) {
            conditions.push(
                eq(studentsTable.status, normalizedStatus as StatusEnum)
            )
        }

        // filter by class
        if (normalizedClass) {
            conditions.push(
                eq(classesTable.id, normalizedClass)
            )
        }

        // filter by grade
        if (normalizedGrade) {
            conditions.push(
                eq(gradesTable.id, normalizedGrade)
            )
        }

        const whereClause =
            conditions.length > 0
                ? and(...conditions)
                : undefined

        const [rows, totalResult] = await Promise.all([
            this.db
                .select({
                    student: studentsTable,
                    user: users,
                    classe: {
                        id: classesTable.id,
                        name: classesTable.name,
                    },
                    grade: {
                        id: gradesTable.id,
                        name: gradesTable.name,
                    },
                })
                .from(studentsTable)
                .innerJoin(users, eq(studentsTable.userId, users.id))
                .innerJoin(
                    classesTable,
                    eq(studentsTable.classId, classesTable.id)
                )
                .innerJoin(
                    gradesTable,
                    eq(classesTable.gradeId, gradesTable.id)
                )
                .where(whereClause)
                .orderBy(orderDirection)
                .limit(safeSize)
                .offset(offset),

            this.db
                .select({
                    total: count(),
                })
                .from(studentsTable)
                .innerJoin(users, eq(studentsTable.userId, users.id))
                .innerJoin(
                    classesTable,
                    eq(studentsTable.classId, classesTable.id)
                )
                .innerJoin(
                    gradesTable,
                    eq(classesTable.gradeId, gradesTable.id)
                )
                .where(whereClause),
        ])

        const totalCount = Number(totalResult[0]?.total ?? 0)
        const totalPages = Math.ceil(totalCount / safeSize)

        const data = rows.map(({
            student,
            user,
            classe,
            grade,
        }) =>
            StudentUserDto(student, user, classe, grade)
        )

        return {
            data,
            pagination: {
                totalCount,
                totalPages,
            },
        }
    }


    async addStudent(data: AddStudentType) {
        const userId = generateId();

        const passwordHash = await handlePassword.hash("student123")

        try {
            const classe = await this.db.query.classesTable.findFirst({
                where: eq(classesTable.id, data.classId)
            })
            if (!classe) throw new Error("Classe Not Found");

            await this.db.insert(users).values({
                id: userId,
                email: data.email,
                telNumber: data.telNumber,
                gender: data.gender,
                image: data.image,
                role: UserRoleEnum.STUDENT,
                name: data.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            }).returning()

            await this.db.insert(account).values({
                id: generateId(),
                userId,
                accountId: userId,
                providerId: "credential",
                password: passwordHash,
                createdAt: new Date(),
            })

            const [{ id: studentId }] = await this.db
                .insert(studentsTable)
                .values({
                    address: data.address,
                    dateOfBirth: data.dateOfBirth,
                    enrollmentDate: data.enrollmentDate,
                    parentName: data.parentName,
                    parentPhoneNumber: data.parentPhoneNumber,
                    schoolId: data.schoolId,
                    userId,
                    classId: data.classId,
                })
                .returning({ id: studentsTable.id })

            const student = await this.db.query.studentsTable.findFirst({
                where: eq(studentsTable.id, studentId),
                with: {
                    user: true,
                    class: {
                        columns: {
                            id: true,
                            name: true,
                        },
                        with: {
                            grade: {
                                columns: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
            if (!student) throw new Error("Student Not Created")
            const studentUser: StudentUser = StudentUserDto(student, student.user, student.class, student.class.grade);
            return studentUser
        } catch (error) {
            await this.db.delete(users).where(eq(users.id, userId)).catch(() => undefined)
            throw error
        }
    }


    async getStudent(studentId: string) {
        const student = await db.query.studentsTable.findFirst({
            where: eq(studentsTable.id, studentId),
            with: {
                user: true,
                class: {
                    columns: {
                        id: true,
                        name: true
                    },
                    with: {
                        grade: {
                            columns: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
        });
        if (!student) return undefined;
        return StudentUserDto(student, student.user, student.class, student.class.grade);
    }


    async editStudent(data: EditStudentType) {
        const password = data.name // just the name of the user 
        const passwordHash = await handlePassword.hash(password);

        const foundStudent = await this.db.query.studentsTable.findFirst({
            where: eq(studentsTable.id, data.studentId),
            columns: { userId: true }
        });
        if (!foundStudent) throw new Error("Student not found");
        const userId = foundStudent.userId;

        await this.db
            .update(users)
            .set({
                email: data.email,
                name: data.name,
                image: data.image,
                emailVerified: false,
                telNumber: data.telNumber,
                gender: data.gender,
            })
            .where(eq(users.id, userId))
            .returning()

        await this.db.update(account)
            .set({
                password: passwordHash,
            })
            .where(eq(account.userId, userId))

        await this.db
            .update(studentsTable)
            .set({
                address: data.address,
                dateOfBirth: data.dateOfBirth,
                parentName: data.parentName,
                parentPhoneNumber: data.parentPhoneNumber,
                status: StatusEnum.NEW,
                enrollmentDate: data.enrollmentDate
            })
            .where(eq(studentsTable.id, data.studentId))
            .returning()

        const student = await this.db.query.studentsTable.findFirst({
            where: eq(studentsTable.id, data.studentId),
            with: {
                user: true,
                class: {
                    columns: {
                        id: true,
                        name: true
                    },
                    with: {
                        grade: {
                            columns: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        if (!student) throw new Error("Student not found");

        const studentWithUser: StudentUser = StudentUserDto(student, student.user, student.class, student.class.grade);
        return studentWithUser

    }

    async deleteStudent(studentId: string) {
        const [deletedStudent] = await this.db.delete(studentsTable).where(eq(studentsTable.id, studentId)).returning();
        return deletedStudent;
    }

    async getStudentsStats() {
        const now = new Date()

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

        const [{ totalStudents }] = await this.db
            .select({ totalStudents: count() })
            .from(studentsTable)

        const [{ totalMonthEnrollments }] = await this.db
            .select({ totalMonthEnrollments: count() })
            .from(studentsTable)
            .where(
                and(
                    gte(studentsTable.enrollmentDate, startOfMonth.toISOString()),
                    lt(studentsTable.enrollmentDate, startOfNextMonth.toISOString()),
                ),
            )

        return {
            totalStudents,
            totalMonthEnrollments,
        }
    }

    // related to dashboard

    async getDashboardStats(schoolId: ID) {
        const [{ totalStudents }] = await this.db
            .select({ totalStudents: count() })
            .from(studentsTable)
            .where(eq(studentsTable.schoolId, schoolId))

        const [{ totalTeachers }] = await this.db
            .select({ totalTeachers: count() })
            .from(teachersTable)
            .where(eq(teachersTable.schoolId, schoolId))

        const [{ totalGrades }] = await this.db
            .select({ totalGrades: count() })
            .from(gradesTable)
            .where(eq(gradesTable.schoolId, schoolId))

        const [{ totalClasses }] = await this.db
            .select({ totalClasses: count() })
            .from(classesTable)
            .where(eq(classesTable.schoolId, schoolId))

        return {
            totalStudents,
            totalTeachers,
            totalGrades,
            totalClasses,
        }
    }

    async getDashboardChart({
        schoolId,
        period,
    }: DashboardPeriod) {
        const now = new Date()

        let startDate = new Date()
        let labels: string[] = []

        switch (period) {
            case DashboardPeriodEnum.MONTH:
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth(),
                    1,
                )

                labels = [
                    'Week 1',
                    'Week 2',
                    'Week 3',
                    'Week 4',
                ]
                break

            case DashboardPeriodEnum.HALFYEAR:
                startDate = new Date(
                    now.getFullYear(),
                    now.getMonth() - 5,
                    1,
                )

                labels = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                ]
                break

            case DashboardPeriodEnum.YEAR:
                startDate = new Date(
                    now.getFullYear() - 1,
                    now.getMonth(),
                    1,
                )

                labels = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                ]
                break
        }

        const startDateString = startDate
            .toISOString()
            .split('T')[0]

        const students = await this.db
            .select({
                enrollmentDate:
                    studentsTable.enrollmentDate,
            })
            .from(studentsTable)
            .where(
                and(
                    gte(
                        studentsTable.enrollmentDate,
                        startDateString,
                    ),

                    eq(
                        studentsTable.schoolId,
                        schoolId,
                    ),
                ),
            )

        // ----------------------------------------
        // CREATE COUNTERS
        // ----------------------------------------

        let data: number[] = []

        switch (period) {
            case DashboardPeriodEnum.MONTH: {
                // 4 weeks

                const weeks = [0, 0, 0, 0]

                students.forEach((student) => {
                    const date = new Date(
                        student.enrollmentDate,
                    )

                    const day = date.getDate()

                    if (day <= 7) weeks[0]++
                    else if (day <= 14) weeks[1]++
                    else if (day <= 21) weeks[2]++
                    else weeks[3]++
                })

                data = weeks
                break
            }

            case DashboardPeriodEnum.HALFYEAR: {
                // 6 months

                const months = [0, 0, 0, 0, 0, 0]

                students.forEach((student) => {
                    const date = new Date(
                        student.enrollmentDate,
                    )

                    const diff =
                        now.getMonth() - date.getMonth()

                    if (diff >= 0 && diff < 6) {
                        months[5 - diff]++
                    }
                })

                data = months
                break
            }

            case DashboardPeriodEnum.YEAR: {
                // 12 months

                const months = [
                    0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0, 0, 0,
                ]

                students.forEach((student) => {
                    const date = new Date(
                        student.enrollmentDate,
                    )

                    const month = date.getMonth()

                    months[month]++
                })

                data = months
                break
            }
        }

        return {
            labels,

            datasets: [
                {
                    label: 'Enrollments',

                    data,

                    borderColor: '#3b82f6',

                    backgroundColor:
                        'rgba(59, 130, 246, 0.2)',

                    tension: 0.4,

                    pointRadius: 5,

                    pointHoverRadius: 7,

                    fill: true,
                },
            ],
        }
    }
}
export const studentsController = new StudentsController(db);

// this function is not in use now
// async function findStudentByUserId(
//     userId: string,
// ) {
//     const student = await db.query.studentsTable.findFirst({
//         where: eq(studentsTable.userId, userId),
//         with: {
//             user: true,
//             class: {
//                 columns: {
//                     id: true,
//                     name: true
//                 },
//                 with: {
//                     grade: {
//                         columns: {
//                             id: true,
//                             name: true
//                         }
//                     }
//                 }
//             }
//         },
//     });
//     if (!student) return undefined;
//     return StudentUserDto(student, student.user, student.class, student.class.grade);
// }
