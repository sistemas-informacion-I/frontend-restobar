import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui/Select/Select'
import { Search, Plus, ClipboardList, ListFilter, Store } from 'lucide-react'
import { ComandasTable } from '../../components/comandas/comandasTable'
import { ComandaView } from '../../components/comandas/comandaView'
import { ComandaForm } from '../../components/comandas/comandaForm'
import type { Comanda, Mesa, Sector, Sucursal, Cliente } from '../../services/types'

interface ComandasPageViewProps {
  comandas: Comanda[]
  mesas: Mesa[]
  sectores: Sector[]
  clientes: Cliente[]
  sucursales: Sucursal[]
  sucursalNombre?: string
  selectedSucursalId?: number
  setSelectedSucursalId: (value: number | undefined) => void
  isSuperuser: boolean
  productos: Array<{ id: number; nombre: string; precio: number }>
  promociones: Array<{ id: number; nombre: string; productos: Array<{ idProductoFinal: number; nombre: string }> }>
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
  sectores,
  clientes,
  sucursales,
  sucursalNombre,
  selectedSucursalId,
  setSelectedSucursalId,
  isSuperuser,
  productos,
  promociones,
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

      {/* Header */}
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
              <ClipboardList size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
              Comandas
            </h1>
          </div>
          <p className="ml-1 text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40">
            {comandas.length} registro{comandas.length !== 1 ? 's' : ''} · Órdenes de servicio
          </p>
        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="h-12 rounded-2xl px-6 shadow-xl shadow-wine-900/20 active:scale-95 transition-transform"
        >
          <Plus size={18} className="mr-2 stroke-[3px]" />
          <span className="text-[10px] font-black uppercase tracking-widest">Nueva Comanda</span>
        </Button>
      </header>

      {/* Filtros */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-md">
          <Input
            type="text"
            placeholder="Buscar por número, cliente, estado o servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 !rounded-2xl border-wine-100/50 bg-white/50 backdrop-blur-sm focus:border-wine-600 dark:border-wine-900/20 dark:bg-black/20"
            icon={<Search size={18} className="text-wine-900/40" />}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Filtro por sucursal: sólo superusuario */}
          {isSuperuser && (
            <div className="w-full sm:w-56">
              <Select
                value={selectedSucursalId}
                onChange={(val) => setSelectedSucursalId(val ? Number(val) : undefined)}
                options={sucursales.map(s => ({ value: s.idSucursal, label: s.nombre }))}
                placeholder="Sucursal"
                icon={<Store size={18} />}
              />
            </div>
          )}

          <div className="w-full sm:w-56">
            <Select
              value={filterEstado}
              onChange={(val) => setFilterEstado(String(val))}
              options={ESTADOS.map(e => ({
                value: e.value,
                label: `${e.label} (${getEstadoCount(comandas, e.value)})`
              }))}
              placeholder="Filtrar por estado"
              icon={<ListFilter size={18} />}
            />
          </div>
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
            sectores={sectores}
            clientes={clientes}
            sucursalNombre={sucursalNombre}
            productos={productos}
            promociones={promociones}
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
            sectores={sectores}
            clientes={clientes}
            sucursalNombre={sucursalNombre}
            productos={productos}
            promociones={promociones}
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
