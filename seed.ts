import 'dotenv/config'

import { faker } from '@faker-js/faker'
import { eq } from 'drizzle-orm'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import generateId from '#/lib/id_generator'
import { db } from '#/server/db/db'
import * as schema from '#/server/db/schema'
import { handlePassword } from '#/server/utils/handle-password'

faker.seed(42)

const ADMIN_PASSWORD = 'admin123'
const TEACHER_PASSWORD = 'teacher123'
const STUDENT_PASSWORD = 'student123'

const SCHOOLS = [
  {
    schoolName: 'El Maarifa School',
    adminEmail: 'admin@maarifa.edu',
    adminName: 'Abdelhadi',
    adminGender: schema.UserGenderEnum.MALE,
    domain: 'maarifa.edu',
  },
  {
    schoolName: 'Al Noor School',
    adminEmail: 'admin@alkhatir.edu',
    adminName: 'Ayoub',
    adminGender: schema.UserGenderEnum.MALE,
    domain: 'alkhatir.edu',
  },
] as const

const GRADE_DEFINITIONS = [
  { name: '1AM', levelOrder: 1 },
  { name: '2AM', levelOrder: 2 },
  { name: '3AM', levelOrder: 3 },
  { name: '4AM', levelOrder: 4 },
  { name: '5AM', levelOrder: 5 },
] as const

const CLASS_NAMES = ['A', 'B', 'C', 'D', 'E'] as const

const SUBJECT_DEFINITIONS = [
  { name: 'Mathematics', code: 'MATH' },
  { name: 'Physics', code: 'PHYS' },
  { name: 'English', code: 'ENG' },
  { name: 'Arabic', code: 'ARAB' },
  { name: 'History', code: 'HIST' },
] as const

const EVENT_TEMPLATES = [
  {
    title: 'Opening Assembly',
    description: 'Whole-school opening assembly and welcome session.',
    dayOffset: 0,
    startHour: 8,
    durationMinutes: 60,
    allDay: false,
  },
  {
    title: 'Project Launch',
    description: 'Class project kickoff with the assigned teacher.',
    dayOffset: 1,
    startHour: 9,
    durationMinutes: 90,
    allDay: false,
  },
  {
    title: 'Subject Lab',
    description: 'Focused subject session for the class group.',
    dayOffset: 2,
    startHour: 10,
    durationMinutes: 90,
    allDay: false,
  },
  {
    title: 'Parent Check-In',
    description: 'A short meeting to review progress and attendance.',
    dayOffset: 3,
    startHour: 11,
    durationMinutes: 60,
    allDay: false,
  },
  {
    title: 'Weekly Review',
    description: 'Weekly wrap-up for class planning and follow-up.',
    dayOffset: 4,
    startHour: 8,
    durationMinutes: 75,
    allDay: false,
  },
] as const

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / 1024 ** unitIndex

  return `${Number.parseFloat(size.toFixed(2))} ${units[unitIndex]}`
}

function readResourceFiles(): string[] {
  const resourceDirectory = join(process.cwd(), 'resources_to_seed')
  const files = readdirSync(resourceDirectory)
    .filter((entry) => statSync(join(resourceDirectory, entry)).isFile())
    .sort((left, right) =>
      left.localeCompare(right, 'en', { numeric: true, sensitivity: 'base' }),
    )

  if (files.length < 5) {
    throw new Error('resources_to_seed must contain at least five files')
  }

  return files.slice(0, 5)
}

function randomGender() {
  const genders = Object.values(
    schema.UserGenderEnum,
  ) as schema.UserGenderEnum[]
  return faker.helpers.arrayElement(genders)
}

function randomDateOfBirth(minAge: number, maxAge: number): string {
  return faker.date
    .birthdate({ min: minAge, max: maxAge, mode: 'age' })
    .toISOString()
    .slice(0, 10)
}

function randomEnrollmentDate(): string {
  return faker.date
    .between({
      from: new Date('2025-09-01T00:00:00.000Z'),
      to: new Date('2026-01-31T00:00:00.000Z'),
    })
    .toISOString()
    .slice(0, 10)
}

function makePhoneNumber(prefix: string): string {
  const firstBlock = faker.number.int({ min: 100, max: 999 })
  const secondBlock = faker.number.int({ min: 100, max: 999 })
  const thirdBlock = faker.number.int({ min: 100, max: 999 })

  return `${prefix} ${firstBlock} ${secondBlock} ${thirdBlock}`
}

