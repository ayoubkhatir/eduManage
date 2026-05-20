import type { AddSubjectSchema } from "#/types/subjectsTypes";
import { db, type Database } from "#/server/db/db";
import { gradesTable, gradeSubjectsTable, StatusEnum, studentsTable, subjectsTable, teachersTable } from "#/server/db/schema";
import { and, eq, inArray } from "drizzle-orm";

class SubjectsController {
    constructor(private readonly db: Database) { }

    async addSubject(data: AddSubjectSchema) {

        // 1) ensure all grades exist and belong to same school
        const grades = await db
            .select({
                id: gradesTable.id,
                schoolId: gradesTable.schoolId,
            })
            .from(gradesTable)
            .where(
                and(
                    eq(gradesTable.schoolId, data.schoolId),
                    inArray(gradesTable.id, data.gradeIds),
                ),
            )

        if (grades.length !== data.gradeIds.length) {
            throw new Error('One or more selected grades are invalid')
        }

        // 2) ensure subject name is unique inside school
        const existingSubject = await db.query.subjectsTable.findFirst({
            where: and(
                eq(subjectsTable.schoolId, data.schoolId),
                eq(subjectsTable.name, data.name),
            ),
        })

        let subjectId = existingSubject?.id

        // 3) create subject if it does not exist
        if (!existingSubject) {
            const [createdSubject] = await db
                .insert(subjectsTable)
                .values({
                    schoolId: data.schoolId,
                    name: data.name.trim(),
                    code: data.code.trim(),
                    status: data.status,
                })
                .returning({
                    id: subjectsTable.id,
                    name: subjectsTable.name,
                    code: subjectsTable.code,
                    status: subjectsTable.status,
                })

            subjectId = createdSubject.id
        }

        if (!subjectId) {
            throw new Error('Failed to create subject')
        }

        // 4) create missing grade_subject relations
        const existingLinks = await db
            .select({
                gradeId: gradeSubjectsTable.gradeId,
            })
            .from(gradeSubjectsTable)
            .where(
                and(
                    eq(gradeSubjectsTable.subjectId, subjectId),
                    inArray(gradeSubjectsTable.gradeId, data.gradeIds),
                ),
            )

        const existingGradeIds = new Set(existingLinks.map((x) => x.gradeId))
        const missingGradeIds = data.gradeIds.filter((id) => !existingGradeIds.has(id))

        if (missingGradeIds.length > 0) {
            await db.insert(gradeSubjectsTable).values(
                missingGradeIds.map((gradeId) => ({
                    schoolId: data.schoolId,
                    gradeId,
                    subjectId,
                    status: StatusEnum.ACTIVE,
                })),
            )
        }

        // 5) return subject + linked grades
        const linkedGrades = await db
            .select({
                gradeId: gradeSubjectsTable.gradeId,
            })
            .from(gradeSubjectsTable)
            .where(eq(gradeSubjectsTable.subjectId, subjectId))

        return {
            id: subjectId,
            name: existingSubject?.name ?? data.name.trim(),
            code: existingSubject?.code ?? (data.code?.trim() || null),
            gradeIds: linkedGrades.map((g) => g.gradeId),
        }
    }

    async listAllSubjects() {
        const subjects = await this.db.query.subjectsTable.findMany({
            columns: {
                id: true,
                name: true,
            },
            with: {
                gradeSubjects: {
                    columns: {},
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

        return subjects.map(s => ({ id: s.id, name: s.name, grades: s.gradeSubjects.map(s => s.grade) }));
    }

    async listStudentSubjectsByUserId(studentUserId: string) {
        const student = await this.db.query.studentsTable.findFirst({
            where: eq(studentsTable.userId, studentUserId),
            columns: {},
            with: {
                class: {
                    columns: {
                        id: true
                    },
                    with: {
                        assignments: {
                            columns: {},
                            with: {
                                subject: true
                            }
                        }
                    }
                }
            }
        })
        console.log({ student })
        return student?.class.assignments.map(ass => ass.subject) ?? []
    }

    async listTeacherSubjectsByUserId(teacherUserId: string) {
        const teacher = await this.db.query.teachersTable.findFirst({
            where: eq(teachersTable.userId, teacherUserId),
            columns: {},
            with: {
                assignments: {
                    columns: {},
                    with: {
                        subject: true
                    }
                }
            }
        })
        console.log({ teacher })
        return teacher?.assignments.map(ass => ass.subject) ?? []
    }
}
export const subjectsController = new SubjectsController(db)