import type { AddStudentSchema, EditStudentSchema, GetStudentsSchema } from "#/schemas/students.schema";
import { db } from "#/server/db/db";
import { account, classesTable, StatusEnum, studentsTable, UserRoleEnum, users } from "#/server/db/schema";
import { and, count, eq, gte, lt } from "drizzle-orm";
import generateId from "../../utils/id_generator";
import { generateTemporaryPassword } from "../../utils/temp_password_generator";
import { StudentUserDto, type StudentUser } from "./students.types";
import { handlePassword } from "#/server/utils/handle-password";
import { studentsRepository, type IStudentsRepository } from "#/server/db/repo";

class StudentsController {
    constructor(private readonly studentsRepository: IStudentsRepository) { }

    async listStudents(search_queries: GetStudentsSchema) {
        return await this.studentsRepository.listStudents(search_queries);
    }





    async addStudent(data: AddStudentSchema) {
        const userId = generateId();

        const passwordHash = await handlePassword.hash(generateTemporaryPassword(data.name))

        const student = await db.transaction(async (tx) => {
            const classe = await tx.query.classesTable.findFirst({
                where: eq(classesTable.id, data.classId)
            })
            if (!classe) throw new Error("Classe Not Found");

            await tx.insert(users).values({
                id: userId,
                email: data.email,
                telNumber: data.telNumber,
                gender: data.gender,
                image: data.image,
                role: UserRoleEnum.STUDENT,
                name: data.name,
                createdAt: new Date(),
                updatedAt: new Date(),
            })

            await tx.insert(account).values({
                id: generateId(),
                userId,
                accountId: userId,
                providerId: "credentials",
                password: passwordHash,
                createdAt: new Date(),
            })

            const [{ id: studentId }] = await tx
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

            const student = await tx.query.studentsTable.findFirst({
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
            return student;
        })

        if (!student) throw new Error("USER CREATED");

        const studentWithUser: StudentUser = StudentUserDto(student, student?.user, student?.class, student?.class.grade);
        console.log({ studentWithUser })
        return studentWithUser
    }

    async getStudent(studentId: string) {
        return this.studentsRepository.findStudentById(studentId)
    }

    async editStudent(data: EditStudentSchema) {
        const password = generateTemporaryPassword(data.name)
        const passwordHash = await handlePassword.hash(password);

        const student = await db.transaction(async (tx) => {
            const foundStudent = await tx.query.studentsTable.findFirst({
                where: eq(studentsTable.id, data.studentId),
                columns: { userId: true }
            });
            if (!foundStudent) throw new Error("Student not found");
            const userId = foundStudent.userId;

            const [updatedUser] = await tx
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

            await tx.update(account)
                .set({
                    password: passwordHash,
                })
                .where(eq(account.userId, userId))



            console.log({ newUser: updatedUser });

            const [updatedStudent] = await tx
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
            console.log({ newStudent: updatedStudent })

            const student = await tx.query.studentsTable.findFirst({
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
            return student
        })

        if (!student) throw new Error("User UPDATED")

        const studentWithUser: StudentUser = StudentUserDto(student, student.user, student.class, student.class.grade);
        console.log({ studentWithUser })
        return studentWithUser

    }

    async deleteStudent(studentId: string) {
        await this.studentsRepository.deleteStudent(studentId)
    }

    async getStudentsStats() {
        const now = new Date()

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

        const [{ totalStudents }] = await db
            .select({ totalStudents: count() })
            .from(studentsTable)

        const [{ totalMonthEnrollments }] = await db
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
}

export const studentsController = new StudentsController(studentsRepository);

