import type { Comanda } from '@/modules/comercial/models/ventaPresencial.model'

interface ComandaCardProps {
  comanda: Comanda
  isSelected: boolean
  onSelect: () => void
}

const stateColors: Record<string, string> = {
  LISTA: 'border-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/30 dark:border-emerald-600',
  ENTREGADA: 'border-sky-400 bg-sky-50/80 dark:bg-sky-950/30 dark:border-sky-600',
  ABIERTA: 'border-amber-400 bg-amber-50/80 dark:bg-amber-950/30 dark:border-amber-600',
  EN_PREPARACION: 'border-purple-400 bg-purple-50/80 dark:bg-purple-950/30 dark:border-purple-600',
}

const stateBadgeColors: Record<string, string> = {
  LISTA: 'bg-emerald-500 text-white',
  ENTREGADA: 'bg-sky-500 text-white',
  ABIERTA: 'bg-amber-500 text-white',
  EN_PREPARACION: 'bg-purple-500 text-white',
}

const stateLabels: Record<string, string> = {
  LISTA: 'Listo',
  ENTREGADA: 'Entregado',
  ABIERTA: 'Abierta',
  EN_PREPARACION: 'En Prep.',
}

export function ComandaCard({ comanda, isSelected, onSelect }: ComandaCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer
        ${stateColors[comanda.estado] || 'border-wine-100 bg-white dark:bg-white/5'}
        ${isSelected
          ? 'ring-4 ring-wine-500/20 shadow-xl shadow-wine-900/10'
          : 'hover:shadow-lg hover:ring-2 hover:ring-wine-300/30 shadow-md'
        }
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-400/50">
              {comanda.mesa}
            </span>
            {comanda.sucursal && (
              <span className="text-[9px] font-bold text-wine-900/40 dark:text-wine-400/40 bg-wine-100/50 dark:bg-wine-900/20 px-1.5 py-0.5 rounded-md">
                {comanda.sucursal}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${stateBadgeColors[comanda.estado] || 'bg-wine-500 text-white'}`}>
              {stateLabels[comanda.estado] || comanda.estado}
            </span>
          </div>
          <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            {comanda.numeroComanda}
          </p>
          <p className="text-sm font-bold text-wine-900/60 dark:text-wine-400/60 mt-0.5">
            {comanda.cliente}
          </p>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Bs {comanda.subtotal.toFixed(2)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40 mt-0.5">
            {comanda.hora}
          </span>
        </div>
      </div>
    </button>
  )
}
