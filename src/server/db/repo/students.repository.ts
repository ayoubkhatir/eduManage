import { db, type Database } from "../db.js";
import { eq, inArray, like, or, sql } from "drizzle-orm";
import { studentsTable, UserRoleEnum, users } from "../schema.js";
import { type AddStudentType, type Student, type StudentSearchType } from "#/types/studentTypes.js";


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

  // type newAuthUser = {
  //     name: string;
  //     email: string;
  //     emailVerified: boolean;
  //     image: string | null;
  //     gender: UserGenderEnum;
  //     telNumber: string | null;
  //     role: UserRoleEnum;
  // }

  //     userId: z.ZodCUID2;
  //     schoolId: z.ZodCUID2;
  //     gradeId: z.ZodCUID2;
  //     classId: z.ZodCUID2;
  //     parentPhoneNumber: z.ZodString;
  //     parentName: z.ZodString;
  //     status: z.ZodEnum<{
  //         Active: "Active";
  //         Inactive: "Inactive";
  //         Pending: "Pending";
  //         New: "New";
  //     }>;
  //     address: z.ZodString;
  //     dateOfBirth: z.ZodString;
  //     enrollmentDate: z.ZodString;
  // }, z.core.$strip>
  // import addStudentSchema

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

  async findStudentById(id: string) {
    const student = await db.query.studentsTable.findFirst({
      where: eq(studentsTable.id, id),
      with: { user: true },
    });
    if (!student) return undefined;

    return student;
  }

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

  async listStudents({
    search,
    page,
    size,
    sortBy,
    sortOrder,
  }: StudentSearchType
  ) {


    // search 
    const searchValue = search?.trim();
    // pagination
    const offset = (page - 1) * size;

    const sortByMap = sortBy === 'name' ? users.name : users.email

    // Define the where clause once
    const whereClause = searchValue
      ? inArray(
        studentsTable.userId,
        this.db
          .select({ id: users.id })
          .from(users)
          .where(like(sortByMap, `%${searchValue}%`)),
      )
      : undefined;



    // Run both queries in parallel to save time
    const [data, totalResult] = await Promise.all([
      this.db.query.studentsTable.findMany({
        where: whereClause,
        with: { user: true },
        limit: size,
        offset,
      }),
      this.db
        .select({ total: sql<number>`count(*)` })
        .from(studentsTable)
        .where(whereClause),
    ]);

    const totalCount = Number(totalResult[0]?.total ?? 0);
    const totalPages = Math.ceil(totalCount / size);

    const data_dtos = data.map(student => student)
    return { data: data_dtos, pagination: { totalCount, totalPages } };
  }


  async updateStudent(
    id: string,
    data: Partial<AddStudentType>,
  ): Promise<Student | undefined> {
    const [student] = await this.db
      .update(studentsTable)
      .set(data)
      .where(eq(studentsTable.id, id))
      .returning();
    return student;
  }

  async deleteStudent(id: string): Promise<Student | undefined> {
    const [row] = await this.db.delete(studentsTable).where(eq(studentsTable.id, id)).returning();
    return row;
  }

}

export const studentsRepository = new StudentsRepository(db);