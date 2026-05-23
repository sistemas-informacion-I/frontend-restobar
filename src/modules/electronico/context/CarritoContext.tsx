import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { carritoService } from '../services/carrito.service'
import { CarritoResponse, AgregarItemRequest } from '../models/carrito.model'
import { getErrorMessage } from '@/core/api'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { toast } from 'sonner'

interface CarritoContextType {
  carrito: CarritoResponse | null
  isOpen: boolean
  isLoading: boolean
  totalItems: number
  sucursalId: number | null
  setSucursalId: (id: number) => void
  openCarrito: () => void
  closeCarrito: () => void
  agregarItem: (req: AgregarItemRequest) => Promise<void>
  actualizarCantidad: (idProductoFinal: number, cantidad: number) => Promise<void>
  eliminarItem: (idProductoFinal: number) => Promise<void>
  refetchCarrito: () => Promise<void>
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined)

export function CarritoProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const [carrito, setCarrito] = useState<CarritoResponse | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [sucursalId, setSucursalId] = useState<number | null>(null)

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
    async (req: AgregarItemRequest) => {
      if (!sucursalId) {
        toast.error('Selecciona una sucursal antes de agregar productos')
        return
      }
      try {
        setIsLoading(true)
        const updated = await carritoService.agregarItem(sucursalId, req, isAuthenticated)
        setCarrito(updated)
        toast.success('Producto agregado al carrito')
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

  const totalItems = carrito?.items.reduce((sum, item) => sum + item.cantidad, 0) ?? 0

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        isOpen,
        isLoading,
        totalItems,
        sucursalId,
        setSucursalId,
        openCarrito,
        closeCarrito,
        agregarItem,
        actualizarCantidad,
        eliminarItem,
        refetchCarrito,
      }}
    >
      {children}
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
