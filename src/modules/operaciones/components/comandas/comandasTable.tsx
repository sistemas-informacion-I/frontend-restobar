import { Eye, Edit2, Trash2, CheckCircle, ClipboardList, Store, Grid3X3, Armchair, Package, Users } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { TableContainer } from '@/shared/components/ui'
import type { Comanda } from '../../services/types'

interface ComandasTableProps {
  comandas: Comanda[]
  isLoading: boolean
  onViewClick: (comanda: Comanda) => void
  onEditClick: (comanda: Comanda) => void
  onCloseClick: (comanda: Comanda) => void
  onDeleteClick: (comanda: Comanda) => void
  canEdit?: boolean
  canDelete?: boolean
  canClose?: boolean
}

const ESTADO_STYLES: Record<string, string> = {
  ABIERTA: 'bg-wine-500/10 text-wine-700 dark:text-wine-300 border-wine-500/20',
  EN_PREPARACION: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  LISTA: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  ENTREGADA: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
  CERRADA: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
  CANCELADA: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  PENDIENTE_PAGO: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
}

const TIPO_LABELS: Record<string, string> = {
  MESA: 'En Mesa',
  PARA_LLEVAR: 'Para Llevar',
  ONLINE: 'En Línea',
}

const estadoStyle = (estado: string) => ESTADO_STYLES[estado] || ESTADO_STYLES.ABIERTA

const formatFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })

export function ComandasTable({
  comandas,
  isLoading,
  onViewClick,
  onEditClick,
  onCloseClick,
  onDeleteClick,
  canEdit = true,
  canDelete = true,
  canClose = true,
}: ComandasTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
        <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando comandas...</p>
      </div>
    )
  }

  const ubicacion = (comanda: Comanda) => (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-200">
        <Store size={12} className="text-wine-600" />
        <span className="text-xs font-bold tracking-tight truncate">{comanda.nombreSucursal || '—'}</span>
      </div>
      {comanda.tipoServicio === 'MESA' && (
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
          <Grid3X3 size={12} className="text-wine-900/40 dark:text-wine-100/30" />
          <span className="text-[11px] font-semibold tracking-tight truncate">{comanda.nombreSector || 'Sin sector'}</span>
          {comanda.mesaNombre && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-wine-700 dark:text-wine-300">
              <Armchair size={11} /> {comanda.mesaNombre}
            </span>
          )}
        </div>
      )}
    </div>
  )

  const actions = (comanda: Comanda) => {
    const cerrada = comanda.estado === 'CERRADA' || comanda.estado === 'CANCELADA'
    return (
      <div className="flex justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewClick(comanda)}
          title="Ver detalles"
          className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
        >
          <Eye size={16} />
        </Button>
        {canEdit && !cerrada && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEditClick(comanda)}
            title="Editar"
            className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
          >
            <Edit2 size={16} />
          </Button>
        )}
        {canClose && !cerrada && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCloseClick(comanda)}
            title="Cerrar comanda"
            className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20 hover:!text-emerald-600 border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900/30 transition-all"
          >
            <CheckCircle size={16} />
          </Button>
        )}
        {canDelete && comanda.estado !== 'CERRADA' && (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDeleteClick(comanda)}
            title="Eliminar"
            className="!rounded-xl shadow-lg shadow-rose-900/10"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {comandas.map((comanda) => (
          <div
            key={comanda.idComanda}
            className="glass-card overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/50 p-6 dark:border-wine-900/20 dark:bg-black/20 shadow-xl shadow-wine-900/5 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
                  <ClipboardList size={24} />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-lg font-black leading-none tracking-tight text-slate-900 dark:text-white">{comanda.numeroComanda}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600 dark:text-wine-400">{formatFecha(comanda.fechaApertura)}</span>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm ${estadoStyle(comanda.estado)}`}>
                {comanda.estado.replace('_', ' ')}
              </span>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 rounded-2xl border border-wine-100/30 bg-wine-50/30 p-3 dark:border-wine-900/10 dark:bg-wine-900/10">
                <span className="text-[8px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Servicio</span>
                <span className="text-xs font-black tracking-tight text-wine-700 dark:text-wine-300">{TIPO_LABELS[comanda.tipoServicio]}</span>
              </div>
              <div className="flex flex-col gap-1 rounded-2xl border border-wine-100/30 bg-wine-50/30 p-3 dark:border-wine-900/10 dark:bg-wine-900/10">
                <span className="text-[8px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Ubicación</span>
                {ubicacion(comanda) || <span className="text-xs font-black tracking-tight text-slate-400">—</span>}
              </div>
            </div>

            <div className="mb-4 flex items-center gap-4 text-[11px] font-bold text-slate-500 dark:text-slate-400">
              {comanda.numeroPersonas != null && (
                <span className="inline-flex items-center gap-1"><Users size={13} className="text-wine-600" /> {comanda.numeroPersonas} pers.</span>
              )}
              <span className="inline-flex items-center gap-1"><Package size={13} className="text-wine-600" /> {comanda.items?.length ?? 0} ítems</span>
              {comanda.clienteNombre && <span className="truncate">{comanda.clienteNombre}</span>}
            </div>

            {actions(comanda)}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TableContainer>
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Comanda</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Servicio</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Ubicación</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Info</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {comandas.map((comanda) => (
                <tr key={comanda.idComanda} className="group transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20 transition-transform group-hover:scale-105">
                        <ClipboardList size={20} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold leading-none tracking-tight text-slate-900 dark:text-white">{comanda.numeroComanda}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-wine-600 dark:text-wine-400">{formatFecha(comanda.fechaApertura)}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg border border-wine-100/50 bg-wine-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-wine-700 dark:border-wine-900/20 dark:text-wine-300">
                      {TIPO_LABELS[comanda.tipoServicio]}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {ubicacion(comanda) || <span className="text-sm font-bold text-slate-400">—</span>}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter shadow-sm ${estadoStyle(comanda.estado)}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      {comanda.estado.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {comanda.numeroPersonas != null && (
                        <span className="inline-flex items-center gap-1"><Users size={12} className="text-wine-600" /> {comanda.numeroPersonas} pers.</span>
                      )}
                      <span className="inline-flex items-center gap-1"><Package size={12} className="text-wine-600" /> {comanda.items?.length ?? 0} ítems</span>
                      {comanda.clienteNombre && <span className="truncate max-w-[140px]">{comanda.clienteNombre}</span>}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="opacity-0 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
                      {actions(comanda)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </div>
    </div>
  )
}
