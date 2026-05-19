import { getAllGradesServerFn } from "#/server/modules/grades/grades.server-functions"

export const getAllGradesQueryOptions = () => ({
  queryKey: ['students', 'grades'],
  queryFn: async () => {
    const response = await getAllGradesServerFn()
    if (response.success) return response.data
    else throw new Error('Failed to fetch grades')
  },
})