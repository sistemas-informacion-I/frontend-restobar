import { Modal } from '@/shared/components/ui/Modal'
import { CompraToolbar } from './components/CompraToolbar.view'
import { CompraTable } from './components/CompraTable.view'
import { CompraForm } from './components/CompraForm.view'
import { CompraView as CompraDetail } from './components/CompraView.view'
import { DeleteConfirmModal } from './components/DeleteConfirmModal.view'
import {
  CompraResponse,
  CompraRequest,
  EstadoPago,
} from '@/modules/comercial/services/compras.service'
import { Proveedor } from '@/modules/comercial/services/proveedores.service'
import { Empleado } from '@/modules/acceso/services/empleados.service'
import { InventarioItem } from '@/modules/inventario/services/inventario.service'

interface CompraViewProps {
  compras: CompraResponse[]
  total: number
  isLoading: boolean
  isSubmitLoading: boolean
  isDeleting: boolean
  search: string
  onSearchChange: (search: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  isFormModalOpen: boolean
  setIsFormModalOpen: (open: boolean) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  isDeleteModalOpen: boolean
  setIsDeleteModalOpen: (open: boolean) => void
  selectedCompra: CompraResponse | null
  proveedores: Proveedor[]
  employees: Empleado[]
  insumos: InventarioItem[]
  sucursales: { idSucursal: number; nombre: string }[]
  sucursalesLoading: boolean
  filtroProveedor: string
  onFiltroProveedorChange: (value: string) => void
  filtroEstado: string
  onFiltroEstadoChange: (value: string) => void
  onCreate: () => void
  onEdit: (compra: CompraResponse) => void
  onView: (compra: CompraResponse) => void
  onDeleteClick: (compra: CompraResponse) => void
  onDeleteConfirm: () => Promise<void>
  onCambiarEstado: (compra: CompraResponse, nuevoEstado: EstadoPago) => void
  onSubmit: (data: CompraRequest) => Promise<void>
}

export function CompraView({
  compras,
  total,
  isLoading,
  isSubmitLoading,
  isDeleting,
  search,
  onSearchChange,
  feedbackMessage,
  feedbackType,
  canCreate,
  canUpdate,
  canDelete,
  isFormModalOpen,
  setIsFormModalOpen,
  isViewModalOpen,
  setIsViewModalOpen,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  selectedCompra,
  proveedores,
  employees,
  insumos,
  sucursales,
  sucursalesLoading,
  filtroProveedor,
  onFiltroProveedorChange,
  filtroEstado,
  onFiltroEstadoChange,
  onCreate,
  onEdit,
  onView,
  onDeleteClick,
  onDeleteConfirm,
  onCambiarEstado,
  onSubmit,
}: CompraViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {feedbackMessage && !isFormModalOpen && !isViewModalOpen && (
        <div className={`rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2 duration-500 ${
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

      <CompraToolbar
        search={search}
        onSearchChange={onSearchChange}
        total={total}
        canCreate={canCreate}
        onCreate={onCreate}
        proveedores={proveedores}
        filtroProveedor={filtroProveedor}
        onFiltroProveedorChange={onFiltroProveedorChange}
        filtroEstado={filtroEstado}
        onFiltroEstadoChange={onFiltroEstadoChange}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-wine-50/10 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Cargando compras...</p>
        </div>
      ) : (
        <CompraTable
          compras={compras}
          canUpdate={canUpdate}
          canDelete={canDelete}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDeleteClick}
          onCambiarEstado={onCambiarEstado}
        />
      )}

      {/* Modal Crear / Editar */}
      <Modal.Root isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} size="lg">
        <Modal.Header>
          {selectedCompra ? 'Editar Compra' : 'Nueva Compra'}
        </Modal.Header>
        <Modal.Body>
          {feedbackMessage && feedbackType === 'error' && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {feedbackMessage}
              </div>
            </div>
          )}
          <CompraForm
            compra={selectedCompra}
            isLoading={isSubmitLoading}
            onCancel={() => setIsFormModalOpen(false)}
            onSubmit={onSubmit}
            proveedores={proveedores}
            employees={employees}
            insumos={insumos}
            sucursales={sucursales}
            sucursalesLoading={sucursalesLoading}
          />
        </Modal.Body>
      </Modal.Root>

      {/* Modal Ver detalle */}
      <Modal.Root isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} size="lg">
        <Modal.Header>Detalle de la Compra</Modal.Header>
        <Modal.Body>
          {selectedCompra && <CompraDetail compra={selectedCompra} />}
        </Modal.Body>
      </Modal.Root>

      {/* Modal Confirmar Eliminación */}
      {selectedCompra && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          nroFactura={selectedCompra.nroFactura}
          onConfirm={onDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
