import { useState, useMemo, useEffect, useRef } from 'react'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useInventario, useStock } from '../../hooks/useInventario'
import { InventarioPageView } from './InventarioPage.view'
import {
  inventarioService,
  InventarioItem,
  InventarioRequest,
  LoteRequest,
  EstadoLote,
  StockInicialRequest,
} from '../../services/inventario.service'
import { getErrorMessage } from '@/core/api'
import { useSucursales } from '@/modules/operaciones/hooks/useSucursales'

const FEEDBACK_TIMEOUT_MS = 4000

export function InventarioPage() {
  const { user } = useAuth()
  const { sucursales } = useSucursales()

  // Estado para la sucursal seleccionada
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (user?.tipoUsuario === 'S') {
      if (sucursales.length > 0 && !selectedSucursalId) {
        setSelectedSucursalId(sucursales[0].idSucursal)
      }
    } else if (user?.sucursalId) {
      setSelectedSucursalId(user.sucursalId)
    }
  }, [user, sucursales, selectedSucursalId])

  const { insumos, isLoading: loadingInsumos, mutate: mutateInsumos } = useInventario()
  const { stock, isLoading: loadingStock, mutate: mutateStock } = useStock(selectedSucursalId)

  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showStockDrawer, setShowStockDrawer] = useState(false)
  const [showStockInitialModal, setShowStockInitialModal] = useState(false)
  
  const [selectedInsumo, setSelectedInsumo] = useState<InventarioItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── Helpers ───────────────────────────────────────────────────────────────

  const showFeedback = (message: string, type: 'success' | 'error') => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setFeedbackMessage(message)
    setFeedbackType(type)
    feedbackTimer.current = setTimeout(() => {
      setFeedbackMessage('')
      setFeedbackType('')
    }, FEEDBACK_TIMEOUT_MS)
  }

  const clearFeedback = () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current)
    setFeedbackMessage('')
    setFeedbackType('')
  }

  // ─── Datos combinados ──────────────────────────────────────────────────────

  const combinedData = useMemo(() => {
    if (!insumos) return []
    return insumos.map(insumo => {
      const stockItem = stock?.find(s => s.idInventario === insumo.idInventario)
      return {
        ...insumo,
        stockActual: stockItem?.cantidad ?? 0,
        stockMinimo: stockItem?.cantidadMinima ?? 0,
        idStock: stockItem?.idStock,
        stockItem,
      }
    })
  }, [insumos, stock])

  const filteredInsumos = useMemo(() => {
    return combinedData.filter(item =>
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.codigo.toLowerCase().includes(search.toLowerCase()) ||
      item.marca?.toLowerCase().includes(search.toLowerCase())
    )
  }, [combinedData, search])

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleCreateInsumo = async (data: InventarioRequest) => {
    setIsSubmitting(true)
    try {
      await inventarioService.crearInsumo(data)
      showFeedback('Insumo creado exitosamente', 'success')
      setShowCreateModal(false)
      mutateInsumos()
      return { success: true }
    } catch (error) {
      const msg = getErrorMessage(error, 'crear el insumo')
      return { success: false, error: msg }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateInsumo = async (id: number, data: InventarioRequest) => {
    setIsSubmitting(true)
    try {
      await inventarioService.actualizarInsumo(id, data)
      showFeedback('Insumo actualizado exitosamente', 'success')
      setShowEditModal(false)
      setSelectedInsumo(null)
      mutateInsumos()
      return { success: true }
    } catch (error) {
      const msg = getErrorMessage(error, 'actualizar el insumo')
      return { success: false, error: msg }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAgregarLote = async (data: LoteRequest) => {
    setIsSubmitting(true)
    try {
      // 1. Calcular valores optimistas para una respuesta instantánea
      const currentStock = stock || []
      const optimisticStock = currentStock.map(s => {
        if (s.idStock === data.idStock) {
          const newCantidad = Number(s.cantidad) + Number(data.cantidad)
          const oldTotal = Number(s.cantidad) * Number(s.precioPromedio)
          const newTotal = Number(data.cantidad) * Number(data.precioCompra)
          const newAvg = (oldTotal + newTotal) / newCantidad
          return { 
            ...s, 
            cantidad: newCantidad, 
            precioPromedio: newAvg, 
            precioUnitario: Number(data.precioCompra) 
          }
        }
        return s
      })

      // 2. Aplicar mutación optimista al caché de SWR (sin re-validar inmediatamente)
      mutateStock(optimisticStock, false)

      // 3. Llamada real al servidor
      await inventarioService.agregarLote(data)
      showFeedback('Lote registrado y stock actualizado', 'success')
      
      // 4. Re-validar con datos reales del servidor
      mutateStock() 
      return { success: true }
    } catch (error) {
      // Revertir en caso de error
      mutateStock()
      const msg = getErrorMessage(error, 'agregar el lote')
      return { success: false, error: msg }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCambiarEstadoLote = async (
    idLote: number,
    estado: EstadoLote,
    mutateLotes: () => void
  ) => {
    try {
      await inventarioService.actualizarEstadoLote(idLote, estado)
      showFeedback('Estado del lote actualizado', 'success')
      mutateLotes()
      mutateStock()
    } catch (error) {
      showFeedback(getErrorMessage(error, 'cambiar el estado del lote'), 'error')
    }
  }

  const handleConfigurarStockInicial = async (data: StockInicialRequest) => {
    setIsSubmitting(true)
    try {
      await inventarioService.establecerStockInicial(data)
      showFeedback('Stock inicializado correctamente', 'success')
      setShowStockInitialModal(false)
      setSelectedInsumo(null)
      mutateStock()
      return { success: true }
    } catch (error) {
      const msg = getErrorMessage(error, 'inicializar stock')
      return { success: false, error: msg }
    } finally {
      setIsSubmitting(false)
    }
  }

  const openStockDetails = (insumo: any) => {
    setSelectedInsumo(insumo)
    setShowStockDrawer(true)
  }

  const openEditModal = (insumo: InventarioItem) => {
    setSelectedInsumo(insumo)
    setShowEditModal(true)
  }

  const openStockInitialModal = (insumo: InventarioItem) => {
    setSelectedInsumo(insumo)
    setShowStockInitialModal(true)
  }

  return InventarioPageView({
    insumos: filteredInsumos,
    loading: loadingInsumos || loadingStock,
    search,
    setSearch,
    selectedSucursalId,
    setSelectedSucursalId,
    sucursales,
    feedbackMessage,
    feedbackType,
    clearFeedback,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showStockDrawer,
    setShowStockDrawer,
    showStockInitialModal,
    setShowStockInitialModal,
    selectedInsumo,
    setSelectedInsumo,
    selectedStock: stock?.find(s => s.idInventario === selectedInsumo?.idInventario) ?? null,
    isSubmitting,
    handleCreateInsumo,
    handleUpdateInsumo,
    handleAgregarLote,
    handleCambiarEstadoLote,
    handleConfigurarStockInicial,
    openStockDetails,
    openEditModal,
    openStockInitialModal,
    user,
  })
}
