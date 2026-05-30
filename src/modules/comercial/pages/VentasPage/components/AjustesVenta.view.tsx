import { Percent, DollarSign, SlidersHorizontal } from 'lucide-react'

interface AjustesVentaProps {
  subtotal: number
  descuentoPorcentual: number
  descuentoFijo: number
  propinaPorcentual: number
  propinaFija: number
  onDescuentoPorcentualChange: (v: number) => void
  onDescuentoFijoChange: (v: number) => void
  onPropinaPorcentualChange: (v: number) => void
  onPropinaFijaChange: (v: number) => void
  onPropinaQuick: (porcentaje: number) => void
}

export function AjustesVenta({
  subtotal,
  descuentoPorcentual,
  descuentoFijo,
  propinaPorcentual,
  propinaFija,
  onDescuentoPorcentualChange,
  onDescuentoFijoChange,
  onPropinaPorcentualChange,
  onPropinaFijaChange,
  onPropinaQuick,
}: AjustesVentaProps) {
  const descError = descuentoFijo > subtotal
  const negError = descuentoPorcentual < 0 || descuentoFijo < 0 || propinaPorcentual < 0 || propinaFija < 0

  return (
    <div className="rounded-2xl border-2 border-wine-100/50 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-wine-900/30 shadow-md">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-wine-100/50 dark:border-wine-900/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600/10 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
          <SlidersHorizontal size={16} />
        </div>
        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Ajustes de Venta
        </p>
      </div>

      {negError && (
        <div className="mx-5 mt-3 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2 dark:border-rose-900/30 dark:bg-rose-900/10">
          <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
            Los valores negativos no están permitidos
          </p>
        </div>
      )}

      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-400/50 mb-1.5">
              <Percent size={11} />
              Descuento %
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                step={0.5}
                value={descuentoPorcentual}
                onChange={(e) => onDescuentoPorcentualChange(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-wine-100/50 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-900 dark:bg-black/20 dark:text-white dark:border-wine-900/30 focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-wine-900/40 dark:text-wine-400/40">
                %
              </span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-400/50 mb-1.5">
              <DollarSign size={11} />
              Descuento Fijo
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={descuentoFijo}
              onChange={(e) => onDescuentoFijoChange(Number(e.target.value))}
              className={`w-full rounded-xl border-2 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-900 dark:bg-black/20 dark:text-white outline-none transition-all ${
                descError
                  ? 'border-rose-500/50 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                  : 'border-wine-100/50 dark:border-wine-900/30 focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10'
              }`}
              placeholder="0.00"
            />
            {descError && (
              <p className="mt-1 text-[10px] font-bold text-rose-500">
                Supera el subtotal
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-wine-100/50 dark:bg-wine-900/30" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-400/50 mb-1.5">
              <Percent size={11} />
              Propina %
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                step={0.5}
                value={propinaPorcentual}
                onChange={(e) => onPropinaPorcentualChange(Number(e.target.value))}
                className="w-full rounded-xl border-2 border-wine-100/50 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-900 dark:bg-black/20 dark:text-white dark:border-wine-900/30 focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all"
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-wine-900/40 dark:text-wine-400/40">
                %
              </span>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-400/50 mb-1.5">
              <DollarSign size={11} />
              Propina Fija
            </label>
            <input
              type="number"
              min={0}
              step={0.5}
              value={propinaFija}
              onChange={(e) => onPropinaFijaChange(Number(e.target.value))}
              className="w-full rounded-xl border-2 border-wine-100/50 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-900 dark:bg-black/20 dark:text-white dark:border-wine-900/30 focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-400/50">
            Propina rápida:
          </span>
          {[
            { label: '+5%', value: 5 },
            { label: '+10%', value: 10 },
          ].map((btn) => (
            <button
              key={btn.value}
              type="button"
              onClick={() => onPropinaQuick(btn.value)}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                propinaPorcentual === btn.value && propinaFija === 0
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'
                  : 'bg-wine-100/50 text-wine-900/60 hover:bg-wine-200/50 dark:bg-wine-900/30 dark:text-wine-400/60 dark:hover:bg-wine-800/30'
              }`}
            >
              {btn.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onPropinaQuick(0)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              propinaPorcentual === 0 && propinaFija === 0
                ? 'bg-slate-500 text-white shadow-lg shadow-slate-900/20'
                : 'bg-wine-100/50 text-wine-900/60 hover:bg-wine-200/50 dark:bg-wine-900/30 dark:text-wine-400/60 dark:hover:bg-wine-800/30'
            }`}
          >
            Sin propina
          </button>
        </div>
      </div>
    </div>
  )
}
