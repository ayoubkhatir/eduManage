import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { useForm } from 'react-hook-form'
import {
  addStudentServerFn,
  deleteStudentServerFn,
  editStudentServerFn,
  getAllStudentsServerFn,
  getStudentByIdServerFn,
} from '#/server/modules/students/students.server-functions';
import type { StudentUser } from '#/types/studentTypes';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import { addStudentSchema, editStudentSchema } from '#/schemas/students.schema';
import { StatusEnum, UserGenderEnum } from '#/server/db/schema'
import type {
  AddStudentType,
  EditStudentType,
  GetStudentsType,
} from '#/types/studentTypes'

// add student
export function useAddStudent(schoolId: string) {
  const navigate = useNavigate()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate: addStudent } = useMutation({
    mutationFn: async (data: AddStudentType) => {
      const response = await addStudentServerFn({ data: data as any })
      if (response.success) return response.data
      const message =
        'message' in response
          ? response.message
          : 'issues' in response
            ? response.issues.join(', ')
            : 'Error has occured'
      throw new Error(message)
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["students"] })
      await queryClient.invalidateQueries({ queryKey: ["students"] })
      await router.invalidate({ sync: true });
    }
  })

  const studentForm = useForm<AddStudentType>({
    resolver: standardSchemaResolver(addStudentSchema),
    defaultValues: {
      telNumber: "11111111",
      status: StatusEnum.NEW,
      schoolId,
      parentPhoneNumber: "11111111",
      parentName: "Mohammed",
      name: "Abdelouadoud",
      image: undefined,
      gender: UserGenderEnum.MALE,
      enrollmentDate: new Date().toISOString(),
      email: "abdelouadoud_student@email.com",
      dateOfBirth: new Date().toISOString(),
      address: "Hassi El Ghela"
    }
  })
  function onSubmit(data: AddStudentType) {
    addStudent(data, {
      onSuccess: () => {
        toast.success("User Added", { description: "Redirection to students page..." })
        navigate({ to: "/admin/students" })
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
    const response = await getStudentByIdServerFn({ data: studentId })
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
}: Partial<GetStudentsType>) {
  return useQuery({
    queryKey: ['students', page, search, size],
    queryFn: async () =>
      getAllStudentsServerFn({
        data: {
          page,
          search,
          size,
        },
      }),
    select: (response) => {
      return {
        data: response.success ? response.data : [],
        pagination: {
          totalPages: response.success ? response.pagination.totalPages : 1,
          totalElements: response.success
            ? response.pagination.totalCount
            : 0,
        },
      }
    },
    placeholderData: keepPreviousData,
  })
}

// edit student information
export function useEditStudent(edited: StudentUser) {
  const studentForm = useForm<EditStudentType>({
    defaultValues: {
      status: edited.info.status,
      parentPhoneNumber: edited.info.parentPhoneNumber,
      parentName: edited.info.parentName,
      name: edited.name,
      image: edited.image ?? "",
      gender: edited.gender,
      enrollmentDate: new Date().toISOString(),
      email: edited.email,
      dateOfBirth: new Date().toISOString(),
      address: edited.info.address,
      telNumber: edited.telNumber!,
      studentId: edited.info.id,
      classId: edited.info.class.id,
      gradeId: edited.info.grade.id
    },
    resolver: standardSchemaResolver(editStudentSchema),
  })

  const queryClient = useQueryClient()

  const { mutate: editStudent } = useMutation({
    mutationFn: async (data: EditStudentType) => {
      try {
        const response = await editStudentServerFn({ data })
        return response;
      } catch (error) {
        console.log({ error })
      }

    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })

  function onSubmit(data: EditStudentType) {
    const newData: EditStudentType = {
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
      status: edited.info.status,
      image: data.image,
      telNumber: data.telNumber,
      studentId: data.studentId
    }
    console.log({ newData })
    editStudent(newData, {
      onSuccess: () => {
        toast.success("Edit User Success")
      },
      onError: () => {
        toast.error("Error occured")
      }
    })
  }

  return { studentForm, onSubmit }
}

// delete student
export function useDeleteStudent() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (studentId: string) => deleteStudentServerFn({ data: studentId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['students'] })
      await router.invalidate()
    },
  })
}
