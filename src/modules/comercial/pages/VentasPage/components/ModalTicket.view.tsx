import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Printer, CheckCircle } from 'lucide-react'
import type { Comanda, ProductoVenta, MetodoPagoType, EstadoVenta } from '@/modules/comercial/models/ventaPresencial.model'

const estadoLabels: Record<EstadoVenta, { label: string; color: string }> = {
  PAGADO: { label: 'Pagado', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  PENDIENTE: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  ANULADA: { label: 'Anulada', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
}

interface ModalTicketProps {
  isOpen: boolean
  onClose: () => void
  onImprimir: () => void
  comanda: Comanda | null
  productos: ProductoVenta[]
  total: number
  metodoPago: MetodoPagoType
  estado: EstadoVenta
}

const metodoLabels: Record<MetodoPagoType, string> = {
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  QR: 'QR',
}

export function ModalTicket({
  isOpen,
  onClose,
  onImprimir,
  comanda,
  productos,
  total,
  metodoPago,
  estado,
}: ModalTicketProps) {
  const handleClose = () => {
    onClose()
  }

  return (
    <Modal.Root isOpen={isOpen} onClose={handleClose} size="md">
      <Modal.Header>Ticket de Venta</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div className="flex flex-col items-center text-center py-2">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-3 dark:bg-emerald-900/30">
              <CheckCircle size={28} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-base font-black text-slate-900 dark:text-white">
              Venta confirmada
            </p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mt-1.5 ${estadoLabels[estado].color}`}>
              {estadoLabels[estado].label}
            </span>
          </div>

          <div className="rounded-2xl bg-wine-50/50 p-4 dark:bg-wine-900/10">
            <div className="text-center border-b-2 border-dashed border-wine-200 dark:border-wine-800 pb-3 mb-3">
              <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                RESTOBAR
              </p>
              <p className="text-[10px] font-bold text-wine-900/50 dark:text-wine-400/50">
                Ticket de Venta
              </p>
            </div>

            {comanda && (
              <div className="space-y-1 mb-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-bold text-wine-900/50 dark:text-wine-400/50">Comanda:</span>
                  <span className="font-black text-slate-900 dark:text-white">{comanda.numeroComanda}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-wine-900/50 dark:text-wine-400/50">Mesa:</span>
                  <span className="font-black text-slate-900 dark:text-white">{comanda.mesa}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-wine-900/50 dark:text-wine-400/50">Cliente:</span>
                  <span className="font-black text-slate-900 dark:text-white">{comanda.cliente}</span>
                </div>
              </div>
            )}

            <div className="border-t border-wine-200 dark:border-wine-800 pt-3 space-y-1.5">
              {productos.map((p) => (
                <div key={p.idProducto} className="flex justify-between text-sm">
                  <span className="font-bold text-wine-900/70 dark:text-wine-400/70">
                    {p.nombre} x{p.cantidad}
                  </span>
                  <span className="font-black text-slate-900 dark:text-white">
                    Bs {p.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-dashed border-wine-200 dark:border-wine-800 mt-3 pt-3">
              <div className="flex justify-between text-base">
                <span className="font-black text-slate-900 dark:text-white uppercase">Total</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">Bs {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-bold text-[10px] text-wine-900/50 dark:text-wine-400/50 uppercase">Pago</span>
                <span className="font-black text-[10px] text-wine-900/70 dark:text-wine-400/70 uppercase">{metodoLabels[metodoPago]}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleClose}
          className="rounded-xl font-black uppercase tracking-widest text-[10px]"
        >
          Cerrar
        </Button>
        <Button
          onClick={onImprimir}
          className="rounded-xl bg-wine-600 hover:bg-wine-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-wine-900/20"
        >
          <Printer size={16} className="mr-2" />
          Imprimir Ticket
        </Button>
      </Modal.Footer>
    </Modal.Root>
  )
}
