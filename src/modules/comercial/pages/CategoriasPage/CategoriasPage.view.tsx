import { Modal } from '@/shared/components/ui/Modal'
import { CategoriasToolbar } from './components/CategoriasToolbar.view'
import { CategoriasTable } from './components/CategoriasTable.view'
import { CategoriaForm } from './components/CategoriaForm.view'
import { CategoriaView } from './components/CategoriaView.view'
import { Categoria, CreateCategoriaData } from '@/modules/comercial/services/categorias.service'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

interface CategoriasPageViewProps {
  categorias: Categoria[]
  allCategorias: Categoria[]
  total: number
  isLoading: boolean
  isSubmitLoading: boolean
  search: string
  onSearchChange: (search: string) => void
  feedbackMessage: string
  feedbackType: 'error' | 'success' | ''
  canCreate: boolean
  canUpdate: boolean
  isFormModalOpen: boolean
  setIsFormModalOpen: (open: boolean) => void
  isViewModalOpen: boolean
  setIsViewModalOpen: (open: boolean) => void
  selectedCategoria: Categoria | null
  onCreate: () => void
  onEdit: (categoria: Categoria) => void
  onView: (categoria: Categoria) => void
  onDesactivar: (categoria: Categoria) => void
  onActivar: (categoria: Categoria) => void
  onSubmit: (data: CreateCategoriaData) => Promise<void>
  confirmModal: { open: boolean; mensaje: string; onConfirm: () => void }
  onConfirmModalClose: () => void
}

export function CategoriasPageView({
  categorias,
  allCategorias,
  total,
  isLoading,
  isSubmitLoading,
  search,
  onSearchChange,
  feedbackMessage,
  feedbackType,
  canCreate,
  canUpdate,
  isFormModalOpen,
  setIsFormModalOpen,
  isViewModalOpen,
  setIsViewModalOpen,
  selectedCategoria,
  onCreate,
  onEdit,
  onView,
  onDesactivar,
  onActivar,
  onSubmit,
  confirmModal,
  onConfirmModalClose,
}: CategoriasPageViewProps) {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">

        {/* Feedback global (fuera de modales) */}
        {feedbackMessage && !isFormModalOpen && !isViewModalOpen && (
          <div className={`flex items-start gap-4 rounded-3xl p-5 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500 border-2 ${
            feedbackType === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300'
          }`}>
            {/* Ícono grande */}
            {feedbackType === 'error'
              ? <XCircle size={28} className="shrink-0 mt-0.5" />
              : <CheckCircle2 size={28} className="shrink-0 mt-0.5" />
            }
            {/* Texto */}
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                {feedbackType === 'error' ? 'Error' : 'Éxito'}
              </span>
              <span className="text-sm font-bold">{feedbackMessage}</span>
            </div>
          </div>
        )}

        <CategoriasToolbar
          search={search}
          onSearchChange={onSearchChange}
          total={total}
          canCreate={canCreate}
          onCreate={onCreate}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-wine-50/10 rounded-[2.5rem] border-2 border-dashed border-wine-100/50 dark:bg-black/10 dark:border-wine-900/20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
              Cargando categorías...
            </p>
          </div>
        ) : (
          <CategoriasTable
            categorias={categorias}
            canUpdate={canUpdate}
            onView={onView}
            onEdit={onEdit}
            onDesactivar={onDesactivar}
            onActivar={onActivar}
          />
        )}

        {/* Modal Crear / Editar */}
        <Modal.Root
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          size="lg"
        >
          <Modal.Header>
            {selectedCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
            <CategoriaForm
              categoria={selectedCategoria}
              categorias={allCategorias}
              isLoading={isSubmitLoading}
              onCancel={() => setIsFormModalOpen(false)}
              onSubmit={onSubmit}
            />
          </Modal.Body>
        </Modal.Root>

        {/* Modal Ver detalle */}
        <Modal.Root
                  isOpen={isViewModalOpen}
                  onClose={() => setIsViewModalOpen(false)}
                  size="lg"
                >
                  <Modal.Header>Detalle de la Categoría</Modal.Header>
                  <Modal.Body>
                    {selectedCategoria && <CategoriaView categoria={selectedCategoria} />}
                  </Modal.Body>
                </Modal.Root>
                  {/* Modal de confirmación */}
        <Modal.Root
          isOpen={confirmModal.open}
          onClose={onConfirmModalClose}
          size="sm"
        >
          <Modal.Header>Confirmar acción</Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-6">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {confirmModal.mensaje}
              </p>
              <div className="flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={onConfirmModalClose}
                  className="bg-wine-50/50 dark:bg-wine-950/30"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={confirmModal.onConfirm}
                  className="shadow-lg shadow-wine-900/20"
                >
                  Confirmar
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Root>

    </div>
  )
}
