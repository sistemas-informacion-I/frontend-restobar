import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Search, Plus, ClipboardList } from 'lucide-react'
import { ComandasTable } from '../../components/comandas/comandasTable'
import { ComandaView } from '../../components/comandas/comandaView'
import { ComandaForm } from '../../components/comandas/comandaForm'
import type { Comanda, Mesa } from '../../services/types'

interface ComandasPageViewProps {
  comandas: Comanda[]
  mesas: Mesa[]
  productos: Array<{ id: number; nombre: string; precio: number }>
  loading: boolean
  search: string
  setSearch: (value: string) => void
  filterEstado: string
  setFilterEstado: (value: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  showCreateModal: boolean
  setShowCreateModal: (value: boolean) => void
  showEditModal: boolean
  setShowEditModal: (value: boolean) => void
  showViewModal: boolean
  setShowViewModal: (value: boolean) => void
  selectedComanda: Comanda | null
  setSelectedComanda: (value: Comanda | null) => void
  isSubmitting: boolean
  handleCreate: (data: any) => Promise<void>
  handleUpdate: (data: any) => Promise<void>
  handleCloseComanda: (comanda: Comanda) => Promise<void>
  onCancelDetalle?: (idDetalleComanda: number) => void
  onDeleteDetalle?: (idDetalleComanda: number) => void
  openView: (comanda: Comanda) => void
  openEdit: (comanda: Comanda) => void
}

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'ABIERTA', label: 'Abierta' },
  { value: 'EN_PREPARACION', label: 'En Preparación' },
  { value: 'LISTA', label: 'Lista' },
  { value: 'ENTREGADA', label: 'Entregada' },
  { value: 'CERRADA', label: 'Cerrada' },
  { value: 'CANCELADA', label: 'Cancelada' },
  { value: 'PENDIENTE_PAGO', label: 'Pendiente Pago' }
]

const getEstadoCount = (comandas: Comanda[], estado: string): number => {
  if (!estado) return comandas.length
  return comandas.filter(c => c.estado === estado).length
}

export function ComandasPageView({
  comandas,
  mesas,
  productos,
  loading,
  search,
  setSearch,
  filterEstado,
  setFilterEstado,
  feedbackMessage,
  feedbackType,
  showCreateModal,
  setShowCreateModal,
  showEditModal,
  setShowEditModal,
  showViewModal,
  setShowViewModal,
  selectedComanda,
  setSelectedComanda,
  isSubmitting,
  handleCreate,
  handleUpdate,
  handleCloseComanda,
  onCancelDetalle,
  onDeleteDetalle,
  openView,
  openEdit
}: ComandasPageViewProps) {
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

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-wine-500/10">
            <ClipboardList size={20} className="text-wine-600" />
          </div>
          <div>
            <h1 className="text-lg font-black uppercase tracking-wider text-gray-900 dark:text-white">
              Comandas
            </h1>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              {comandas.length} registro{comandas.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar comanda..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 rounded-xl border border-gray-300 bg-white py-2 pl-9 pr-3 text-xs font-semibold uppercase tracking-wider placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wine-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500"
            />
          </div>

          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-wine-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            {ESTADOS.map(e => (
              <option key={e.value} value={e.value}>
                {e.label} ({getEstadoCount(comandas, e.value)})
              </option>
            ))}
          </select>

          <Button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Nueva Comanda
          </Button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-wine-50/5 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando comandas...</p>
        </div>
      ) : comandas.length === 0 ? (
        <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-24 text-center dark:border-wine-900/20 dark:bg-black/10">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
              <ClipboardList size={32} />
            </div>
            <div className="max-w-xs">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-wine-950 dark:text-white">
                No hay comandas
              </h3>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
                {search || filterEstado ? 'No se encontraron comandas con ese criterio' : 'Crea tu primera comanda para comenzar'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <ComandasTable
          comandas={comandas}
          isLoading={false}
          onViewClick={openView}
          onEditClick={openEdit}
          onCloseClick={handleCloseComanda}
          onDeleteClick={() => {}}
          canDelete={false}
        />
      )}

      {/* View Modal */}
      <Modal.Root isOpen={showViewModal} onClose={() => setShowViewModal(false)}>
        <Modal.Header>Detalle de Comanda</Modal.Header>
        <Modal.Body>
          {selectedComanda && (
            <ComandaView
              comanda={selectedComanda}
              onClose={() => {
                setShowViewModal(false)
                setSelectedComanda(null)
              }}
              onEdit={() => {
                setShowViewModal(false)
                setShowEditModal(true)
              }}
              onCancelDetalle={onCancelDetalle}
              onDeleteDetalle={onDeleteDetalle}
              isLoading={isSubmitting}
            />
          )}
        </Modal.Body>
      </Modal.Root>

      {/* Create Modal */}
      <Modal.Root isOpen={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Modal.Header>Nueva Comanda</Modal.Header>
        <Modal.Body>
          <ComandaForm
            mesas={mesas}
            productos={productos}
            onSubmit={handleCreate}
            onCancel={() => setShowCreateModal(false)}
            isLoading={isSubmitting}
          />
        </Modal.Body>
      </Modal.Root>

      {/* Edit Modal */}
      <Modal.Root isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <Modal.Header>Editar Comanda</Modal.Header>
        <Modal.Body>
          <ComandaForm
            comanda={selectedComanda || undefined}
            mesas={mesas}
            productos={productos}
            onSubmit={handleUpdate}
            onCancel={() => {
              setShowEditModal(false)
              setSelectedComanda(null)
            }}
            isLoading={isSubmitting}
            isEditing
          />
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}
