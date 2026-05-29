import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Minus, Plus, Trash2, AlertTriangle, ArrowLeft, CreditCard, ShoppingBag } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { Select } from '@/shared/components/ui/Select/Select'
import { EmptyState } from '@/shared/components/ui/EmptyState/EmptyState'
import { CarritoItemSkeleton } from '@/shared/components/ui/Skeleton/Skeleton'
import { useCarrito } from '../../hooks/useCarrito'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { ItemCarritoResponse } from '../../models/carrito.model'
import { toast } from 'sonner'
import { MetodoPagoOnline, PasarelaPagoService } from '../../services/pasarelaPago.service'

export default function CarritoPage() {
  const navigate = useNavigate()
  const { carrito, isLoading, sucursalId, actualizarCantidad, eliminarItem } = useCarrito()
  const { isAuthenticated } = useAuth()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [metodosPago, setMetodosPago] = useState<MetodoPagoOnline[]>([])
  const [selectedMetodoId, setSelectedMetodoId] = useState<number | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('carrito_sucursal_id')
    if (stored || sucursalId) {
      setIsHydrated(true)
    }
  }, [sucursalId])

  useEffect(() => {
    if (isAuthenticated) {
      loadMetodosPago()
    }
  }, [isAuthenticated])

  const loadMetodosPago = async () => {
    try {
      const metodos = await PasarelaPagoService.getMetodosOnline()
      setMetodosPago(metodos)
      if (metodos.length > 0 && !selectedMetodoId) {
        setSelectedMetodoId(metodos[0].idMetodoPago)
      }
    } catch (error) {
      console.error('Error loading payment methods:', error)
    }
  }

  useEffect(() => {
    if (isHydrated && !sucursalId) {
      toast.error('Selecciona una sucursal para ver el carrito')
      navigate('/catalogo')
    }
  }, [isHydrated, sucursalId, navigate])

  const handleClearCart = async () => {
    if (!carrito?.items.length) return
    setIsClearing(true)
    try {
      for (const item of carrito.items) {
        await eliminarItem(item.idProductoFinal)
      }
      toast.success('Carrito vaciado correctamente')
    } catch (error: any) {
      toast.error(error.message || 'Error al vaciar carrito')
    } finally {
      setIsClearing(false)
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="flex flex-col gap-4 w-full max-w-md">
          {Array.from({ length: 3 }).map((_, i) => (
            <CarritoItemSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (!sucursalId) {
    return (
      <EmptyState
        icon="cart"
        title="Selecciona una sucursal"
        description="Elige una sucursal en el catálogo para ver tu carrito"
        action={{ label: 'Ir al catálogo', onClick: () => navigate('/catalogo') }}
      />
    )
  }

  const itemsNoDisponibles = carrito?.items.filter(i => !i.disponible) ?? []
  const tieneProblemas = itemsNoDisponibles.length > 0

  const subtotal = carrito?.items.reduce((sum, item) => sum + item.subtotal, 0) ?? 0
  const impuesto = subtotal * 0.13
  const total = subtotal + impuesto

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-wine-100/40 bg-gradient-to-br from-white via-wine-50/30 to-wine-100/20 p-8 shadow-[0_30px_80px_rgba(76,5,25,0.08)] dark:border-wine-900/20 dark:from-black/70 dark:via-black/55 dark:to-wine-950/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(159,18,57,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(159,18,57,0.08),transparent_30%)]" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg">
            <ShoppingCart size={24} />
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white">
              Mi Carrito de Compras
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {carrito?.items.length ?? 0} {carrito?.items.length === 1 ? 'producto' : 'productos'}
            </p>
          </div>
        </div>
      </div>

      {tieneProblemas && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-6 py-4 dark:border-amber-900/30 dark:bg-amber-900/10">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Productos no disponibles
              </p>
              <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">
                {itemsNoDisponibles.length === 1
                  ? '1 producto no está disponible en esta sucursal.'
                  : `${itemsNoDisponibles.length} productos no están disponibles.`}{' '}
                Retíralos antes de continuar.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 ${carrito && carrito.items.length > 0 ? 'xl:grid-cols-[1fr_380px]' : ''}`}>
        <div className="space-y-4">
          {isLoading && !carrito ? (
            <div className="flex flex-col gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CarritoItemSkeleton key={i} />
              ))}
            </div>
          ) : !carrito || carrito.items.length === 0 ? (
            <EmptyState
              icon="cart"
              title="Tu carrito está vacío"
              description="Agrega productos desde el catálogo para comenzar"
              action={{ label: 'Ver catálogo', onClick: () => navigate('/catalogo') }}
            />
          ) : (
            <>
              {carrito.items.map((item) => (
                <CarritoItemRow
                  key={item.idProductoFinal}
                  item={item}
                  onActualizar={actualizarCantidad}
                  onEliminar={eliminarItem}
                  isLoading={isLoading}
                />
              ))}

              <div className="flex justify-between items-center pt-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/catalogo')}
                  icon={<ArrowLeft size={16} />}
                  className="!text-slate-500 hover:!text-slate-700 dark:!text-slate-400 dark:hover:!text-slate-200"
                >
                  Seguir Comprando
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleClearCart}
                  isLoading={isClearing}
                  disabled={isClearing || carrito.items.length === 0}
                  className="!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-900/10"
                  icon={<Trash2 size={16} />}
                >
                  Vaciar Carrito
                </Button>
              </div>
            </>
          )}
        </div>

        {carrito && carrito.items.length > 0 && (
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-wine-100/40 bg-white/75 p-8 shadow-2xl shadow-wine-900/5 dark:border-wine-900/20 dark:bg-black/35 sticky top-6">
              <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {carrito.items.map((item) => (
                  <div key={item.idProductoFinal} className="flex gap-3 pb-3 border-b border-wine-100/30 dark:border-wine-900/30">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{item.nombreProducto}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Cantidad: {item.cantidad}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Bs {item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Bs {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                  <span>Impuestos (13%):</span>
                  <span className="font-semibold text-slate-900 dark:text-white">Bs {impuesto.toFixed(2)}</span>
                </div>
                <div className="border-t border-wine-100/30 dark:border-wine-900/30 pt-3 flex justify-between">
                  <span className="text-lg font-black text-slate-900 dark:text-white">Total:</span>
                  <span className="text-xl font-black text-wine-600 dark:text-wine-400">Bs {total.toFixed(2)}</span>
                </div>
              </div>

              {!isAuthenticated ? (
                <div className="space-y-3">
                  <p className="text-center text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-900/30">
                    Inicia sesión para completar tu pedido
                  </p>
                  <Button
                    fullWidth
                    onClick={() => navigate('/login')}
                    className="!rounded-2xl"
                    icon={<CreditCard size={18} />}
                  >
                    Iniciar Sesión
                  </Button>
                </div>
              ) : (
                <>
                  {isAuthenticated && metodosPago.length > 0 && (
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">
                        Método de Pago
                      </label>
                      <Select
                        value={selectedMetodoId || ''}
                        onChange={(value) => {
                          if (value) setSelectedMetodoId(value as number)
                        }}
                        options={metodosPago
                          .filter((m) => m.activo)
                          .map((metodo) => ({
                            value: metodo.idMetodoPago,
                            label: metodo.comisionPorcentaje && metodo.comisionPorcentaje > 0
                              ? `${metodo.nombre} (+${metodo.comisionPorcentaje}% comisión)`
                              : metodo.nombre
                          }))}
                        placeholder="Selecciona un método de pago"
                        icon={<CreditCard size={18} />}
                      />
                    </div>
                  )}
                  <Button
                    fullWidth
                    onClick={() => {
                      if (selectedMetodoId) {
                        sessionStorage.setItem('checkout_metodo_pago', String(selectedMetodoId))
                      }
                      navigate('/checkout')
                    }}
                    disabled={tieneProblemas || isLoading || !selectedMetodoId}
                    isLoading={isLoading}
                    className="!rounded-2xl bg-gradient-to-r from-wine-600 to-wine-950 px-6 text-sm font-black uppercase tracking-widest shadow-xl shadow-wine-900/20"
                    icon={<CreditCard size={18} />}
                  >
                    Proceder al Pago
                  </Button>
                </>
              )}

              {tieneProblemas && (
                <p className="text-center text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mt-3">
                  Retira los productos no disponibles para continuar
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface CarritoItemRowProps {
  item: ItemCarritoResponse
  onActualizar: (id: number, cantidad: number) => Promise<void>
  onEliminar: (id: number) => Promise<void>
  isLoading: boolean
}

function CarritoItemRow({ item, onActualizar, onEliminar, isLoading }: CarritoItemRowProps) {
  return (
    <div className={`rounded-[2rem] border p-6 flex flex-col sm:flex-row gap-6 transition-all ${
      item.disponible
        ? 'border-wine-100/50 bg-white/50 dark:border-wine-900/20 dark:bg-black/20'
        : 'border-amber-200/60 bg-amber-50/30 dark:border-amber-900/20 dark:bg-amber-900/5'
    }`}>
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-100 to-wine-200 dark:from-wine-900/40 dark:to-wine-800/40">
        <ShoppingBag size={32} className="text-wine-600 dark:text-wine-300" />
      </div>

      <div className="flex flex-1 flex-col gap-4 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{item.nombreProducto}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Precio unitario: Bs {item.precioUnitario.toFixed(2)}
            </p>
            {!item.disponible && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 mt-2">
                <AlertTriangle size={10} /> No disponible en esta sucursal
              </span>
            )}
          </div>
          <button
            onClick={() => onEliminar(item.idProductoFinal)}
            disabled={isLoading}
            className="shrink-0 rounded-xl p-3 text-slate-300 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors disabled:opacity-40"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => item.cantidad > 1 && onActualizar(item.idProductoFinal, item.cantidad - 1)}
              disabled={isLoading || item.cantidad <= 1}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-wine-100/50 bg-white/50 text-slate-500 hover:border-wine-300 hover:bg-wine-50 dark:border-wine-900/30 dark:bg-black/20 transition-colors disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <span className="w-12 text-center text-lg font-black text-slate-900 dark:text-white">
              {item.cantidad}
            </span>
            <button
              onClick={() => onActualizar(item.idProductoFinal, item.cantidad + 1)}
              disabled={isLoading}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-wine-100/50 bg-white/50 text-slate-500 hover:border-wine-300 hover:bg-wine-50 dark:border-wine-900/30 dark:bg-black/20 transition-colors disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-500 dark:text-slate-400">Subtotal</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">Bs {item.subtotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}