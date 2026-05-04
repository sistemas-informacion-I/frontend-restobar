import { useState, useMemo } from 'react'
import { getErrorMessage } from '../../../../core/api'
import { Mesa, CreateMesaData, UpdateMesaData } from '../../services/types'
import { MesasPageView } from './MesasPage.view'
import { useMesas } from '../../hooks/useMesas'
import { useSectores } from '../../hooks/useSectores'

export function MesasPage() {

  const {
    mesas,
    isLoading: mesasLoading,
    isSubmitting,
    createMesa,
    updateMesa,
    deleteMesa,
    loadError: mesasError
  } = useMesas()

  const {
    sectores,
    isLoading: sectoresLoading,
    loadError: sectoresError
  } = useSectores()

  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMesa, setSelectedMesa] = useState<Mesa | null>(null)

  const loading = mesasLoading || sectoresLoading
  const loadError = mesasError || sectoresError

  const filteredMesas = useMemo(() => {
    return mesas.filter((mesa: any) =>
      mesa.numeroMesa.toLowerCase().includes(search.toLowerCase()) ||
      (mesa.nombreSector && mesa.nombreSector.toLowerCase().includes(search.toLowerCase())) ||
      mesa.disponibilidad.toLowerCase().includes(search.toLowerCase())
    )
  }, [mesas, search])

  const handleCreate = async (data: CreateMesaData | UpdateMesaData) => {
    try {
      await createMesa(data as CreateMesaData)
      setFeedbackType('success')
      setFeedbackMessage('Mesa creada exitosamente')
      setShowCreateModal(false)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear la mesa'))
    }
  }

  const handleUpdate = async (data: CreateMesaData | UpdateMesaData) => {
    if (!selectedMesa) return
    try {
      await updateMesa({ id: selectedMesa.idMesa, data: data as UpdateMesaData })
      setFeedbackType('success')
      setFeedbackMessage('Mesa actualizada exitosamente')
      setShowEditModal(false)
      setSelectedMesa(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar la mesa'))
    }
  }

  const handleDelete = async () => {
    if (!selectedMesa) return
    try {
      await deleteMesa(selectedMesa.idMesa)
      setFeedbackType('success')
      setFeedbackMessage('Mesa deshabilitada exitosamente')
      setShowDeleteModal(false)
      setSelectedMesa(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar la mesa'))
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

  // Permissions
  const canViewMesas = true
  const canCreateMesas = true 
  const canUpdateMesas = true
  const canDeleteMesas = true

  return MesasPageView({
    mesas: filteredMesas,
    sectores,
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
