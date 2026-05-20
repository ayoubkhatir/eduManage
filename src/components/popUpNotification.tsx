// import { MdOutlineGrade, MdPriorityHigh } from 'react-icons/md'
// import { GiWhiteBook } from 'react-icons/gi'
// import { FaRegCircleUser } from 'react-icons/fa6'
// import { FaUserTie } from 'react-icons/fa'
// import { memo, useEffect, useRef, useState } from 'react'
// import { Link, useLocation, useNavigate } from '@tanstack/react-router'
// // import { useQueryClient } from '@tanstack/react-query'

// import { Skeleton } from './ui/skeleton'
// import type { ResourceCard } from '@/services/api/student/types/apiType'
// import useSideBarListStore from '#/store/sidebar_list_store'
// import useGetNotPanel from '@/services/api/getNotification'
// import useGetTeacherNotifications from '@/services/api/teacher/notification/hooks'

// function NotificationSkeleton() {
//   return (
//     <div className="flex gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800/50 bg-white dark:bg-[#151b2b]">
//       <Skeleton className="size-8 rounded-full shrink-0 mt-1 bg-slate-200 dark:bg-slate-700 animate-none" />
//       <div className="flex flex-col gap-2 w-full">
//         <div className="flex items-start justify-between gap-2">
//           <Skeleton className="h-4 w-3/5 bg-slate-200 dark:bg-slate-700 animate-none" />
//           <Skeleton className="h-2 w-2 rounded-full mt-1.5 shrink-0 bg-slate-300 dark:bg-slate-600 animate-none" />
//         </div>
//         <Skeleton className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 animate-none" />
//       </div>
//     </div>
//   )
// }

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
// function PopUpNotification() {
//   /* to know current location*/
//   const location = useLocation()
//   const navigate = useNavigate()
//   const currentPath = location.pathname.split('/')[1]
//   const isTeacherPage = currentPath === 'teacher'

//   /* notification show*/
//   const [isOpen, setIsOpen] = useState(false)
//   const setChoosen = useSideBarListStore((state) => state.setChoosen)

//   /* sync with outside click */
//   const containerRef = useRef<HTMLDivElement>(null)

//   /* get notifications from React Query */
//   const studentNotifications = useGetNotPanel(false)
//   const teacherNotifications = useGetTeacherNotifications(
//     {
//       pageIndex: 1,
//       pageSize: 50,
//     },
//     false,
//   )

//   const { data: notificationsData, isLoading } = isTeacherPage
//     ? teacherNotifications
//     : studentNotifications

//   // Transform teacher notifications to match the student format for consistent display
//   const notifications = isTeacherPage
//     ? (notificationsData && 'data' in notificationsData
//         ? notificationsData.data
//         : []
//       ).map((noti: any) => ({
//         id: noti.id,
//         type: noti.type,
//         title: noti.subject,
//         message: noti.content,
//         read: noti.read,
//         time: noti.createdAt || noti.time,
//       }))
//     : ((notificationsData || []) as Array<any>)

//   // const queryClient = useQueryClient()

//   /* clear notifications */

//   // const clearNotifications = () => {
//   //   if (isTeacherPage) {
//   //     queryClient.setQueryData(
//   //       ['teacher-notifications', { pageIndex: 1, pageSize: 50 }],
//   //       { data: [] },
//   //     )
//   //   } else {
//   //     queryClient.setQueryData(['notifications'], [])
//   //   }
//   // }

//   // Close when clicking outside
//   useEffect(() => {
//     const handleClick = (event: MouseEvent) => {
//       if (!isOpen) return
//       if (
//         containerRef.current &&
//         !containerRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false)
//       }
//     }
//     document.addEventListener('mousedown', handleClick)
//     return () => document.removeEventListener('mousedown', handleClick)
//   }, [isOpen])

//   /* mark as read for notification icon*/

//   const [isRead, setIsRead] = useState(false)
//   const countRef = useRef(0)
//   useEffect(() => {
//     if (notifications.length > 0) {
//       const currentCount = notifications.length
//       if (currentCount > countRef.current) {
//         setIsRead(false)
//       }
//       countRef.current = currentCount
//     } else if (notifications.length === 0) {
//       setIsRead(true)
//     }
//   }, [notifications, isOpen])

