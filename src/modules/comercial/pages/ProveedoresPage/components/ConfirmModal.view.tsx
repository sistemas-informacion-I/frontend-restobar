import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { AlertTriangle, Power } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
  type: 'activar' | 'desactivar'
  nombre: string
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  type,
  nombre,
}: ConfirmModalProps) {
  const isActivar = type === 'activar'

  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>{isActivar ? 'Confirmar Activación' : 'Confirmar Desactivación'}</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-[2rem] ${
            isActivar
              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
          }`}>
            {isActivar ? <Power size={32} /> : <AlertTriangle size={32} />}
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              ¿{isActivar ? 'Activar' : 'Desactivar'} al proveedor?
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
              {nombre}
            </p>
            {!isActivar && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                No podrá usarse en nuevas compras
              </p>
            )}
          </div>
        </div>
      </Modal.Body>
      <div className="flex justify-end gap-3 border-t border-wine-100/30 p-6 dark:border-wine-900/10">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          variant={isActivar ? 'primary' : 'danger'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {isActivar ? 'Activar' : 'Desactivar'}
        </Button>
      </div>
    </Modal.Root>
  )
}
