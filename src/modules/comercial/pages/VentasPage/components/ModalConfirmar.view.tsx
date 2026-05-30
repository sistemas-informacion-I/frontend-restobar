import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface ModalConfirmarProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  isConfirming: boolean
  total: number
  metodoPagoNombre: string
}

export function ModalConfirmar({
  isOpen,
  onClose,
  onConfirm,
  isConfirming,
  total,
  metodoPagoNombre,
}: ModalConfirmarProps) {
  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>Confirmar Venta</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center text-center py-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 dark:bg-amber-900/30">
            <AlertTriangle size={28} className="text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white mb-2">
            ¿Confirmar esta venta?
          </p>
          <p className="text-sm font-bold text-wine-900/60 dark:text-wine-400/60 mb-4">
            Esta acción no se puede deshacer
          </p>

          <div className="w-full rounded-2xl bg-wine-50/50 p-4 space-y-2 dark:bg-wine-900/10">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-wine-900/60 dark:text-wine-400/60">Total</span>
              <span className="font-black text-slate-900 dark:text-white">Bs {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold text-wine-900/60 dark:text-wine-400/60">Pago</span>
              <span className="font-black text-slate-900 dark:text-white">{metodoPagoNombre}</span>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          disabled={isConfirming}
          className="rounded-xl font-black uppercase tracking-widest text-[10px]"
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          isLoading={isConfirming}
          className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-900/20"
        >
          <CheckCircle size={16} className="mr-2" />
          Confirmar Venta
        </Button>
      </Modal.Footer>
    </Modal.Root>
  )
}
