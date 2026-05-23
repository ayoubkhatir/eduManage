import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import type { SubmitHandler } from 'react-hook-form'
import type { AnnouncementFormType } from '@/components/admin/Announcement/announcement-form.schema'
import { getAnnouncementFormSchema } from '@/components/admin/Announcement/announcement-form.schema'

interface AnnouncementPayload {
  title: string
  content: string
  audience: 'All School' | 'Students' | 'Teachers'
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
  authorName: string
  publishedAt: string
}

const createAnnouncement = async (payload: AnnouncementPayload) => {
  const response = await fetch('http://localhost:4000/announcements', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      id: Date.now().toString(),
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create announcement')
  }

  return response.json()
}

export function useAnnouncementForm() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormType>({
    resolver: zodResolver(getAnnouncementFormSchema()),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      audience: 'All School',
      status: 'DRAFT',
    },
  })

  const createAnnouncementMutation = useMutation({
    mutationFn: (data: AnnouncementPayload) => createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      toast.success('Announcement created successfully!')
      navigate({ to: '/admin/announcements' })
    },
    onError: () => {
      toast.error('Failed to create announcement. Please try again.')
    },
  })

  const onSubmit: SubmitHandler<AnnouncementFormType> = useCallback(
    async (data) => {
      await createAnnouncementMutation.mutateAsync({
        ...data,
        authorName: 'Administration',
        publishedAt: new Date().toLocaleDateString(),
      })

      reset({
        title: '',
        content: '',
        audience: 'All School',
        status: 'DRAFT',
      })
    },
    [createAnnouncementMutation, reset],
  )

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    isLoading: createAnnouncementMutation.isPending,
    isError: createAnnouncementMutation.isError,
  }
}
