import { useState, useEffect, useCallback } from 'react'
import { Layout } from '@/shared/components/layout/Layout'
import { Modal } from '@/shared/components/ui/Modal'
import { SucursalesToolbar, SucursalesTable, SucursalForm, SucursalView, SectorForm } from '../components/sucursales'
import { sucursalService, sectorService, getErrorMessage } from '../../acceso/services/api'
import { Store, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Sucursal as SucursalType, Sector as SectorType, CreateSucursalData, UpdateSucursalData } from '../services/types'

export default function SucursalesPage() {
  const [sucursales, setSucursales] = useState<SucursalType[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAddSectorModal, setShowAddSectorModal] = useState(false)
  const [selectedSucursal, setSelectedSucursal] = useState<SucursalType | null>(null)
  const [sectoresView, setSectoresView] = useState<SectorType[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const data = await sucursalService.getAll()
      setSucursales(data)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'cargar las sucursales'))
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const filteredSucursales = sucursales.filter((sucursal) =>
    sucursal.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (sucursal.ciudad && sucursal.ciudad.toLowerCase().includes(search.toLowerCase())) ||
    (sucursal.direccion && sucursal.direccion.toLowerCase().includes(search.toLowerCase()))
  )

  // Handlers
  const handleCreate = async (data: CreateSucursalData | UpdateSucursalData) => {
    try {
      setIsSubmitting(true)
      await sucursalService.create(data as CreateSucursalData)
      setFeedbackType('success')
      setFeedbackMessage('Sucursal creada exitosamente')
      setShowCreateModal(false)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'crear la sucursal'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (data: CreateSucursalData | UpdateSucursalData) => {
    if (!selectedSucursal) return
    try {
      setIsSubmitting(true)
      await sucursalService.update(selectedSucursal.idSucursal, data as UpdateSucursalData)
      setFeedbackType('success')
      setFeedbackMessage('Sucursal actualizada exitosamente')
      setShowEditModal(false)
      setSelectedSucursal(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'actualizar la sucursal'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedSucursal) return
    try {
      setIsSubmitting(true)
      await sucursalService.delete(selectedSucursal.idSucursal)
      setFeedbackType('success')
      setFeedbackMessage('Sucursal eliminada exitosamente')
      setShowDeleteModal(false)
      setSelectedSucursal(null)
      loadData()
    } catch (error: unknown) {
      setFeedbackType('error')
      setFeedbackMessage(getErrorMessage(error, 'eliminar la sucursal'))
    } finally {
      setIsSubmitting(false)
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
      setIsSubmitting(true)
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
    } finally {
      setIsSubmitting(false)
    }
  }

  // Permission checks
  const canViewSucursales = true
  const canCreateSucursales = true
  const canUpdateSucursales = true
  const canDeleteSucursales = true

  if (!canViewSucursales) {
    return (
      <Layout>
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <AlertCircle size={48} />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">No tienes permiso para ver las sucursales</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-1">
        {feedbackMessage && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${feedbackType === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
            }`}>
            {feedbackMessage}
          </div>
        )}

        <SucursalesToolbar
          search={search}
          onSearchChange={setSearch}
          total={filteredSucursales.length}
          canCreateSucursales={canCreateSucursales}
          onCreateSucursal={() => setShowCreateModal(true)}
        />

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Cargando sucursales...
          </div>
        ) : filteredSucursales.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <Store size={48} />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">No hay sucursales</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {search 
                ? 'No se encontraron sucursales con ese criterio de búsqueda'
                : 'Comienza creando una nueva sucursal'
              }
            </p>
          </div>
        ) : (
          <SucursalesTable
            sucursales={filteredSucursales}
            canUpdateSucursales={canUpdateSucursales}
            canDeleteSucursales={canDeleteSucursales}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
            onAddSector={openAddSector}
          />
        )}

        {/* Create Modal */}
        <Modal.Root
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          size="lg"
        >
          <Modal.Header>Crear Nueva Sucursal</Modal.Header>
          <Modal.Body>
            <SucursalForm
              onSubmit={handleCreate}
              onCancel={() => setShowCreateModal(false)}
              isLoading={isSubmitting}
            />
          </Modal.Body>
        </Modal.Root>

        {/* Edit Modal */}
        <Modal.Root
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedSucursal(null)
          }}
          size="lg"
        >
          <Modal.Header>Editar Sucursal</Modal.Header>
          <Modal.Body>
            {selectedSucursal && (
              <SucursalForm
                sucursal={selectedSucursal}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedSucursal(null)
                }}
                isLoading={isSubmitting}
              />
            )}
          </Modal.Body>
        </Modal.Root>

        {/* View Modal */}
        <Modal.Root
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false)
            setSelectedSucursal(null)
          }}
          size="md"
        >
          <Modal.Header>Detalles de la Sucursal</Modal.Header>
          <Modal.Body>
            {selectedSucursal && <SucursalView sucursal={selectedSucursal} sectores={sectoresView} />}
          </Modal.Body>
        </Modal.Root>

        {/* Delete Confirmation Modal */}
        <Modal.Root
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedSucursal(null)
          }}
          size="sm"
        >
          <Modal.Header>Confirmar Eliminación</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <Store size={24} />
              </div>
              <p>
                ¿Estás seguro de que deseas eliminar la sucursal <strong>{selectedSucursal?.nombre}</strong>?
              </p>
              <p className="mt-2 text-sm text-rose-500">
                Esta acción no se puede deshacer.
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedSucursal(null)
              }}
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDelete}
              isLoading={isSubmitting}
            >
              Eliminar
            </Button>
          </Modal.Footer>
        </Modal.Root>

        {/* Add Sector Modal */}
        <Modal.Root
          isOpen={showAddSectorModal}
          onClose={() => {
            setShowAddSectorModal(false)
            setSelectedSucursal(null)
          }}
          size="lg"
        >
          <Modal.Header>Añadir Sector</Modal.Header>
          <Modal.Body>
            {selectedSucursal && (
              <SectorForm
                nombreSucursal={selectedSucursal.nombre}
                onSubmit={handleAddSector}
                onCancel={() => {
                  setShowAddSectorModal(false)
                  setSelectedSucursal(null)
                }}
                isLoading={isSubmitting}
              />
            )}
          </Modal.Body>
        </Modal.Root>
      </div>
    </Layout>
  )
}