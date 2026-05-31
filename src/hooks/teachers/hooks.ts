import {
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { addTeacherServerFn, assignTeacherToClassAndSubjectServerFn, deleteTeacherAssignmentServerFn, deleteTeacherServerFn, editTeacherServerFn, getTeacherByIdServerFn, getTeacherByUserIdServerFn } from '#/server/modules/teachers/teachers.server-functions'
import { addTeacherSchema, assignTeacherSchema, editTeacherSchema } from '#/schemas/teachers.schema'
import type { TeacherUser } from '#/types/teacherTypes'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { toast } from 'sonner'
import { useNavigate, useRouter } from '@tanstack/react-router'
import { queryClient } from '#/lib/query-client'
import { StatusEnum, UserGenderEnum } from '#/server/db/schema'
import type { APIResponse } from '#/server/utils/response.type'
import type {
  AddTeacherType,
  AssignTeacherType,
  EditTeacherType,
} from '#/types/teacherTypes'
import type { UseFormReturn } from 'react-hook-form'
import { useEffect } from 'react'

export function useAddTeacher(schoolId: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const router = useRouter()
  const form = useForm<AddTeacherType>({
    resolver: standardSchemaResolver(addTeacherSchema),
    mode: "onBlur",
    defaultValues: {
      status: StatusEnum.NEW,
      name: "New Teacher",
      telNumber: "0675243935",
      schoolId,
      image: undefined,
      gender: UserGenderEnum.MALE,
      email: "new_teacher@email.com",
      dateOfBirth: new Date().toISOString(),
      address: "",
      about: "",
    },
  })

  useEffect(() => {
    if (!schoolId) {
      return
    }

    form.reset({
      ...form.getValues(),
      schoolId,
    })
  }, [form, schoolId])


  const { mutate: addTeacher } = useMutation({
    mutationFn: async (data: AddTeacherType) => {
      const response = await addTeacherServerFn({ data })
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
      await queryClient.invalidateQueries({ queryKey: ['teachers'] })
      router.invalidate()
      navigate({ to: "/admin/teachers" })
    },
  })


  function onSubmit(data: AddTeacherType) {
    addTeacher(data, {
      onSuccess: () => {
        toast.success("Teacher added")
      },
      onError: (error) => {
        toast.error(error.message || "Error has occured")
      }
    })
  }

  return { form, onSubmit }
}


export function useEditTeacher(editedTeacher: TeacherUser) {

  const teacherForm: UseFormReturn<EditTeacherType> = useForm<EditTeacherType>({
    defaultValues: {
      teacherId: editedTeacher.info.id,
      name: editedTeacher.name,
      telNumber: editedTeacher.telNumber ?? '',
      status: editedTeacher.info.status,
      image: editedTeacher.image ?? null,
      gender: editedTeacher.gender,
      email: editedTeacher.email,
      dateOfBirth: editedTeacher.info.dateOfBirth,
      address: editedTeacher.info.address,
      about: editedTeacher.info.about,
    },
    resolver: standardSchemaResolver(editTeacherSchema),
  })

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: editTeacher } = useMutation({
    mutationFn: async (data: EditTeacherType) => {
      try {
        const response = await editTeacherServerFn({ data })
        if (response.success) {
          return response.data
        }
        throw new Error("Error has occured")
      }
      catch (error) {
        console.log({ error })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
  })

  function onSubmit(data: EditTeacherType) {
    editTeacher(data, {
      onSuccess: () => {
        toast.success("Teacher updated")
        navigate({ to: "/admin/teachers" })
      },
      onError: () => {
        toast.error("Error occured")
      }
    })
  }

  return { teacherForm, onSubmit }
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
  const form = useForm<AssignTeacherType>({
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
    mutationFn: async (data: AssignTeacherType) => {
      const response = await assignTeacherToClassAndSubjectServerFn({ data })
      if (response.success) return response.data
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

  async function onSubmit(data: AssignTeacherType) {
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
  const form: UseFormReturn<EditTeacherType> = useForm<EditTeacherType>({
    resolver: standardSchemaResolver(editTeacherSchema),
    defaultValues: {
      teacherId: teacher.id,
      name: teacher.name,
      email: teacher.email,
      image: teacher.image,
      telNumber: teacher.telNumber ?? '',
      gender: teacher.gender,
      about: teacher.info.about,
      address: teacher.info.address,
      dateOfBirth: teacher.info.dateOfBirth,
      status: teacher.info.status,
    }
  })
  const router = useRouter()
  const { mutate: updateTeacherSettings } = useMutation({
    mutationFn: async (data: EditTeacherType) => {
      const response = await editTeacherServerFn({ data })
      if (response.success) return response.data
      throw new Error("Error occured")
    },
    onSuccess: () => {
      toast.success("Update Success")
      router.invalidate()
      queryClient.invalidateQueries({ queryKey: ["teachers", teacher.id, `userId-${teacher.info.userId}`] })
    },
    onError: () => {
      toast.error("Error occured")
    }
  })
  const onSubmit = async (data: EditTeacherType) => {
    updateTeacherSettings(data)
    form.reset()
  }

  return { form, onSubmit }
}
