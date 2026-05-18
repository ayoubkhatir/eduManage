import type { AddClassSchema } from "#/schemas/classes.schema";
import { db, type Database } from "#/server/db/db";
import { classesTable, users } from "#/server/db/schema";
import { eq } from "drizzle-orm";

class ClassesController {
    constructor(private readonly db: Database) { }

    async listClassesByGradeId(gradeId: string) {
        return this.db.query.classesTable.findMany({
            where: eq(classesTable.gradeId, gradeId),
            columns: {
                name: true,
                id: true
            }
        })
    }

    async listClasses() {
        return this.db.query.classesTable.findMany({
            columns: {
                name: true,
                id: true,
                gradeId: true
            },
        })
    }

    async addClass({ gradeId, name, schoolId, status }: AddClassSchema) {
        const [newClass] = await this.db
            .insert(classesTable)
            .values({
                gradeId,
                name,
                schoolId,
                status,
            })
            .returning();
        return newClass
    }

    async getClassesByTeacherUserId(teacherUserId: string) {
        const user = await this.db.query.users.findFirst({
            where: eq(users.id, teacherUserId),
            columns: {},
            with: {
                teacher: {
                    columns: {},
                    with: {
                        assignments: {
                            columns: {},
                            with: {
                                class: {
                                    columns: { id: true, name: true }
                                }
                            }
                        }
                    }
                }
            }
        })
        return user?.teacher?.assignments.map(ass => ass.class) ?? []
    }
}
export const classesController = new ClassesController(db);