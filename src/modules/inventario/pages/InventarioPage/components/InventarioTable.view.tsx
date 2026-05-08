import { Package, AlertTriangle, ChevronRight, Edit2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { TableContainer } from '@/shared/components/ui'
import { InventarioItemWithStock } from '../../../services/inventario.service'

interface InventarioTableProps {
  insumos: InventarioItemWithStock[]
  onOpenStockDetails: (item: InventarioItemWithStock) => void
  onOpenEditModal: (item: InventarioItemWithStock) => void
  onOpenStockInitialModal: (item: InventarioItemWithStock) => void
}

export function InventarioTable({
  insumos,
  onOpenStockDetails,
  onOpenEditModal,
  onOpenStockInitialModal
}: InventarioTableProps) {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-[2.5rem] border border-wine-100/50 bg-white/60 shadow-2xl backdrop-blur-xl dark:border-wine-900/10 dark:bg-black/20 md:block">
        <TableContainer>
          <table className="w-full text-left">
            <thead>
            <tr className="bg-wine-50/50 dark:bg-wine-900/10">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Insumo</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Código / Marca</th>
              <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Unidad</th>
              <th className="px-8 py-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Stock Sucursal</th>
              <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Acciones</th>
            </tr>
          </thead>
            <tbody className="divide-y divide-wine-100/20 dark:divide-wine-900/5">
            {insumos.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-12 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                    No se encontraron insumos
                  </span>
                </td>
              </tr>
            ) : (
              insumos.map((item) => (
              <tr 
                key={item.idInventario} 
                className="group hover:bg-wine-50/30 dark:hover:bg-wine-900/5 transition-colors cursor-pointer"
                onClick={() => onOpenStockDetails(item)}
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-50 to-wine-100 text-wine-700 dark:from-wine-900/20 dark:to-wine-900/40 dark:text-wine-400 shadow-sm transition-transform group-hover:scale-110">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800 dark:text-slate-100">{item.nombre}</p>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">{item.descripcion || 'Sin descripción'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{item.codigo}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase">{item.marca || '-'}</p>
                </td>
                <td className="px-8 py-6 text-center">
                  <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {item.unidadMedida}
                  </span>
                </td>
                <td className="px-8 py-6 text-center">
                  {item.idStock ? (
                    <div className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs font-black transition-all ${
                      item.stockActual <= (item.stockMinimo || 0)
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 animate-pulse border border-rose-200 dark:border-rose-900/30' 
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/30'
                    }`}>
                      {item.stockActual <= (item.stockMinimo || 0) && <AlertTriangle size={14} />}
                      {item.stockActual} {item.unidadMedida}
                    </div>
                  ) : (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="rounded-xl text-[10px] border-dashed"
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenStockInitialModal(item)
                      }}
                    >
                      Inicializar Stock
                    </Button>
                  )}
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onOpenEditModal(item)
                      }}
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 hover:bg-wine-50 hover:text-wine-600 dark:hover:bg-wine-900/20 transition-all"
                      title="Editar Insumo"
                    >
                      <Edit2 size={18} />
                    </button>
                    <ChevronRight className="text-wine-200 transition-all group-hover:translate-x-1 group-hover:text-wine-600" />
                  </div>
                </td>
              </tr>
              ))
            )}
            </tbody>
          </table>
        </TableContainer>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {insumos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-wine-200/60 bg-white/70 py-10 text-center dark:border-wine-900/20 dark:bg-black/30">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">
              No se encontraron insumos
            </span>
          </div>
        ) : (
          insumos.map((item) => (
          <div 
            key={item.idInventario} 
            className="group relative overflow-hidden rounded-3xl border border-wine-100/50 bg-white p-6 dark:border-wine-900/20 dark:bg-black/40 active:scale-95 transition-all shadow-lg"
            onClick={() => onOpenStockDetails(item)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-50 text-wine-600 dark:bg-wine-900/30 dark:text-wine-400">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">{item.nombre}</h3>
                  <p className="text-[10px] font-bold text-wine-600 uppercase tracking-widest">{item.codigo}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenEditModal(item)
                  }}
                  className="p-2 text-slate-400 hover:text-wine-600"
                >
                  <Edit2 size={16} />
                </button>
                {item.idStock && item.stockActual <= (item.stockMinimo || 0) && (
                  <div className="rounded-full bg-rose-500 p-1.5 text-white shadow-lg shadow-rose-500/30">
                    <AlertTriangle size={14} />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-wine-100/30 pt-4 dark:border-wine-900/10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Stock Actual</p>
                <p className={`text-sm font-black ${item.stockActual <= (item.stockMinimo || 0) ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {item.idStock ? `${item.stockActual} ${item.unidadMedida}` : 'No inicializado'}
                </p>
              </div>
              <ChevronRight size={20} className="text-wine-200" />
            </div>
          </div>
          ))
        )}
      </div>
    </>
  )
}
