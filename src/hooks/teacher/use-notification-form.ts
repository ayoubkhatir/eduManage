import { zodResolver } from '@hookform/resolvers/zod'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form'
import type { PubNotificationType } from '@/components/teacher/notification/pubnotification.schema.ts'
import { getPubNotificationSchema } from '@/components/teacher/notification/pubnotification.schema.ts'
import useGetSendToList from '@/components/teacher/notification/getSendToList'
import { useAddTeacherNotification } from '@/services/api/teacher/notification/hooks'

const DEFAULT_NOTIFICATION_TYPE = 'Teacher'
const FILE_SELECTION_ANIMATION_MS = 220

export type RecipientOption = {
  value: string
  label: string
}

export function useNotificationForm(role: 'teacher' | 'admin') {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectionProgress, setSelectionProgress] = useState(0)

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PubNotificationType>({
    resolver: zodResolver(getPubNotificationSchema(role)),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      sendTo: role === 'teacher' ? ['Students'] : [],
      type: DEFAULT_NOTIFICATION_TYPE,
    },
  })

  const addTeacherNotificationMutation = useAddTeacherNotification()

  const onSubmit: SubmitHandler<PubNotificationType> = useCallback(
    async (data) => {
      setUploadProgress(0)

      await addTeacherNotificationMutation.mutateAsync({
        role,
        subject: data.subject.trim(),
        content: data.content.trim(),
        sendTo: role === 'admin' ? data.sendTo : undefined,
        type: data.type,
        attachments: data.attachments,
        onUploadProgress: (progress) => {
          setUploadProgress(progress)
        },
      })

      reset({
        subject: '',
        content: '',
        sendTo: role === 'teacher' ? ['Students'] : [],
        type: DEFAULT_NOTIFICATION_TYPE,
        attachments: undefined,
      })

      setUploadProgress(0)
    },
    [addTeacherNotificationMutation, reset, role],
  )

  const {
    data: sendToList = [],
    isLoading: isSendToLoading,
    isError: isSendToError,
  } = useGetSendToList()

  const selectedSendTo =
    useWatch({ control, name: 'sendTo' }) ?? (role === 'teacher' ? ['Students'] : [])

  const attachments = useWatch({ control, name: 'attachments' }) as
    | FileList
    | undefined
  const attachmentFiles = useMemo(
    () => Array.from(attachments ?? []),
    [attachments],
  )
  const totalAttachmentSize = useMemo(
    () =>
      attachmentFiles.reduce((total, file) => total + Math.max(file.size, 1), 0),
    [attachmentFiles],
  )
  const hasAttachments = (attachments?.length ?? 0) > 0
  const isUploading = addTeacherNotificationMutation.isPending

  const formatFileSize = useCallback((size: number) => {
    if (size < 1024) return `${size} B`
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
    return `${(size / (1024 * 1024)).toFixed(1)} MB`
  }, [])

  const getFileProgress = useCallback(
    (index: number) => {
      if (!isUploading) {
        return selectionProgress
      }

      if (totalAttachmentSize === 0) {
        return 0
      }

      const uploadedBytes = Math.round((uploadProgress / 100) * totalAttachmentSize)
      let consumedBytes = 0

      for (let i = 0; i < attachmentFiles.length; i += 1) {
        const currentSize = Math.max(attachmentFiles[i]?.size ?? 0, 1)
        const start = consumedBytes
        const end = consumedBytes + currentSize

        if (i === index) {
          if (uploadedBytes <= start) {
            return 0
          }

          if (uploadedBytes >= end) {
            return 100
          }

          return Math.round(((uploadedBytes - start) / currentSize) * 100)
        }

        consumedBytes = end
      }

      return 0
    },
    [attachmentFiles, isUploading, selectionProgress, totalAttachmentSize, uploadProgress],
  )

  const removeAttachment = useCallback(
    (indexToRemove: number) => {
      const dt = new DataTransfer()

      attachmentFiles.forEach((file, index) => {
        if (index !== indexToRemove) {
          dt.items.add(file)
        }
      })

      setValue('attachments', dt.files, { shouldDirty: true, shouldValidate: true })
    },
    [attachmentFiles, setValue],
  )

  const clearAttachments = useCallback(() => {
    const dt = new DataTransfer()
    setValue('attachments', dt.files, { shouldDirty: true, shouldValidate: true })
    setSelectionProgress(0)
    setUploadProgress(0)
  }, [setValue])

  const removeSendTo = useCallback(
    (valueToRemove: string) => {
      setValue(
        'sendTo',
        selectedSendTo.filter((value) => value !== valueToRemove),
        { shouldDirty: true, shouldValidate: true },
      )
    },
    [selectedSendTo, setValue],
  )

  const toggleSendTo = useCallback(
    (nextValue: string) => {
      const isSelected = selectedSendTo.includes(nextValue)
      const nextSelection = isSelected
        ? selectedSendTo.filter((value) => value !== nextValue)
        : [...selectedSendTo, nextValue]

      setValue('sendTo', nextSelection, { shouldDirty: true, shouldValidate: true })
    },
    [selectedSendTo, setValue],
  )

  useEffect(() => {
    if (!hasAttachments || isUploading) {
      if (!hasAttachments) {
        setSelectionProgress(0)
      }
      return
    }

    setSelectionProgress(10)
    const timer = window.setTimeout(() => {
      setSelectionProgress(100)
    }, FILE_SELECTION_ANIMATION_MS)

    return () => window.clearTimeout(timer)
  }, [hasAttachments, isUploading])

  return {
    register,
    control,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    selectedSendTo,
    sendToList: sendToList as Array<RecipientOption>,
    isSendToLoading,
    isSendToError,
    removeSendTo,
    toggleSendTo,
    hasAttachments,
    isUploading,
    attachmentFiles,
    getFileProgress,
    formatFileSize,
    removeAttachment,
    clearAttachments,
    uploadProgress,
    selectionProgress,
    isPublishPending: addTeacherNotificationMutation.isPending,
    isPublishError: addTeacherNotificationMutation.isError,
  }
}