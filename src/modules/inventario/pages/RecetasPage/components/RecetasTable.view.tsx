import { Calculator, Copy, Eye, Pencil, Power, Trash2 } from 'lucide-react'
import type { Receta } from '../../../services/recetas.service'

interface RecetasTableProps {
  recetas: Receta[]
  canUpdate: boolean
  canDelete: boolean
  hasSucursalForCosto: boolean
  onView: (receta: Receta) => void
  onEdit: (receta: Receta) => void
  onDuplicate: (receta: Receta) => void
  onDeactivate: (receta: Receta) => Promise<void>
  onDelete: (receta: Receta) => Promise<void>
  onRecalculateCosto: (receta: Receta) => Promise<void>
}

export function RecetasTable({
  recetas,
  canUpdate,
  canDelete,
  hasSucursalForCosto,
  onView,
  onEdit,
  onDuplicate,
  onDeactivate,
  onDelete,
  onRecalculateCosto,
}: RecetasTableProps) {
  if (recetas.length === 0) {
    return (
      <div className="rounded-[1.75rem] border-2 border-dashed border-wine-100/40 bg-wine-50/20 px-6 py-16 text-center dark:border-wine-900/20 dark:bg-wine-950/10">
        <p className="text-xs font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
          No hay recetas para mostrar
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-wine-100/40 bg-white/85 shadow-[0_14px_40px_-20px_rgba(69,10,10,0.3)] dark:border-wine-900/20 dark:bg-black/30">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-wine-100/40 dark:divide-wine-900/20">
          <thead className="bg-wine-50/70 dark:bg-wine-950/30">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/70">Receta</th>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/70">Producto</th>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/70">Sucursal Ref.</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/70">Costo</th>
              <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/70">Estado</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/70">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wine-100/30 dark:divide-wine-900/20">
            {recetas.map((r) => (
              <tr key={r.idReceta} className="transition-colors hover:bg-wine-50/40 dark:hover:bg-wine-900/10">
                <td className="px-4 py-3">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{r.nombre}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.versionEtiqueta || 'Sin version'}</p>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{r.nombreProductoFinal || '-'}</td>
                <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-300">{r.nombreSucursalReferencia || '-'}</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-800 dark:text-slate-200">
                  {r.costoTotal !== undefined && r.costoTotal !== null ? `Bs ${Number(r.costoTotal).toFixed(2)}` : '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                      r.activo
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                    }`}
                  >
                    {r.activo ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onView(r)}
                      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-wine-300 hover:text-wine-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-wine-700 dark:hover:text-wine-300"
                      title="Ver detalle"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {canUpdate && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(r)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-amber-300 hover:text-amber-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-700 dark:hover:text-amber-300"
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDuplicate(r)}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-sky-300 hover:text-sky-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-sky-700 dark:hover:text-sky-300"
                          title="Duplicar"
                        >
                          <Copy className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeactivate(r)}
                          disabled={!r.activo}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-rose-300 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-700 dark:hover:text-rose-300"
                          title="Desactivar"
                        >
                          <Power className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onRecalculateCosto(r)}
                          disabled={!hasSucursalForCosto}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:text-emerald-300"
                          title="Recalcular costo"
                        >
                          <Calculator className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(r)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-rose-300 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-rose-700 dark:hover:text-rose-300"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
