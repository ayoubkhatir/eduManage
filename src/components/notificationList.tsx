// import { MdOutlineGrade, MdPriorityHigh } from 'react-icons/md'
// import { GiWhiteBook } from 'react-icons/gi'
// import { FaRegCircleUser } from 'react-icons/fa6'
// import { FaUserTie } from 'react-icons/fa'
// import { useNavigate } from '@tanstack/react-router'
// import { Skeleton as BoneyardSkeleton } from 'boneyard-js/react'

// import Loading from './loading'
// import type {
//   NotificationListProps,
//   ResourceCard,
//   TypeTabFilter,
// } from '@/types/notificationTypes'
// // import { useNotifications } from '@/services/api/student/notification/notification'
// // import useGetTeacherNotifications from '@/services/api/teacher/notification/hooks'

// const getIcon = (iconType: string) => {
//   switch (iconType) {
//     case 'Urgent':
//       return <MdPriorityHigh className="text-[24px]" />
//     case 'Book':
//       return <GiWhiteBook className="text-[24px]" />
//     case 'User':
//       return <FaRegCircleUser className="text-[24px]" />
//     case 'Grade':
//       return <MdOutlineGrade className="text-[24px]" />
//     case 'Teacher':
//       return <FaUserTie className="text-[24px]" />
//     default:
//       return <MdPriorityHigh className="text-[24px]" />
//   }
// }

// const getColors = (type: string) => {
//   switch (type) {
//     case 'Urgent':
//       return {
//         bg: 'bg-red-50',
//         text: 'text-red-500',
//         darkBg: 'dark:bg-red-500/10',
//         ring: 'ring-red-500/20',
//         border: 'border-red-500',
//       }
//     case 'Book':
//       return {
//         bg: 'bg-purple-50',
//         text: 'text-purple-500',
//         darkBg: 'dark:bg-purple-500/10',
//         ring: 'ring-purple-500/20',
//         border: 'border-purple-500',
//       }
//     case 'Teacher':
//       return {
//         bg: 'bg-blue-50',
//         text: 'text-blue-500',
//         darkBg: 'dark:bg-blue-500/10',
//         ring: 'ring-blue-500/20',
//         border: 'border-blue-500',
//       }
//     case 'Grade':
//       return {
//         bg: 'bg-green-50',
//         text: 'text-green-500',
//         darkBg: 'dark:bg-green-500/10',
//         ring: 'ring-green-500/20',
//         border: 'border-green-500',
//       }
//     case 'User':
//       return {
//         bg: 'bg-orange-50',
//         text: 'text-orange-500',
//         darkBg: 'dark:bg-orange-500/10',
//         ring: 'ring-orange-500/20',
//         border: 'border-orange-500',
//       }
//     default:
//       return {
//         bg: 'bg-gray-50',
//         text: 'text-gray-500',
//         darkBg: 'dark:bg-gray-500/10',
//         ring: 'ring-gray-500/20',
//         border: 'border-gray-500',
//       }
//   }
// }

// const filterNotifications = (
//   data: Array<ResourceCard>,
//   tab: TypeTabFilter = 'All',
//   searchText = '',
// ) => {
//   const lowerSearch = searchText.trim().toLowerCase()

//   return data.filter((notification) => {
//     const matchesTab =
//       tab === 'All' ||
//       (tab === 'Unread' && notification.read === false) ||
//       (tab === 'Urgent' && notification.type === 'Urgent') ||
//       (tab === 'Teachers' && notification.type === 'Teacher') ||
//       (tab === 'Administration' &&
//         ['Administration', 'Admin'].includes(notification.type))

//     if (!matchesTab) return false

//     if (!lowerSearch) return true

//     const haystack =
//       `${notification.title} ${notification.subject} ${notification.type}`.toLowerCase()
//     return haystack.includes(lowerSearch)
//   })
// }

// export default function NotificationList({
//   tab = 'All',
//   searchText = '',
//   role = 'Student',
//   data: propData,
//   isLoading: propIsLoading,
//   error: propError,
//   detailTo = role === 'Teacher'
//     ? '/teacher/notifications'
//     : '/student/notification',
// }: NotificationListProps) {
//   const studentNotificationsQuery = useNotifications()
//   const teacherNotificationsQuery = useGetTeacherNotifications(
//     {
//       pageIndex: 1,
//       pageSize: 50,
//     },
//     false,
//   )
//   const navigate = useNavigate()

//   const hookResult =
//     role === 'Teacher' ? teacherNotificationsQuery : studentNotificationsQuery
//   const data =
//     propData ?? (role === 'Teacher' ? hookResult.data?.data : hookResult.data)
//   const isLoading = propIsLoading ?? hookResult.isLoading
//   const error = propError ?? hookResult.error

