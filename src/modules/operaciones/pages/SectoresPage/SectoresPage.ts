import { useState, useMemo } from 'react'
import { mesaService } from '../../services/api'
import { getErrorMessage } from '../../../../core/api'
import { Sector as SectorType, CreateSectorData, UpdateSectorData, CreateMesaData } from '../../services/types'
import { SectoresPageView } from './SectoresPage.view'
import { useSectores } from '../../hooks/useSectores'
import { useSucursales } from '../../hooks/useSucursales'
import { useAuth } from '../../../acceso/context/AuthContext'

export function SectoresPage() {
  const { user, canRead, canCreate, canUpdate, canDelete } = useAuth()
  const isSuperUser = user?.tipoUsuario === 'S'

  const {
    sectores,
    isLoading: sectoresLoading,
    isSubmitting: sectoresSubmitting,
    createSector,
    updateSector,
    deleteSector,
    loadError: sectoresError
  } = useSectores()

  const {
    sucursales,
    isLoading: sucursalesLoading,
    loadError: sucursalesError
  } = useSucursales()

  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSelectSucursalModal, setShowSelectSucursalModal] = useState(false)
  const [showAddMesaModal, setShowAddMesaModal] = useState(false)
  const [selectedSector, setSelectedSector] = useState<SectorType | null>(null)
  const [selectedSectorForMesa, setSelectedSectorForMesa] = useState<SectorType | null>(null)
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | null>(null)
  const [isMesaSubmitting, setIsMesaSubmitting] = useState(false)

  const loading = sectoresLoading || sucursalesLoading
  const loadError = sectoresError || sucursalesError
  const isSubmitting = sectoresSubmitting || isMesaSubmitting

  const filteredSectores = useMemo(() => {
    return sectores.filter((sector: any) =>
      sector.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (sector.nombreSucursal && sector.nombreSucursal.toLowerCase().includes(search.toLowerCase())) ||
      sector.tipoSector.toLowerCase().includes(search.toLowerCase())
    )
  }, [sectores, search])

  const handleCreate = async (data: CreateSectorData | UpdateSectorData) => {
    // If not SU, selectedSucursalId won't be set by modal but backend handles it
    try {
      await createSector({
        ...data,
        idSucursal: selectedSucursalId, // Backend will override if not SU
      } as CreateSectorData)
      setFeedbackType('success')
      setFeedbackMessage('Sector creado exitosamente')
      setShowCreateModal(false)
      setShowSelectSucursalModal(false)
      setSelectedSucursalId(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el sector'))
    }
  }

  const handleUpdate = async (data: CreateSectorData | UpdateSectorData) => {
    if (!selectedSector) return
    try {
      await updateSector({ id: selectedSector.idSector, data: data as UpdateSectorData })
      setFeedbackType('success')
      setFeedbackMessage('Sector actualizado exitosamente')
      setShowEditModal(false)
      setSelectedSector(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el sector'))
    }
  }

  const handleDelete = async () => {
    if (!selectedSector) return
    try {
      await deleteSector(selectedSector.idSector)
      setFeedbackType('success')
      setFeedbackMessage('Sector eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedSector(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el sector'))
    }
  }

  const openView = (sector: SectorType) => {
    setSelectedSector(sector)
    setShowViewModal(true)
  }

  const openEdit = (sector: SectorType) => {
    setSelectedSector(sector)
    setShowEditModal(true)
  }

  const openDelete = (sector: SectorType) => {
    setSelectedSector(sector)
    setShowDeleteModal(true)
  }

  const openAddMesa = (sector: SectorType) => {
    setSelectedSectorForMesa(sector)
    setShowAddMesaModal(true)
  }

  const handleAddMesa = async (data: CreateMesaData) => {
    if (!selectedSectorForMesa) return
    try {
      setIsMesaSubmitting(true)
      await mesaService.create({
        ...data,
        idSector: selectedSectorForMesa.idSector,
      })
      setFeedbackType('success')
      setFeedbackMessage('Mesa creada exitosamente')
      setShowAddMesaModal(false)
      setSelectedSectorForMesa(null)
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear la mesa'))
    } finally {
      setIsMesaSubmitting(false)
    }
  }

  const openCreate = () => {
    setSelectedSucursalId(null)
    if (isSuperUser) {
      setShowSelectSucursalModal(true)
    } else {
      setShowCreateModal(true)
    }
  }

  const handleSelectSucursal = (idSucursal: number) => {
    setSelectedSucursalId(idSucursal)
    setShowSelectSucursalModal(false)
    setShowCreateModal(true)
  }

  const getSucursalNombre = (idSucursal: number) => {
    const sucursal = sucursales.find((s: any) => s.idSucursal === idSucursal)
    return sucursal?.nombre || `Sucursal #${idSucursal}`
  }

  // Permission checks (gestión reservada a ADMIN/SU; el personal solo visualiza)
  const canViewSectores = canRead('sectores')
  const canCreateSectores = canCreate('sectores')
  const canUpdateSectores = canUpdate('sectores')
  const canDeleteSectores = canDelete('sectores')
  const canCreateMesas = canCreate('mesas')

  return SectoresPageView({
    sectores: filteredSectores,
    sucursales,
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
    showSelectSucursalModal,
    setShowSelectSucursalModal,
    showAddMesaModal,
    setShowAddMesaModal,
    selectedSector,
    setSelectedSector,
    selectedSectorForMesa,
    setSelectedSectorForMesa,
    selectedSucursalId,
    setSelectedSucursalId,
    isSubmitting,
    handleCreate,
    handleUpdate,
    handleDelete,
    openView,
    openEdit,
    openDelete,
    openAddMesa,
    handleAddMesa,
    openCreate,
    handleSelectSucursal,
    getSucursalNombre,
    canViewSectores,
    canCreateSectores,
    canUpdateSectores,
    canDeleteSectores,
    canCreateMesas
  })
}

export default SectoresPage
