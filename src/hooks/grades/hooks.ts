import { getAllGradesServerFn, getAllGradesWithClassesAndSubjectsServerFn } from "#/server/modules/grades/grades.server-functions"

export const getAllGradesQueryOptions = () => ({
  queryKey: ['grades'],
  queryFn: async () => {
    try {
      const response = await getAllGradesServerFn()
      return response.success ? response.data : []
    } catch (error) {
      console.log({ error })
      return []
    }
  },
})


export const getAllGradesWithClassesAndSubjectsQueryOptions = () => ({
  queryKey: ['grades', 'grades_classes_subjects'],
  queryFn: async () => {
    try {
      const response = await getAllGradesWithClassesAndSubjectsServerFn()
      return response.success ? response.data : []
    } catch (error) {
      console.log({ error })
      return []
    }
  },
})