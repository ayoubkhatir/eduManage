import type { AddTeacherType, Teacher, TeacherSearchType } from "#/types/teacherTypes";
import { and, asc, desc, eq, inArray, like, sql } from "drizzle-orm";
import { teachersTable, users } from "../schema";
import { db, type Database } from "../db";

export interface ITeachersRepository {
  createTeacher(data: AddTeacherType): Promise<Teacher[]>;
  findTeacherById(id: string): Promise<Teacher | undefined>;
  findTeacherByUserId(userId: string): Promise<Teacher | undefined>;
  listTeachers(search_queries: TeacherSearchType & { schoolId: string }): Promise<{ data: Teacher[]; pagination: { totalCount: number, totalPages: number } }>;
  updateTeacher(id: string, data: Partial<AddTeacherType>): Promise<Teacher | undefined>;
  deleteTeacher(id: string): Promise<Teacher | undefined>;
  getTotalTeachers(schoolId: string): Promise<number>;
}

class TeacherRepository implements ITeachersRepository {
  constructor(private readonly db: Database) { }

  async createTeacher(data: AddTeacherType): Promise<Teacher[]> {
    const payload = { ...data, id: data.id ?? crypto.randomUUID() };
    const rows = await this.db.insert(teachersTable).values(payload).returning();
    return rows;
  }

  async findTeacherById(id: string) {
    return this.db.query.teachersTable.findFirst({
      where: eq(teachersTable.id, id),
      with: { user: true },
    });
  }

  async findTeacherByUserId(
    userId: string,
  ) {
    return this.db.query.teachersTable.findFirst({
      where: eq(teachersTable.userId, userId),
      with: { user: true },
    });
  }

  async listTeachers({
    search,
    page,
    size,
    sortBy,
    sortOrder,
  }: TeacherSearchType & { schoolId: string }): Promise<{ data: Teacher[]; pagination: { totalCount: number; totalPages: number; }; }> {

    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, size);
    const offset = (safePage - 1) * safeLimit;
    const searchValue = search?.trim();

    const whereClause = searchValue
      ? and(
        eq(teachersTable.schoolId, schoolId),
        inArray(
          teachersTable.userId,
          this.db
            .select({ id: users.id })
            .from(users)
            .where(like(users.name, `%${searchValue}%`)),
        ),
      )
      : eq(teachersTable.schoolId, schoolId);

    const sortableColumns = {
      name: users.name,
      email: users.email,
    }

    const sortColumn =
      sortableColumns[sortBy ?? "name"]

    const orderByClause =
      sortOrder === "asc"
        ? asc(sortColumn)
        : desc(sortColumn)


    const totalQuery = this.db
      .select({ total: sql<number>`count(*)` })
      .from(teachersTable)
      .where(whereClause);
    const [totalRow] = await totalQuery;
    const totalCount = Number(totalRow?.total ?? 0);
    const totalPages = Math.ceil(totalCount / safeLimit);

    const data = await this.db.query.teachersTable.findMany({
      where: whereClause,
      with: { user: true },
      orderBy: orderByClause,
      limit: safeLimit,
      offset,
    });

    return { data, pagination: { totalCount, totalPages } };
  }



  async updateTeacher(
    id: string,
    data: Partial<AddTeacherType>,
  ): Promise<Teacher | undefined> {
    const [row] = await this.db
      .update(teachersTable)
      .set(data)
      .where(eq(teachersTable.id, id))
      .returning();
    return row;
  }

  async deleteTeacher(id: string): Promise<Teacher | undefined> {
    const [row] = await this.db.delete(teachersTable).where(eq(teachersTable.id, id)).returning();
    return row;
  }

  async getTotalTeachers(schoolId: string): Promise<number> {
    const [row] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(teachersTable)
      .where(eq(teachersTable.schoolId, schoolId));
    return Number(row?.count ?? 0);
  }
}

export const teachersRepository = new TeacherRepository(db);


