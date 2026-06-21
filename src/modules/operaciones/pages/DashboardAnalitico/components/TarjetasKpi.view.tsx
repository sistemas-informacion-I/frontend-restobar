import { TarjetasKpiProps } from './TarjetasKpi'
import { Skeleton } from '../../../../../shared/components/ui'

const kpiDefs: {
  label: string
  key: keyof import('../../../types/dashboard.types').KpiDTO
  prefix?: string
  suffix?: string
  color: string
}[] = [
  { label: 'Ventas del día', key: 'ventasDelDia', prefix: 'Bs ', color: 'from-emerald-500 to-emerald-600' },
  { label: 'Transacciones', key: 'numeroTransacciones', color: 'from-blue-500 to-blue-600' },
  { label: 'Ticket promedio', key: 'ticketPromedio', prefix: 'Bs ', color: 'from-violet-500 to-violet-600' },
  { label: 'Ganancia total', key: 'totalGanancia', prefix: 'Bs ', color: 'from-amber-500 to-amber-600' },
  { label: 'Margen de ganancia', key: 'margenGanancia', suffix: '%', color: 'from-rose-500 to-rose-600' },
  { label: 'Comandas activas', key: 'comandasActivas', color: 'from-cyan-500 to-cyan-600' },
  { label: 'Reservas del día', key: 'reservasDelDia', color: 'from-indigo-500 to-indigo-600' },
  { label: 'Alertas stock crítico', key: 'alertasStockCritico', color: 'from-red-500 to-red-600' },
]

function formatValue(value: number | undefined, prefix?: string, suffix?: string): string {
  if (value === undefined || value === null) return '—'
  const formatted = Number.isInteger(value) ? value.toLocaleString('es-BO') : value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  return `${prefix ?? ''}${formatted}${suffix ?? ''}`
}

export function TarjetasKpiView({ kpis, isLoading }: TarjetasKpiProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
            <Skeleton variant="text" width="70%" height="0.75rem" />
            <Skeleton variant="text" width="50%" height="2rem" className="mt-2" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {kpiDefs.map((def) => (
        <div
          key={def.key}
          className="relative overflow-hidden rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 transition-transform hover:scale-[1.02] dark:bg-black/35"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${def.color} opacity-5`} />
          <p className="relative text-xs font-medium uppercase tracking-wider text-wine-500 dark:text-wine-400">
            {def.label}
          </p>
          <p className="relative mt-2 text-2xl font-bold text-wine-900 dark:text-white">
            {formatValue(kpis?.[def.key], def.prefix, def.suffix)}
          </p>
        </div>
      ))}
    </div>
  )
}
