import { ArrowDownLeft, ArrowUpRight, Inbox } from 'lucide-react'
import { MovimientoCajaResponse, ConceptoMovimiento } from '../../../services/caja.service'

interface MovimientosTableProps {
  movimientos: MovimientoCajaResponse[]
}

const bs = (n: number) => `Bs ${(n ?? 0).toFixed(2)}`

const CONCEPTO_LABEL: Record<ConceptoMovimiento, string> = {
  VENTA: 'Venta',
  COMPRA: 'Compra',
  NOTA_SALIDA: 'Nota de salida',
  INGRESO_EXTRA: 'Ingreso extra',
  RETIRO: 'Retiro',
  AJUSTE: 'Ajuste',
}

function formatFecha(fecha: string) {
  const d = new Date(fecha)
  if (Number.isNaN(d.getTime())) return fecha
  return d.toLocaleString('es-BO', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MovimientosTable({ movimientos }: MovimientosTableProps) {
  if (!movimientos.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-14 dark:border-wine-900/20 dark:bg-black/10">
        <Inbox size={40} className="text-wine-900/20 dark:text-wine-300/20" />
        <p className="text-xs font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
          Sin movimientos registrados
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-wine-100/60 bg-white/60 shadow-sm dark:border-wine-900/20 dark:bg-black/20">
      <table className="w-full">
        <thead>
          <tr className="border-b border-wine-100/60 bg-wine-50/40 text-left dark:border-wine-900/20 dark:bg-black/30">
            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Tipo</th>
            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Concepto</th>
            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Descripción</th>
            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Empleado</th>
            <th className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Fecha</th>
            <th className="px-5 py-3 text-right text-[10px] font-black uppercase tracking-widest text-wine-900/50 dark:text-wine-300/50">Monto</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.map((m) => {
            const isIngreso = m.tipo === 'INGRESO'
            return (
              <tr
                key={m.idMovimiento}
                className="border-b border-wine-50/60 last:border-0 hover:bg-wine-50/30 dark:border-wine-900/10 dark:hover:bg-white/5"
              >
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                      isIngreso
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                    }`}
                  >
                    {isIngreso ? <ArrowUpRight size={13} /> : <ArrowDownLeft size={13} />}
                    {m.tipo}
                  </span>
                </td>
                <td className="px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                  {CONCEPTO_LABEL[m.concepto] ?? m.concepto}
                </td>
                <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">
                  {m.descripcion || '—'}
                </td>
                <td className="px-5 py-3 text-sm text-slate-500 dark:text-slate-400">
                  {m.nombreEmpleado || '—'}
                </td>
                <td className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {formatFecha(m.fecha)}
                </td>
                <td
                  className={`px-5 py-3 text-right text-sm font-black ${
                    isIngreso ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {isIngreso ? '+' : '-'} {bs(m.monto)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
