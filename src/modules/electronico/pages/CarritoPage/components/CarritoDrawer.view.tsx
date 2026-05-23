import { ShoppingCart, X, Minus, Plus, Trash2, ShoppingBag, AlertTriangle, Loader2 } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { useCarrito } from "@/modules/electronico/hooks/useCarrito"
import { useAuth } from "@/modules/acceso/context/AuthContext"
import { ItemCarritoResponse } from '../../models/carrito.model'

export function CarritoDrawer() {
  const { carrito, isOpen, isLoading, closeCarrito, actualizarCantidad, eliminarItem } = useCarrito()
  const { isAuthenticated } = useAuth()

  if (!isOpen) return null

  const itemsNoDisponibles = carrito?.items.filter(i => !i.disponible) ?? []
  const tieneProblemas = itemsNoDisponibles.length > 0

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={closeCarrito}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-wine-100/50 dark:border-wine-900/20 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg">
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
            className="rounded-xl p-2 text-slate-400 hover:bg-wine-50 hover:text-slate-600 dark:hover:bg-wine-900/20 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Alerta productos no disponibles */}
        {tieneProblemas && (
          <div className="mx-4 mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 dark:border-amber-900/30 dark:bg-amber-900/10">
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

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {isLoading && !carrito ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 size={32} className="animate-spin text-wine-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cargando...</p>
            </div>
          ) : !carrito || carrito.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-wine-50 dark:bg-wine-900/20">
                <ShoppingBag size={36} className="text-wine-200 dark:text-wine-800" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Carrito vacío</p>
            </div>
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

        {/* Footer total + checkout */}
        {carrito && carrito.items.length > 0 && (
          <div className="border-t border-wine-100/50 dark:border-wine-900/20 px-6 py-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total</span>
              <span className="text-xl font-black text-slate-900 dark:text-white">
                Bs. {carrito.total.toFixed(2)}
              </span>
            </div>
            {!isAuthenticated ? (
              <p className="text-center text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 rounded-xl px-4 py-2 border border-amber-200 dark:border-amber-900/30">
                Inicia sesión para completar tu pedido
              </p>
            ) : (
              <Button
                className="w-full !rounded-2xl shadow-xl shadow-wine-900/20"
                disabled={tieneProblemas || isLoading}
              >
                {isLoading ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <ShoppingCart size={16} className="mr-2" />
                )}
                Realizar pedido
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  )
}

interface ItemRowProps {
  item: ItemCarritoResponse
  onActualizar: (id: number, cantidad: number) => Promise<void>
  onEliminar: (id: number) => Promise<void>
  isLoading: boolean
}

function ItemRow({ item, onActualizar, onEliminar, isLoading }: ItemRowProps) {
  return (
    <div className={`glass-card rounded-[1.5rem] border p-4 flex gap-4 transition-all ${
      item.disponible
        ? 'border-wine-100/50 bg-white/50 dark:border-wine-900/20 dark:bg-black/20'
        : 'border-amber-200/60 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-900/5'
    }`}>
      {/* Icono producto */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-md">
        <ShoppingBag size={18} />
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
            onClick={() => onEliminar(item.idProductoFinal)}
            disabled={isLoading}
            className="shrink-0 rounded-lg p-1 text-slate-300 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Cantidad */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => item.cantidad > 1 && onActualizar(item.idProductoFinal, item.cantidad - 1)}
              disabled={isLoading || item.cantidad <= 1}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-wine-100/50 bg-white/50 text-slate-500 hover:border-wine-300 hover:bg-wine-50 dark:border-wine-900/30 dark:bg-black/20 transition-colors disabled:opacity-30"
            >
              <Minus size={12} />
            </button>
            <span className="w-6 text-center text-sm font-black text-slate-900 dark:text-white">
              {item.cantidad}
            </span>
            <button
              onClick={() => onActualizar(item.idProductoFinal, item.cantidad + 1)}
              disabled={isLoading}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-wine-100/50 bg-white/50 text-slate-500 hover:border-wine-300 hover:bg-wine-50 dark:border-wine-900/30 dark:bg-black/20 transition-colors disabled:opacity-30"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Subtotal */}
          <span className="text-sm font-black text-slate-900 dark:text-white">
            Bs. {item.subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}
