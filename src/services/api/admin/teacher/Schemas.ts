import { z } from "zod/v4";

export const TeacherSchema = z.object({
    name: z.string().min(4, "Min name length is 4").max(20, "Max name length is 20"),
    id: z.string(),
    gender: z.enum(["male", "female"], { message: "Gender is required" }),
    email: z.email("Invalid email"),
    number: z.string().min(6, "Number must be at least 6 digits").max(15, "Number must be max 15 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    address: z.string().nonempty('Address is required'),
    subjects: z.array(z.string()).min(1, "At least one subject is required"),
    departement: z.string(),
    dateOfBirth: z.string(),
    joiningDate: z.string(),
    imgSrc: z.string().url("Invalid image URL").optional(),
    status: z.string().optional(),
    role: z.enum(["Admin", "Teacher", "Student"]).optional(),
})

export type TeacherModel = z.infer<typeof TeacherSchema>

export const EditTeacherSchema = TeacherSchema.omit({ id: true, role: true, password: true })
export type EditTeacherModel = z.infer<typeof EditTeacherSchema>


// add student type and schema
export const AddTeacherSchema = TeacherSchema.omit({ id: true, role: true, password: true })
export type AddTeacherModel = z.infer<typeof AddTeacherSchema>
