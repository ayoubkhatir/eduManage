import { db, type Database } from '#/server/db/db'
import {
    assessmentsTable,
    assessmentPeriodsTable,
    studentMarksTable,
    studentsTable,
    classesTable,
    gradesTable,
    subjectsTable,
    teacherAssignmentsTable,
    users,
} from '#/server/db/schema'
import type { CreateAssessmentSchema, GetAssessmentsByClassSubjectSchema, SaveStudentMarksSchema, UpdateAssessmentSchema } from '#/types/assessmentsTypes'
import type { GetTeacherClassMarksPageType } from '#/types/teacherTypes'
// import type {
//     CreateAssessmentSchema,
//     GetAssessmentsByClassSubjectSchema,
//     GetTeacherClassMarksPageSchema,
//     SaveStudentMarksSchema,
//     UpdateAssessmentSchema,
// } from '#/schemas/marks.schema'
import { and, asc, desc, eq, inArray } from 'drizzle-orm'

class MarksController {
    constructor(private readonly db: Database) { }

    async getTeacherClassMarksPage(input: GetTeacherClassMarksPageType) {
        const teacherAssignments = await this.db
            .select({
                assignmentId: teacherAssignmentsTable.id,
                classId: teacherAssignmentsTable.classId,
                subjectId: teacherAssignmentsTable.subjectId,
                subjectName: subjectsTable.name,
                subjectCode: subjectsTable.code,
                isPrimaryTeacher: teacherAssignmentsTable.isPrimaryTeacher,
                status: teacherAssignmentsTable.status,
            })
            .from(teacherAssignmentsTable)
            .innerJoin(
                subjectsTable,
                eq(subjectsTable.id, teacherAssignmentsTable.subjectId),
            )
            .where(
                and(
                    eq(teacherAssignmentsTable.teacherId, input.teacherId),
                    eq(teacherAssignmentsTable.classId, input.classId),
                ),
            )
            .orderBy(asc(subjectsTable.name))

        const classInfo = await this.db
            .select({
                classId: classesTable.id,
                className: classesTable.name,
                gradeId: gradesTable.id,
                gradeName: gradesTable.name,
            })
            .from(classesTable)
            .innerJoin(gradesTable, eq(gradesTable.id, classesTable.gradeId))
            .where(eq(classesTable.id, input.classId))
            .then((rows) => rows[0] ?? null)

        if (!classInfo) {
            throw new Error('Class not found')
        }

        const students = await this.db
            .select({
                studentId: studentsTable.id,
                userId: users.id,
                name: users.name,
                email: users.email,
                image: users.image,
                status: studentsTable.status,
            })
            .from(studentsTable)
            .innerJoin(users, eq(users.id, studentsTable.userId))
            .where(eq(studentsTable.classId, input.classId))
            .orderBy(asc(users.name))

        const periods = await this.db
            .select({
                id: assessmentPeriodsTable.id,
                name: assessmentPeriodsTable.name,
                code: assessmentPeriodsTable.code,
                startDate: assessmentPeriodsTable.startDate,
                endDate: assessmentPeriodsTable.endDate,
                status: assessmentPeriodsTable.status,
            })
            .from(assessmentPeriodsTable)
            .where(eq(assessmentPeriodsTable.schoolId, teacherAssignments[0]?.classId ? teacherAssignments[0]!.classId : classInfo.classId)) // replace if needed
            .orderBy(desc(assessmentPeriodsTable.startDate))
            .catch(() => [])

        const selectedSubjectId =
            input.subjectId ?? teacherAssignments[0]?.subjectId ?? undefined

        const assessments =
            selectedSubjectId == null
                ? []
                : await this.getAssessmentsByClassAndSubject({
                    classId: input.classId,
                    subjectId: selectedSubjectId,
                    periodId: input.periodId,
                })

        const data = {
            class: classInfo,
            teacherAssignments,
            students,
            periods,
            selectedSubjectId,
            assessments,
            summary: {
                totalStudents: students.length,
                totalSubjects: teacherAssignments.length,
                totalAssessments: assessments.length,
            },
        }
        return data
    }

