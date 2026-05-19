import { Edit2, ShoppingBag, Tag, CheckCircle, XCircle, AlertTriangle, ShoppingCart, Clock } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { TableContainer } from '@/shared/components/ui'
import { CatalogoProducto } from '../../../models/catalogo.model'

interface CatalogoTableProps {
  productos: CatalogoProducto[]
  canUpdate: boolean
  isAdmin: boolean
  onEdit: (producto: CatalogoProducto) => void
  onAgregarCarrito?: (producto: CatalogoProducto) => void
}

export function CatalogoTable({ productos, canUpdate, isAdmin, onEdit, onAgregarCarrito }: CatalogoTableProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {productos.length === 0 ? (
          <div className="col-span-2 glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-12 text-center dark:border-wine-900/20">
            <ShoppingBag size={40} className="mx-auto text-wine-100 dark:text-wine-900/30 mb-3" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Sin productos</span>
          </div>
        ) : productos.map((p) => (
          <div key={p.idProductoFinal} className="glass-card overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/50 p-5 dark:border-wine-900/20 dark:bg-black/20 shadow-xl shadow-wine-900/5 flex flex-col gap-4">
            {/* Imagen */}
            <div className="relative">
              {p.imagenUrl ? (
                <img src={p.imagenUrl} alt={p.nombre} className="w-full h-36 rounded-2xl object-cover" />
              ) : (
                <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 flex items-center justify-center">
                  <ShoppingBag size={40} className="text-white/50" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <EstadoBadge disponible={p.disponible} hayStock={p.hayStock} />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
              <span className="font-black text-slate-900 dark:text-white leading-tight">{p.nombre}</span>
              {p.descripcion && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{p.descripcion}</span>
              )}
              <div className="flex items-center justify-between mt-1">
                {p.nombreCategoria && (
                  <span className="inline-flex items-center gap-1 bg-wine-500/10 text-wine-700 dark:text-wine-300 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-wine-100/50">
                    <Tag size={9} /> {p.nombreCategoria}
                  </span>
                )}
                {p.tiempoPreparacion && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock size={11} /> {p.tiempoPreparacion} min
                  </span>
                )}
              </div>
            </div>

            {/* Precio + Acciones */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-wine-100/20 dark:border-wine-900/20">
              <span className="text-lg font-black text-slate-900 dark:text-white">Bs. {p.precio.toFixed(2)}</span>
              {canUpdate ? (
                <Button variant="ghost" size="sm" className="!rounded-xl border border-wine-100/50 h-9" onClick={() => onEdit(p)}>
                  <Edit2 size={14} className="mr-1.5" /> Editar
                </Button>
              ) : (
                p.disponible && onAgregarCarrito && (
                  <Button size="sm" className="!rounded-xl shadow-lg shadow-wine-900/20 h-9" onClick={() => onAgregarCarrito(p)}>
                    <ShoppingCart size={14} className="mr-1.5" /> Agregar
                  </Button>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden">
        <TableContainer>
          <table className="min-w-[900px] w-full border-collapse">
            <thead>
              <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
                {['Producto', 'Categoría', 'Tiempo', 'Precio', ...(isAdmin ? ['Stock', 'Estado'] : ['Estado']), 'Acciones'].map(h => (
                  <th key={h} className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <ShoppingBag size={40} className="text-wine-100 dark:text-wine-900/30" />
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">No se encontraron productos</span>
                    </div>
                  </td>
                </tr>
              ) : productos.map((p) => (
                <tr key={p.idProductoFinal} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {p.imagenUrl ? (
                        <img src={p.imagenUrl} alt={p.nombre} className="h-12 w-12 rounded-2xl object-cover shadow-lg" />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg group-hover:scale-105 transition-transform">
                          <ShoppingBag size={20} />
                        </div>
                      )}
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-900 dark:text-white tracking-tight">{p.nombre}</span>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-wine-600 dark:text-wine-400">{p.codigo}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {p.nombreCategoria ? (
                      <span className="inline-flex items-center gap-1.5 bg-wine-500/10 text-wine-700 dark:text-wine-300 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border border-wine-100/50">
                        <Tag size={10} /> {p.nombreCategoria}
                      </span>
                    ) : <span className="text-[10px] text-slate-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    {p.tiempoPreparacion ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                        <Clock size={12} /> {p.tiempoPreparacion} min
                      </span>
                    ) : <span className="text-[10px] text-slate-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900 dark:text-white">Bs. {p.precio.toFixed(2)}</span>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4">
                      {p.hayStock ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle size={14} /> Con stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-wider">
                          <AlertTriangle size={14} /> Sin stock
                        </span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <EstadoBadge disponible={p.disponible} hayStock={p.hayStock} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      {canUpdate ? (
                        <Button variant="ghost" size="sm" className="!rounded-xl bg-white/50 dark:bg-black/20 border border-transparent hover:border-wine-100" onClick={() => onEdit(p)} title="Editar">
                          <Edit2 size={16} />
                        </Button>
                      ) : (
                        p.disponible && onAgregarCarrito && (
                          <Button size="sm" className="!rounded-xl shadow-lg shadow-wine-900/20" onClick={() => onAgregarCarrito(p)} title="Agregar al carrito">
                            <ShoppingCart size={16} />
                          </Button>
                        )
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

function EstadoBadge({ disponible, hayStock }: { disponible: boolean; hayStock: boolean }) {
  if (!hayStock) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter border bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
        <AlertTriangle size={10} /> Sin stock
      </span>
    )
  }
  return disponible ? (
    <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Disponible
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
      <XCircle size={10} /> No disponible
    </span>
  )
}
