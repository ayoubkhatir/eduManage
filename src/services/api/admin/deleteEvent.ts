import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'

async function deleteEvent(id: string) {
  return axios
    .delete(`http://localhost:4000/events/${id}`)
    .then((res) => res.data)
}

export default function useDeleteEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
