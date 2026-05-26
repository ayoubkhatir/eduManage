import { deleteGradeServerFn, getAllGradesServerFn, getAllGradesWithClassesAndSubjectsServerFn } from "#/server/modules/grades/grades.server-functions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"

export const getAllGradesQueryOptions = () => ({
  queryKey: ['grades'],
  queryFn: async () => {
    try {
      const response = await getAllGradesServerFn()
      return response.success ? response.data : []
    } catch (error) {
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

export function useDeleteGrade() {
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (gradeId: string) => deleteGradeServerFn({ data: gradeId }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['grades'] })
      await router.invalidate()

    },
  })
}
