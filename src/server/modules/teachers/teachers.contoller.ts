import { db, type Database } from "#/server/db/db";
import { account, adminsTable, classesTable, gradesTable, StatusEnum, studentsTable, subjectsTable, teacherAssignmentsTable, teachersTable, UserGenderEnum, UserRoleEnum, users } from "#/server/db/schema";
import { and, asc, count, desc, eq, exists, gte, ilike, inArray, lt, or, sql, SQL } from "drizzle-orm"
import { generateTemporaryPassword } from "#/server/utils/temp_password_generator";
import { handlePassword } from "#/server/utils/handle-password";
import generateId from "#/server/utils/id_generator";
import type { AddTeacherType, AssignTeacherType, EditTeacherType, GetTeacherClassesType, GetTeachersType } from "#/types/teacherTypes";
import { TeacherUserDto } from "#/types/teacherTypes";

function toDateOnly(value: string | Date) {
    return new Date(value).toISOString().slice(0, 10)
}

export type CreateTeacherInput = {
    schoolId: string
    username: string
    email: string
    passwordHash: string
    image?: string | null
    telNumber: string
    gender: UserGenderEnum
    address: string
    dateOfBirth: string
    joiningDate: string
    status?: StatusEnum
}

export type UpdateTeacherInput = Partial<{
    username: string
    email: string
    passwordHash: string
    image: string | null
    telNumber: string
    gender: UserGenderEnum

    address: string
    dateOfBirth: string
    joiningDate: string
    status: StatusEnum
}>

export type AssignTeacherInput = {
    schoolId: string
    teacherId: string
    classId: string
    subjectId: string
    isPrimaryTeacher?: boolean
    status?: StatusEnum
}

class TeachersController {
    constructor(private readonly db: Database) { }

    async listTeachers({
        search,
        page,
        size,
        status,
        sortBy,
        sortOrder,
        subject,
    }: GetTeachersType) {
        const safePage = Math.max(1, page ?? 1)
        const safeSize = Math.max(1, size ?? 10)
        const offset = (safePage - 1) * safeSize

        const conditions: SQL<unknown>[] = []

        const normalizedSearch = search?.trim()
        const normalizedStatus = status?.trim()
        const normalizedSubject = subject?.trim()

        const sortColumn =
            sortBy === 'email'
                ? sql`lower(${users.email})`
                : sql`lower(${users.name})`

        const orderDirection =
            sortOrder === 'desc'
                ? desc(sortColumn)
                : asc(sortColumn)

        // Search filter
        if (normalizedSearch) {
            conditions.push(
                or(
                    ilike(users.name, `%${normalizedSearch}%`),
                    ilike(users.email, `%${normalizedSearch}%`)
                )!
            )
        }

        // Status filter
        if (normalizedStatus) {
            conditions.push(
                eq(teachersTable.status, normalizedStatus as StatusEnum)

            )
        }

        // Subject filter
        if (normalizedSubject) {
            conditions.push(
                exists(
                    this.db
                        .select({ id: subjectsTable.id })
                        .from(teacherAssignmentsTable)
                        .innerJoin(
                            subjectsTable,
                            eq(
                                teacherAssignmentsTable.subjectId,
                                subjectsTable.id
                            )
                        )
                        .where(
                            and(
                                eq(
                                    teacherAssignmentsTable.teacherId,
                                    teachersTable.id
                                ),
                                ilike(
                                    subjectsTable.name,
                                    `%${normalizedSubject}%`
                                )
                            )
                        )
                )
            )
        }

        const whereClause =
            conditions.length > 0
                ? and(...conditions)
                : undefined

        // Step 1: get paginated teachers + user
        const [rows, totalRows] = await Promise.all([
            this.db
                .select({
                    teacher: teachersTable,
                    user: users,
                })
                .from(teachersTable)
                .innerJoin(
                    users,
                    eq(teachersTable.userId, users.id)
                )
                .where(whereClause)
                .orderBy(orderDirection)
                .limit(safeSize)
                .offset(offset),

            this.db
                .select({
                    total: count(),
                })
                .from(teachersTable)
                .innerJoin(
                    users,
                    eq(teachersTable.userId, users.id)
                )
                .where(whereClause),
        ])

        const teacherIds = rows.map(
            ({ teacher }) => teacher.id
        )

        // Step 2: get subjects for only those teachers
        const assignmentRows =
            teacherIds.length === 0
                ? []
                : await this.db
                    .select({
                        teacherId:
                            teacherAssignmentsTable.teacherId,
                        subjectId: subjectsTable.id,
                        subjectName: subjectsTable.name,
                        subjectCode: subjectsTable.code,
                    })
                    .from(teacherAssignmentsTable)
                    .innerJoin(
                        subjectsTable,
                        eq(
                            teacherAssignmentsTable.subjectId,
                            subjectsTable.id
                        )
                    )
                    .where(
                        inArray(
                            teacherAssignmentsTable.teacherId,
                            teacherIds
                        )
                    )

        // Step 3: group subjects by teacherId
        const subjectsByTeacherId = new Map<
            string,
            Array<{
                id: string
                name: string
                code: string | null
            }>
        >()

        for (const row of assignmentRows) {
            const current =
                subjectsByTeacherId.get(row.teacherId) ?? []

            const alreadyExists = current.some(
                (subject) => subject.id === row.subjectId
            )

            if (!alreadyExists) {
                current.push({
                    id: row.subjectId,
                    name: row.subjectName,
                    code: row.subjectCode,
                })
            }

            subjectsByTeacherId.set(
                row.teacherId,
                current
            )
        }

        const totalCount = Number(totalRows[0]?.total ?? 0)

        const totalPages = Math.ceil(
            totalCount / safeSize
        )

        const data = rows.map(
            ({ teacher, user }) =>
                TeacherUserDto(
                    teacher,
                    user,
                    subjectsByTeacherId.get(teacher.id) ?? []
                )
        )

        console.log(data)

        return {
            data,
            pagination: {
                totalCount,
                totalPages,
            },
        }
    }

