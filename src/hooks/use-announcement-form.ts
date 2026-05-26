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
      schoolId: user.role === UserRoleEnum.ADMIN ? (user as AdminUser).info.id : user.role === UserRoleEnum.TEACHER ? (user as TeacherUser).info.schoolId : ""
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

      reset({
        title: '',
        description: '',
        audience: AnnouncementAudienceEnum.PUBLIC,
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
