import { History } from 'lucide-react'
import { CajaResponse } from '../../../services/caja.service'

interface HistorialTableProps {
  cajas: CajaResponse[]
  isLoading: boolean
}

const bs = (n?: number) => `Bs ${(n ?? 0).toFixed(2)}`

function formatFecha(fecha?: string) {
  if (!fecha) return '—'
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return fecha
  return d.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function HistorialTable({ cajas, isLoading }: HistorialTableProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-2 px-1">
        <History size={18} className="text-wine-600 dark:text-wine-400" />
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
          Historial de cajas
        </h2>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
        </div>
      ) : !cajas.length ? (
        <div className="rounded-[2rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-10 text-center text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:border-wine-900/20 dark:bg-black/10 dark:text-wine-300/40">
          Sin cajas en el historial
        </div>
      ) : (
        <div className="overflow-hidden rounded-[2rem] border border-wine-100/60 bg-white/60 shadow-sm dark:border-wine-900/20 dark:bg-black/20">
          <table className="w-full">
            <thead>
              <tr className="border-b border-wine-100/60 bg-wine-50/40 text-left dark:border-wine-900/20 dark:bg-black/30">
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">#</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Sucursal</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Estado</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Apertura</th>
                <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Cierre</th>
                <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Saldo esp.</th>
                <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Diferencia</th>
              </tr>
            </thead>
            <tbody>
              {cajas.map((c) => {
                const diff = c.diferencia
                return (
                  <tr
                    key={c.idCaja}
                    className="border-b border-wine-50/60 last:border-0 hover:bg-wine-50/30 dark:border-wine-900/10 dark:hover:bg-white/5"
                  >
                    <td className="px-5 py-3 text-sm font-black text-slate-400">#{c.idCaja}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">{c.nombreSucursal}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                          c.estado === 'ABIERTA'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400'
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{formatFecha(c.fechaApertura)}</td>
                    <td className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{formatFecha(c.fechaCierre)}</td>
                    <td className="px-5 py-3 text-right text-sm font-black text-slate-700 dark:text-slate-200">{bs(c.saldoEsperado)}</td>
                    <td className="px-5 py-3 text-right text-sm font-black">
                      {c.estado === 'CERRADA' && diff !== undefined && diff !== null ? (
                        <span
                          className={
                            diff === 0
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : diff > 0
                                ? 'text-sky-600 dark:text-sky-400'
                                : 'text-rose-600 dark:text-rose-400'
                          }
                        >
                          {diff > 0 ? '+' : diff < 0 ? '-' : ''} {bs(Math.abs(diff))}
                        </span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
