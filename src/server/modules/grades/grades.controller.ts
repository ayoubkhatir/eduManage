import type { AddGradeSchema } from "#/schemas/grades.schema";
import { db, type Database } from "#/server/db/db";
import { gradesTable } from "#/server/db/schema";

class GradesController {
    constructor(private readonly db: Database) { }

    async getAllGrades() {
        return this.db.query.gradesTable.findMany({
            // where: eq(gradesTable.status, "Active"),
            columns: {
                name: true,
                id: true
            }
        })
    }

    /*
    grade: {
    id: string
    name: string
    levelOrder: number
    status: string
    classes: Array<{
      id: string
      name: string
    }>
    subjects: Array<{
      id: string
      name: string
      code?: string | null
    }>
  }
    */
    async getAllGradesWithClassesAndSubjects() {
        const grades = await this.db.query.gradesTable.findMany({
            // where: eq(gradesTable.status, "Active"),
            with: {
                classes: {
                    columns: {
                        id: true,
                        name: true
                    }
                },
                gradeSubjects: {
                    columns: {},
                    with: {
                        subject: {
                            columns: {
                                id: true,
                                name: true,
                                code: true
                            }
                        }
                    }
                }
            }
        })
        const gradesData = grades.map(g => ({
            id: g.id,
            name: g.name,
            levelOrder: g.levelOrder,
            status: g.status,
            classes: g.classes,
            subjects: g.gradeSubjects.map(gs => gs.subject)
        }))
        return gradesData
    }

    async addGrade({
        levelOrder,
        name,
        schoolId,
        status
    }: AddGradeSchema) {
        const [grade] = await this.db
            .insert(gradesTable)
            .values({
                status,
                schoolId,
                name,
                levelOrder
            })
            .returning()
        return grade
    }
}

export const gradesController = new GradesController(db)