    /**
     * Create user + teacher profile in one transaction
     */
    async createTeacher(data: AddTeacherType) {
        console.log({ inputData: data })
        const userId = crypto.randomUUID();
        const passwordHash = await handlePassword.hash(generateTemporaryPassword(data.name))
        const dateOfBirth = toDateOnly(data.dateOfBirth)
        const joiningDate = toDateOnly(new Date())

        try {
            const school = await this.db.query.adminsTable.findFirst({
                where: eq(adminsTable.id, data.schoolId),
            })

            if (!school) {
                throw new Error("School not found")
            }

            const [createdUser] = await this.db.insert(users).values({
                id: userId,
                email: data.email,
                name: data.name,
                image: data.image ?? null,
                telNumber: data.telNumber,
                role: UserRoleEnum.TEACHER,
                gender: data.gender,
                createdAt: new Date(),
                updatedAt: new Date(),
                emailVerified: false
            }).returning()

            const createdAccount = await this.db.insert(account).values({
                id: generateId(),
                userId,
                accountId: userId,
                providerId: "credentials",
                password: passwordHash,
                createdAt: new Date(),
            }).returning()
            console.log(createdAccount)

            const [createdTeacher] = await this.db
                .insert(teachersTable)
                .values({
                    schoolId: data.schoolId,
                    userId,
                    address: data.address,
                    dateOfBirth,
                    joiningDate,
                    status: data.status ?? "New",
                })
                .returning()


            const result = TeacherUserDto(createdTeacher, createdUser, [])

            return result
        } catch (error) {
            console.log({ error })
            await this.db.delete(users).where(eq(users.id, userId)).catch(() => undefined)
            throw error
        }
    }