    async createAssessment(input: CreateAssessmentSchema) {
        const [assessment] = await this.db
            .insert(assessmentsTable)
            .values({
                schoolId: input.schoolId,
                classId: input.classId,
                subjectId: input.subjectId,
                teacherAssignmentId: input.teacherAssignmentId,
                periodId: input.periodId,
                title: input.title,
                type: input.type,
                maxScore: input.maxScore,
                weight: input.weight,
                assessmentDate: input.assessmentDate
                    ? new Date(input.assessmentDate)
                    : null,
                notes: input.notes,
                status: input.status,
            })
            .returning()

        return assessment
    }

    async updateAssessment(input: UpdateAssessmentSchema) {
        const [updated] = await this.db
            .update(assessmentsTable)
            .set({
                ...(input.title !== undefined ? { title: input.title } : {}),
                ...(input.type !== undefined ? { type: input.type } : {}),
                ...(input.maxScore !== undefined ? { maxScore: input.maxScore } : {}),
                ...(input.weight !== undefined ? { weight: input.weight } : {}),
                ...(input.assessmentDate !== undefined
                    ? { assessmentDate: new Date(input.assessmentDate) }
                    : {}),
                ...(input.notes !== undefined ? { notes: input.notes } : {}),
                ...(input.periodId !== undefined ? { periodId: input.periodId } : {}),
                ...(input.status !== undefined ? { status: input.status } : {}),
            })
            .where(eq(assessmentsTable.id, input.assessmentId))
            .returning()

        return updated ?? null
    }

    async deleteAssessment(assessmentId: string) {
        await this.db
            .delete(assessmentsTable)
            .where(eq(assessmentsTable.id, assessmentId))
    }

    async getAssessmentsByClassAndSubject(
        input: GetAssessmentsByClassSubjectSchema,
    ) {
        return await this.db
            .select({
                id: assessmentsTable.id,
                title: assessmentsTable.title,
                type: assessmentsTable.type,
                maxScore: assessmentsTable.maxScore,
                weight: assessmentsTable.weight,
                assessmentDate: assessmentsTable.assessmentDate,
                notes: assessmentsTable.notes,
                periodId: assessmentsTable.periodId,
                status: assessmentsTable.status,
                createdAt: assessmentsTable.createdAt,
            })
            .from(assessmentsTable)
            .where(
                and(
                    eq(assessmentsTable.classId, input.classId),
                    eq(assessmentsTable.subjectId, input.subjectId),
                    ...(input.periodId
                        ? [eq(assessmentsTable.periodId, input.periodId)]
                        : []),
                ),
            )
            .orderBy(desc(assessmentsTable.assessmentDate), desc(assessmentsTable.createdAt))
    }

    async getAssessmentMarks(assessmentId: string) {
        const assessment = await this.db
            .select({
                id: assessmentsTable.id,
                title: assessmentsTable.title,
                type: assessmentsTable.type,
                maxScore: assessmentsTable.maxScore,
                weight: assessmentsTable.weight,
                classId: assessmentsTable.classId,
                subjectId: assessmentsTable.subjectId,
                status: assessmentsTable.status,
            })
            .from(assessmentsTable)
            .where(eq(assessmentsTable.id, assessmentId))
            .then((rows) => rows[0] ?? null)

        if (!assessment) {
            throw new Error('Assessment not found')
        }

        const students = await this.db
            .select({
                studentId: studentsTable.id,
                name: users.name,
                email: users.email,
                image: users.image,
            })
            .from(studentsTable)
            .innerJoin(users, eq(users.id, studentsTable.userId))
            .where(eq(studentsTable.classId, assessment.classId))
            .orderBy(asc(users.name))

        const markRows = await this.db
            .select({
                id: studentMarksTable.id,
                studentId: studentMarksTable.studentId,
                score: studentMarksTable.score,
                absent: studentMarksTable.absent,
                excused: studentMarksTable.excused,
                comment: studentMarksTable.comment,
                updatedAt: studentMarksTable.updatedAt,
            })
            .from(studentMarksTable)
            .where(eq(studentMarksTable.assessmentId, assessmentId))

        const markMap = new Map(markRows.map((row) => [row.studentId, row]))

        const entries = students.map((student) => {
            const existing = markMap.get(student.studentId)
            return {
                studentId: student.studentId,
                name: student.name,
                email: student.email,
                image: student.image,
                markId: existing?.id ?? null,
                score: existing?.score ?? null,
                absent: existing?.absent ?? false,
                excused: existing?.excused ?? false,
                comment: existing?.comment ?? null,
                updatedAt: existing?.updatedAt ?? null,
            }
        })

        return {
            assessment,
            entries,
            summary: {
                totalStudents: entries.length,
                enteredMarks: entries.filter((e) => e.score !== null || e.absent).length,
            },
        }
    }

