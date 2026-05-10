import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  nroFactura: string
  onConfirm: () => void
  isDeleting: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  nroFactura,
  onConfirm,
  isDeleting,
}: DeleteConfirmModalProps) {
  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>Confirmar Eliminación</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
            <AlertTriangle size={32} />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              ¿Estás seguro de eliminar esta compra?
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
              N° Factura: {nroFactura}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
              Esta acción no se puede deshacer
            </p>
          </div>
        </div>
      </Modal.Body>
      <div className="flex justify-end gap-3 border-t border-wine-100/30 p-6 dark:border-wine-900/10">
        <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm} isLoading={isDeleting}>
          Eliminar
        </Button>
      </div>
    </Modal.Root>
  )
}
