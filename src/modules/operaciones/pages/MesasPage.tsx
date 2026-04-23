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
          <div className={`mb-6 rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2 duration-500 ${
            feedbackType === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-emerald-900/5'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              {feedbackMessage}
            </div>
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
          <div className="flex flex-col items-center justify-center py-24 bg-wine-50/5 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sincronizando mobiliario...</p>
          </div>
        ) : filteredMesas.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-24 text-center dark:border-wine-900/20 dark:bg-black/10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
                <AlertCircle size={32} />
              </div>
              <div className="max-w-xs">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-wine-950 dark:text-white">
                  No hay mesas
                </h3>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
                  {search ? 'No se encontraron mesas con ese criterio' : 'Crea tu primera mesa para comenzar a recibir clientes'}
                </p>
              </div>
            </div>
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