import { Modal } from '@/shared/components/ui/Modal'
import { SectoresToolbar, SectoresTable, SectorView, SectorFormEdit } from '../../components/sectores'
import { MesaForm } from '../../components/mesas/MesaForm'
import { Grid3X3, AlertCircle } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Sucursal, Sector as SectorType } from '../../services/types'

interface SectoresPageViewProps {
  sectores: SectorType[]
  sucursales: Sucursal[]
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
  showSelectSucursalModal: boolean
  setShowSelectSucursalModal: (value: boolean) => void
  showAddMesaModal: boolean
  setShowAddMesaModal: (value: boolean) => void
  selectedSector: SectorType | null
  setSelectedSector: (value: SectorType | null) => void
  selectedSectorForMesa: SectorType | null
  setSelectedSectorForMesa: (value: SectorType | null) => void
  selectedSucursalId: number | null
  setSelectedSucursalId: (value: number | null) => void
  isSubmitting: boolean
  handleCreate: (data: any) => Promise<void>
  handleUpdate: (data: any) => Promise<void>
  handleDelete: () => Promise<void>
  openView: (sector: SectorType) => void
  openEdit: (sector: SectorType) => void
  openDelete: (sector: SectorType) => void
  openAddMesa: (sector: SectorType) => void
  handleAddMesa: (data: any) => Promise<void>
  openCreate: () => void
  handleSelectSucursal: (idSucursal: number) => void
  getSucursalNombre: (idSucursal: number) => string
  canViewSectores: boolean
  canCreateSectores: boolean
  canUpdateSectores: boolean
  canDeleteSectores: boolean
  canCreateMesas: boolean
}

export function SectoresPageView({
  sectores,
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
  canDeleteSectores,
  canCreateMesas
}: SectoresPageViewProps) {
  if (!canViewSectores) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-900">
          <AlertCircle size={48} className="mx-auto text-wine-600" />
          <h2 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">No tienes permiso para ver los sectores</p>
        </div>
    )
  }

  return (
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

        <SectoresToolbar
          search={search}
          onSearchChange={setSearch}
          total={sectores.length}
          canCreateSectores={canCreateSectores}
          onCreateSector={openCreate}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-wine-50/5 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Sincronizando sectores...</p>
          </div>
        ) : sectores.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-24 text-center dark:border-wine-900/20 dark:bg-black/10">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
                <Grid3X3 size={32} />
              </div>
              <div className="max-w-xs">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-wine-950 dark:text-white">
                  No hay sectores
                </h3>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
                  {search
                    ? 'No se encontraron sectores con ese criterio de búsqueda'
                    : 'Comienza creando un nuevo sector para organizar tu local'
                  }
                </p>
              </div>
            </div>
          </div>
        ) : (
          <SectoresTable
            sectores={sectores}
            canUpdateSectores={canUpdateSectores}
            canDeleteSectores={canDeleteSectores}
            canCreateMesas={canCreateMesas}
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
                <p className="text-center text-slate-500 py-6">No hay sucursales disponibles</p>
              ) : (
                sucursales.map((sucursal) => (
                  <button
                    key={sucursal.idSucursal}
                    onClick={() => handleSelectSucursal(sucursal.idSucursal)}
                    className="flex items-center gap-4 rounded-2xl border border-wine-100/30 p-4 text-left transition-all hover:border-wine-500 hover:bg-wine-50/50 dark:border-wine-900/20 dark:hover:border-wine-500 dark:hover:bg-wine-900/20 group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wine-50 text-wine-600 group-hover:bg-wine-600 group-hover:text-white transition-all">
                      <Grid3X3 size={20} />
                    </div>
                    <span className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-slate-100">{sucursal.nombre}</span>
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
            <div className="text-center flex flex-col gap-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400">
                <Grid3X3 size={32} />
              </div>
              <div>
                <p className="text-slate-700 dark:text-slate-200">
                  ¿Estás seguro de que deseas eliminar el sector <strong>{selectedSector?.nombre}</strong>?
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
                  setSelectedSector(null)
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
  )
}
