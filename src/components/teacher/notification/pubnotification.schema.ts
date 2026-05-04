import z from 'zod'

/* handling file input */
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ACCEPTED_DOC_TYPES = [
  'application/pdf', // PDF
  'application/msword', // DOC
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'application/vnd.ms-powerpoint', // PPT
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
  'application/vnd.ms-excel', // XLS
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
]

/* VALIDATION FUNCTION */
const isValidFile = (file: File) => {
  return (
    file.type.startsWith('image/') ||
    file.type.startsWith('video/') ||
    ACCEPTED_DOC_TYPES.includes(file.type)
  )
}

const basePubNotificationSchema = z.object({
  subject: z.string().min(3, 'Subject required'),
  content: z.string().min(5, 'Content required'),
  sendTo: z.array(z.string()).default([]),
  type: z.enum([
    'Urgent',
    'Teacher',
    'Administrative',
    'User',
    'Grade',
    'Book',
  ]),
  attachments: z
    .custom<FileList>((val) => val instanceof FileList, 'Please upload a file')
    .refine((files) => files.length > 0, 'A file is required.')
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      'Max file size is 50MB.',
    )
    .refine(
      (files) => Array.from(files).every((file) => isValidFile(file)),
      'Only Images, Videos, PDF, Word, Excel and PowerPoint files are allowed.',
    ),
})

export const getPubNotificationSchema = (role: 'teacher' | 'admin') => {
  if (role === 'teacher') {
    return basePubNotificationSchema
  }

  return basePubNotificationSchema.refine((data) => data.sendTo.length > 0, {
    path: ['sendTo'],
    message: 'Select at least one',
  })
}

export type PubNotificationType = z.input<typeof basePubNotificationSchema>
