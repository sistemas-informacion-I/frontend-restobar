import { Edit2, Eye, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { TableContainer } from '@/shared/components/ui'
import { CompraResponse, EstadoPago } from '@/modules/comercial/services/compras.service'

interface CompraTableProps {
  compras: CompraResponse[]
  canUpdate: boolean
  canDelete: boolean
  onView: (compra: CompraResponse) => void
  onEdit: (compra: CompraResponse) => void
  onDelete: (compra: CompraResponse) => void
  onCambiarEstado: (compra: CompraResponse, nuevoEstado: EstadoPago) => void
}

const ESTADO_STYLES: Record<EstadoPago, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900/30',
  PAGADO: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30',
  PARCIAL: 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-900/30',
  VENCIDO: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-900/30',
}

const ESTADOS_DISPONIBLES: EstadoPago[] = ['PENDIENTE', 'PAGADO', 'PARCIAL', 'VENCIDO']

export function CompraTable({
  compras,
  canUpdate,
  canDelete,
  onView,
  onEdit,
  onDelete,
  onCambiarEstado,
}: CompraTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {compras.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-12 text-center dark:border-wine-900/20">
            <ShoppingCart size={40} className="mx-auto text-wine-100 dark:text-wine-900/30 mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No hay compras</span>
          </div>
        ) : (
          compras.map((c) => (
            <div key={c.idCompra} className="glass-card overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/50 p-6 dark:border-wine-900/20 dark:bg-black/20 shadow-xl shadow-wine-900/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20">
                    <ShoppingCart size={24} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-none">{c.nroFactura}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600 dark:text-wine-400">{c.nombreProveedor}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm border ${ESTADO_STYLES[c.estadoPago]}`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${c.estadoPago === 'PAGADO' ? 'bg-green-500 animate-pulse' : 'bg-current'}`} />
                  {c.estadoPago}
                </span>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Fecha:</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{c.fechaCompra}</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Total:</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">Bs {c.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                  onClick={() => onView(c)}
                >
                  <Eye size={16} className="mr-2" /> Detalle
                </Button>
                {canUpdate && (
                  <Button
                    variant="ghost"
                    className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                    onClick={() => onEdit(c)}
                  >
                    <Edit2 size={16} className="mr-2" /> Editar
                  </Button>
                )}
                {canUpdate && (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) onCambiarEstado(c, e.target.value as EstadoPago)
                      e.target.value = ''
                    }}
                    className="h-10 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-[10px] font-black uppercase tracking-widest text-slate-900 outline-none transition-all hover:border-wine-300/50 focus:border-wine-500 focus:ring-2 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/40 dark:text-white"
                  >
                    <option value="">Cambiar Estado</option>
                    {ESTADOS_DISPONIBLES.filter((e) => e !== c.estadoPago).map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                )}
                {canDelete && (
                  <Button
                    variant="danger"
                    className="!rounded-xl h-12"
                    onClick={() => onDelete(c)}
                  >
                    <Trash2 size={16} className="mr-2" /> Eliminar
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TableContainer>
          <table className="min-w-[1100px] w-full border-collapse">
            <thead>
              <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">N° Factura</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Proveedor</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Empleado</th>
                <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Fecha</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Total</th>
                <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {compras.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingCart size={40} className="text-wine-100 dark:text-wine-900/30" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No se encontraron compras</span>
                    </div>
                  </td>
                </tr>
              ) : compras.map((c) => (
                <tr key={c.idCompra} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/20 group-hover:scale-105 transition-transform">
                        <ShoppingCart size={20} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 dark:text-white tracking-tight leading-none">{c.nroFactura}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{c.nombreProveedor}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{c.nombreEmpleado}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{c.fechaCompra}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-slate-900 dark:text-white">Bs {c.total.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {canUpdate ? (
                      <select
                        value={c.estadoPago}
                        onChange={(e) => onCambiarEstado(c, e.target.value as EstadoPago)}
                        className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter border cursor-pointer ${ESTADO_STYLES[c.estadoPago]}`}
                      >
                        {ESTADOS_DISPONIBLES.map((e) => (
                          <option key={e} value={e}>{e}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter border ${ESTADO_STYLES[c.estadoPago]}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${c.estadoPago === 'PAGADO' ? 'bg-green-500 animate-pulse' : 'bg-current'}`} />
                        {c.estadoPago}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                        onClick={() => onView(c)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </Button>
                      {canUpdate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!rounded-xl bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 border border-transparent hover:border-wine-100 dark:hover:border-wine-900/20 transition-all"
                          onClick={() => onEdit(c)}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="danger"
                          size="sm"
                          className="!rounded-xl shadow-lg shadow-rose-900/10"
                          onClick={() => onDelete(c)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
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
