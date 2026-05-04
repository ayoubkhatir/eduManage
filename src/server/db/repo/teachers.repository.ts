import {
  and,
  asc,
  desc,
  eq,
  ilike,
  count,
  or,
  type SQL,
} from 'drizzle-orm'

import { db, type Database } from '../db.js'
import type { NewTeacher, Teacher } from '../../types'
import { teachersTable, usersTable } from '../schema.js'
import { TeacherUserDto, type TeacherUser } from '#/server/modules/teachers/teachers.types'
import type { GetTeachersSchema } from '#/schemas/teachers.schema.js'

export interface ITeachersRepository {
  createTeacher(data: NewTeacher): Promise<Teacher>
  findTeacherById(id: string): Promise<TeacherUser | undefined>
  findTeacherByUserId(userId: string): Promise<TeacherUser | undefined>
  listTeachers(searchQueries: GetTeachersSchema): Promise<{
    data: TeacherUser[]
    pagination: {
      totalCount: number
      totalPages: number
    }
  }>
  updateTeacher(id: string, data: Partial<NewTeacher>): Promise<Teacher | undefined>
  deleteTeacher(id: string): Promise<void>
}

class TeacherRepository implements ITeachersRepository {
  constructor(private readonly db: Database) { }

  async createTeacher(data: NewTeacher): Promise<Teacher> {
    const [teacher] = await this.db.insert(teachersTable).values(data).returning()
    return teacher
  }

  async findTeacherById(id: string): Promise<TeacherUser | undefined> {
    const teacher = await this.db.query.teachersTable.findFirst({
      where: eq(teachersTable.id, id),
      with: { user: true },
    })

    if (!teacher || !teacher.user) return undefined

    return TeacherUserDto(teacher, teacher.user);
  }

  async findTeacherByUserId(userId: string): Promise<TeacherUser | undefined> {
    const teacher = await this.db.query.teachersTable.findFirst({
      where: eq(teachersTable.userId, userId),
      with: { user: true },
    })

    if (!teacher || !teacher.user) return undefined

    return TeacherUserDto(teacher, teacher.user)
  }

  async listTeachers({
    search,
    page,
    size,
    sortBy,
    sortOrder,
    subject,
    status,
    email
  }: GetTeachersSchema): Promise<{
    data: TeacherUser[]
    pagination: {
      totalCount: number
      totalPages: number
      page: number
      size: number
    }
  }> {
    const safePage = Math.max(1, page ?? 1)
    const safeSize = Math.max(1, size ?? 10)
    const offset = (safePage - 1) * safeSize

    const conditions: SQL<unknown>[] = []

    const normalizedSearch = search?.trim()
    const normalizedSubject = subject?.trim()
    const normalizedStatus = status?.trim()

    // if (schoolId) {
    //   conditions.push(eq(teachersTable.schoolId, schoolId))
    // }
    // if (email) {
    //   conditions.push(eq(teachersTable.email, schoolId))
    // }

    if (normalizedSearch) {
      conditions.push(
        or(
          ilike(usersTable.username, `%${normalizedSearch}%`),
          ilike(usersTable.email, `%${normalizedSearch}%`)
        )!
      )
    }

    if (normalizedSubject) {
      conditions.push(ilike(teachersTable.subjects, `%${normalizedSubject}%`))
    }

    if (normalizedStatus) {
      conditions.push(eq(teachersTable.status, normalizedStatus as any))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // const orderColumn =
    //   sortBy === 'email'
    //     ? usersTable.email
    //     : sortBy === 'status'
    //       ? teachersTable.status
    //       : sortBy === 'subject'
    //         ? teachersTable.subjects
    //         : usersTable.username

    // const orderDirection =
    // sortOrder === 'desc' ? desc(orderColumn) : asc(orderColumn)

    const [rows, totalRows] = await Promise.all([
      this.db
        .select({
          teacher: teachersTable,
          user: usersTable,
        })
        .from(teachersTable)
        .innerJoin(usersTable, eq(teachersTable.userId, usersTable.id))
        .where(whereClause)
        // .orderBy(orderDirection)
        .limit(safeSize)
        .offset(offset),
      this.db
        .select({
          total: count(),
        })
        .from(teachersTable)
        .innerJoin(usersTable, eq(teachersTable.userId, usersTable.id))
        .where(whereClause),
    ])

    const totalCount = Number(totalRows[0]?.total ?? 0)
    const totalPages = Math.ceil(totalCount / safeSize)

    const data = rows.map(({ teacher, user }) => TeacherUserDto(teacher, user))

    return {
      data,
      pagination: {
        totalCount,
        totalPages,
        page: safePage,
        size: safeSize,
      },
    }
  }

  async updateTeacher(
    id: string,
    data: Partial<NewTeacher>,
  ): Promise<Teacher | undefined> {
    const [row] = await this.db
      .update(teachersTable)
      .set(data)
      .where(eq(teachersTable.id, id))
      .returning()

    return row
  }

  async deleteTeacher(id: string): Promise<void> {
    await this.db.delete(teachersTable).where(eq(teachersTable.id, id))
  }
}

export const teachersRepository = new TeacherRepository(db)