//   const popUpOPen = () => {
//     setIsOpen(!isOpen)
//     setIsRead(true)
//   }

//   return (
//     <div className="relative" ref={containerRef}>
//       <button
//         aria-expanded={isOpen}
//         onClick={() => popUpOPen()}
//         className="cursor-pointer relative flex size-9 cursor-pointer items-center justify-center rounded-lg text-[#4c669a] transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
//       >
//         <span
//           className="material-symbols-outlined text-[22px]"
//         >
//           notifications
//         </span>
//         {!isRead && (
//           <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border border-white dark:border-gray-900"></span>
//         )}
//       </button>

//       {/* notification list */}

//       {isOpen && (
//         <button
//           aria-label="Close sidebar"
//           className="cursor-pointer fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
//           onClick={() => setIsOpen(false)}
//         ></button>
//       )}

//       <div
//         className={`absolute right-0 top-full mt-3 w-80 sm:w-96 bg-white dark:bg-[#151b2b] rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden origin-top-right ${isOpen ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
//         style={{ transition: 'opacity 0.2s ease-out, transform 0.2s ease-out' }}
//       >
//         <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
//           <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
//             Notifications
//           </h3>
//           {/* <div className="flex gap-2">
//             <button
//               onClick={clearNotifications}
//               className="cursor-pointer text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
//             >
//               Clear all
//             </button>
//           </div> */}
//         </div>
//         <div className="max-h-95 overflow-y-auto custom-scrollbar">
//           {isLoading ? (
//             <div className="py-1 bg-white dark:bg-[#151b2b] animate-pulse">
//               {Array.from({ length: 4 }).map((_, index) => (
//                 <NotificationSkeleton key={index} />
//               ))}
//             </div>
//           ) : notifications.length == 0 ? (
//             <div className="flex flex-col items-center justify-center h-32 text-center px-4">
//               <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-3">
//                 <span className="material-symbols-outlined text-[32px]">
//                   notifications_off
//                 </span>
//               </div>
//               <p className="text-sm text-slate-500 dark:text-slate-400">
//                 You have no new notifications
//               </p>
//             </div>
//           ) : (
//             notifications
//               .sort((a: any, b: any) => {
//                 const aTime = new Date(a.time).getTime()
//                 const bTime = new Date(b.time).getTime()
//                 return bTime - aTime
//               })
//               .map((noti: ResourceCard) => {
//                 const Icon = getIcon(noti.type)
//                 const colors = getColors(noti.type)
//                 return (
//                   <div
//                     role="button"
//                     tabIndex={0}
//                     onClick={() => {
//                       const path = isTeacherPage
//                         ? `/teacher/notifications/${noti.id}`
//                         : `/student/notification/${noti.id}`
//                       navigate({ to: path })
//                       setIsOpen(false)
//                     }}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter' || e.key === ' ') {
//                         const path = isTeacherPage
//                           ? `/teacher/notifications/${noti.id}`
//                           : `/student/notification/${noti.id}`
//                         navigate({ to: path })
//                         setIsOpen(false)
//                       }
//                     }}
//                     key={noti.id}
//                     className="flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50 cursor-pointer bg-blue-50/30 dark:bg-blue-900/10"
//                   >
//                     <div className="shrink-0 mt-1">
//                       <div
//                         className={`size-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ${colors.bg} ${colors.text} ${colors.darkBg}`}
//                       >
//                         {Icon}
//                       </div>
//                     </div>
//                     <div className="flex flex-col gap-0.5 w-full">
//                       <div className="flex justify-between items-start">
//                         <p className="text-sm font-medium text-slate-900 dark:text-white">
//                           {noti.title}
//                         </p>
//                         {!noti.read && (
//                           <span className="size-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
//                         )}
//                       </div>
//                       <div className="text-[10px] text-slate-400 mt-1">
//                         {noti.time}
//                       </div>
//                     </div>
//                   </div>
//                 )
//               })
//           )}
//         </div>
//         <div className="p-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
//           <Link
//             to={
//               isTeacherPage ? '/teacher/notifications' : '/student/notification'
//             }
//             onClick={() => {
//               setIsOpen(!isOpen)
//               setChoosen('notifications')
//             }}
//             className="text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary py-1 w-full cursor-pointer"
//           >
//             View All Notifications
//           </Link>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default memo(PopUpNotification)
