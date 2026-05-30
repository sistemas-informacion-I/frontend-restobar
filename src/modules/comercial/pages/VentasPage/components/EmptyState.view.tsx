import { ClipboardList, ArrowLeft } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px]">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="h-20 w-20 rounded-[2rem] bg-wine-100/50 flex items-center justify-center mb-6 dark:bg-wine-900/20">
          <ClipboardList size={40} className="text-wine-900/30 dark:text-wine-400/30" />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          Ninguna comanda seleccionada
        </h3>
        <p className="text-sm font-bold text-wine-900/50 dark:text-wine-400/50 mb-6">
          Selecciona una comanda del panel izquierdo para gestionar la venta
        </p>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-wine-900/30 dark:text-wine-400/30">
          <ArrowLeft size={14} />
          <span>Selecciona una comanda</span>
        </div>
      </div>
    </div>
  )
}
