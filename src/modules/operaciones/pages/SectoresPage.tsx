import { useState, useEffect, useCallback } from 'react'
import { Layout } from '@/shared/components/layout/Layout'
import { Modal } from '@/shared/components/ui/Modal'
import { SectoresToolbar, SectoresTable, SectorView, SectorFormEdit } from '../components/sectores'
import { MesaForm } from '../components/mesas/MesaForm'
import { sucursalService, sectorService, mesaService, getErrorMessage } from '../../acceso/services/api'
import { Grid3X3, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Sucursal, Sector as SectorType, CreateSectorData, UpdateSectorData, CreateMesaData } from '../services/types'

export default function SectoresPage() {
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

  const canViewSectores = true
  const canCreateSectores = true
  const canUpdateSectores = true
  const canDeleteSectores = true

  if (!canViewSectores) {
    return (
      <Layout>
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <AlertCircle size={48} />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">No tienes permiso para ver los sectores</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-1">
        {feedbackMessage && (
          <div className={`mb-4 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ${feedbackType === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300'
            }`}>
            {feedbackMessage}
          </div>
        )}

        <SectoresToolbar
          search={search}
          onSearchChange={setSearch}
          total={filteredSectores.length}
          canCreateSectores={canCreateSectores}
          onCreateSector={openCreate}
        />

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
            Cargando sectores...
          </div>
        ) : filteredSectores.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <Grid3X3 size={48} />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">No hay sectores</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {search
                ? 'No se encontraron sectores con ese criterio de búsqueda'
                : 'Comienza creando un nuevo sector'
              }
            </p>
          </div>
        ) : (
          <SectoresTable
            sectores={filteredSectores}
            canUpdateSectores={canUpdateSectores}
            canDeleteSectores={canDeleteSectores}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
            onAddMesa={openAddMesa}
          />
        )}

        {/* Select Sucursal Modal */}
        <Modal.Root
          isOpen={showSelectSucursalModal}
          onClose={() => {
            setShowSelectSucursalModal(false)
            setSelectedSucursalId(null)
          }}
          size="md"
        >
          <Modal.Header>Seleccionar Sucursal</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-2">
              {sucursales.length === 0 ? (
                <p className="text-center text-slate-500">No hay sucursales disponibles</p>
              ) : (
                sucursales.map((sucursal) => (
                  <button
                    key={sucursal.idSucursal}
                    onClick={() => handleSelectSucursal(sucursal.idSucursal)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:hover:border-indigo-500 dark:hover:bg-indigo-500/10"
                  >
                    <Grid3X3 size={18} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium text-slate-900 dark:text-slate-100">{sucursal.nombre}</span>
                  </button>
                ))
              )}
            </div>
          </Modal.Body>
        </Modal.Root>

        {/* Create Modal */}
        <Modal.Root
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedSucursalId(null)
          }}
          size="lg"
        >
          <Modal.Header>Crear Nuevo Sector</Modal.Header>
          <Modal.Body>
            {selectedSucursalId && (
              <SectorFormEdit
                nombreSucursal={getSucursalNombre(selectedSucursalId)}
                onSubmit={handleCreate}
                onCancel={() => {
                  setShowCreateModal(false)
                  setSelectedSucursalId(null)
                }}
                isLoading={isSubmitting}
              />
            )}
          </Modal.Body>
        </Modal.Root>

        {/* Edit Modal */}
        <Modal.Root
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedSector(null)
          }}
          size="lg"
        >
          <Modal.Header>Editar Sector</Modal.Header>
          <Modal.Body>
            {selectedSector && (
              <SectorFormEdit
                sector={selectedSector}
                nombreSucursal={selectedSector.nombreSucursal}
                onSubmit={handleUpdate}
                onCancel={() => {
                  setShowEditModal(false)
                  setSelectedSector(null)
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
            setSelectedSector(null)
          }}
          size="md"
        >
          <Modal.Header>Detalles del Sector</Modal.Header>
          <Modal.Body>
            {selectedSector && <SectorView sector={selectedSector} />}
          </Modal.Body>
        </Modal.Root>

        {/* Delete Confirmation Modal */}
        <Modal.Root
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedSector(null)
          }}
          size="sm"
        >
          <Modal.Header>Confirmar Eliminación</Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <Grid3X3 size={24} />
              </div>
              <p>
                ¿Estás seguro de que deseas eliminar el sector <strong>{selectedSector?.nombre}</strong>?
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
                setSelectedSector(null)
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

        {/* Add Mesa Modal */}
        <Modal.Root
          isOpen={showAddMesaModal}
          onClose={() => {
            setShowAddMesaModal(false)
            setSelectedSectorForMesa(null)
          }}
        >
          <Modal.Header>Añadir Mesa</Modal.Header>
          <Modal.Body>
            {selectedSectorForMesa && (
              <MesaForm
                nombreSector={selectedSectorForMesa.nombre}
                onSubmit={handleAddMesa}
                onCancel={() => {
                  setShowAddMesaModal(false)
                  setSelectedSectorForMesa(null)
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