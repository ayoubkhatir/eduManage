import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { SubmitHandler } from 'react-hook-form'
import { createAnnouncementServerFn } from '#/server/modules/announcement/announcement.server-functions'
import type { CreateAnnouncementType } from '#/types/announcementTypes'
import type { AdminUser } from '#/types/usersTypes'
import { createAnnouncementSchema } from '#/schemas/announcement.schema'
import { AnnouncementAudienceEnum, UserRoleEnum } from '#/server/db/schema'
import type { TeacherUser } from '#/types/teacherTypes'

// const createAnnouncement = async (payload: AnnouncementPayload) => {
//   const response = await fetch('http://localhost:4000/announcements', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       ...payload,
//       id: Date.now().toString(),
//     }),
//   })

//   if (!response.ok) {
//     throw new Error('Failed to create announcement')
//   }

//   return response.json()
// }

export function useAnnouncementForm(user: TeacherUser | AdminUser) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState
  } = useForm<CreateAnnouncementType>({
    resolver: zodResolver(createAnnouncementSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      audience: AnnouncementAudienceEnum.PUBLIC,
      authorId: user.id,
      schoolId: user.role === UserRoleEnum.ADMIN ? user.info.id : UserRoleEnum.TEACHER ? user.info.id : ""
      // BECAUSE THE COMPILER THINK role CAN BE ALSO A STUDENT, BUT IN THIS CASE THE user IS ONLY A TEACHER OR ADMIN
    },
  })

  const createAnnouncementMutation = useMutation({
    mutationFn: async (data: CreateAnnouncementType) => {
      const response = await createAnnouncementServerFn({ data })
      if (!response.success) throw new Error(response.errorType)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast.success('Announcement created successfully!')
      navigate({ to: '/admin/announcements' })
    },
    onError: () => {
      toast.error('Failed to create announcement. Please try again.')
    },
  })
  console.log({ formState, values: watch() })

  const onSubmit: SubmitHandler<CreateAnnouncementType> = useCallback(
    async (data) => {
      await createAnnouncementMutation.mutateAsync(data)
      // authorId: user.info.id, // TODO: Get current user
      // schoolId: user.info.id,

      reset({
        title: '',
        description: '',
        audience: AnnouncementAudienceEnum.PUBLIC,
        // status: 'DRAFT',
      })
    },
    [createAnnouncementMutation, reset],
  )

  return {
    register,
    control,
    handleSubmit,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    onSubmit,
    isLoading: createAnnouncementMutation.isPending,
    isError: createAnnouncementMutation.isError,
  }
}
