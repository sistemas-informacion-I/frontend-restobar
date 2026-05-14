import { Modal } from '@/shared/components/ui/Modal'
import { ProductosSucursalesToolbar } from './components/ProductosSucursalesToolbar.view'
import { ProductosSucursalesTable } from './components/ProductosSucursalesTable.view'
import { ProductoSucursalForm } from './components/ProductoSucursalForm.view'
import { ProductoSucursal } from '../../hooks/useProductosSucursales'
import { ProductoFinal } from '../../services/productosFinales.service'

interface ProductosSucursalesPageViewProps {
  productos: ProductoSucursal[]
  total: number
  isLoading: boolean
  isSubmitLoading: boolean
  search: string
  onSearchChange: (search: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  isFormModalOpen: boolean
  setIsFormModalOpen: (open: boolean) => void
  productosDisponibles: ProductoFinal[]
  productosLoading: boolean
  sucursalId: number
  onCreate: () => void
  onAssign: (idProducto: number, precio: number, disponible: boolean) => Promise<void>
}

export function ProductosSucursalesPageView({
  productos,
  total,
  isLoading,
  isSubmitLoading,
  search,
  onSearchChange,
  feedbackMessage,
  feedbackType,
  isFormModalOpen,
  setIsFormModalOpen,
  productosDisponibles,
  productosLoading,
  sucursalId,
  onCreate,
  onAssign,
}: ProductosSucursalesPageViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {feedbackMessage && !isFormModalOpen && (
        <div
          className={`rounded-2xl border-2 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg animate-in fade-in slide-in-from-top-2 duration-500 ${
            feedbackType === 'error'
              ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5'
              : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-emerald-900/5'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${feedbackType === 'error' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            {feedbackMessage}
          </div>
        </div>
      )}

      <ProductosSucursalesToolbar
        search={search}
        onSearchChange={onSearchChange}
        total={total}
        sucursalId={sucursalId}
        onCreate={onCreate}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-wine-50/10 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
          <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
            Cargando productos...
          </p>
        </div>
      ) : (
        <ProductosSucursalesTable productos={productos} />
      )}

      {/* Modal Asignar Producto */}
      <Modal.Root isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} size="lg">
        <Modal.Header>Asignar Producto a Sucursal</Modal.Header>
        <Modal.Body>
          {feedbackMessage && feedbackType === 'error' && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/50 p-3 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-400 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                {feedbackMessage}
              </div>
            </div>
          )}
          <ProductoSucursalForm
            productosDisponibles={productosDisponibles}
            productosLoading={productosLoading}
            isLoading={isSubmitLoading}
            onCancel={() => setIsFormModalOpen(false)}
            onSubmit={onAssign}
          />
        </Modal.Body>
      </Modal.Root>
    </div>
  )
}
