import { Layout } from '@/shared/components/layout/Layout'
import { Modal } from '@/shared/components/ui/Modal'
import { SucursalesToolbar, SucursalesTable, SucursalForm, SucursalView, SectorForm } from '../../components/sucursales'
import { Store, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Sucursal as SucursalType, Sector as SectorType } from '../../services/types'

interface SucursalesPageViewProps {
  sucursales: SucursalType[]
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
  showAddSectorModal: boolean
  setShowAddSectorModal: (value: boolean) => void
  selectedSucursal: SucursalType | null
  setSelectedSucursal: (value: SucursalType | null) => void
  sectoresView: SectorType[]
  isSubmitting: boolean
  handleCreate: (data: any) => Promise<void>
  handleUpdate: (data: any) => Promise<void>
  handleDelete: () => Promise<void>
  openView: (sucursal: SucursalType) => Promise<void>
  openEdit: (sucursal: SucursalType) => void
  openDelete: (sucursal: SucursalType) => void
  openAddSector: (sucursal: SucursalType) => void
  handleAddSector: (data: any) => Promise<void>
  canViewSucursales: boolean
  canCreateSucursales: boolean
  canUpdateSucursales: boolean
  canDeleteSucursales: boolean
}

export function SucursalesPageView({
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
  showAddSectorModal,
  setShowAddSectorModal,
  selectedSucursal,
  setSelectedSucursal,
  sectoresView,
  isSubmitting,
  handleCreate,
  handleUpdate,
  handleDelete,
  openView,
  openEdit,
  openDelete,
  openAddSector,
  handleAddSector,
  canViewSucursales,
  canCreateSucursales,
  canUpdateSucursales,
  canDeleteSucursales
}: SucursalesPageViewProps) {
  if (!canViewSucursales) {
    return (
      <Layout>
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <AlertCircle size={48} className="mx-auto text-wine-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">No tienes permiso para ver las sucursales</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-6 animate-in fade-in slide-in-from-bottom-1">
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

        <SucursalesToolbar
          search={search}
          onSearchChange={setSearch}
          total={sucursales.length}
          canCreateSucursales={canCreateSucursales}
          onCreateSucursal={() => setShowCreateModal(true)}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-wine-50/5 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sincronizando sucursales...</p>
          </div>
        ) : sucursales.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-24 text-center dark:border-wine-900/20 dark:bg-black/10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
                <Store size={32} />
              </div>
              <div className="max-w-xs">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-wine-950 dark:text-white">
                  No hay sucursales
                </h3>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
                  {search 
                    ? 'No se encontraron sucursales con ese criterio de búsqueda'
                    : 'Registra tu primera sucursal para comenzar la expansión de tu negocio'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <SucursalesTable
            sucursales={sucursales}
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
            <div className="text-center flex flex-col gap-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <Store size={32} />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-200">
                  ¿Estás seguro de que deseas eliminar la sucursal <strong>{selectedSucursal?.nombre}</strong>?
                </p>
                <p className="mt-2 text-sm text-rose-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex w-full justify-end gap-3">
              <Button 
                variant="secondary" 
                className="!rounded-xl text-[10px] font-black uppercase tracking-widest px-6"
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedSucursal(null)
                }}
              >
                Cancelar
              </Button>
              <Button 
                variant="danger" 
                className="!rounded-xl text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-rose-900/20"
                onClick={handleDelete}
                isLoading={isSubmitting}
              >
                Eliminar
              </Button>
            </div>
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
