import { Modal } from '@/shared/components/ui/Modal'
import { MesasToolbar, MesasTable, MesaView, MesaFormEdit } from '../../components/mesas'
import { AlertCircle } from 'lucide-react'
import { Mesa, Sector } from '../../services/types'

interface MesasPageViewProps {
  mesas: Mesa[]
  sectores: Sector[]
  loading: boolean
  search: string
  setSearch: (value: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  showCreateModal: boolean
  setShowCreateModal: (value: boolean) => void
  showEditModal: boolean
  setShowEditModal: (value: boolean) => void
  showViewModal: boolean
  setShowViewModal: (value: boolean) => void
  showDeleteModal: boolean
  setShowDeleteModal: (value: boolean) => void
  selectedMesa: Mesa | null
  setSelectedMesa: (value: Mesa | null) => void
  isSubmitting: boolean
  handleCreate: (data: any) => Promise<void>
  handleUpdate: (data: any) => Promise<void>
  handleDelete: () => Promise<void>
  openView: (mesa: Mesa) => void
  openEdit: (mesa: Mesa) => void
  openDelete: (mesa: Mesa) => void
  canViewMesas: boolean
  canCreateMesas: boolean
  canUpdateMesas: boolean
  canDeleteMesas: boolean
}

export function MesasPageView({
  mesas,
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
}: MesasPageViewProps) {
  if (!canViewMesas) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <AlertCircle size={48} className="mx-auto text-wine-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">No tienes permiso para ver las mesas</p>
        </div>
    )
  }

  return (
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
          total={mesas.length}
          canCreateMesas={canCreateMesas}
          onCreateMesa={() => setShowCreateModal(true)}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-wine-50/5 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sincronizando mobiliario...</p>
          </div>
        ) : mesas.length === 0 ? (
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
            mesas={mesas}
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
            <div className="flex flex-col gap-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-900/20">
                <AlertCircle size={32} />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-300">
                  ¿Estás seguro de que deseas eliminar la mesa <strong>{selectedMesa?.numeroMesa}</strong>?
                </p>
                <p className="mt-2 text-sm text-slate-500">Esta acción no se puede deshacer.</p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="rounded-xl border border-slate-300 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                disabled={isSubmitting}
                className="rounded-xl bg-rose-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-rose-700 disabled:opacity-50 shadow-lg shadow-rose-900/20 transition-all"
              >
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </Modal.Footer>
        </Modal.Root>
      </div>
  )
}
