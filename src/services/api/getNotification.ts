import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

import type { UseQueryResult } from '@tanstack/react-query'

export type Not = Array<{
  id: number
  type: string
  title: string
  message: string
  time: string
}>

export const getNotification = async (): Promise<Not> => {
  // // await new Promise((resolve) => setTimeout(resolve, 2000))
  const data: Not = await axios
    .get<Not>('http://localhost:4000/notifications')
    .then((res) => {
      return res.data
    })
  return data
}

export default function useGetNotPanel(enabled: boolean): UseQueryResult<Not> {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getNotification,
    staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh, no refetch
    gcTime: 10 * 60 * 1000, // 10 minutes - keep in cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled
  })
}
