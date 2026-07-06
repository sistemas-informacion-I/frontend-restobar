import { CheckCircle2, Eye, PencilLine, Slash, Trash2 } from 'lucide-react'
import type { Promocion } from '../models/Promocion'

interface PromocionTableProps {
  promociones: Promocion[]
  sucursalesById?: Record<number, string>
  onView: (promocion: Promocion) => void
  onEdit: (promocion: Promocion) => void
  onActivate: (promocion: Promocion) => void
  onDeactivate: (promocion: Promocion) => void
  onDelete: (promocion: Promocion) => void
  isSubmitting?: boolean
}

const formatDate = (value?: string) => {
  if (!value) return '—'

  const normalized = value.trim()

  // Evita desfases por zona horaria al parsear fechas sin hora (yyyy-MM-dd)
  const isoMatch = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (isoMatch) {
    const [, year, month, day] = isoMatch
    return `${day}/${month}/${year}`
  }

  const slashMatch = normalized.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (slashMatch) {
    const [, day, month, year] = slashMatch
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`
  }

  return normalized
}

const tipoLabel: Record<string, string> = {
  PORCENTAJE: 'Porcentaje',
  MONTO_FIJO: 'Monto fijo',
  COMPRA_MINIMA: 'Compra mínima',
  DOS_POR_UNO: '2x1',
  COMBO: 'Combo',
}

const estadoLabel: Record<string, string> = {
  PROGRAMADA: 'Programada',
  ACTIVA: 'Activa',
  INACTIVA: 'Inactiva',
  FINALIZADA: 'Finalizada',
}

export function PromocionTable({ promociones, sucursalesById = {}, onView, onEdit, onActivate, onDeactivate, onDelete, isSubmitting = false }: PromocionTableProps) {
  if (!promociones.length) {
    return (
      <div className="rounded-[2rem] border border-dashed border-wine-100/50 bg-white/70 p-10 text-center text-sm font-semibold text-slate-500 dark:border-wine-900/20 dark:bg-black/20 dark:text-slate-400">
        No hay promociones para mostrar.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-wine-100/40 bg-white/80 shadow-[0_18px_60px_-24px_rgba(137,2,2,0.22)] backdrop-blur dark:border-wine-900/20 dark:bg-black/30">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-wine-100/50 text-left text-sm dark:divide-wine-900/20">
          <thead className="bg-wine-50/70 text-[10px] font-black uppercase tracking-[0.2em] text-wine-700 dark:bg-wine-900/10 dark:text-wine-300">
            <tr>
              <th className="px-4 py-4">Nombre</th>
              <th className="px-4 py-4">Tipo</th>
              <th className="px-4 py-4">Descuento</th>
              <th className="px-4 py-4">Inicio</th>
              <th className="px-4 py-4">Fin</th>
              <th className="px-4 py-4">Estado</th>
              <th className="px-4 py-4">Sucursal</th>
              <th className="px-4 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/60">
            {promociones.map((promocion) => (
              (() => {
                const isEditable = promocion.editable !== false
                const isEstadoActivo = promocion.estado === 'ACTIVA'
                const isProgramada = promocion.estado === 'PROGRAMADA'
                const isInactiva = promocion.estado === 'INACTIVA'
                const isFinalizada = promocion.estado === 'FINALIZADA'
                const canEdit = isEditable && !isFinalizada
                const shouldShowDeactivate = isEstadoActivo || (isProgramada && promocion.activo === true)
                const shouldShowActivate = isInactiva || (isProgramada && promocion.activo !== true)
                const canActivate = isEditable && shouldShowActivate
                const canDeactivate = isEditable && shouldShowDeactivate
                const estadoClass = isProgramada
                  ? 'bg-sky-100 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400'
                  : isEstadoActivo
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : isFinalizada
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'

                return (
              <tr key={promocion.id} className="bg-white/50 transition hover:bg-wine-50/30 dark:bg-transparent dark:hover:bg-wine-900/10">
                <td className="px-4 py-4">
                  <div className="font-semibold text-slate-900 dark:text-white">{promocion.nombre}</div>
                  {promocion.descripcion && <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{promocion.descripcion}</div>}
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{tipoLabel[promocion.tipo] ?? promocion.tipo}</td>
                <td className="px-4 py-4 font-semibold text-wine-700 dark:text-wine-300">{promocion.valorDescuento}%</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{formatDate(promocion.fechaInicio)}</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{formatDate(promocion.fechaFin)}</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${estadoClass}`}>
                    <CheckCircle2 size={14} />
                    {estadoLabel[promocion.estado] ?? promocion.estado}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">{promocion.nombreSucursal ?? sucursalesById[promocion.idSucursal] ?? `#${promocion.idSucursal}`}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <button type="button" title="Ver promoción" onClick={() => onView(promocion)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-wine-300 hover:text-wine-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-wine-700">
                      <Eye size={16} />
                    </button>
                    <button type="button" title="Editar promoción" disabled={!canEdit} onClick={() => onEdit(promocion)} className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-wine-300 hover:text-wine-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:border-wine-700">
                      <PencilLine size={16} />
                    </button>
                    {shouldShowDeactivate ? (
                      <button type="button" title="Desactivar promoción" disabled={isSubmitting || !canDeactivate} onClick={() => onDeactivate(promocion)} className="rounded-xl border border-amber-200 p-2 text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-amber-900/30 dark:text-amber-400">
                        <Slash size={16} />
                      </button>
                    ) : shouldShowActivate ? (
                      <button type="button" title="Activar promoción" disabled={isSubmitting || !canActivate} onClick={() => onActivate(promocion)} className="rounded-xl border border-emerald-200 p-2 text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-900/30 dark:text-emerald-400">
                        <CheckCircle2 size={16} />
                      </button>
                    ) : (
                      <button type="button" title="No disponible para promociones finalizadas" disabled className="rounded-xl border border-slate-200 p-2 text-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-500">
                        <Slash size={16} />
                      </button>
                    )}
                    <button type="button" title="Eliminar promoción" disabled={isSubmitting} onClick={() => onDelete(promocion)} className="rounded-xl border border-rose-200 p-2 text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-900/30 dark:text-rose-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
                )
              })()
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
