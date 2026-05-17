import z from "zod/v4"

export const StudentSchema = z.object({
    id: z.string(),
    name: z.string().min(2, { error: 'Name must be at least 2 characters' }).max(20, { error: 'Name must be at most 20 characters' }),
    email: z.email({ error: 'Invalid email address' }).nonempty({ error: 'Email is required' }),
    grade: z.string().nonempty({ error: 'Grade is required' }),
    classe: z.string().nonempty({ error: 'Grade is required' }),
    parentPhoneNumber: z.string().min(8, { error: 'Parent phone number is too short' }).max(15, { error: 'Parent phone number is too long' }),
    parentName: z.string().nonempty({ error: 'Parent name is required' }),
    status: z.string().nonempty({ error: 'Status is required' }),
    image: z.string().optional(),
    gender: z.enum(['Male', 'Female']),
    address: z.string(),
    dateOfBirth: z.string(),
    enrollmentDate: z.string(),
})
export type StudentModel = z.infer<typeof StudentSchema>


// edit student type and schema
export const editStudentSchema = StudentSchema.omit({ id: true, })
export type EditStudentModel = z.infer<typeof editStudentSchema>
