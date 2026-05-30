import { useNavigate } from 'react-router-dom'
import { ShoppingCart, X, Minus, Plus, Trash2, AlertTriangle, ArrowRight } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { EmptyState } from '@/shared/components/ui/EmptyState/EmptyState'
import { CarritoItemSkeleton } from '@/shared/components/ui/Skeleton/Skeleton'
import { useCarrito } from "@/modules/electronico/hooks/useCarrito"
import { useAuth } from "@/modules/acceso/context/AuthContext"
import { ItemCarritoResponse } from '@/modules/electronico/models/carrito.model'
import { useState } from 'react'

export function CarritoDrawer() {
  const navigate = useNavigate()
  const { carrito, isOpen, isLoading, closeCarrito, actualizarCantidad, eliminarItem } = useCarrito()
  const { isAuthenticated } = useAuth()

  if (!isOpen) return null

  const itemsNoDisponibles = carrito?.items.filter(i => !i.disponible) ?? []
  const tieneProblemas = itemsNoDisponibles.length > 0

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeCarrito}
      />

      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 rounded-l-[2rem] overflow-hidden">
        <div className="flex items-center justify-between border-b border-wine-100/50 dark:border-wine-900/20 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/30">
              <ShoppingCart size={18} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Carrito
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {carrito?.items.length ?? 0} {carrito?.items.length === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>
          <button
            onClick={closeCarrito}
            className="rounded-xl p-2 text-slate-400 hover:bg-wine-50 hover:text-slate-600 dark:hover:bg-wine-900/20 transition-all hover:rotate-90 duration-300"
          >
            <X size={18} />
          </button>
        </div>

        {tieneProblemas && (
          <div className="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-900/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                {itemsNoDisponibles.length === 1
                  ? '1 producto no está disponible en esta sucursal.'
                  : `${itemsNoDisponibles.length} productos no están disponibles.`}{' '}
                Retíralos antes de continuar.
              </p>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {isLoading && !carrito ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <CarritoItemSkeleton key={i} />
              ))}
            </div>
          ) : !carrito || carrito.items.length === 0 ? (
            <EmptyState
              icon="cart"
              title="Tu carrito está vacío"
              description="Agrega productos desde el catálogo"
              action={{ label: 'Ver catálogo', onClick: () => { closeCarrito(); navigate('/catalogo') } }}
              className="py-12"
            />
          ) : (
            carrito.items.map((item) => (
              <ItemRow
                key={item.idProductoFinal}
                item={item}
                onActualizar={actualizarCantidad}
                onEliminar={eliminarItem}
                isLoading={isLoading}
              />
            ))
          )}
        </div>

        {carrito && carrito.items.length > 0 && (
          <div className="border-t border-wine-100/50 dark:border-wine-900/20 px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Bs. {carrito.total.toFixed(2)}
              </span>
            </div>
            <Button
              variant="ghost"
              fullWidth
              onClick={() => {
                closeCarrito()
                navigate('/carrito')
              }}
              className="!rounded-2xl !border !border-wine-100/50 dark:!border-wine-900/30"
              icon={<ArrowRight size={16} />}
            >
              Ver más detalles
            </Button>
            {isAuthenticated && (
              <Button
                className="w-full !rounded-2xl shadow-xl shadow-wine-900/20"
                disabled={tieneProblemas || isLoading}
                onClick={() => {
                  closeCarrito()
                  navigate('/checkout')
                }}
              >
                Realizar pedido
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

function ItemRow({ item, onActualizar, onEliminar, isLoading }: ItemRowProps) {
  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemove = async () => {
    setIsRemoving(true)
    await new Promise(r => setTimeout(r, 200))
    await onEliminar(item.idProductoFinal)
    setIsRemoving(false)
  }

  return (
    <div className={`glass-card rounded-[1.5rem] border p-4 flex gap-4 transition-all duration-300 ${
      isRemoving ? 'opacity-0 scale-95 -translate-x-4' : 'opacity-100'
    } ${
      item.disponible
        ? 'border-wine-100/50 bg-white/50 dark:border-wine-900/20 dark:bg-black/20 hover:shadow-lg hover:border-wine-200 dark:hover:border-wine-800'
        : 'border-amber-200/60 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-900/5'
    }`}>
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-md">
        <ShoppingCart size={18} />
      </div>

      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-900 dark:text-white leading-tight">
              {item.nombreProducto}
            </p>
            {!item.disponible && (
              <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                <AlertTriangle size={9} /> No disponible en esta sucursal
              </span>
            )}
            {item.notasEspeciales && (
              <p className="truncate text-[10px] text-slate-400 italic">{item.notasEspeciales}</p>
            )}
          </div>
          <button
            onClick={handleRemove}
            disabled={isLoading}
            className="shrink-0 rounded-lg p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 transition-all hover:scale-110 active:scale-90 disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => item.cantidad > 1 && onActualizar(item.idProductoFinal, item.cantidad - 1)}
              disabled={isLoading || item.cantidad <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-wine-100/50 bg-white/50 text-slate-500 hover:border-wine-300 hover:bg-wine-50 dark:border-wine-900/30 dark:bg-black/20 transition-all hover:scale-105 active:scale-90 disabled:opacity-30"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-sm font-black text-slate-900 dark:text-white tabular-nums">
              {item.cantidad}
            </span>
            <button
              onClick={() => onActualizar(item.idProductoFinal, item.cantidad + 1)}
              disabled={isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-wine-100/50 bg-white/50 text-slate-500 hover:border-wine-300 hover:bg-wine-50 dark:border-wine-900/30 dark:bg-black/20 transition-all hover:scale-105 active:scale-90 disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>

          <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
            Bs. {item.subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

interface ItemRowProps {
  item: ItemCarritoResponse
  onActualizar: (id: number, cantidad: number) => Promise<void>
  onEliminar: (id: number) => Promise<void>
  isLoading: boolean
}
