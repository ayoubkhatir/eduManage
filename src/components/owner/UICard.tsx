// export type UICardType = {
//   id: string
//   iconName: string
//   iconColor: string
//   stateIcon: string
//   percentage: number
//   cardTitle: string
//   info: string
// }

// export default function UICardComponent(props: UICardType) {
//   return (
//     <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-black/20 dark:hover:border-gray-700 group">
//       <div className="flex justify-between items-start mb-4">
//         <div
//           className={`p-2 ${props.iconColor == 'blue' ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : props.iconColor == 'purple' ? 'bg-purple-50 dark:bg-purple-500/20  text-purple-600 dark:text-purple-400' : props.iconColor == 'green' ? 'bg-green-50 dark:bg-green-500/20  text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-500/20  text-orange-600 dark:text-orange-400'} rounded-lg group-hover:scale-110`}
//           style={{ transition: 'transform 0.2s ease-in-out' }}
//         >
//           <span className="material-symbols-outlined">{props.iconName}</span>
//         </div>
//         <span
//           className={`flex items-center text-xs font-bold   px-2 py-1 rounded-full border border-transparent  ${props.percentage > 0 ? 'text-green-600 dark:text-green-400 dark:border-green-500/10 bg-green-50 dark:bg-green-500/10' : 'text-red-600 dark:text-red-400 dark:border-red-500/10 bg-red-50 dark:bg-red-500/10'}`}
//         >
//           <span className="material-symbols-outlined text-sm mr-1">
//             {props.stateIcon}
//           </span>
//           {props.percentage}%
//         </span>
//       </div>
//       <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
//         {props.cardTitle}
//       </p>
//       <h3 className="text-2xl font-bold text-[#111318] dark:text-white mt-1">
//         {props.info}
//       </h3>
//     </div>
//   )
// }
import { Skeleton } from '@/components/ui/skeleton'

type CardColor = 'blue' | 'purple' | 'green' | 'orange'

export type UICardType = {
  id: string
  iconName: string
  iconColor: CardColor
  stateIcon: string
  percentage: number
  cardTitle: string
  info: string | number
}

const iconColorMap: Record<CardColor, string> = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  purple:
    'bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400',
  green: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400',
  orange:
    'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400',
}

export default function UICardComponent({
  iconName,
  iconColor,
  stateIcon,
  percentage,
  cardTitle,
  info,
}: UICardType) {
  const isPositive = percentage >= 0
  const displayInfo = typeof info === 'number' ? info.toLocaleString() : info

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:shadow-black/20">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconColorMap[iconColor]}`}
        >
          <span className="material-symbols-outlined text-[22px]">
            {iconName}
          </span>
        </div>

        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400'
              : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'
          }`}
        >
          <span className="material-symbols-outlined text-sm">{stateIcon}</span>
          <span>
            {isPositive && percentage > 0 ? '+' : ''}
            {percentage}%
          </span>
        </span>
      </div>

      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {cardTitle}
      </p>

      <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
        {displayInfo}
      </h3>
    </div>
  )
}

export function UICardSkeletonItem() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-4">
        {/* Icon */}
        <Skeleton className="h-11 w-11 rounded-xl" />

        {/* Percentage badge */}
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>

      {/* Title */}
      <Skeleton className="h-4 w-32" />

      {/* Value */}
      <Skeleton className="mt-3 h-8 w-24" />
    </div>
  )
}

export function UICardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-${count}`}>
      {Array.from({ length: count }).map((_, i) => (
        <UICardSkeletonItem key={i} />
      ))}
    </div>
  )
}
