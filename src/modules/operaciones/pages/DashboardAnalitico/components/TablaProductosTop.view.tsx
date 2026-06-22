import { TablaProductosTopProps } from './TablaProductosTop'
import { Skeleton } from '../../../../../shared/components/ui'

export function TablaProductosTopView({ data, isLoading }: TablaProductosTopProps) {
  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <Skeleton variant="text" width="40%" height="1.25rem" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} variant="text" width="100%" height="1rem" />
          ))}
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
        <p className="text-center text-sm text-wine-500">Sin datos de productos top</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
      <h3 className="mb-4 text-base font-semibold text-wine-800 dark:text-wine-200">
        Productos más vendidos
      </h3>
      <div className="space-y-2">
        {data.map((producto, index) => (
          <div
            key={producto.idProducto}
            className="flex items-center justify-between rounded-2xl bg-wine-50/50 px-4 py-2.5 dark:bg-wine-900/10"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-wine-500 to-wine-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="text-sm font-medium text-wine-800 dark:text-wine-200">
                {producto.nombre}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-wine-900 dark:text-white">
                Bs {producto.totalGenerado.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-wine-500">{producto.cantidadVendida} vendidos</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
