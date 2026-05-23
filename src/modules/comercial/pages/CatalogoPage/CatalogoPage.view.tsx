import { Modal } from '@/shared/components/ui/Modal'
import { CatalogoToolbar } from './components/CatalogoToolbar.view'
import { CatalogoTable } from './components/CatalogoTable.view'
import { CatalogoForm } from './components/CatalogoForm.view'
import { CatalogoProducto, CatalogoUpdateRequest } from '../../models/catalogo.model'
import { Sucursal } from '@/modules/acceso/services/types'

interface CatalogoPageViewProps {
  productos: CatalogoProducto[]
  total: number
  isLoading: boolean
  isSubmitLoading: boolean
  search: string
  onSearchChange: (v: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  canUpdate: boolean
  isAdmin: boolean
  isFormModalOpen: boolean
  setIsFormModalOpen: (open: boolean) => void
  selectedProducto: CatalogoProducto | null
  onEdit: (producto: CatalogoProducto) => void
  onAgregarCarrito: (producto: CatalogoProducto) => void
  onSubmit: (data: CatalogoUpdateRequest) => Promise<void>
  sucursales: Sucursal[]
  sucursalId: number | null
  onSucursalChange: (id: number) => void
}

export function CatalogoPageView({
  productos, total, isLoading, isSubmitLoading,
  search, onSearchChange, feedbackMessage, feedbackType,
  canUpdate, isAdmin, isFormModalOpen, setIsFormModalOpen,
  selectedProducto, onEdit, onAgregarCarrito, onSubmit,
  sucursales, sucursalId, onSucursalChange,
}: CatalogoPageViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {feedbackMessage && !isFormModalOpen && (
        <div className={`rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2 duration-500 ${
          feedbackType === 'error'
            ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400'
            : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {feedbackMessage}
          </div>
        </div>
      )}

      <CatalogoToolbar
        search={search}
        onSearchChange={onSearchChange}
        total={total}
        isAdmin={isAdmin}
        sucursales={sucursales}
        sucursalId={sucursalId}
        onSucursalChange={onSucursalChange}
      />

      {!sucursalId ? (
        <div className="flex flex-col items-center justify-center py-20 bg-wine-50/10 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
          <p className="text-xs font-bold uppercase tracking-widest text-wine-900/40">
            Selecciona una sucursal para ver el catálogo
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-wine-50/10 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40">Cargando catálogo...</p>
        </div>
      ) : (
        <CatalogoTable
          productos={productos}
          canUpdate={canUpdate}
          isAdmin={isAdmin}
          onEdit={onEdit}
          onAgregarCarrito={onAgregarCarrito}
        />
      )}

      <Modal.Root isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} size="md">
        <Modal.Header>Editar Producto del Catálogo</Modal.Header>
        <Modal.Body>
          {feedbackMessage && feedbackType === 'error' && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {feedbackMessage}
              </div>
            </div>
          )}
          <CatalogoForm
            producto={selectedProducto}
            isLoading={isSubmitLoading}
            onCancel={() => setIsFormModalOpen(false)}
            onSubmit={onSubmit}
          />
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}
