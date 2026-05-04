import { db, type Database } from '../db.ts'
import { classesTable, gradesTable, studentsTable, usersTable } from '../schema.ts'
import type { NewStudent, Student } from '../../types.ts'
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  type SQL,
} from 'drizzle-orm'
import {
  StudentUserDto,
  type StudentUser,
} from '../../modules/students/students.types.ts'
import type { GetStudentsSchema } from '#/schemas/students.schema.ts'

export interface IStudentsRepository {
  createStudent(data: NewStudent): Promise<Student>
  findStudentById(id: string): Promise<StudentUser | undefined>
  findStudentByUserId(userId: string): Promise<StudentUser | undefined>
  listStudents(
    query: GetStudentsSchema,
  ): Promise<{
    data: StudentUser[]
    pagination: {
      totalCount: number
      totalPages: number
    }
  }>
  updateStudent(id: string, data: Partial<NewStudent>): Promise<Student | undefined>
  deleteStudent(id: string): Promise<void>
}

class StudentsRepository implements IStudentsRepository {
  constructor(private readonly db: Database) { }

  async createStudent(data: NewStudent): Promise<Student> {
    const [student] = await this.db.insert(studentsTable).values(data).returning()
    return student
  }

  async findStudentById(id: string): Promise<StudentUser | undefined> {
    const student = await this.db.query.studentsTable.findFirst({
      where: eq(studentsTable.id, id),
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
    })

    if (!student || !student.user) return undefined

    return StudentUserDto(student, student.user, student.class, student.class.grade)
  }

  async findStudentByUserId(userId: string): Promise<StudentUser | undefined> {
    const student = await this.db.query.studentsTable.findFirst({
      where: eq(studentsTable.userId, userId),
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
    })

    if (!student || !student.user) return undefined

    return StudentUserDto(student, student.user, student.class, student.class.grade)
  }

  async listStudents({
    search,
    page,
    size,
    classe,
    email,
    grade,
    sortBy,
    sortOrder,
    status,
  }: GetStudentsSchema) {
    const safePage = Math.max(1, page ?? 1)
    const safeSize = Math.max(1, size ?? 10)
    const offset = (safePage - 1) * safeSize

    const conditions: SQL<unknown>[] = []

    const normalizedSearch = search?.trim()
    const normalizedEmail = email?.trim()
    const normalizedClasse = classe?.trim()
    const normalizedGrade = grade?.trim()
    const normalizedStatus = status?.trim()

    if (normalizedSearch) {
      conditions.push(
        or(
          ilike(usersTable.username, `%${normalizedSearch}%`),
          ilike(usersTable.email, `%${normalizedSearch}%`)
        ) as SQL<unknown>
      );
    }

    if (normalizedEmail) {
      conditions.push(ilike(usersTable.email, `%${normalizedEmail}%`))
    }

    if (normalizedClasse) {
      conditions.push(eq(studentsTable.classId, normalizedClasse))
    }

    if (normalizedGrade) {
      conditions.push(eq(classesTable.gradeId, normalizedGrade))
    }

    if (normalizedStatus) {
      conditions.push(eq(studentsTable.status, normalizedStatus as any))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const orderColumn =
      sortBy === 'email' ? usersTable.email : usersTable.username

    const orderDirection =
      sortOrder === 'desc' ? desc(orderColumn) : asc(orderColumn)

    const [rows, totalResult] = await Promise.all([
      this.db
        .select({
          student: studentsTable,
          user: usersTable,
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
        .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
        .innerJoin(classesTable, eq(studentsTable.classId, classesTable.id))
        .innerJoin(gradesTable, eq(classesTable.gradeId, gradesTable.id)).where(whereClause)
        .orderBy(orderDirection)
        .limit(safeSize)
        .offset(offset),

      this.db
        .select({
          total: count(),
        })
        .from(studentsTable)
        .innerJoin(usersTable, eq(studentsTable.userId, usersTable.id))
        .innerJoin(classesTable, eq(studentsTable.classId, classesTable.id))
        .innerJoin(gradesTable, eq(classesTable.gradeId, gradesTable.id)).where(whereClause),
    ])

    const totalCount = Number(totalResult[0]?.total ?? 0)
    const totalPages = Math.ceil(totalCount / safeSize)

    const data = rows.map(({
      student,
      user,
      classe,
      grade
    }) => StudentUserDto(student, user, classe, grade))

    return {
      data,
      pagination: {
        totalCount,
        totalPages,
      },
    }
  }

  async updateStudent(
    id: string,
    data: Partial<NewStudent>,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(studentsTable)
      .set(data)
      .where(eq(studentsTable.id, id))
      .returning()

    return student
  }

  async deleteStudent(id: string): Promise<void> {
    const student = await this.db.query.studentsTable.findFirst({
      where: eq(studentsTable.id, id),
    })

    if (!student) return

    await this.db.transaction(async (tx) => {
      await tx.delete(studentsTable).where(eq(studentsTable.id, id))

      if (student.userId) {
        await tx.delete(usersTable).where(eq(usersTable.id, student.userId))
      }
    })
  }
}

export const studentsRepository = new StudentsRepository(db)