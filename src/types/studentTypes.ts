import * as schema from '#/server/db/schema'
import {
  addStudentSchema,
  dashboardPeriodSchema,
  editStudentSchema,
  getStudentsSchema,
  studentSearchSchema,
} from '#/schemas/students.schema'
import z from 'zod'
import type { AuthUser } from './authTypes'

export type Student = typeof schema.studentsTable.$inferSelect
export type StudentUser = Omit<AuthUser, 'info'> & {
  info: Student & {
    class: {
      id: string
      name: string
    }
    grade: {
      id: string
      name: string
    }
  }
}

export type GetStudentsType = z.infer<typeof getStudentsSchema>

export type AddStudentType = z.infer<typeof addStudentSchema>

export type EditStudentType = z.infer<typeof editStudentSchema>

export type StudentSearchType = z.infer<typeof studentSearchSchema>

export type StudentMarksType = typeof schema.studentMarksTable.$inferSelect

export function StudentUserDto(
  student: Student,
  user: AuthUser,
  studentClass: { id: string; name: string },
  grade: { id: string; name: string },
): StudentUser {
  return {
    ...user,
    info: {
      ...student,
      class: {
        id: studentClass.id,
        name: studentClass.name,
      },
      grade: {
        id: grade.id,
        name: grade.name,
      },
    },
  }
}



// related to dashboard  
export enum DashboardPeriodEnum {
  MONTH = 'month',
  HALFYEAR = '6months',
  YEAR = 'year'
}

// inferred type from schema
export type DashboardPeriod = z.infer<
  typeof dashboardPeriodSchema
>