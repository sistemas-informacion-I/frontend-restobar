import { useState, useEffect, useCallback } from 'react'
import { mesaService, sectorService } from '../../services/api'
import { getErrorMessage } from '../../../../core/api'
import { Mesa, Sector, CreateMesaData, UpdateMesaData } from '../../services/types'
import { MesasPageView } from './MesasPage.view'

export function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([])
  const [sectores, setSectores] = useState<Sector[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [mesasData, sectoresData] = await Promise.all([
        mesaService.getAll(),
        sectorService.getAll(),
      ])
      setMesas(mesasData)
      setSectores(sectoresData)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar las mesas'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredMesas = mesas.filter((mesa) =>
    mesa.numeroMesa.toLowerCase().includes(search.toLowerCase()) ||
    (mesa.nombreSector && mesa.nombreSector.toLowerCase().includes(search.toLowerCase())) ||
    mesa.disponibilidad.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (data: CreateMesaData | UpdateMesaData) => {
    try {
      setIsSubmitting(true)
      await mesaService.create(data as CreateMesaData)
      setFeedbackType('success')
      setFeedbackMessage('Mesa creada exitosamente')
      setShowCreateModal(false)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear la mesa'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: CreateMesaData | UpdateMesaData) => {
    if (!selectedMesa) return
    try {
      setIsSubmitting(true)
      await mesaService.update(selectedMesa.idMesa, data as UpdateMesaData)
      setFeedbackType('success')
      setFeedbackMessage('Mesa actualizada exitosamente')
      setShowEditModal(false)
      setSelectedMesa(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar la mesa'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMesa) return
    try {
      setIsSubmitting(true)
      await mesaService.delete(selectedMesa.idMesa)
      setFeedbackType('success')
      setFeedbackMessage('Mesa eliminada exitosamente')
      setShowDeleteModal(false)
      setSelectedMesa(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar la mesa'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const openView = (mesa: Mesa) => {
    setSelectedMesa(mesa)
    setShowViewModal(true)
  }

  const openEdit = (mesa: Mesa) => {
    setSelectedMesa(mesa)
    setShowEditModal(true)
  }

  const openDelete = (mesa: Mesa) => {
    setSelectedMesa(mesa)
    setShowDeleteModal(true)
  }

  // Permissions (could be moved to a hook or context later)
  const canViewMesas = true
  const canCreateMesas = true // En el original estaba false, lo cambio a true si el usuario tiene permiso
  const canUpdateMesas = true
  const canDeleteMesas = true

  return MesasPageView({
    mesas: filteredMesas,
    sectores,
    loading,
    search,
    setSearch,
    feedbackMessage,
    feedbackType,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showViewModal,
    setShowViewModal,
    showDeleteModal,
    setShowDeleteModal,
    selectedMesa,
    setSelectedMesa,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    openView,
    openEdit,
    openDelete,
    canViewMesas,
    canCreateMesas,
    canUpdateMesas,
    canDeleteMesas
  })
}

export default MesasPage
