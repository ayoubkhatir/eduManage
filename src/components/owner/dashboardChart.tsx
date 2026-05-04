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
import type {ChartOptions, ScriptableContext} from 'chart.js';


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

// still need some changes since the chart is not rerendering when the user changes the time from 6 months to 1 year

export default function DashboardChart({ props }: { props: boolean }) {
  const data2 = {
    // should be the data for the 1 year time stamp
    labels: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    datasets: [
      {
        label: 'Steps',
        data: [
          1000, 2500, 1000, 4000, 3000, 6000, 1000, 2500, 1000, 4000, 3000,
          6000,
        ],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
    ],
  }
  const data1 = {
    // should be the data for the 6 months time stamp
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Steps',
        data: [1000, 2500, 1000, 4000, 3000, 6000],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
      },
    ],
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly New Enrollements',
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

  const data = props ? data2 : data1

  return (
    <div className="w-full h-80">
      <Line options={options} data={data} />
    </div>
  )
}
