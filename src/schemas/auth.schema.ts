import z from "zod/v4"
import * as schema from "../server/db/schema" 
import { authRoleSchema, genderSchema, type AuthRole  , type UserGender } from "./shared.schema"
//import Signup from '../auth/signup/signupForm';

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(5),
    rememberMe : z.boolean().optional(),
  role : authRoleSchema,
    callbackURL : z.string().optional(),
})
export const loginFieldsSchema = loginSchema.omit({ rememberMe: true, callbackURL: true , role: true })

const registerBaseSchema = z.object({
    fullName: z.string().min(2, 'Full name is required'),
    schoolName: z.string().min(2, 'School name is required'),
    email: z.email('Invalid email address'),
    gender : genderSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    rememberMe : z.boolean().optional(),
    callbackURL : z.string().optional(),
})

export const signupFieldsSchema = registerBaseSchema.omit({  rememberMe: true, callbackURL: true })

export const registerSchema = registerBaseSchema.refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
})


export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginFields = z.infer<typeof loginFieldsSchema>
export type SignupFields = z.infer<typeof signupFieldsSchema>
// user schema : 


export type AuthUserInfoTeacher = typeof schema.teachersTable.$inferSelect
export type AuthUserInfoStudent = typeof schema.studentsTable.$inferSelect
export type AuthUserInfoAdmin = typeof schema.adminsTable.$inferSelect
export type AuthUserInfo = AuthUserInfoTeacher | AuthUserInfoStudent | AuthUserInfoAdmin

export type AuthUser = typeof schema.users.$inferSelect & {
    info?: AuthUserInfo
}
// APi types : 
export type LoginRequest = {
  email: string
  password: string
  rememberMe: boolean
  role: AuthRole
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