import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from 'react-hook-form'
import { studentFetcher } from './fetcher'
import type { Filters } from '../types/apiTypes'
import { addStudentServerFn, deleteStudentServerFn, editStudentServerFn, getStudentByIdServerFn } from '#/server/modules/students/students.server-functions';
import type { StudentUser } from '#/server/modules/students/students.types';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { addStudentSchema, editStudentSchema, type AddStudentSchema, type EditStudentSchema } from '#/schemas/students.schema';
import { UserGenderEnum } from '#/server/db/schema'

// add student
export function useAddStudent(schoolId: string) {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate: addStudent } = useMutation({
    mutationFn: async (data: AddStudentSchema) => {
      const response = await addStudentServerFn({ data: data as any })
      return response
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["students"] })
      await queryClient.invalidateQueries({ queryKey: ["students"] })
      await router.invalidate({ sync: true });
    }
  })

  const studentForm = useForm<AddStudentSchema>({
    resolver: standardSchemaResolver(addStudentSchema),
    defaultValues: {
      telNumber: "11111111",
      status: "New",
      schoolId,
      parentPhoneNumber: "11111111",
      parentName: "Mohammed",
      name: "Abdelouadoud",
      image: "",
      gender: UserGenderEnum.MALE,
      enrollmentDate: new Date().toISOString(),
      email: "abdelouadoud_student@email.com",
      dateOfBirth: new Date().toISOString(),
      address: "Hassi El Ghela"
    }
  })
  function onSubmit(data: AddStudentSchema) {
    addStudent(data, {
      onSuccess: () => {
        toast.success("User Added", { description: "Redirection to students page..." })
        navigate({ to: "/owner/students" })
      },
      onError: () => {
        toast.error("Error occured")
      }
    })
  }
  return { studentForm, onSubmit }
}

export const getStudentQueryOptions = (studentId: string) => ({
  queryKey: ['student', studentId],
  queryFn: async () => {
    const response = await getStudentByIdServerFn({ data: studentId })//studentFetcher.getStudent(studentId)
    if (response.success) return response.data
    throw new Error("user not found");
  },
})

// get student by id
// export function useGetStudent(id: string) {
//   return useQuery<StudentUser | null>(getStudentQueryOptions(id))
// }

// get student list
export function useGetStudents({
  page,
  search,
  size,
}: Partial<Filters<StudentUser>>) {
  return useQuery({
    queryKey: ['students', page, search, size],
    queryFn: () =>
      studentFetcher.getStudents({ page, search, size }),
    select: (response) => {
      return {
        data: response.success ? response.data : [],
        pagination: {
          totalPages: response.success ? response.pagination.totalPages : 1,
          totalElements: response.success
            ? response.pagination.totalElements
            : 0,
        },
      }
    },
    placeholderData: keepPreviousData,
  })
}

// edit student information
export function useEditStudent(edited: StudentUser) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate: editStudent } = useMutation({
    mutationFn: async (data: EditStudentSchema) => {
      const response = await editStudentServerFn({ data })
      return response
    },
    // onMutate: () => {
    // queryClient.cancelQueries({ queryKey: ['students'] })
    // const oldStudentList = queryClient.getQueryData<Array<StudentUser>>([
    //   'students',
    // ])
    // const newStudentList = oldStudentList?.map((student) =>
    //   student.id === edited.id
    //     ? { ...student, ...edited }
    //     : student,
    // )
    // queryClient.setQueryData(['students'], newStudentList)
    // },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })

  function onSubmit(data: EditStudentSchema) {
    const newData: EditStudentSchema = {
      name: data.name,
      email: data.email,
      gradeId: data.gradeId,
      classId: data.classId,
      parentPhoneNumber: data.parentPhoneNumber,
      parentName: data.parentName,
      gender: data.gender,
      address: data.address,
      dateOfBirth: data.dateOfBirth,
      enrollmentDate: data.enrollmentDate,
      status: edited.status,
      image: data.image,
      telNumber: data.telNumber,
      studentId: data.studentId
    }
    console.log({ newData })
    editStudent(newData, {
      onSuccess: () => {
        toast.success("Edit User Success")
        router.invalidate()

      }
    })
  }

  const studentForm = useForm<EditStudentSchema>({
    defaultValues: {
      status: edited.status,
      parentPhoneNumber: edited.parentPhoneNumber,
      parentName: edited.parentName,
      name: edited.name,
      image: edited.image ?? "",
      gender: edited.gender,
      enrollmentDate: new Date().toISOString(),
      email: edited.email,
      dateOfBirth: new Date().toISOString(),
      address: edited.address,
      telNumber: edited.telNumber ?? "11111111",
      studentId: edited.id,
      classId: edited.class.id,
      gradeId: edited.grade.id
    },
    resolver: standardSchemaResolver(editStudentSchema),
  })

  return { studentForm, onSubmit }
}

// delete student
export function useDeleteStudent() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (studentId: string) => deleteStudentServerFn({ data: studentId }),//studentFetcher.deleteStudent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      await router.invalidate()
      // queryClient.removeQueries({ queryKey: ['students', studentId] })
    },
    // onMutate: async (studentId) => {
    //   await queryClient.cancelQueries({ queryKey: ['students'] })

    //   const previous = queryClient.getQueryData(['students'])

    //   queryClient.setQueryData(['students'], (old: any[]) =>
    //     old?.filter((s) => s.id !== studentId)
    //   )

    //   return { previous }
    // },

    // onError: (_, __, context) => {
    //   queryClient.setQueryData(['students'], context?.previous)
    // },
  })
}
