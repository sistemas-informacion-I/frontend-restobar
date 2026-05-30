import { DollarSign, Percent, Receipt, Gift, Banknote } from 'lucide-react'

interface ResumenFinancieroProps {
  subtotal: number
  descuento: number
  impuesto: number
  propina: number
  total: number
}

export function ResumenFinanciero({
  subtotal,
  descuento,
  impuesto,
  propina,
  total,
}: ResumenFinancieroProps) {
  const rows = [
    { label: 'Subtotal', value: subtotal, icon: Receipt, color: 'text-slate-900 dark:text-white' },
    { label: 'Descuento', value: -descuento, icon: Gift, color: 'text-rose-600 dark:text-rose-400' },
    { label: 'Impuesto (18%)', value: impuesto, icon: Percent, color: 'text-slate-900 dark:text-white' },
    { label: 'Propina', value: propina, icon: DollarSign, color: 'text-emerald-600 dark:text-emerald-400' },
  ]

  return (
    <div className="rounded-2xl border-2 border-wine-100/50 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-wine-900/30 shadow-md">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-wine-100/50 dark:border-wine-900/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
          <Banknote size={16} />
        </div>
        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Resumen Financiero
        </p>
      </div>

      <div className="px-5 py-3 space-y-2.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <row.icon size={12} className="text-wine-900/30 dark:text-wine-400/30" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-wine-900/50 dark:text-wine-400/50">
                {row.label}
              </span>
            </div>
            <span className={`text-sm font-black ${row.color}`}>
              {row.value >= 0 ? 'Bs ' : '-Bs '}{Math.abs(row.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="mx-5 my-2 h-px bg-gradient-to-r from-wine-200/50 via-wine-400/30 to-wine-200/50 dark:from-wine-900/30 dark:via-wine-700/30 dark:to-wine-900/30" />

      <div className="px-5 py-4 flex items-center justify-between">
        <span className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
          Total
        </span>
        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Bs {total.toFixed(2)}
        </span>
      </div>
    </div>
  )
}
