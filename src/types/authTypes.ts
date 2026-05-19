import type { validCuidSchema } from '#/schemas/shared.schema';
import * as schema from '#/server/db/schema';
import type {Student} from "./studentTypes"
import type {Teacher} from "./teacherTypes"
import z from "zod";



export type ID = z.infer<typeof validCuidSchema>

// user Types: 
export type Admin = typeof schema.adminsTable.$inferSelect
export type AuthUserInfo = Teacher | Student | Admin

export type AuthUser = typeof schema.users.$inferSelect & {
    info?: AuthUserInfo
}

export type UserRole = schema.UserRoleEnum
export type UserGender = schema.UserGenderEnum
export type Status = schema.StatusEnum



// APi types : 
export type LoginRequest = {
  email: string
  password: string
  rememberMe: boolean
  role: UserRole
  callbackURL?: string
}

export type RegisterRequest = {
  fullName: string
  schoolName: string
  email: string
  gender: UserGender
  password: string
  confirmPassword: string
  rememberMe: boolean
  callbackURL: string
}

export type LoginSuccessPayload = {
  redirect?: boolean
  token?: string
  url?: string
  user?: AuthUser 
}

export type AuthResult = {
  success: boolean
  message?: string
  status : number
  data?: LoginSuccessPayload
}