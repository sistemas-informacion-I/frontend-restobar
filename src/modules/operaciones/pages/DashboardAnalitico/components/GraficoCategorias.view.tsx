import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { GraficoCategoriasProps } from './GraficoCategorias'
import { Skeleton } from '../../../../../shared/components/ui'

ChartJS.register(ArcElement, Tooltip, Legend)

const PALETTE = [
  '#7c3aed', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#ec4899', '#14b8a6', '#f97316',
]

export function GraficoCategoriasView({ data, isLoading }: GraficoCategoriasProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <Skeleton variant="text" width="50%" height="1.25rem" />
        <Skeleton variant="circular" width={200} height={200} className="mx-auto mt-4" />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <p className="text-center text-sm text-wine-500">Sin datos de ventas por categoría</p>
      </div>
    )
  }

  const chartData = {
    labels: data.map((d) => d.categoria),
    datasets: [
      {
        data: data.map((d) => d.total),
        backgroundColor: PALETTE.slice(0, data.length),
        borderWidth: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 12,
          usePointStyle: true,
          color: '#a78bfa',
          font: { size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const total = ctx.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const pct = ((ctx.parsed / total) * 100).toFixed(1)
            return `${ctx.label}: Bs ${ctx.parsed.toLocaleString('es-BO')} (${pct}%)`
          },
        },
      },
    },
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
      <h3 className="mb-4 text-base font-semibold text-wine-800 dark:text-wine-200">
        Ventas por categoría
      </h3>
      <div className="h-[250px]">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  )
}
