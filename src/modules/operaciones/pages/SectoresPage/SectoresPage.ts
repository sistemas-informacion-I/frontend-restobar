import { useState, useEffect, useCallback } from 'react'
import { sucursalService, sectorService, mesaService } from '../../services/api'
import { getErrorMessage } from '../../../../core/api'
import { Sucursal, Sector as SectorType, CreateSectorData, UpdateSectorData, CreateMesaData } from '../../services/types'
import { SectoresPageView } from './SectoresPage.view'

export function SectoresPage() {
  const [sectores, setSectores] = useState<SectorType[]>([])
  const [sucursales, setSucursales] = useState<Sucursal[]>([])
  const [loading, setLoading] = useState(true)
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
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [sectoresData, sucursalesData] = await Promise.all([
        sectorService.getAll(),
        sucursalService.getAll(),
      ])
      setSectores(sectoresData)
      setSucursales(sucursalesData)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar los sectores'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredSectores = sectores.filter((sector) =>
    sector.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (sector.nombreSucursal && sector.nombreSucursal.toLowerCase().includes(search.toLowerCase())) ||
    sector.tipoSector.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = async (data: CreateSectorData | UpdateSectorData) => {
    if (!selectedSucursalId) return
    try {
      setIsSubmitting(true)
      await sectorService.create({
        ...data,
        idSucursal: selectedSucursalId,
      } as CreateSectorData)
      setFeedbackType('success')
      setFeedbackMessage('Sector creado exitosamente')
      setShowCreateModal(false)
      setShowSelectSucursalModal(false)
      setSelectedSucursalId(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear el sector'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: CreateSectorData | UpdateSectorData) => {
    if (!selectedSector) return
    try {
      setIsSubmitting(true)
      await sectorService.update(selectedSector.idSector, data as UpdateSectorData)
      setFeedbackType('success')
      setFeedbackMessage('Sector actualizado exitosamente')
      setShowEditModal(false)
      setSelectedSector(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar el sector'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedSector) return
    try {
      setIsSubmitting(true)
      await sectorService.delete(selectedSector.idSector)
      setFeedbackType('success')
      setFeedbackMessage('Sector eliminado exitosamente')
      setShowDeleteModal(false)
      setSelectedSector(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar el sector'))
    } finally {
      setIsSubmitting(false)
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
      setIsSubmitting(true)
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
      setIsSubmitting(false)
    }
  }

  const openCreate = () => {
    setSelectedSucursalId(null)
    setShowSelectSucursalModal(true)
  }

  const handleSelectSucursal = (idSucursal: number) => {
    setSelectedSucursalId(idSucursal)
    setShowSelectSucursalModal(false)
    setShowCreateModal(true)
  }

  const getSucursalNombre = (idSucursal: number) => {
    const sucursal = sucursales.find(s => s.idSucursal === idSucursal)
    return sucursal?.nombre || `Sucursal #${idSucursal}`
  }

  // Permission checks
  const canViewSectores = true
  const canCreateSectores = true
  const canUpdateSectores = true
  const canDeleteSectores = true

  return SectoresPageView({
    sectores: filteredSectores,
    sucursales,
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
    canDeleteSectores
  })
}

export default SectoresPage