    /**
     * Get all teachers of a school with linked user info
     */
    async getTeachers(schoolId: string) {
        return await this.db
            .select({
                teacherId: teachersTable.id,
                schoolId: teachersTable.schoolId,
                userId: teachersTable.userId,
                address: teachersTable.address,
                dateOfBirth: teachersTable.dateOfBirth,
                joiningDate: teachersTable.joiningDate,
                status: teachersTable.status,

                username: users.name,
                email: users.email,
                telNumber: users.telNumber,
                gender: users.gender,
                image: users.image,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(teachersTable)
            .innerJoin(users, eq(teachersTable.userId, users.id))
            .where(eq(teachersTable.schoolId, schoolId))
            .orderBy(desc(users.createdAt))
    }

    /**
     * Get one teacher by teacher id
     */
    async getTeacherById(teacherId: string) {
        const teacher = await this.db.query.teachersTable.findFirst({
            where: eq(teachersTable.id, teacherId),
            with: {
                user: true,
                assignments: {
                    with: {
                        subject: {
                            columns: {
                                id: true,
                                name: true

                            }
                        },
                        class: {
                            columns: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        })
        if (!teacher) throw new Error("Teacher not found");
        const subjects = teacher.assignments.map(a => a.subject)
        // const classes = teacher.assignments.map(a => a.class)
        return TeacherUserDto(teacher, teacher.user, subjects)
    }

    /**
     * Get one teacher by user id
     */
    async getTeacherByUserId(userId: string) {
        const user = await this.db.query.users.findFirst({
            where: eq(users.id, userId),
            with: {
                teacher: {
                    with: {
                        assignments: {
                            with: {
                                subject: {
                                    columns: {
                                        id: true,
                                        name: true

                                    }
                                },
                                class: {
                                    columns: {
                                        id: true,
                                        name: true,
                                    }
                                }
                            }
                        }

                    }
                }
            }
        })
        if (!user || !user.teacher) throw new Error("Teacher not found");
        const subjects = user.teacher.assignments.map(a => a.subject)
        // const classes = teacher.assignments.map(a => a.class)
        return TeacherUserDto(user.teacher, user, subjects)
    }

    /**
     * Update both user and teacher tables
     */
    async updateTeacher(input: EditTeacherType) {
        const dateOfBirth = toDateOnly(input.dateOfBirth)

        const [existingTeacher] = await this.db
            .select({
                id: teachersTable.id,
                userId: teachersTable.userId,
            })
            .from(teachersTable)
            .where(eq(teachersTable.id, input.teacherId))

        if (!existingTeacher) {
            throw new Error("Teacher not found")
        }

        await this.db
            .update(users)
            .set({
                email: input.email,
                name: input.name,
                telNumber: input.telNumber,
                image: input.image,
                gender: input.gender,
            })
            .where(eq(users.id, existingTeacher.userId))

        await this.db
            .update(teachersTable)
            .set({
                status: input.status,
                address: input.address,
                dateOfBirth,
                about: input.about
            })
            .where(eq(teachersTable.id, input.teacherId))

        const [updatedTeacher] = await this.db
            .select({
                teacherId: teachersTable.id,
                schoolId: teachersTable.schoolId,
                userId: teachersTable.userId,
                address: teachersTable.address,
                dateOfBirth: teachersTable.dateOfBirth,
                joiningDate: teachersTable.joiningDate,
                status: teachersTable.status,

                username: users.name,
                email: users.email,
                telNumber: users.telNumber,
                gender: users.gender,
                image: users.image,
                emailVerified: users.emailVerified,
                createdAt: users.createdAt,
                updatedAt: users.updatedAt,
            })
            .from(teachersTable)
            .innerJoin(users, eq(teachersTable.userId, users.id))
            .where(eq(teachersTable.id, input.teacherId))

        return updatedTeacher
    }

    /**
     * Delete teacher and linked user
     * Since users is the account root, removing the user is usually cleaner.
     */
    async deleteTeacher(teacherId: string): Promise<void> {
        const [teacher] = await this.db
            .select({
                userId: teachersTable.userId,
            })
            .from(teachersTable)
            .where(eq(teachersTable.id, teacherId))

        if (!teacher) {
            throw new Error("Teacher not found")
        }

        await this.db
            .delete(teacherAssignmentsTable)
            .where(eq(teacherAssignmentsTable.teacherId, teacherId))

        if (teacher.userId) {
            await this.db.delete(users).where(eq(users.id, teacher.userId))
        } else {
            await this.db.delete(teachersTable).where(eq(teachersTable.id, teacherId))
        }
    }

    /**
     * Assign teacher to subject + class
     */
    async assignTeacher(input: AssignTeacherInput) {
        const [assignment] = await this.db
            .insert(teacherAssignmentsTable)
            .values({
                schoolId: input.schoolId,
                teacherId: input.teacherId,
                classId: input.classId,
                subjectId: input.subjectId,
                isPrimaryTeacher: input.isPrimaryTeacher ?? false,
                status: input.status ?? StatusEnum.NEW,
            })
            .returning()

        return assignment
    }

    /**
     * Update one assignment
     */
    async updateAssignment(
        assignmentId: string,
        input: Partial<Pick<AssignTeacherInput, "classId" | "subjectId" | "isPrimaryTeacher" | "status">>
    ) {
        const [updated] = await this.db
            .update(teacherAssignmentsTable)
            .set({
                ...(input.classId !== undefined ? { classId: input.classId } : {}),
                ...(input.subjectId !== undefined ? { subjectId: input.subjectId } : {}),
                ...(input.isPrimaryTeacher !== undefined
                    ? { isPrimaryTeacher: input.isPrimaryTeacher }
                    : {}),
                ...(input.status !== undefined ? { status: input.status } : {}),
            })
            .where(eq(teacherAssignmentsTable.id, assignmentId))
            .returning()

        return updated ?? null
    }

    /**
     * Remove one assignment
     */
    async removeAssignment(assignmentId: string): Promise<void> {
        await this.db
            .delete(teacherAssignmentsTable)
            .where(eq(teacherAssignmentsTable.id, assignmentId))
    }

    /**
     * Get assignments of one teacher
     */
    // async getTeacherAssignments(teacherId: string) {
    //     return await this.db
    //         .select({
    //             assignmentId: teacherAssignmentsTable.id,
    //             teacherId: teacherAssignmentsTable.teacherId,
    //             classId: teacherAssignmentsTable.classId,
    //             subjectId: teacherAssignmentsTable.subjectId,
    //             schoolId: teacherAssignmentsTable.schoolId,
    //             isPrimaryTeacher: teacherAssignmentsTable.isPrimaryTeacher,
    //             status: teacherAssignmentsTable.status,
    //             createdAt: teacherAssignmentsTable.createdAt,
    //             updatedAt: teacherAssignmentsTable.updatedAt,

    //             className: classesTable.name,
    //             gradeId: classesTable.gradeId,

    //             subjectName: subjectsTable.name,
    //             subjectCode: subjectsTable.code,
    //         })
    //         .from(teacherAssignmentsTable)
    //         .innerJoin(classesTable, eq(teacherAssignmentsTable.classId, classesTable.id))
    //         .innerJoin(subjectsTable, eq(teacherAssignmentsTable.subjectId, subjectsTable.id))
    //         .where(eq(teacherAssignmentsTable.teacherId, teacherId))
    //         .orderBy(desc(teacherAssignmentsTable.createdAt))
    // }

    /**
     * Get all teachers assigned to one class
     */
    async getTeachersByClass(classId: string) {
        return await this.db
            .select({
                assignmentId: teacherAssignmentsTable.id,
                teacherId: teachersTable.id,
                subjectId: subjectsTable.id,
                subjectName: subjectsTable.name,
                subjectCode: subjectsTable.code,
                isPrimaryTeacher: teacherAssignmentsTable.isPrimaryTeacher,
                assignmentStatus: teacherAssignmentsTable.status,

                userId: users.id,
                username: users.name,
                email: users.email,
                telNumber: users.telNumber,
                image: users.image,
                gender: users.gender,

                teacherStatus: teachersTable.status,
                joiningDate: teachersTable.joiningDate,
            })
            .from(teacherAssignmentsTable)
            .innerJoin(teachersTable, eq(teacherAssignmentsTable.teacherId, teachersTable.id))
            .innerJoin(users, eq(teachersTable.userId, users.id))
            .innerJoin(subjectsTable, eq(teacherAssignmentsTable.subjectId, subjectsTable.id))
            .where(eq(teacherAssignmentsTable.classId, classId))
            .orderBy(desc(teacherAssignmentsTable.createdAt))
    }

    /**
     * Simple stats
     */
    // async getTeachersStats(schoolId: string) {
    //     const [{ totalTeachers }] = await this.db
    //         .select({ totalTeachers: count() })
    //         .from(teachersTable)
    //         .where(eq(teachersTable.schoolId, schoolId))

    //     const [{ activeTeachers }] = await this.db
    //         .select({ activeTeachers: count() })
    //         .from(teachersTable)
    //         .where(
    //             and(
    //                 eq(teachersTable.schoolId, schoolId),
    //                 eq(teachersTable.status, "Active")
    //             )
    //         )

    //     const [{ totalAssignments }] = await this.db
    //         .select({ totalAssignments: count() })
    //         .from(teacherAssignmentsTable)
    //         .where(eq(teacherAssignmentsTable.schoolId, schoolId))

    //     return {
    //         totalTeachers,
    //         activeTeachers,
    //         totalAssignments,
    //     }
    // }

    async getTeachersStats() {
        const now = new Date()

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

        const [[{ totalTeachers }], [{ totalActiveTeachers }], [{ totalNewThisMonth }]] =
            await Promise.all([
                this.db
                    .select({ totalTeachers: count() })
                    .from(teachersTable),

                this.db
                    .select({ totalActiveTeachers: count() })
                    .from(teachersTable)
                    .where(eq(teachersTable.status, StatusEnum.ACTIVE)),

                this.db
                    .select({ totalNewThisMonth: count() })
                    .from(teachersTable)
                    .where(
                        and(
                            gte(teachersTable.joiningDate, startOfMonth.toISOString()),
                            lt(teachersTable.joiningDate, startOfNextMonth.toISOString()),
                        ),
                    ),
            ])

        return {
            totalTeachers,
            totalActiveTeachers,
            totalNewThisMonth,
        }
    }

    async assignTeacherToClassAndSubject(data: AssignTeacherType) {
        console.log({ input: data })
        const teacher = await db.query.teachersTable.findFirst({
            where: and(
                eq(teachersTable.id, data.teacherId),
                eq(teachersTable.schoolId, data.schoolId),
            ),
        })

        if (!teacher) {
            throw new Error('Teacher not found')
        }

        const classe = await db.query.classesTable.findFirst({
            where: and(
                eq(classesTable.id, data.classId),
                eq(classesTable.schoolId, data.schoolId),
            ),
        })

        if (!classe) {
            throw new Error('Class not found')
        }

        const subject = await db.query.subjectsTable.findFirst({
            where: and(
                eq(subjectsTable.id, data.subjectId),
                eq(subjectsTable.schoolId, data.schoolId),
            ),
        })

        if (!subject) {
            throw new Error('Subject not found')
        }

        const existing = await db.query.teacherAssignmentsTable.findFirst({
            where: and(
                eq(teacherAssignmentsTable.teacherId, data.teacherId),
                eq(teacherAssignmentsTable.classId, data.classId),
                eq(teacherAssignmentsTable.subjectId, data.subjectId),
            ),
        })

        if (existing) {
            throw new Error('This assignment already exists')
        }

        // optional rule: only one primary teacher per class
        if (data.isPrimaryTeacher) {
            await db
                .update(teacherAssignmentsTable)
                .set({ isPrimaryTeacher: false })
                .where(eq(teacherAssignmentsTable.classId, data.classId))
        }

        const [assignment] = await db
            .insert(teacherAssignmentsTable)
            .values({
                schoolId: data.schoolId,
                teacherId: data.teacherId,
                classId: data.classId,
                subjectId: data.subjectId,
                gradeId: classe.gradeId,
                isPrimaryTeacher: data.isPrimaryTeacher,
                status: data.status ?? StatusEnum.NEW,
            })
            .returning()

        return assignment
    }

    async getTeacherAssignments(teacherId: string) {
        const rows = await db
            .select({
                id: teacherAssignmentsTable.id,
                teacherId: teacherAssignmentsTable.teacherId,
                subjectId: teacherAssignmentsTable.subjectId,
                subjectName: subjectsTable.name,
                classId: teacherAssignmentsTable.classId,
                className: classesTable.name,
                gradeName: gradesTable.name,
                isPrimaryTeacher: teacherAssignmentsTable.isPrimaryTeacher,
                status: teacherAssignmentsTable.status,
                teacherName: users.name,
            })
            .from(teacherAssignmentsTable)
            .innerJoin(
                teachersTable,
                eq(teachersTable.id, teacherAssignmentsTable.teacherId),
            )
            .innerJoin(users, eq(users.id, teachersTable.userId))
            .innerJoin(
                subjectsTable,
                eq(subjectsTable.id, teacherAssignmentsTable.subjectId),
            )
            .innerJoin(classesTable, eq(classesTable.id, teacherAssignmentsTable.classId))
            .innerJoin(gradesTable, eq(gradesTable.id, classesTable.gradeId))
            .where(eq(teacherAssignmentsTable.teacherId, teacherId))

        return rows
    }

    async getTeacherClassesDashboard(input: GetTeacherClassesType) {
        const safePage = Math.max(1, input.page ?? 1)
        const safeSize = Math.max(1, input.size ?? 10)
        const offset = (safePage - 1) * safeSize

        const conditions: SQL<unknown>[] = [
            eq(teacherAssignmentsTable.teacherId, input.teacherId),
        ]

        const normalizedSearch = input.search?.trim()
        const normalizedStatus = input.status?.trim()

        if (normalizedSearch) {
            conditions.push(
                or(
                    ilike(classesTable.name, `%${normalizedSearch}%`),
                    ilike(gradesTable.name, `%${normalizedSearch}%`),
                    ilike(subjectsTable.name, `%${normalizedSearch}%`)
                )!
            )
        }

        if (normalizedStatus && normalizedStatus !== 'All') {
            conditions.push(eq(teacherAssignmentsTable.status, normalizedStatus as any))
        }

        const whereClause = and(...conditions)

        const [rows, totalRows] = await Promise.all([
            this.db
                .select({
                    assignmentId: teacherAssignmentsTable.id,
                    classId: classesTable.id,
                    className: classesTable.name,
                    gradeId: gradesTable.id,
                    gradeName: gradesTable.name,
                    subjectId: subjectsTable.id,
                    subjectName: subjectsTable.name,
                    isPrimaryTeacher: teacherAssignmentsTable.isPrimaryTeacher,
                    status: teacherAssignmentsTable.status,
                    studentCount: count(studentsTable.id),
                })
                .from(teacherAssignmentsTable)
                .innerJoin(
                    classesTable,
                    eq(classesTable.id, teacherAssignmentsTable.classId),
                )
                .innerJoin(
                    gradesTable,
                    eq(gradesTable.id, classesTable.gradeId),
                )
                .innerJoin(
                    subjectsTable,
                    eq(subjectsTable.id, teacherAssignmentsTable.subjectId),
                )
                .leftJoin(
                    studentsTable,
                    eq(studentsTable.classId, classesTable.id),
                )
                .where(whereClause)
                .groupBy(
                    teacherAssignmentsTable.id,
                    classesTable.id,
                    classesTable.name,
                    gradesTable.id,
                    gradesTable.name,
                    subjectsTable.id,
                    subjectsTable.name,
                    teacherAssignmentsTable.isPrimaryTeacher,
                    teacherAssignmentsTable.status,
                )
                .orderBy(asc(gradesTable.name), asc(classesTable.name), asc(subjectsTable.name))
                .limit(safeSize)
                .offset(offset),

            this.db
                .select({ total: count() })
                .from(teacherAssignmentsTable)
                .innerJoin(
                    classesTable,
                    eq(classesTable.id, teacherAssignmentsTable.classId),
                )
                .innerJoin(
                    gradesTable,
                    eq(gradesTable.id, classesTable.gradeId),
                )
                .innerJoin(
                    subjectsTable,
                    eq(subjectsTable.id, teacherAssignmentsTable.subjectId),
                )
                .where(whereClause),
        ])

        const allRowsForSummary = await this.db
            .select({
                classId: classesTable.id,
                subjectId: subjectsTable.id,
                studentCount: count(studentsTable.id),
            })
            .from(teacherAssignmentsTable)
            .innerJoin(
                classesTable,
                eq(classesTable.id, teacherAssignmentsTable.classId),
            )
            .innerJoin(
                gradesTable,
                eq(gradesTable.id, classesTable.gradeId),
            )
            .innerJoin(
                subjectsTable,
                eq(subjectsTable.id, teacherAssignmentsTable.subjectId),
            )
            .leftJoin(
                studentsTable,
                eq(studentsTable.classId, classesTable.id),
            )
            .where(whereClause)
            .groupBy(classesTable.id, subjectsTable.id)

        const uniqueClassIds = new Set(allRowsForSummary.map((row) => row.classId))
        const uniqueSubjectIds = new Set(allRowsForSummary.map((row) => row.subjectId))
        const totalStudents = allRowsForSummary.reduce(
            (sum, row) => sum + Number(row.studentCount ?? 0),
            0,
        )

        const totalCount = Number(totalRows[0]?.total ?? 0)

        return {
            data: rows.map((row) => ({
                ...row,
                studentCount: Number(row.studentCount ?? 0),
            })),
            rowCount: totalCount,
            summary: {
                totalClasses: uniqueClassIds.size,
                totalStudents,
                totalSubjects: uniqueSubjectIds.size,
            },
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / safeSize),
            },
        }
    }

}
export const teachersController = new TeachersController(db)