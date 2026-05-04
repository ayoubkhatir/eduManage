import type { AddStudentSchema, EditStudentSchema, GetStudentsSchema } from "#/schemas/students.schema";
import { db } from "#/server/db/db";
import { classesTable, StatusEnum, studentsTable, UserRoleEnum, usersTable } from "#/server/db/schema";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { studentsRepository, type IStudentsRepository } from "../../db/repo";
import generateId from "../../utils/id_generator";
import { generateTemporaryPassword } from "../../utils/temp_password_generator";
import { passwordHasher } from "../auth/services/password_hasher.service";
import { StudentUserDto, type StudentUser } from "./students.types";

class StudentsController {
    constructor(private readonly studentsRepository: IStudentsRepository) { }

    async listStudents(search_queries: GetStudentsSchema) {
        return await this.studentsRepository.listStudents(search_queries);
    }

    async addStudent(data: AddStudentSchema) {
        const userId = generateId();

        const password = generateTemporaryPassword(data.name)
        const passwordHash = await passwordHasher.hashPassword(password);

        const student = await db.transaction(async (tx) => {
            const classe = await tx.query.classesTable.findFirst({
                where: eq(classesTable.id, data.classId)
            })
            if (!classe) throw new Error("Classe Not Found");

            await tx.insert(usersTable).values({
                id: userId,
                email: data.email,
                passwordHash,
                role: UserRoleEnum.STUDENT,
                username: data.name,
                image: data.image,
                emailVerified: false,
                telNumber: data.telNumber,
                gender: data.gender,
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
        const passwordHash = await passwordHasher.hashPassword(password);

        const student = await db.transaction(async (tx) => {
            const foundStudent = await tx.query.studentsTable.findFirst({
                where: eq(studentsTable.id, data.studentId),
                columns: { userId: true }
            });
            if (!foundStudent) throw new Error("Student not found");
            const userId = foundStudent.userId;

            const [updatedUser] = await tx
                .update(usersTable)
                .set({
                    email: data.email,
                    passwordHash,
                    username: data.name,
                    image: data.image,
                    emailVerified: false,
                    telNumber: data.telNumber,
                    gender: data.gender,
                })
                .where(eq(usersTable.id, userId))
                .returning()
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

