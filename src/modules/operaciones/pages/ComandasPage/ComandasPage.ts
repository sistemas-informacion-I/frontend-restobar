import { useState, useMemo, useEffect } from 'react'
import useSWR from 'swr'
import { getErrorMessage } from '@/core/api'
import { ComandasPageView } from './ComandasPage.view'
import { useComandas } from '../../hooks/useComandas'
import { useMesas } from '../../hooks/useMesas'
import { useSectores } from '../../hooks/useSectores'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useSucursales } from '../../hooks/useSucursales'
import { productosFinalesService } from '@/modules/comercial/services/productosFinales.service'
import { clienteService } from '../../services/cliente.service'
import type { Comanda, Cliente, CreateComandaData, UpdateComandaData } from '../../services/types'
import type { ProductoFinal } from '@/modules/comercial/services/productosFinales.service'

export function ComandasPage() {
  const {
    comandas,
    isLoading: comandasLoading,
    isCreating,
    isUpdating,
    isClosing,
    isUpdatingDetalle,
    isCancellingDetalle,
    isDeletingDetalle,
    createComanda,
    updateComanda,
    closeComanda,
    cancelarDetalle,
    deleteDetalle,
    refreshComandas,
    loadError: comandasError
  } = useComandas()

  const {
    mesas,
    isLoading: mesasLoading,
    loadError: mesasError
  } = useMesas()

  const {
    sectores,
    isLoading: sectoresLoading
  } = useSectores()

  const { data: productos = [], isLoading: productosLoading } = useSWR<ProductoFinal[]>(
    '/api/productos',
    () => productosFinalesService.getAll({ activo: true })
  )

  const { data: clientes = [] } = useSWR<Cliente[]>(
    '/api/clientes',
    () => clienteService.getAll()
  )

  const { user } = useAuth()
  const { sucursales } = useSucursales()
  const isSuperuser = user?.tipoUsuario === 'S'

  const [search, setSearch] = useState('')
  const [filterEstado, setFilterEstado] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (user?.tipoUsuario === 'S') {
      if (sucursales.length > 0 && selectedSucursalId === undefined) {
        setSelectedSucursalId(sucursales[0].idSucursal)
      }
    } else if (user?.sucursalId) {
      setSelectedSucursalId(user.sucursalId)
    }
  }, [user, sucursales, selectedSucursalId])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null)

  const loading = comandasLoading || mesasLoading || sectoresLoading || productosLoading
  const loadError = comandasError || mesasError

  const filteredComandas = useMemo(() => {
    let filtered = comandas

    // El superusuario ve todas las comandas; las filtramos por la sucursal elegida.
    if (selectedSucursalId !== undefined) {
      filtered = filtered.filter(c => c.idSucursal === selectedSucursalId)
    }

    if (search) {
      const q = search.toLowerCase()
      filtered = filtered.filter(c =>
        c.numeroComanda.toLowerCase().includes(q) ||
        c.clienteNombre?.toLowerCase().includes(q) ||
        c.estado.toLowerCase().includes(q) ||
        c.tipoServicio.toLowerCase().includes(q)
      )
    }

    if (filterEstado) {
      filtered = filtered.filter(c => c.estado === filterEstado)
    }

    return filtered
  }, [comandas, search, filterEstado, selectedSucursalId])

  // Sectores activos de la sucursal seleccionada (para el selector del formulario)
  const sectoresDeSucursal = useMemo(() =>
    sectores.filter(s => s.activo && s.idSucursal === selectedSucursalId),
    [sectores, selectedSucursalId]
  )

  // Mesas disponibles que pertenecen a algún sector de la sucursal seleccionada
  const mesasDisponibles = useMemo(() => {
    const sectorIds = new Set(sectoresDeSucursal.map(s => s.idSector))
    return mesas.filter(m =>
      m.activo &&
      sectorIds.has(m.idSector) &&
      (m.disponibilidad === 'DISPONIBLE')
    )
  }, [mesas, sectoresDeSucursal])

  const productoOptions = useMemo(() =>
    productos.map(p => ({
      id: p.idProductoFinal,
      nombre: p.nombre,
      precio: ((p as unknown as { precio?: number; precioVenta?: number }).precio ?? (p as unknown as { precio?: number; precioVenta?: number }).precioVenta ?? 0)
    })),
    [productos]
  )

  const handleCreate = async (data: CreateComandaData | UpdateComandaData) => {
    try {
      const idSucursal = selectedSucursalId ?? user?.sucursalId
      if (!idSucursal) {
        throw new Error('Sucursal no seleccionada')
      }

      const createPayload: CreateComandaData = {
        ...(data as CreateComandaData),
        idSucursal
      }

      await createComanda(createPayload)
      setFeedbackType('success')
      setFeedbackMessage('Comanda creada exitosamente')
      setShowCreateModal(false)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear la comanda'))
    }
  }

  const handleUpdate = async (data: CreateComandaData | UpdateComandaData) => {
    if (!selectedComanda) return
    try {
      await updateComanda({ id: selectedComanda.idComanda, data: data as UpdateComandaData })
      setFeedbackType('success')
      setFeedbackMessage('Comanda actualizada exitosamente')
      setShowEditModal(false)
      setSelectedComanda(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar la comanda'))
    }
  }

  const handleCloseComanda = async (comanda: Comanda) => {
    setSelectedComanda(comanda)
    try {
      await closeComanda(comanda.idComanda)
      setFeedbackType('success')
      setFeedbackMessage('Comanda cerrada exitosamente')
      setSelectedComanda(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cerrar la comanda'))
    }
  }

  const handleCancelDetalle = async (idDetalle: number) => {
    if (!selectedComanda) return
    try {
      const updatedDetalle = await cancelarDetalle({
        idComanda: selectedComanda.idComanda,
        idDetalle
      })

      setFeedbackType('success')
      setFeedbackMessage('Detalle cancelado correctamente')
      setSelectedComanda((current) =>
        current
          ? {
              ...current,
              items: current.items?.map((item) =>
                item.idDetalleComanda === idDetalle ? updatedDetalle : item
              )
            }
          : current
      )
      await refreshComandas()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cancelar el detalle'))
    }
  }

  const handleDeleteDetalle = async (idDetalle: number) => {
    if (!selectedComanda) return
    try {
      await deleteDetalle({
        idComanda: selectedComanda.idComanda,
        idDetalle
      })

      setFeedbackType('success')
      setFeedbackMessage('Detalle eliminado correctamente')
      setSelectedComanda((current) =>
        current
          ? {
              ...current,
              items: current.items?.filter((item) => item.idDetalleComanda !== idDetalle)
            }
          : current
      )
      await refreshComandas()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el detalle'))
    }
  }

  const openView = (comanda: Comanda) => {
    setSelectedComanda(comanda)
    setShowViewModal(true)
  }

  const openEdit = (comanda: Comanda) => {
    setSelectedComanda(comanda)
    setShowEditModal(true)
  }

  const sucursalNombre = useMemo(
    () => sucursales.find(s => s.idSucursal === selectedSucursalId)?.nombre,
    [sucursales, selectedSucursalId]
  )

  return ComandasPageView({
    comandas: filteredComandas,
    mesas: mesasDisponibles,
    sectores: sectoresDeSucursal,
    clientes,
    sucursales,
    sucursalNombre,
    selectedSucursalId,
    setSelectedSucursalId,
    isSuperuser,
    productos: productoOptions,
    loading,
    search,
    setSearch,
    filterEstado,
    setFilterEstado,
    feedbackMessage: feedbackMessage || (loadError ? getErrorMessage(loadError) : ''),
    feedbackType: feedbackType || (loadError ? 'error' : ''),
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showViewModal,
    setShowViewModal,
    selectedComanda,
    setSelectedComanda,
    isSubmitting: isCreating || isUpdating || isClosing || isUpdatingDetalle || isCancellingDetalle || isDeletingDetalle,
    handleCreate,
    handleUpdate,
    onCancelDetalle: handleCancelDetalle,
    onDeleteDetalle: handleDeleteDetalle,
    openView,
    openEdit,
    handleCloseComanda
  })
}

export default ComandasPage
