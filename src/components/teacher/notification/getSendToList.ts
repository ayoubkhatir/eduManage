// import { queryOptions, useQuery } from '@tanstack/react-query'
// // import axios from 'axios'

// const sendToList = [
//   { label: 'Teachers', value: 'teachers' },
//   { label: 'Students', value: 'students' },
//   { label: 'Parents', value: 'parents' },
// ]

// export type SendToList = typeof sendToList

// const getSendToList = async (): Promise<SendToList> => {
//   // await new Promise((resolve) => setTimeout(resolve, 5000))
//   /* const data = await axios
//     .get<SendToList>('http://localhost:4000/notifications')
//     .then((res: any) => {
//       return res.data
//     })*/
//   return sendToList
// }

// export const sendToListQueryOptions = queryOptions({
//   queryKey: ['sendToList'],
//   queryFn: getSendToList,
// })

// export default function useGetSendToList() {
//   return useQuery(sendToListQueryOptions)
// }
