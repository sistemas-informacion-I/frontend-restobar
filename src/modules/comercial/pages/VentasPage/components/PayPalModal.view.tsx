import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { ExternalLink, XCircle, Loader2 } from 'lucide-react'

interface PayPalModalProps {
  isOpen: boolean
  payPalUrl: string
  onClose: () => void
}

export function PayPalModal({ isOpen, payPalUrl, onClose }: PayPalModalProps) {
  return (
    <Modal.Root isOpen={isOpen} onClose={onClose} size="sm">
      <Modal.Header>Pago con PayPal</Modal.Header>
      <Modal.Body>
        <div className="flex flex-col items-center text-center py-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-4 dark:bg-blue-900/30">
            <Loader2 size={28} className="text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
          <p className="text-lg font-black text-slate-900 dark:text-white mb-2">
            Procesando pago PayPal
          </p>
          <p className="text-sm font-bold text-wine-900/60 dark:text-wine-400/60 mb-4">
            Se abrió una ventana de PayPal. Completa el pago para finalizar la venta.
          </p>

          <div className="w-full rounded-2xl bg-wine-50/50 p-4 dark:bg-wine-900/10">
            <p className="text-xs font-bold text-wine-900/40 dark:text-wine-400/40 mb-3">
              Si la ventana no se abrió automáticamente, haz clic en el botón:
            </p>
            <a
              href={payPalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-900/20 transition-colors"
            >
              <ExternalLink size={16} />
              Abrir PayPal
            </a>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onClose}
          className="rounded-xl font-black uppercase tracking-widest text-[10px]"
        >
          <XCircle size={16} className="mr-2" />
          Cancelar Pago
        </Button>
      </Modal.Footer>
    </Modal.Root>
  )
}
