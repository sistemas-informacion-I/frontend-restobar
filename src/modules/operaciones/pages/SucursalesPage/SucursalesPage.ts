import { useState, useMemo } from 'react'
import { sectorService } from '../../services/api'
import { getErrorMessage } from '../../../../core/api'
import { Sucursal as SucursalType, Sector as SectorType, CreateSucursalData, UpdateSucursalData } from '../../services/types'
import { SucursalesPageView } from './SucursalesPage.view'
import { useSucursales } from '../../hooks/useSucursales'

export function SucursalesPage() {
  const {
    sucursales,
    isLoading: loading,
    isSubmitting,
    createSucursal,
    updateSucursal,
    deleteSucursal,
    loadError
  } = useSucursales()

  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddSectorModal, setShowAddSectorModal] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState<SucursalType | null>(null)
  const [sectoresView, setSectoresView] = useState<SectorType[]>([])

  const filteredSucursales = useMemo(() => {
    return sucursales.filter((sucursal: any) =>
      sucursal.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (sucursal.ciudad && sucursal.ciudad.toLowerCase().includes(search.toLowerCase())) ||
      (sucursal.direccion && sucursal.direccion.toLowerCase().includes(search.toLowerCase()))
    )
  }, [sucursales, search])

  const handleCreate = async (data: CreateSucursalData | UpdateSucursalData) => {
    try {
      await createSucursal(data as CreateSucursalData)
      setFeedbackType('success')
      setFeedbackMessage('Sucursal creada exitosamente')
      setShowCreateModal(false)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear la sucursal'))
    }
  }

  const handleUpdate = async (data: CreateSucursalData | UpdateSucursalData) => {
    if (!selectedSucursal) return
    try {
      await updateSucursal({ id: selectedSucursal.idSucursal, data: data as UpdateSucursalData })
      setFeedbackType('success')
      setFeedbackMessage('Sucursal actualizada exitosamente')
      setShowEditModal(false)
      setSelectedSucursal(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar la sucursal'))
    }
  }

  const handleDelete = async () => {
    if (!selectedSucursal) return
    try {
      await deleteSucursal(selectedSucursal.idSucursal)
      setFeedbackType('success')
      setFeedbackMessage('Sucursal eliminada exitosamente')
      setShowDeleteModal(false)
      setSelectedSucursal(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar la sucursal'))
    }
  }

  const openView = async (sucursal: SucursalType) => {
    setSelectedSucursal(sucursal)
    try {
      const sectoresData = await sectorService.getBySucursal(sucursal.idSucursal)
      setSectoresView(sectoresData)
    } catch (error) {
      console.error('Error loading sectores:', error)
      setSectoresView([])
    }
    setShowViewModal(true)
  }

  const openEdit = (sucursal: SucursalType) => {
    setSelectedSucursal(sucursal)
    setShowEditModal(true)
  }

  const openDelete = (sucursal: SucursalType) => {
    setSelectedSucursal(sucursal)
    setShowDeleteModal(true)
  }

  const openAddSector = (sucursal: SucursalType) => {
    setSelectedSucursal(sucursal)
    setShowAddSectorModal(true)
  }

  const handleAddSector = async (data: { nombre: string; descripcion?: string; tipoSector: string }) => {
    if (!selectedSucursal) return
    try {
      await sectorService.create({
        ...data,
        idSucursal: selectedSucursal.idSucursal,
      })
      setFeedbackType('success')
      setFeedbackMessage('Sector creado exitosamente')
      setShowAddSectorModal(false)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el sector'))
    }
  }

  // Permission checks
  const canViewSucursales = true
  const canCreateSucursales = true
  const canUpdateSucursales = true
  const canDeleteSucursales = true

  return SucursalesPageView({
    sucursales: filteredSucursales,
    loading,
    search,
    setSearch,
    feedbackMessage: feedbackMessage || (loadError ? getErrorMessage(loadError) : ''),
    feedbackType: feedbackType || (loadError ? 'error' : ''),
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showViewModal,
    setShowViewModal,
    showDeleteModal,
    setShowDeleteModal,
    showAddSectorModal,
    setShowAddSectorModal,
    selectedSucursal,
    setSelectedSucursal,
    sectoresView,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    openView,
    openEdit,
    openDelete,
    openAddSector,
    handleAddSector,
    canViewSucursales,
    canCreateSucursales,
    canUpdateSucursales,
    canDeleteSucursales
  })
}

export default SucursalesPage
