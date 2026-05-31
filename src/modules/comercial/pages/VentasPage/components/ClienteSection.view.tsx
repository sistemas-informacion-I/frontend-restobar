import { User, Search, UserX, FileText } from 'lucide-react'
import type { ClienteVenta } from '@/modules/comercial/models/ventaPresencial.model'

interface ClienteSectionProps {
  cliente: ClienteVenta
  nitManual: string
  onNitManualChange: (v: string) => void
  onVentaAnonima: () => void
  onAbrirModalCliente: () => void
}

export function ClienteSection({
  cliente,
  nitManual,
  onNitManualChange,
  onVentaAnonima,
  onAbrirModalCliente,
}: ClienteSectionProps) {
  return (
    <div className="rounded-2xl border-2 border-wine-100/50 bg-white/50 backdrop-blur-sm dark:bg-black/20 dark:border-wine-900/30 shadow-md">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-wine-100/50 dark:border-wine-900/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-600/10 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400">
          <User size={16} />
        </div>
        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Cliente
        </p>
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`h-8 w-8 rounded-xl flex items-center justify-center ${
              cliente.esAnonimo
                ? 'bg-wine-100/50 text-wine-900/40 dark:bg-wine-900/30 dark:text-wine-400/40'
                : 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}>
              <User size={14} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">
                {cliente.nombre}
              </p>
              {cliente.esAnonimo ? (
                <span className="text-[10px] font-bold uppercase tracking-wider text-wine-900/40 dark:text-wine-400/40">
                  Venta anónima
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Cliente asignado
                  </span>
                  {cliente.nit && (
                    <span className="text-[10px] font-bold text-wine-900/40 dark:text-wine-400/40">
                      NIT: {cliente.nit}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onAbrirModalCliente}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-wine-100/50 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-wine-900/60 hover:bg-wine-50 dark:border-wine-900/30 dark:text-wine-400/60 dark:hover:bg-wine-900/20 transition-all cursor-pointer"
          >
            <Search size={13} />
            Buscar cliente
          </button>
          {!cliente.esAnonimo && (
            <button
              type="button"
              onClick={onVentaAnonima}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-rose-200/50 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-rose-600/60 hover:bg-rose-50 dark:border-rose-900/30 dark:text-rose-400/60 dark:hover:bg-rose-900/20 transition-all cursor-pointer"
            >
              <UserX size={13} />
              Anónimo
            </button>
          )}
        </div>

        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-400/50 mb-1.5">
            <FileText size={11} />
            NIT (manual)
          </label>
          <input
            type="text"
            value={nitManual}
            onChange={(e) => onNitManualChange(e.target.value)}
            placeholder="Ingrese NIT"
            className="w-full rounded-xl border-2 border-wine-100/50 bg-slate-50/50 px-3 py-2.5 text-sm font-bold text-slate-900 dark:bg-black/20 dark:text-white dark:border-wine-900/30 focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  )
}