//   const detailBaseTo = detailTo.endsWith('/') ? detailTo.slice(0, -1) : detailTo

//   if (isLoading) {
//     return (
//       <BoneyardSkeleton
//         name={
//           role === 'Teacher'
//             ? 'teacher-notification-list'
//             : 'student-notification-list'
//         }
//         loading
//         animate="shimmer"
//         fallback={
//           <div className="h-full w-full flex items-center justify-center">
//             <Loading
//               className="h-[80%] w-[80%] p-10"
//               text="searching..."
//               description="Please wait while we fetch the notifications for you."
//             />
//           </div>
//         }
//       >
//         <div className="flex flex-col gap-3">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <div
//               key={index}
//               className="relative flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-white dark:bg-[#1A202C] border-l-4 border-gray-200 dark:border-slate-700"
//             >
//               <div className="shrink-0">
//                 <div className="flex size-12 rounded-full bg-gray-200 dark:bg-slate-700" />
//               </div>

//               <div className="flex flex-1 flex-col justify-center gap-3">
//                 <div className="h-5 w-2/5 rounded bg-gray-200 dark:bg-slate-700" />
//                 <div className="h-4 w-4/5 rounded bg-gray-100 dark:bg-slate-800" />
//                 <div className="h-3 w-24 rounded bg-gray-100 dark:bg-slate-800" />
//               </div>

//               <div className="hidden md:flex size-5 rounded self-center bg-gray-100 dark:bg-slate-800" />
//             </div>
//           ))}
//         </div>
//       </BoneyardSkeleton>
//     )
//   }

//   if (error) {
//     return (
//       <p className=" text-[#4c669a] dark:text-[#9da6b9] text-center py-10 pl-8 text-base font-normal">
//         Something went wrong.
//       </p>
//     )
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-32 text-center px-4">
//         <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-3">
//           <span className="material-symbols-outlined text-[32px]">
//             notifications_off
//           </span>
//         </div>
//         <p className="text-sm text-slate-500 dark:text-slate-400">
//           You have no new notifications
//         </p>
//       </div>
//     )
//   }

//   const filteredData = filterNotifications(data, tab, searchText)

//   if (filteredData.length === 0) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <p className="text-[#4b5563] dark:text-[#9da6b9]">
//           No notifications match your filters.
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-3">
//       {filteredData.map((notification: ResourceCard) => {
//         const colors = getColors(notification.type)
//         const Icon = getIcon(notification.type)

//         return (
//           <div
//             key={notification.id}
//             role="button"
//             tabIndex={0}
//             onClick={() =>
//               navigate({
//                 to: `${detailBaseTo}/${notification.id}`,
//               })
//             }
//             onKeyDown={(e) => {
//               if (e.key === 'Enter' || e.key === ' ') {
//                 e.preventDefault()
//                 navigate({
//                   to: `${detailBaseTo}/${notification.id}`,
//                 })
//               }
//             }}
//             className={`group relative flex flex-col md:flex-row gap-4 p-5 rounded-xl hover:bg-gray-100 bg-white dark:bg-[#1A202C] dark:hover:bg-[#202736] border-l-4 ${colors.border} cursor-pointer`}
//           >
//             <div className="shrink-0">
//               {!notification.read && (
//                 <div className="absolute right-4 top-4 size-2 rounded-full bg-primary" />
//               )}
//               <div
//                 className={`flex size-12 items-center justify-center rounded-full ${colors.bg} ${colors.text} ${colors.darkBg}`}
//               >
//                 {Icon}
//               </div>
//             </div>

//             <div className="flex flex-1 flex-col justify-center gap-1">
//               <div className="flex items-center gap-2">
//                 <h3 className="text-[#0d121b] dark:text-white text-lg font-semibold">
//                   {notification.title}
//                 </h3>

//                 <span
//                   className={`inline-flex items-center rounded-md ${colors.bg} ${colors.darkBg} px-2 py-0.5 text-xs font-medium ${colors.text} ring-1 ring-inset ${colors.ring}`}
//                 >
//                   {notification.type}
//                 </span>
//               </div>

//               <p className="text-[#4c669a] dark:text-[#9da6b9] text-sm">
//                 {notification.subject}
//               </p>

//               <p className="text-[#6b7280] text-xs mt-2 font-medium">
//                 {notification.time}
//               </p>
//             </div>

//             <div className="hidden md:flex shrink-0 items-center self-center">
//               <span className="material-symbols-outlined text-gray-400 hover:text-black dark:text-[#4b5563] dark:group-hover:text-white">
//                 chevron_right
//               </span>
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
