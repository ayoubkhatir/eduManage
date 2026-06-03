import { getStudentSubjectAssessmentsServerFn } from '#/server/modules/marks/marks.server-functions'

export const getStudentSubjectAssessmentsQueryOptions = (input: {
  classId: string
  subjectCode: string
  studentId: string
  schoolId: string
  periodId?: string
}) => ({
  queryKey: [
    'student',
    `classId-${input.classId}`,
    `subjectCode-${input.subjectCode}`,
    'assessments',
  ],
  queryFn: async () => {
    const response = await getStudentSubjectAssessmentsServerFn({ data: input })
    if (response.success) return response.data
    throw new Error('Failed to load assessments')
  },
})
