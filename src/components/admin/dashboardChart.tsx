// import { useState } from 'react'
// import { Line } from 'react-chartjs-2'
// import {
//   CategoryScale,
//   Chart as ChartJS,
//   Filler,
//   Legend,
//   LineElement,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
// } from 'chart.js'

// import type { ChartOptions, ScriptableContext } from 'chart.js'
// import { DashboardPeriodEnum, type DashboardPeriod } from '#/types/studentTypes'
// import { getDashboardChartServerFn } from '#/server/modules/students/students.server-functions'
// import type { ID } from '#/types/authTypes'
// import { useQuery } from '@tanstack/react-query'

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
// )

// const getDashboardChartQueryOptions = ({
//   schoolId,
//   period,
// }: DashboardPeriod) => ({
//   queryKey: ['dashboard-chart', schoolId, period],

//   queryFn: async () => {
//     const result = await getDashboardChartServerFn({
//       data: { schoolId, period },
//     })
//     if (!result.success) throw new Error('Dashboard chart not found')
//     return result
//   },
// })

// export default function DashboardChart({
//   schoolId,
//   period,
// }: {
//   schoolId: ID
//   period: DashboardPeriodEnum
// }) {
//   const { data } = useQuery(getDashboardChartQueryOptions({ schoolId, period }))

//   const [filter, setFilter] = useState<DashboardPeriodEnum>(
//     DashboardPeriodEnum.MONTH,
//   )

//   const chartData: Record<DashboardPeriodEnum, any> = {
//     [DashboardPeriodEnum.MONTH]: {
//       labels: [
//         'Day 1',
//         'Day 2',
//         'Day 3',
//         'Day 4',
//         'Day 5',
//         'Day 6',
//         'Day 7',
//         'Day 8',
//         'Day 9',
//         'Day 10',
//       ],
//       datasets: [
//         {
//           label: 'Enrollments',
//           data: [120, 300, 220, 450, 390, 520, 610, 480, 700, 850],
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.2)',
//           tension: 0.4,
//           pointRadius: 5,
//           pointHoverRadius: 7,
//           fill: true,
//         },
//       ],
//     },

//     [DashboardPeriodEnum.HALFYEAR]: {
//       labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
//       datasets: [
//         {
//           label: 'Enrollments',
//           data: [1200, 1900, 3000, 4200],
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.2)',
//           tension: 0.4,
//           pointRadius: 5,
//           pointHoverRadius: 7,
//           fill: true,
//         },
//       ],
//     },

//     [DashboardPeriodEnum.YEAR]: {
//       labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//       datasets: [
//         {
//           label: 'Enrollments',
//           data: [1000, 2500, 1000, 4000, 3000, 6000],
//           borderColor: '#3b82f6',
//           backgroundColor: 'rgba(59, 130, 246, 0.2)',
//           tension: 0.4,
//           pointRadius: 6,
//           pointHoverRadius: 8,
//           fill: true,
//         },
//       ],
//     },
//   }

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
//             { label: '10 Days', value: '10days' },
//             { label: '30 Days', value: '30days' },
//             { label: '6 Months', value: '6months' },
//             { label: '1 Year', value: '1year' },
//           ].map((item) => (
//             <button
//               key={item.value}
//               onClick={() => setFilter(item.value as DashboardPeriodEnum)}
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
//         <Line options={options} data={chartData[filter]} />
//       </div>
//     </div>
//   )
// }

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
    getDashboardChartQueryOptions({
      schoolId,
      period: filter,
    }),
  )

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: 'top',
      },

      title: {
        display: true,
        text: 'Student Enrollments',
        font: {
          size: 16,
        },
      },

      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
      },
    },

    animation: {
      duration: 1200,
      easing: 'easeOutQuart',
    },

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
    <div className="w-full rounded-2xl border bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Enrollment Analytics</h2>

          <p className="text-sm text-gray-500">
            Overview of student enrollments
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 rounded-xl bg-gray-100 p-1">
          {[
            {
              label: '1 Month',
              value: DashboardPeriodEnum.MONTH,
            },
            {
              label: '6 Months',
              value: DashboardPeriodEnum.HALFYEAR,
            },
            {
              label: '1 Year',
              value: DashboardPeriodEnum.YEAR,
            },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                filter === item.value
                  ? 'bg-blue-500 text-white shadow'
                  : 'text-gray-600 hover:bg-white'
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
          <div className="flex h-full items-center justify-center">
            Loading...
          </div>
        ) : data ? (
          <Line options={options} data={data} />
        ) : (
          <div className="flex h-full items-center justify-center">
            No data available
          </div>
        )}
      </div>
    </div>
  )
}
