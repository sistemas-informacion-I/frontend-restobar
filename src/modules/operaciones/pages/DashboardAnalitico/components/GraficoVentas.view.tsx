import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { GraficoVentasProps } from './GraficoVentas'
import { Skeleton } from '../../../../../shared/components/ui'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler)

export function GraficoVentasView({ data, isLoading }: GraficoVentasProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <Skeleton variant="text" width="40%" height="1.25rem" />
        <Skeleton variant="rectangular" height={250} className="mt-4" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <p className="text-center text-sm text-wine-500">Sin datos de evolución de ventas</p>
      </div>
    )
  }

  const labels = data.map((d) => {
    const date = new Date(d.fecha)
    return date.toLocaleDateString('es-BO', { day: '2-digit', month: 'short' })
  })

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Ventas (Bs)',
        data: data.map((d) => d.total),
        fill: true,
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#7c3aed',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `Bs ${ctx.parsed.y.toLocaleString('es-BO')}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#a78bfa', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(124, 58, 237, 0.08)' },
        ticks: {
          color: '#a78bfa',
          font: { size: 11 },
          callback: (val: any) => `Bs ${val.toLocaleString('es-BO')}`,
        },
      },
    },
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
      <h3 className="mb-4 text-base font-semibold text-wine-800 dark:text-wine-200">
        Evolución de ventas
      </h3>
      <div className="h-[250px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
