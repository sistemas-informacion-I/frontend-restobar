import { CheckCircle, XCircle, Printer, Eye } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'

interface AccionesVentaProps {
  onConfirmar: () => void
  onCancelar: () => void
  isConfirming: boolean
}

export function AccionesVenta({ onConfirmar, onCancelar, isConfirming }: AccionesVentaProps) {
  return (
    <div className="flex items-center gap-3 pt-2 pb-6">
      <Button
        onClick={onConfirmar}
        isLoading={isConfirming}
        className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest text-[11px] shadow-xl shadow-emerald-900/20 active:scale-95 transition-all"
      >
        <CheckCircle size={18} className="mr-2" />
        Confirmar Venta
      </Button>

      <Button
        onClick={onCancelar}
        variant="secondary"
        className="h-12 rounded-2xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 font-black uppercase tracking-widest text-[11px] active:scale-95 transition-all dark:border-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/10"
      >
        <XCircle size={18} className="mr-2" />
        Cancelar
      </Button>

      <Button
        variant="ghost"
        className="h-12 rounded-2xl text-wine-900/50 hover:bg-wine-50 font-bold uppercase tracking-widest text-[10px] dark:text-wine-400/50 dark:hover:bg-wine-900/10 active:scale-95 transition-all"
        title="Vista previa ticket"
      >
        <Eye size={18} />
      </Button>

      <Button
        variant="ghost"
        className="h-12 rounded-2xl text-wine-900/50 hover:bg-wine-50 font-bold uppercase tracking-widest text-[10px] dark:text-wine-400/50 dark:hover:bg-wine-900/10 active:scale-95 transition-all"
        title="Imprimir ticket"
      >
        <Printer size={18} />
      </Button>
    </div>
  )
}
