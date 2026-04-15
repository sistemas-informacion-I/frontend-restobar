import { Clock, Database } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { AuditoriaTableProps } from './AuditoriaTable'

interface AuditoriaTableViewProps extends AuditoriaTableProps {
  getOperationBadge: (operacion: string) => string
}

export function AuditoriaTableView({ 
  logs, 
  onViewDetails, 
  page, 
  totalPages, 
  onPageChange,
  getOperationBadge 
}: AuditoriaTableViewProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-16 dark:border-wine-900/20 dark:bg-black/20">
        <div className="rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 p-4 text-white shadow-lg shadow-wine-900/20 mb-6">
          <Database size={32} />
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Sin registros de actividad</h3>
        <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          La matriz de auditoría está vacía para el criterio de búsqueda.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full border-collapse">
          <thead>
            <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Marca Temporal</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Entidad / ID</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Operación</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Responsable</th>
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Seguridad (IP)</th>
              <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
            {logs.map((log) => (
              <tr key={log.idLog} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400 group-hover:scale-110 transition-transform">
                      <Clock size={16} />
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-tighter">
                      {new Date(log.fechaOperacion).toLocaleString('es-ES', { 
                        day: '2-digit', month: '2-digit', year: 'numeric', 
                        hour: '2-digit', minute: '2-digit', second: '2-digit' 
                      })}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-800 dark:text-wine-200">{log.tabla}</span>
                    <span className="text-[10px] font-medium text-slate-400 font-mono tracking-tighter">REF# {log.idRegistro || '---'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center rounded-lg border-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest ${getOperationBadge(log.operacion).replace('bg-opacity-10', 'bg-opacity-5')}`}>
                    {log.operacion}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wine-600 to-wine-900 text-[10px] font-black text-white shadow-lg shadow-wine-900/20">
                      {(log.username || 'S').charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight">{log.username || 'Sistema'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 bg-slate-100 dark:bg-black/20 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-wine-900/10">
                    {log.ipOrigen || 'LOCAL'}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(log)}
                    className="bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30 font-black text-[10px] uppercase tracking-widest px-4 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Detalles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-wine-100/50 px-8 py-6 bg-wine-50/20 dark:bg-black/20 backdrop-blur-md">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Vista <span className="text-wine-900 dark:text-wine-300 font-black">{page + 1}</span> de <span className="text-wine-900 dark:text-wine-300 font-black">{totalPages}</span>
          </span>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="bg-white/50 dark:bg-black/20 font-black text-[10px] uppercase tracking-widest px-5 hover:!bg-wine-50"
            >
              Previo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="bg-white/50 dark:bg-black/20 font-black text-[10px] uppercase tracking-widest px-5 hover:!bg-wine-50"
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
