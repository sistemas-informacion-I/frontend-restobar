import { createContext, useContext, useState, useCallback, ReactNode, useEffect, useRef } from 'react'
import { carritoService } from '../services/carrito.service'
import { CarritoResponse, AgregarItemRequest } from '../models/carrito.model'
import { getErrorMessage } from '@/core/api'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { toast } from 'sonner'

interface FlyElement {
  x: number
  y: number
  width: number
  height: number
}

interface CarritoContextType {
  carrito: CarritoResponse | null
  isOpen: boolean
  isLoading: boolean
  totalItems: number
  sucursalId: number | null
  flyElements: FlyElement[]
  setSucursalId: (id: number) => void
  openCarrito: () => void
  closeCarrito: () => void
  agregarItem: (req: AgregarItemRequest, sourceEl?: HTMLElement) => Promise<void>
  actualizarCantidad: (idProductoFinal: number, cantidad: number) => Promise<void>
  eliminarItem: (idProductoFinal: number) => Promise<void>
  refetchCarrito: () => Promise<void>
  checkout: () => Promise<number>
}

const CARRITO_SUCURSAL_KEY = 'carrito_sucursal_id'

const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [carrito, setCarrito] = useState<CarritoResponse | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sucursalId, setSucursalIdState] = useState<number | null>(null)
  const [flyElements, setFlyElements] = useState<FlyElement[]>([])
  const [_isHydrated, setIsHydrated] = useState(false)
  const flyTimer = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(CARRITO_SUCURSAL_KEY)
    if (stored) {
      setSucursalIdState(Number(stored))
    }
    setIsHydrated(true)
  }, [])

  const setSucursalId = useCallback((id: number) => {
    setSucursalIdState(id)
    sessionStorage.setItem(CARRITO_SUCURSAL_KEY, String(id))
  }, [])

  const refetchCarrito = useCallback(async () => {
    if (!sucursalId) return
    try {
      setIsLoading(true)
      const data = await carritoService.getCarrito(sucursalId, isAuthenticated)
      setCarrito(data)
    } catch {
      setCarrito(null)
    } finally {
      setIsLoading(false)
    }
  }, [sucursalId, isAuthenticated])

  const openCarrito = useCallback(async () => {
    setIsOpen(true)
    await refetchCarrito()
  }, [refetchCarrito])

  const closeCarrito = useCallback(() => setIsOpen(false), [])

  const agregarItem = useCallback(
    async (req: AgregarItemRequest, sourceEl?: HTMLElement) => {
      if (!sucursalId) {
        toast.error('Selecciona una sucursal antes de agregar productos')
        return
      }
      try {
        setIsLoading(true)
        const updated = await carritoService.agregarItem(sucursalId, req, isAuthenticated)
        setCarrito(updated)

        if (sourceEl) {
          const rect = sourceEl.getBoundingClientRect()
          setFlyElements(prev => [...prev, {
            x: rect.left + rect.width / 2 - 12,
            y: rect.top + rect.height / 2 - 12,
            width: 24,
            height: 24,
          }])
          if (flyTimer.current) clearTimeout(flyTimer.current)
          flyTimer.current = setTimeout(() => setFlyElements([]), 1200)
        }

        const nombre = updated.items?.find(i => i.idProductoFinal === req.idProductoFinal)?.nombreProducto || 'Producto'
        const newTotal = updated.items?.reduce((sum, item) => sum + item.cantidad, 0) ?? 0
        toast.custom(() => (
          <div className="flex items-center gap-3 rounded-2xl border border-wine-200/50 bg-white/95 px-4 py-3 shadow-xl shadow-wine-900/10 backdrop-blur-sm dark:border-wine-800/50 dark:bg-black/90">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-600 dark:text-emerald-400"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{nombre}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Agregado al carrito ({newTotal} items)</p>
            </div>
          </div>
        ), { duration: 3000 })
      } catch (error: any) {
        toast.error(getErrorMessage(error, 'Agregar al carrito'))
      } finally {
        setIsLoading(false)
      }
    },
    [sucursalId, isAuthenticated]
  )

  const actualizarCantidad = useCallback(
    async (idProductoFinal: number, cantidad: number) => {
      if (!sucursalId) return
      try {
        setIsLoading(true)
        const updated = await carritoService.actualizarItem(
          sucursalId, idProductoFinal, { cantidad }, isAuthenticated
        )
        setCarrito(updated)
      } catch (error: any) {
        toast.error(getErrorMessage(error, 'Actualizar cantidad'))
      } finally {
        setIsLoading(false)
      }
    },
    [sucursalId, isAuthenticated]
  )

  const eliminarItem = useCallback(
    async (idProductoFinal: number) => {
      if (!sucursalId) return
      try {
        setIsLoading(true)
        const updated = await carritoService.eliminarItem(sucursalId, idProductoFinal, isAuthenticated)
        setCarrito(updated)
        toast.success('Producto eliminado del carrito')
      } catch (error: any) {
        toast.error(getErrorMessage(error, 'Eliminar ítem'))
      } finally {
        setIsLoading(false)
      }
    },
    [sucursalId, isAuthenticated]
  )

  const checkout = useCallback(async () => {
    if (!sucursalId) {
      throw new Error('Selecciona una sucursal')
    }
    try {
      setIsLoading(true)
      const response = await carritoService.checkout(sucursalId)
      setCarrito(null)
      toast.success('Pedido creado exitosamente')
      return response.idNotaVenta
    } catch (error: any) {
      toast.error(getErrorMessage(error, 'Checkout'))
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [sucursalId, isAuthenticated])

  const totalItems = carrito?.items.reduce((sum, item) => sum + item.cantidad, 0) ?? 0

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        isOpen,
        isLoading,
        totalItems,
        sucursalId,
        flyElements,
        setSucursalId,
        openCarrito,
        closeCarrito,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        refetchCarrito,
        checkout,
      }}
    >
      {children}
      {flyElements.map((el, i) => (
        <div
          key={i}
          className="pointer-events-none fixed z-[100] h-6 w-6 rounded-full bg-wine-600 shadow-lg shadow-wine-900/40"
          style={{
            left: el.x,
            top: el.y,
            animation: `flyToCart${i} 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
          }}
        />
      ))}
      <style dangerouslySetInnerHTML={{
        __html: flyElements.map((_, i) => `
          @keyframes flyToCart${i} {
            0% {
              opacity: 1;
              transform: scale(1) translate(0, 0);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.5) translate(60px, -60px);
            }
            100% {
              opacity: 0;
              transform: scale(0.3) translate(calc(100vw - 120px), -50vh);
            }
          }
        `).join('\n')
      }} />
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const context = useContext(CarritoContext)
  if (context === undefined) {
    throw new Error('useCarrito must be used within a CarritoProvider')
  }
  return context
}
