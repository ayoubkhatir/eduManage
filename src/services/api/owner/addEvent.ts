import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { EventForm } from '@/components/owner/calendar/model'

async function addEvent(event: EventForm) {
  return axios
    .post('http://localhost:4000/events', event)
    .then((res) => res.data)
}

export default function useAddEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })
}