function buildResourceUrl(fileName: string): string {
  return `/resources_to_seed/${encodeURIComponent(fileName)}`
}

async function createAuthUser(input: {
  name: string
  email: string
  gender: schema.UserGenderEnum
  role: schema.UserRoleEnum
  telNumber?: string
  image?: string | null
  password: string
}) {
  const userId = generateId()
  const passwordHash = await handlePassword.hash(input.password)

  await db.insert(schema.users).values({
    id: userId,
    name: input.name,
    email: input.email,
    gender: input.gender,
    role: input.role,
    telNumber: input.telNumber,
    image: input.image ?? null,
    emailVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  await db.insert(schema.account).values({
    id: generateId(),
    accountId: userId,
    providerId: 'credential',
    userId,
    password: passwordHash,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return userId
}

async function seedSchool(
  school: (typeof SCHOOLS)[number],
  schoolIndex: number,
) {
  const adminUserId = await createAuthUser({
    name: school.adminName,
    email: school.adminEmail,
    gender: school.adminGender,
    role: schema.UserRoleEnum.ADMIN,
    telNumber: makePhoneNumber('+213 5'),
    image: faker.image.avatar(),
    password: ADMIN_PASSWORD,
  })

  const [schoolRow] = await db
    .insert(schema.adminsTable)
    .values({
      userId: adminUserId,
      schoolName: school.schoolName,
      numberStudents: 0,
      numberTeachers: 0,
    })
    .returning({
      id: schema.adminsTable.id,
    })

  const gradeRows = await db
    .insert(schema.gradesTable)
    .values(
      GRADE_DEFINITIONS.map((grade) => ({
        schoolId: schoolRow.id,
        name: grade.name,
        levelOrder: grade.levelOrder,
        status: schema.StatusEnum.ACTIVE,
      })),
    )
    .returning({
      id: schema.gradesTable.id,
      name: schema.gradesTable.name,
      levelOrder: schema.gradesTable.levelOrder,
    })

  const classRows = await db
    .insert(schema.classesTable)
    .values(
      gradeRows.map((gradeRow, index) => ({
        schoolId: schoolRow.id,
        gradeId: gradeRow.id,
        name: CLASS_NAMES[index],
        status: schema.StatusEnum.ACTIVE,
      })),
    )
    .returning({
      id: schema.classesTable.id,
      gradeId: schema.classesTable.gradeId,
      name: schema.classesTable.name,
    })

  const subjectRows = await db
    .insert(schema.subjectsTable)
    .values(
      SUBJECT_DEFINITIONS.map((subject) => ({
        schoolId: schoolRow.id,
        name: subject.name,
        code: subject.code,
        status: schema.StatusEnum.ACTIVE,
      })),
    )
    .returning({
      id: schema.subjectsTable.id,
      name: schema.subjectsTable.name,
      code: schema.subjectsTable.code,
    })

  await db.insert(schema.gradeSubjectsTable).values(
    gradeRows.flatMap((gradeRow, gradeIndex) =>
      subjectRows.map((subjectRow, subjectIndex) => ({
        schoolId: schoolRow.id,
        gradeId: gradeRow.id,
        subjectId: subjectRow.id,
        coefficient: subjectIndex + 1,
        weeklyHours: 2 + gradeIndex,
        status: schema.StatusEnum.ACTIVE,
      })),
    ),
  )

  const teacherRows = [] as Array<{ id: string; userId: string }>

  for (let index = 0; index < 5; index += 1) {
    const teacherName = faker.person.fullName()
    const teacherUserId = await createAuthUser({
      name: teacherName,
      email: `teacher.${schoolIndex + 1}.${index + 1}@${school.domain}`,
      gender: randomGender(),
      role: schema.UserRoleEnum.TEACHER,
      telNumber: makePhoneNumber('+213 6'),
      image: faker.image.avatar(),
      password: TEACHER_PASSWORD,
    })

    const [teacherRow] = await db
      .insert(schema.teachersTable)
      .values({
        schoolId: schoolRow.id,
        userId: teacherUserId,
        address: faker.location.streetAddress(),
        dateOfBirth: randomDateOfBirth(25, 55),
        about: `Teacher responsible for ${subjectRows[index].name.toLowerCase()} activities.`,
        joiningDate: randomEnrollmentDate(),
        status: schema.StatusEnum.ACTIVE,
      })
      .returning({
        id: schema.teachersTable.id,
        userId: schema.teachersTable.userId,
      })

    teacherRows.push({ id: teacherRow.id, userId: teacherRow.userId })
  }

  const studentRows = [] as Array<{ id: string; userId: string }>

  for (let index = 0; index < 10; index += 1) {
    const studentName = faker.person.fullName()
    const studentUserId = await createAuthUser({
      name: studentName,
      email: `student.${schoolIndex + 1}.${index + 1}@${school.domain}`,
      gender: randomGender(),
      role: schema.UserRoleEnum.STUDENT,
      telNumber: makePhoneNumber('+213 7'),
      image: faker.image.avatar(),
      password: STUDENT_PASSWORD,
    })

    const classRow = classRows[index % classRows.length]

    const [studentRow] = await db
      .insert(schema.studentsTable)
      .values({
        schoolId: schoolRow.id,
        userId: studentUserId,
        classId: classRow.id,
        parentPhoneNumber: makePhoneNumber('+213 5'),
        parentName: faker.person.fullName(),
        status: schema.StatusEnum.ACTIVE,
        address: faker.location.streetAddress(),
        dateOfBirth: randomDateOfBirth(12, 18),
        enrollmentDate: randomEnrollmentDate(),
      })
      .returning({
        id: schema.studentsTable.id,
        userId: schema.studentsTable.userId,
      })

    studentRows.push({ id: studentRow.id, userId: studentRow.userId })
  }

  await db.insert(schema.teacherAssignmentsTable).values(
    classRows.map((classRow, index) => ({
      schoolId: schoolRow.id,
      teacherId: teacherRows[index].id,
      subjectId: subjectRows[index].id,
      classId: classRow.id,
      gradeId: classRow.gradeId,
      isPrimaryTeacher: true,
      status: schema.StatusEnum.ACTIVE,
    })),
  )

  const resourceFiles = readResourceFiles()

  await db.insert(schema.resourcesTable).values(
    resourceFiles.map((fileName, index) => ({
      schoolId: schoolRow.id,
      subjectId: subjectRows[index].id,
      classId: classRows[index].id,
      teacherId: teacherRows[index].id,
      fileName,
      type: schema.ResourceTypeEnum.PDF,
      size: formatFileSize(
        statSync(join(process.cwd(), 'resources_to_seed', fileName)).size,
      ),
      fileUrl: buildResourceUrl(fileName),
      description: `${subjectRows[index].name} resource for ${school.schoolName}`,
      visibility: 'class',
      status: schema.StatusEnum.ACTIVE,
    })),
  )

  await db.insert(schema.eventsTable).values(
    EVENT_TEMPLATES.map((template, index) => {
      const classRow = classRows[index]
      const teacherRow = teacherRows[index]
      const subjectRow = subjectRows[index]
      const start = new Date(
        2026,
        8,
        1 + template.dayOffset,
        template.startHour,
        0,
        0,
      )
      const end = new Date(
        start.getTime() + template.durationMinutes * 60 * 1000,
      )

      return {
        schoolId: schoolRow.id,
        classId: classRow.id,
        teacherId: teacherRow.id,
        subjectId: subjectRow.id,
        title: `${template.title} - ${classRow.name}`,
        description: template.description,
        color: index % 2 === 0 ? '#2563eb' : '#16a34a',
        start,
        end,
        allDay: template.allDay,
        repeatWeekly: index === 4,
        isClass: true,
        status: schema.StatusEnum.ACTIVE,
      }
    }),
  )

  await db
    .update(schema.adminsTable)
    .set({
      numberStudents: studentRows.length,
      numberTeachers: teacherRows.length,
    })
    .where(eq(schema.adminsTable.id, schoolRow.id))
}

async function main() {
  await db.delete(schema.users)

  for (const [index, school] of SCHOOLS.entries()) {
    await seedSchool(school, index)
  }

  console.log(
    `Seeded ${SCHOOLS.length} schools with students, teachers, classes, grades, resources, and events.`,
  )
}

main().catch((error) => {
  console.error('Seed failed:', error)
  process.exitCode = 1
})
