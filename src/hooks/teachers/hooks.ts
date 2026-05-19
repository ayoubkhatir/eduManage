import {
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { addTeacherServerFn, assignTeacherToClassAndSubjectServerFn, deleteTeacherAssignmentServerFn, deleteTeacherServerFn, editTeacherServerFn, getTeacherByIdServerFn, getTeacherByUserIdServerFn } from '#/server/modules/teachers/teachers.server-functions'
import { addTeacherSchema, assignTeacherSchema, editTeacherSchema } from '#/schemas/teachers.schema'
import type { TeacherUser } from '#/server/modules/teachers/teachers.types'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { toast } from 'sonner'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { queryClient } from '#/lib/query-client'
import { StatusEnum, UserGenderEnum } from '#/server/db/schema'
import type { APIResponse } from '#/server/utils/response.type'
import type {
  AddTeacherSchema,
  AssignTeacherSchema,
  EditTeacherSchema,
} from '#/types/teacherTypes'
import type { UseFormReturn } from 'react-hook-form'

export function useAddTeacher(schoolId: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const router = useRouter()
  const form = useForm<AddTeacherSchema>({
    resolver: standardSchemaResolver(addTeacherSchema),
    defaultValues: {
      status: StatusEnum.NEW,
      name: "New Teacher",
      telNumber: "11111111",
      schoolId,
      image: "",
      gender: UserGenderEnum.MALE,
      email: "new_teacher@email.com",
      dateOfBirth: new Date().toISOString(),
      address: "Hassi El Ghela"
    },
  })


  const { mutate: addTeacher } = useMutation({
    mutationFn: async (data: AddTeacherSchema) => {
      try {
        const response = await addTeacherServerFn({ data })
        return response
      } catch (error) {
        console.log({ errorCatch: error })
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teachers'] })
      router.invalidate()
      navigate({ to: "/admin/teachers" })
    },
  })


  function onSubmit(data: AddTeacherSchema) {
    addTeacher(data, {
      onSuccess: () => {
        toast.success("Teacher added")
      },
      onError: () => {
        toast.error("Error has occured")
      }
    })
  }

  return { form, onSubmit }
}

export function useEditTeacher(editedTeacher: TeacherUser) {
  const form: UseFormReturn<EditTeacherSchema> = useForm<EditTeacherSchema>({
    defaultValues: {
      teacherId: editedTeacher.id,
      name: editedTeacher.name,
      telNumber: editedTeacher.telNumber ?? '',
      status: editedTeacher.status,
      image: editedTeacher.image ?? null,
      gender: editedTeacher.gender,
      email: editedTeacher.email,
      dateOfBirth: editedTeacher.dateOfBirth,
      address: editedTeacher.address,
      about: editedTeacher.about,
    },
    resolver: standardSchemaResolver(editTeacherSchema),
  })

  const queryClient = useQueryClient()

  const { mutate: editTeacher } = useMutation({
    mutationFn: async (data: EditTeacherSchema) => {
      try {
        const response = await editTeacherServerFn({ data })
        return response
      }
      catch (error) {
        console.log({ error })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })

  function onSubmit(data: EditTeacherSchema) {
    console.log({ formData: data })
    editTeacher(data, {
      onSuccess: () => {
        toast.success("Teacher updated")
      },
      onError: () => {
        toast.error("Error occured")
      }
    })
  }

  return { form, onSubmit }
}


export function useDeleteTeacher() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (teacherId: string) => deleteTeacherServerFn({ data: teacherId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['teachers'] })
      await router.invalidate()
    },

  })
}

export const getTeacherQueryOptions = (args: { fetchBy: "userId", userId: string } | { fetchBy: "teacherId", teacherId: string }) => ({
  queryKey: [
    'teachers',
    args.fetchBy === "userId" ? `userId-${args.userId}` : args.teacherId
  ],
  queryFn: async () => {
    let response: APIResponse<TeacherUser>

    if (args.fetchBy === "teacherId") {
      response = await getTeacherByIdServerFn({ data: args.teacherId })
    } else {
      response = await getTeacherByUserIdServerFn({ data: args.userId })
    }
    if (response.success) return response.data
    throw new Error("Error occured")

  },
  placeholderData: keepPreviousData,
})

export function useAssignTeacher(teacherId: string, schoolId: string) {
  const form = useForm<AssignTeacherSchema>({
    defaultValues: {
      teacherId,
      subjectId: "",
      status: StatusEnum.NEW,
      schoolId,
      isPrimaryTeacher: false,
      classId: ""
    },
    resolver: standardSchemaResolver(assignTeacherSchema)
  })
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate: assignTeacher } = useMutation({
    mutationFn: async (data: AssignTeacherSchema) => {
      const response = await assignTeacherToClassAndSubjectServerFn({ data })
      if (response.success) return response.data
      console.log({ response })
      throw new Error("Error occured")
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["teachers", teacherId, "assignements"] })
      router.invalidate()
      toast.success("Success")
    },
    onError: () => {
      toast.error("ERROR OCCURED")
    }
  })

  async function onSubmit(data: AssignTeacherSchema) {
    console.log({ assignData: data })
    assignTeacher(data)
  }

  return { form, onSubmit }
}

export function useDeleteTeacherAssignement() {
  const router = useRouter()
  return useMutation({
    mutationFn: async (assignmentId: string) => deleteTeacherAssignmentServerFn({ data: assignmentId }),
    onSuccess: async (_, assignmentId) => {
      toast.success("Assignement deleted");
      await queryClient.invalidateQueries({ queryKey: ["assignements", assignmentId] })
      await router.invalidate()
    }
  })
}

export function useUpdateTeacherSettings(teacher: TeacherUser) {
  const form: UseFormReturn<EditTeacherSchema> = useForm<EditTeacherSchema>({
    resolver: standardSchemaResolver(editTeacherSchema),
    defaultValues: {
      teacherId: teacher.id,
      name: teacher.name,
      email: teacher.email,
      image: teacher.image,
      telNumber: teacher.telNumber ?? '',
      gender: teacher.gender,
      about: teacher.about,
      address: teacher.address,
      dateOfBirth: teacher.dateOfBirth,
      status: teacher.status,
    }
  })
  const router = useRouter()
  const { mutate: updateTeacherSettings } = useMutation({
    mutationFn: async (data: EditTeacherSchema) => {
      const response = await editTeacherServerFn({ data })
      if (response.success) return response.data
      throw new Error("Error occured")
    },
    onSuccess: () => {
      toast.success("Update Success")
      router.invalidate()
      queryClient.invalidateQueries({ queryKey: ["teachers", teacher.id, `userId-${teacher.userId}`] })
    },
    onError: () => {
      toast.error("Error occured")
    }
  })
  console.log({ errors: form.formState.errors })
  const onSubmit = async (data: EditTeacherSchema) => {
    updateTeacherSettings(data)
    form.reset()
  }

  return { form, onSubmit }
}
