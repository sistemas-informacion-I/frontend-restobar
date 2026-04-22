import { useState, useEffect, useCallback } from 'react'
import { Layout } from '@/shared/components/layout/Layout'
import { Modal } from '@/shared/components/ui/Modal'
import { MesasToolbar, MesasTable, MesaView, MesaFormEdit } from '../components/mesas'
import { mesaService, sectorService, getErrorMessage } from '../../acceso/services/api'
import { AlertCircle } from 'lucide-react'
import { Mesa, Sector, CreateMesaData, UpdateMesaData } from '../services/types'

export default function MesasPage() {
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

  const canViewMesas = true
  const canCreateMesas = false
  const canUpdateMesas = true
  const canDeleteMesas = true

  if (!canViewMesas) {
    return (
      <Layout>
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <AlertCircle size={48} />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">No tienes permiso para ver las mesas</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-6">
        {feedbackMessage && (
          <div className={`mb-4 rounded-lg p-4 ${feedbackType === 'success' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'}`}>
            {feedbackMessage}
          </div>
        )}

        <MesasToolbar
          search={search}
          onSearchChange={setSearch}
          total={filteredMesas.length}
          canCreateMesas={canCreateMesas}
          onCreateMesa={() => setShowCreateModal(true)}
        />

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>
        ) : filteredMesas.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
            <AlertCircle size={48} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">No hay mesas</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              {search ? 'No se encontraron mesas con ese criterio' : 'Crea tu primera mesa para comenzar'}
            </p>
          </div>
        ) : (
          <MesasTable
            mesas={filteredMesas}
            canUpdateMesas={canUpdateMesas}
            canDeleteMesas={canDeleteMesas}
            onView={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        )}

        {/* View Modal */}
        <Modal.Root isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
          <Modal.Header>Ver Mesa</Modal.Header>
          <Modal.Body>
            {selectedMesa && <MesaView mesa={selectedMesa} />}
          </Modal.Body>
        </Modal.Root>

        {/* Create Modal */}
        <Modal.Root isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <Modal.Header>Nueva Mesa</Modal.Header>
          <Modal.Body>
            <MesaFormEdit
              sectores={sectores}
              onSubmit={handleCreate}
              onCancel={() => setShowCreateModal(false)}
              isLoading={isSubmitting}
            />
          </Modal.Body>
        </Modal.Root>

        {/* Edit Modal */}
        <Modal.Root isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
          <Modal.Header>Editar Mesa</Modal.Header>
          <Modal.Body>
            <MesaFormEdit
              mesa={selectedMesa || undefined}
              sectores={sectores}
              onSubmit={handleUpdate}
              onCancel={() => {
                setShowEditModal(false)
                setSelectedMesa(null)
              }}
              isLoading={isSubmitting}
            />
          </Modal.Body>
        </Modal.Root>

        {/* Delete Modal */}
        <Modal.Root isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <Modal.Header>Eliminar Mesa</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-4">
              <p className="text-slate-700 dark:text-slate-300">
                ¿Estás seguro de que deseas eliminar la mesa <strong>{selectedMesa?.numeroMesa}</strong>?
              </p>
              <p className="text-sm text-slate-500">Esta acción no se puede deshacer.</p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </Modal.Footer>
        </Modal.Root>
      </div>
    </Layout>
  )
}