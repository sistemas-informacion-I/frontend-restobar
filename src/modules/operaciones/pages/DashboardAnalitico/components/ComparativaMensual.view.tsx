import { ComparativaMensualProps } from './ComparativaMensual'
import { Skeleton } from '../../../../../shared/components/ui'
import { TrendingUp, TrendingDown } from 'lucide-react'

export function ComparativaMensualView({ data, isLoading }: ComparativaMensualProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <Skeleton variant="text" width="50%" height="1.25rem" />
        <div className="mt-4 space-y-3">
          <Skeleton variant="text" width="60%" height="1rem" />
          <Skeleton variant="text" width="60%" height="1rem" />
          <Skeleton variant="text" width="40%" height="1.5rem" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <p className="text-center text-sm text-wine-500">Sin datos de comparativa mensual</p>
      </div>
    )
  }

  const isPositive = data.variacion >= 0

  return (
    <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
      <h3 className="mb-4 text-base font-semibold text-wine-800 dark:text-wine-200">
        Comparativa mensual
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-wine-500 dark:text-wine-400">{data.periodoActual}</span>
          <span className="font-semibold text-wine-900 dark:text-white">
            Bs {data.mesActual.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-wine-500 dark:text-wine-400">{data.periodoAnterior}</span>
          <span className="font-semibold text-wine-900 dark:text-white">
            Bs {data.mesAnterior.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-wine-50 p-3 dark:bg-wine-900/20">
          {isPositive ? (
            <TrendingUp className="h-5 w-5 text-emerald-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
          <span
            className={`text-lg font-bold ${
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {data.variacion.toFixed(1)}%
          </span>
          <span className="text-xs text-wine-500 dark:text-wine-400">vs mes anterior</span>
        </div>
      </div>
    </div>
  )
}
