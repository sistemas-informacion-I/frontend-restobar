import { Clock, ChefHat, CheckCircle2, AlertCircle, Utensils, Package } from 'lucide-react'
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

  const getItemAccent = (item: PreparacionQueueItem) => {
    if (item.estado === 'PENDIENTE') return 'border-l-amber-500 bg-amber-50/60 dark:bg-amber-950/20'
    if (item.estado === 'EN_PREPARACION') return 'border-l-wine-500 bg-wine-50/60 dark:bg-wine-950/20'
    return 'border-l-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/20'
  }

  const getStatusBadge = (item: PreparacionQueueItem) => {
    const base = 'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border'
    if (item.estado === 'PENDIENTE')
      return <span className={`${base} bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20`}><Clock className="h-3 w-3" /> Pendiente</span>
    if (item.estado === 'EN_PREPARACION')
      return <span className={`${base} bg-wine-500/10 text-wine-700 dark:text-wine-300 border-wine-500/20`}><ChefHat className="h-3 w-3" /> Preparando</span>
    return <span className={`${base} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20`}><CheckCircle2 className="h-3 w-3" /> Listo</span>
  }

  const getServiceIcon = () => {
    if (comanda.tipoServicio === 'MESA') return <Utensils size={20} />
    if (comanda.tipoServicio === 'PARA_LLEVAR') return <AlertCircle size={20} />
    return <span className="text-[10px] font-black">ON</span>
  }

  return (
    <div className="glass-card overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/50 shadow-xl shadow-wine-900/5 transition-all hover:shadow-2xl hover:shadow-wine-900/10 dark:border-wine-900/20 dark:bg-black/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 border-b border-wine-100/50 bg-wine-50/40 px-5 py-4 dark:border-wine-900/20 dark:bg-wine-950/20">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
            {getServiceIcon()}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-black leading-none tracking-tight text-slate-900 dark:text-white">
              {comanda.numeroComanda}
            </h3>
            <p className="mt-1 truncate text-[10px] font-black uppercase tracking-[0.2em] text-wine-600 dark:text-wine-400">
              {comanda.mesaNombre}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-widest ${
            comanda.itemsPendientes > 0
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
              : 'bg-wine-500/10 text-wine-700 dark:text-wine-300 border-wine-500/20'
          }`}>
            {comanda.itemsPendientes > 0 ? (
              <><Clock className="h-3 w-3" /> {comanda.itemsPendientes}</>
            ) : (
              <><ChefHat className="h-3 w-3" /> {comanda.itemsEnPreparacion}</>
            )}
          </span>
          {comanda.itemsListos > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> {comanda.itemsListos}
            </span>
          )}
        </div>
      </div>

      {/* Card Body - Items */}
      <div className="space-y-2.5 p-4">
        {comanda.items.map((item) => (
          <div
            key={item.idDetalleComanda}
            className={`rounded-2xl border border-wine-100/30 border-l-4 p-3.5 transition-colors dark:border-wine-900/10 ${getItemAccent(item)}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                    {item.nombreProducto}
                  </span>
                  <span className="shrink-0 rounded-lg bg-wine-500/10 px-1.5 py-0.5 text-[10px] font-black text-wine-700 dark:text-wine-300">
                    x{item.cantidad}
                  </span>
                </div>
                {item.notas && (
                  <p className="mt-1 truncate text-[11px] font-medium italic text-slate-500 dark:text-slate-400">
                    "{item.notas}"
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {getStatusBadge(item)}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-100/30">
                    <Clock className="h-3 w-3" /> {formatTime(item.tiempoTranscurrido)}
                  </span>
                </div>
                {item.empleadoAsignado && (
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    <ChefHat className="h-3 w-3" /> {item.empleadoAsignado}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                {item.estado === 'PENDIENTE' && (
                  <button
                    onClick={() => onTomar(item.idDetalleComanda)}
                    disabled={isTomando}
                    className="rounded-xl bg-amber-500 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-amber-900/20 transition-all hover:bg-amber-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Tomar
                  </button>
                )}
                {item.estado === 'EN_PREPARACION' && (
                  <button
                    onClick={() => onMarcarListo(item.idDetalleComanda)}
                    disabled={isMarcandoListo}
                    className="rounded-xl bg-emerald-500 px-3.5 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-emerald-900/20 transition-all hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
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
      <div className="flex items-center justify-between border-t border-wine-100/50 bg-wine-50/30 px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:border-wine-900/20 dark:bg-wine-950/20 dark:text-wine-100/30">
        <span className="inline-flex items-center gap-1.5"><Package className="h-3.5 w-3.5 text-wine-600" /> {comanda.totalItems} ítems</span>
        <span>{comanda.itemsPendientes} pend · {comanda.itemsEnPreparacion} prep · {comanda.itemsListos} listos</span>
      </div>
    </div>
  )
}
