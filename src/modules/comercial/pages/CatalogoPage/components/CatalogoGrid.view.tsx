import { Edit2, ShoppingCart, Tag, XCircle, AlertTriangle, Clock, ShoppingBag, Flame } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { EmptyState } from '@/shared/components/ui/EmptyState/EmptyState'
import { CatalogoProducto } from '../../../models/catalogo.model'
import { useState } from 'react'

interface CatalogoGridProps {
  productos: CatalogoProducto[]
  canUpdate: boolean
  isAdmin: boolean
  onEdit: (producto: CatalogoProducto) => void
  onAgregarCarrito?: (producto: CatalogoProducto, element?: HTMLElement) => void
}

export function CatalogoGrid({ productos, canUpdate, isAdmin: _isAdmin, onEdit, onAgregarCarrito }: CatalogoGridProps) {
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  if (productos.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No se encontraron productos"
        description="Intenta con otros filtros o categorías"
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {productos.map((p) => {

        return (
          <div
            key={p.idProductoFinal}
            className="group relative overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/70 backdrop-blur-sm dark:border-wine-900/30 dark:bg-black/30 shadow-lg shadow-wine-900/5 transition-all duration-500 hover:shadow-2xl hover:shadow-wine-900/15 hover:-translate-y-1.5 hover:border-wine-300 dark:hover:border-wine-700"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-wine-100 via-wine-50 to-white dark:from-wine-950 dark:via-black dark:to-wine-950">
              {p.imagenUrl && !imageErrors[p.idProductoFinal] ? (
                <>
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
                  <img
                    src={p.imagenUrl}
                    alt={p.nombre}
                    className="relative w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                    onError={() => setImageErrors(prev => ({ ...prev, [p.idProductoFinal]: true }))}
                    onLoad={(e) => {
                      const el = e.target as HTMLImageElement
                      el.previousElementSibling?.remove()
                    }}
                  />
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-wine-600 to-wine-950">
                  <ShoppingBag size={52} className="text-white/25 transition-transform duration-500 group-hover:scale-110" />
                </div>
              )}

              <div className="absolute top-3 left-3 z-10 flex gap-1.5">
                {!p.hayStock ? (
                  <EstadoBadge type="sin-stock" />
                ) : p.disponible ? (
                  <EstadoBadge type="disponible" />
                ) : (
                  <EstadoBadge type="no-disponible" />
                )}
                {p.idProductoFinal % 5 === 0 && (
                  <span className="inline-flex items-center gap-1 rounded-xl bg-amber-400/90 px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter text-amber-950 backdrop-blur-sm">
                    <Flame size={10} /> Popular
                  </span>
                )}
              </div>

              {p.tiempoPreparacion && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-xl bg-black/50 px-3 py-1.5 text-[10px] font-bold text-white backdrop-blur-md">
                  <Clock size={11} /> {p.tiempoPreparacion} min
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>

            <div className="flex flex-col gap-2.5 p-5">
              <div className="flex items-center gap-2">
                {p.nombreCategoria && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-wine-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-wine-700 dark:text-wine-300 border border-wine-200/50 dark:border-wine-800/50">
                    <Tag size={9} /> {p.nombreCategoria}
                  </span>
                )}
              </div>

              <h3 className="font-black text-slate-900 dark:text-white leading-tight line-clamp-2 group-hover:text-wine-700 dark:group-hover:text-wine-400 transition-colors">
                {p.nombre}
              </h3>

              {p.descripcion && (
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  {p.descripcion}
                </p>
              )}

              <div className="flex items-center justify-between pt-2.5 border-t border-wine-100/30 dark:border-wine-900/20">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-wine-500 dark:text-wine-400">
                    {p.codigo}
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">
                    Bs. {p.precio.toFixed(2)}
                  </span>
                </div>

                {canUpdate ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="!rounded-xl border border-wine-100/50 h-9 hover:bg-wine-50 dark:hover:bg-wine-950/50"
                    onClick={() => onEdit(p)}
                  >
                    <Edit2 size={14} className="mr-1.5" /> Editar
                  </Button>
                ) : (
                  p.disponible && onAgregarCarrito && (
                    <Button
                      size="sm"
                      className="!rounded-xl shadow-lg shadow-wine-900/20 h-9 transform transition-all duration-300 hover:scale-105 active:scale-95"
                      onClick={(e) => {
                        const btn = e.currentTarget.closest('.group') as HTMLElement | null
                        onAgregarCarrito(p, btn || undefined)
                      }}
                    >
                      <ShoppingCart size={14} className="mr-1.5" /> Agregar
                    </Button>
                  )
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function EstadoBadge({ type }: { type: 'disponible' | 'no-disponible' | 'sin-stock' }) {
  const config = {
    'disponible': {
      icon: <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />,
      text: 'Disponible',
      className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    'no-disponible': {
      icon: <XCircle size={10} />,
      text: 'No disponible',
      className: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    'sin-stock': {
      icon: <AlertTriangle size={10} />,
      text: 'Sin stock',
      className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
  }

  const c = config[type]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter border ${c.className} backdrop-blur-sm`}>
      {c.icon} {c.text}
    </span>
  )
}
