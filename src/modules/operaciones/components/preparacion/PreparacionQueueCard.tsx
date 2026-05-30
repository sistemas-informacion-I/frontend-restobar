import { Clock, ChefHat, CheckCircle2, AlertCircle, Utensils } from 'lucide-react'
import type { PreparacionQueue, PreparacionQueueItem } from '../../services/types'

interface QueueCardProps {
  comanda: PreparacionQueue
  onTomar: (idDetalleComanda: number) => void
  onMarcarListo: (idDetalleComanda: number) => void
  isTomando: boolean
  isMarcandoListo: boolean
}

export function PreparacionQueueCard({ comanda, onTomar, onMarcarListo, isTomando, isMarcandoListo }: QueueCardProps) {
  const formatTime = (seconds?: number) => {
    if (!seconds) return '—'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60)
      return `${hrs}h ${mins % 60}m`
    }
    return `${mins}m ${secs}s`
  }

  const getItemColor = (item: PreparacionQueueItem) => {
    if (item.estado === 'PENDIENTE') return 'border-l-amber-500 bg-amber-50 dark:bg-amber-950/20'
    if (item.estado === 'EN_PREPARACION') return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20'
    return 'border-l-green-500 bg-green-50 dark:bg-green-950/20'
  }

  const getStatusBadge = (item: PreparacionQueueItem) => {
    if (item.estado === 'PENDIENTE')
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"><Clock className="w-3 h-3" /> Pendiente</span>
    if (item.estado === 'EN_PREPARACION')
      return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"><ChefHat className="w-3 h-3" /> Preparando</span>
    return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"><CheckCircle2 className="w-3 h-3" /> Listo</span>
  }

  const getServiceIcon = () => {
    if (comanda.tipoServicio === 'MESA') return <Utensils className="w-4 h-4" />
    if (comanda.tipoServicio === 'PARA_LLEVAR') return <AlertCircle className="w-4 h-4" />
    return <span className="text-xs font-bold">ON</span>
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden transition-all hover:shadow-md">
      {/* Card Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/50">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
            {getServiceIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
              {comanda.numeroComanda}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {comanda.mesaNombre}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            comanda.itemsPendientes > 0
              ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
          }`}>
            {comanda.itemsPendientes > 0 ? (
              <><Clock className="w-3 h-3" /> {comanda.itemsPendientes} pend.</>
            ) : (
              <><ChefHat className="w-3 h-3" /> {comanda.itemsEnPreparacion} prep.</>
            )}
          </span>
          {comanda.itemsListos > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
              <CheckCircle2 className="w-3 h-3" /> {comanda.itemsListos}
            </span>
          )}
        </div>
      </div>

      {/* Card Body - Items */}
      <div className="p-3 space-y-2">
        {comanda.items.map((item) => (
          <div
            key={item.idDetalleComanda}
            className={`border-l-4 rounded-lg p-3 transition-colors ${getItemColor(item)}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                    {item.nombreProducto}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                    x{item.cantidad}
                  </span>
                </div>
                {item.notas && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic truncate">
                    "{item.notas}"
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(item)}
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {formatTime(item.tiempoTranscurrido)}
                  </span>
                </div>
                {item.empleadoAsignado && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    <ChefHat className="w-3 h-3 inline mr-0.5" />
                    {item.empleadoAsignado}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="flex-shrink-0">
                {item.estado === 'PENDIENTE' && (
                  <button
                    onClick={() => onTomar(item.idDetalleComanda)}
                    disabled={isTomando}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shadow-sm"
                  >
                    Tomar
                  </button>
                )}
                {item.estado === 'EN_PREPARACION' && (
                  <button
                    onClick={() => onMarcarListo(item.idDetalleComanda)}
                    disabled={isMarcandoListo}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors shadow-sm"
                  >
                    Listo
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Card Footer */}
      <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{comanda.totalItems} items</span>
          <span>{comanda.itemsPendientes} pend. · {comanda.itemsEnPreparacion} prep. · {comanda.itemsListos} listos</span>
        </div>
      </div>
    </div>
  )
}