    async saveStudentMarks(input: SaveStudentMarksSchema) {
        const assessment = await this.db
            .select({
                id: assessmentsTable.id,
                classId: assessmentsTable.classId,
                maxScore: assessmentsTable.maxScore,
            })
            .from(assessmentsTable)
            .where(eq(assessmentsTable.id, input.assessmentId))
            .then((rows) => rows[0] ?? null)

        if (!assessment) {
            throw new Error('Assessment not found')
        }

        const studentIds = input.marks.map((m) => m.studentId)

        const validStudents = await this.db
            .select({
                id: studentsTable.id,
            })
            .from(studentsTable)
            .where(
                and(
                    eq(studentsTable.classId, assessment.classId),
                    inArray(studentsTable.id, studentIds),
                ),
            )

        const validStudentSet = new Set(validStudents.map((s) => s.id))

        for (const mark of input.marks) {
            if (!validStudentSet.has(mark.studentId)) {
                throw new Error(`Student ${mark.studentId} does not belong to this class`)
            }

            if (
                mark.score != null &&
                (mark.score < 0 || mark.score > Number(assessment.maxScore))
            ) {
                throw new Error(
                    `Score for student ${mark.studentId} must be between 0 and ${assessment.maxScore}`,
                )
            }
        }

        const existingRows = await this.db
            .select({
                id: studentMarksTable.id,
                studentId: studentMarksTable.studentId,
            })
            .from(studentMarksTable)
            .where(eq(studentMarksTable.assessmentId, input.assessmentId))

        const existingMap = new Map(existingRows.map((row) => [row.studentId, row.id]))
        const insertedMarkIds: string[] = []

        try {
            for (const mark of input.marks) {
                const existingId = existingMap.get(mark.studentId)

                if (existingId) {
                    await this.db
                        .update(studentMarksTable)
                        .set({
                            score: mark.absent ? null : (mark.score ?? null),
                            absent: mark.absent ?? false,
                            excused: mark.excused ?? false,
                            comment: mark.comment ?? null,
                        })
                        .where(eq(studentMarksTable.id, existingId))
                } else {
                    const [createdMark] = await this.db.insert(studentMarksTable).values({
                        schoolId: input.schoolId,
                        assessmentId: input.assessmentId,
                        studentId: mark.studentId,
                        score: mark.absent ? null : (mark.score ?? null),
                        absent: mark.absent ?? false,
                        excused: mark.excused ?? false,
                        comment: mark.comment ?? null,
                    }).returning({ id: studentMarksTable.id })

                    if (createdMark) {
                        insertedMarkIds.push(createdMark.id)
                    }
                }
            }
        } catch (error) {
            if (insertedMarkIds.length > 0) {
                await this.db
                    .delete(studentMarksTable)
                    .where(inArray(studentMarksTable.id, insertedMarkIds))
                    .catch(() => undefined)
            }
            throw error
        }

        return await this.getAssessmentMarks(input.assessmentId)
    }
}

export const marksController = new MarksController(db)