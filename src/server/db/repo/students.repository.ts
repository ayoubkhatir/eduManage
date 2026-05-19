import { db, type Database } from "../db.js";
import { asc, desc, eq, inArray, like, sql } from "drizzle-orm";
import { studentsTable, UserRoleEnum, users } from "../schema.js";
import { type AddStudentType, type Student, type StudentSearchType } from "#/types/studentTypes.js";
import { getAllStudentsServerFn } from "#/server/modules/students/students.server-functions.js";


export interface IStudentsRepository {
  createStudent(data: AddStudentType): Promise<Student[]>;

  findStudentById(id: string): Promise<Student | undefined>;
  findStudentByUserId(userId: string): Promise<Student | undefined>;

  listStudents(search_queries: StudentSearchType): Promise<{ data: Student[]; pagination: { totalCount: number, totalPages: number } }>;
  updateStudent(id: string, data: Partial<AddStudentType>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<Student | undefined>;
}

class StudentsRepository implements IStudentsRepository {
  constructor(private readonly db: Database) { }

  // create student query function 

  async createStudent(data: AddStudentType): Promise<Student[]> {

    const userId = crypto.randomUUID();
    const studentId = crypto.randomUUID();

    const newUser = await this.db.insert(users).values({ id: userId, name: data.name, email: data.email, image: data.image, gender: data.gender, telNumber: data.telNumber, role: UserRoleEnum.STUDENT }).returning();

    if (!newUser) {
      throw new Error("Failed to create user for student");
    }

    console.log(newUser);

    const newStudent = await this.db
      .insert(studentsTable)
      .values({
        ...data,
        id: studentId,
      })
      .returning();

    if (!newStudent) {
      throw new Error("Failed to create student");
    }
    console.log(newStudent);
    return newStudent;
  }


  // find student by id query function

  async findStudentById(id: string) {
    const student = await db.query.studentsTable.findFirst({
      where: eq(studentsTable.id, id),
      with: { user: true },
    });
    if (!student) return undefined;
    return student;
  }

  // find student by user id query function

  async findStudentByUserId(
    userId: string,
  ) {
    const student = await this.db.query.studentsTable.findFirst({
      where: eq(studentsTable.userId, userId),
      with: { user: true },
    });
    if (!student) return undefined;
    return student
  }

  // list students query function with search, pagination and sorting
  // still not completed

  async listStudents({
    search,
    page,
    size,
    sortBy,
    sortOrder,
  }: StudentSearchType
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, size);
    const offset = (safePage - 1) * safeLimit;
    const searchValue = search?.trim();


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

    const whereClause = searchValue
      ? inArray(
        studentsTable.userId,
        this.db
          .select({ id: users.id })
          .from(users)
          .where(
            like(sortColumn, `%${searchValue}%`)
          ),
      )
      : undefined;

    const [data, totalResult] = await Promise.all([
      this.db.query.studentsTable.findMany({
        where: whereClause,
        with: { user: true },
        orderBy: orderByClause,
        limit: safeLimit,
        offset,
      }),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(studentsTable)
        .where(whereClause),
    ]);

    return {
      data,
      pagination: {
        totalCount: totalResult[0].total,
        totalPages: Math.ceil(totalResult[0].total / size),
      },
    }

  }

  // update student query function

  async updateStudent(
    id: string,
    data: Partial<AddStudentType>,
  ): Promise<Student | undefined> {
    const [updatedStudent] = await this.db
      .update(studentsTable)
      .set(data)
      .where(eq(studentsTable.id, id))
      .returning();

    if (!updatedStudent) throw new Error("STUDENT NOT FOUND");
    return updatedStudent;
  }

  // edit student query function

  async deleteStudent(id: string): Promise<Student | undefined> {
    const [deletedStudent] = await this.db.delete(studentsTable).where(eq(studentsTable.id, id)).returning();
    return deletedStudent;
  }

}

export const studentsRepository = new StudentsRepository(db);

export const getStudentsQueryOptions = ({
  page,
  search,
  size,
  sortOrder,
  sortBy,
}: StudentSearchType) => ({
  queryKey: ['students', page, search, size, sortOrder, sortBy],
  queryFn: async () => {
    const response = await getAllStudentsServerFn({
      data: {
        page,
        search,
        size,
        sortOrder,
        sortBy,
      },
    })

    if (response.success)
      return {
        data: response.data,
        pagination: response.pagination,
      }
    else throw new Error(response.message)
  },
  // placeholderData: keepPreviousData,
})