import { db, type Database } from "../db.js";
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
import { studentsTable, UserRoleEnum, users, classesTable, gradesTable } from "../schema.js";
import { StudentUserDto, type AddStudentType,  type Student, type StudentSearchType, type StudentUser } from "#/types/studentTypes.js";
import { getAllStudentsServerFn } from "#/server/modules/students/students.server-functions.js";


export interface IStudentsRepository {
  createStudent(data: AddStudentType): Promise<Student>;

  findStudentById(id: string): Promise<StudentUser | undefined>;
  findStudentByUserId(userId: string): Promise<StudentUser | undefined>;

  listStudents(search_queries: StudentSearchType): Promise<{ data: StudentUser[]; pagination: { totalCount: number, totalPages: number } }>;
  updateStudent(id: string, data: Partial<AddStudentType>): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<Student | undefined>;
}

class StudentsRepository implements IStudentsRepository {
  constructor(private readonly db: Database) { }

  // create student query function 

  async createStudent(data: AddStudentType): Promise<Student> {

    const userId = crypto.randomUUID();
    const studentId = crypto.randomUUID();

    const newUser = await this.db.insert(users).values({ id: userId, name: data.name, email: data.email, image: data.image, gender: data.gender, telNumber: data.telNumber, role: UserRoleEnum.STUDENT }).returning();

    if (!newUser) {
      throw new Error("Failed to create user for student");
    }

    console.log(newUser);

    const [newStudent] = await this.db
      .insert(studentsTable)
      .values({
        ...data,
        userId,
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
    });
    if (!student) return undefined;
    return StudentUserDto(student, student.user, student.class, student.class.grade);
  }

  // find student by user id query function

  async findStudentByUserId(
    userId: string,
  ) {
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
    });
    if (!student) return undefined;
    return StudentUserDto(student, student.user, student.class, student.class.grade);
  }

  // list students query function with search, pagination and sorting
  // still not completed

  async listStudents({
    search,
    page,
    size,
    sortBy,
    sortOrder,
  }: StudentSearchType) {
    const safePage = Math.max(1, page ?? 1)
    const safeSize = Math.max(1, size ?? 10)
    const offset = (safePage - 1) * safeSize

    const conditions: SQL<unknown>[] = []

    const normalizedSearch = search?.trim()
    

    if (normalizedSearch) {
      conditions.push(
        or(
          ilike(users.name, `%${normalizedSearch}%`),
          ilike(users.email, `%${normalizedSearch}%`)
        ) as SQL<unknown>
      );
    }

    

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    const orderColumn =
      sortBy === 'email' ? users.email : users.name

    const orderDirection =
      sortOrder === 'desc' ? desc(orderColumn) : asc(orderColumn)

    const [rows, totalResult] = await Promise.all([
      this.db
        .select({
          student: studentsTable,
          user: users,
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
        .innerJoin(users, eq(studentsTable.userId, users.id))
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
        .innerJoin(users, eq(studentsTable.userId, users.id))
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