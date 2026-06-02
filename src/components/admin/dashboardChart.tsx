import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'

import type { ChartOptions, ScriptableContext } from 'chart.js'

import { DashboardPeriodEnum } from '#/types/studentTypes'

import { getDashboardChartServerFn } from '#/server/modules/students/students.server-functions'

import type { ID } from '#/types/authTypes'

import { useQuery } from '@tanstack/react-query'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const getDashboardChartQueryOptions = ({
  schoolId,
  period,
}: {
  schoolId: ID
  period: DashboardPeriodEnum
}) => ({
  queryKey: ['dashboard-chart', schoolId, period],

  queryFn: async () => {
    const result = await getDashboardChartServerFn({
      data: {
        schoolId,
        period,
      },
    })

    if (!result.success) {
      throw new Error('Dashboard chart not found')
    }

    return result.data
  },
})
export default function DashboardChart({ schoolId }: { schoolId: ID }) {
  const [filter, setFilter] = useState<DashboardPeriodEnum>(
    DashboardPeriodEnum.MONTH,
  )

  const { data, isLoading } = useQuery(
    getDashboardChartQueryOptions({ schoolId, period: filter }),
  )

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(156 163 175)', // text-gray-400
        },
      },
      title: {
        display: true,
        text: 'Student Enrollments',
        font: { size: 16 },
        color: 'rgb(156 163 175)', // text-gray-400
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: 'rgb(156 163 175)' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
      },
      y: {
        beginAtZero: true,
        ticks: { color: 'rgb(156 163 175)' },
        grid: { color: 'rgba(156, 163, 175, 0.1)' },
      },
    },
    animation: { duration: 1200, easing: 'easeOutQuart' },
    animations: {
      y: {
        from: (ctx: ScriptableContext<'line'>) => {
          const yScale = ctx.chart.scales.y
          return yScale.getPixelForValue(yScale.min)
        },
      },
    },
  }

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Enrollment Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Overview of student enrollments
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 rounded-xl bg-muted p-1">
          {[
            { label: '1 Month', value: DashboardPeriodEnum.MONTH },
            { label: '6 Months', value: DashboardPeriodEnum.HALFYEAR },
            { label: '1 Year', value: DashboardPeriodEnum.YEAR },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === item.value
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'text-muted-foreground hover:bg-background'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        {isLoading ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Loading...
          </div>
        ) : data ? (
          <Line options={options} data={data} />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </div>
    </div>
  )
}

// export default function DashboardChart({ schoolId }: { schoolId: ID }) {
//   const [filter, setFilter] = useState<DashboardPeriodEnum>(
//     DashboardPeriodEnum.MONTH,
//   )

//   const { data, isLoading } = useQuery(
//     getDashboardChartQueryOptions({
//       schoolId,
//       period: filter,
//     }),
//   )

//   const options: ChartOptions<'line'> = {
//     responsive: true,
//     maintainAspectRatio: false,

//     plugins: {
//       legend: {
//         position: 'top',
//       },

//       title: {
//         display: true,
//         text: 'Student Enrollments',
//         font: {
//           size: 16,
//         },
//       },

//       tooltip: {
//         mode: 'index',
//         intersect: false,
//       },
//     },

//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },

//     animation: {
//       duration: 1200,
//       easing: 'easeOutQuart',
//     },

//     animations: {
//       y: {
//         from: (ctx: ScriptableContext<'line'>) => {
//           const yScale = ctx.chart.scales.y

//           return yScale.getPixelForValue(yScale.min)
//         },
//       },
//     },
//   }

//   return (
//     <div className="w-full rounded-2xl border bg-white p-5 shadow-sm">
//       {/* Header */}
//       <div className="mb-6 flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-semibold">Enrollment Analytics</h2>

//           <p className="text-sm text-gray-500">
//             Overview of student enrollments
//           </p>
//         </div>

//         {/* Filters */}
//         <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1">
//           {[
//             {
//               label: '1 Month',
//               value: DashboardPeriodEnum.MONTH,
//             },
//             {
//               label: '6 Months',
//               value: DashboardPeriodEnum.HALFYEAR,
//             },
//             {
//               label: '1 Year',
//               value: DashboardPeriodEnum.YEAR,
//             },
//           ].map((item) => (
//             <button
//               key={item.value}
//               onClick={() => setFilter(item.value)}
//               className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
//                 filter === item.value
//                   ? 'bg-blue-500 text-white shadow'
//                   : 'text-gray-600 hover:bg-white'
//               }`}
//             >
//               {item.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chart */}
//       <div className="h-80">
//         {isLoading ? (
//           <div className="flex h-full items-center justify-center">
//             Loading...
//           </div>
//         ) : data ? (
//           <Line options={options} data={data} />
//         ) : (
//           <div className="flex h-full items-center justify-center">
//             No data available
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
