import { Eye, Clock, Database, User } from 'lucide-react'
import { AuditLog } from '../../services/api'
import { Button } from '@/shared/components/ui/Button'

interface AuditoriaTableProps {
  logs: AuditLog[]
  onViewDetails: (log: AuditLog) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

const getOperationBadge = (operacion: string) => {
  switch (operacion?.toUpperCase()) {
    case 'INSERT':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
    case 'UPDATE':
      return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
    case 'DELETE':
      return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
    case 'EJECUTAR':
      return 'bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20'
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
  }
}

export function AuditoriaTable({ logs, onViewDetails, page, totalPages, onPageChange }: AuditoriaTableProps) {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 py-12 dark:border-slate-700 dark:bg-slate-800/50">
        <div className="rounded-full bg-slate-100 p-3 dark:bg-slate-800">
          <Database size={24} className="text-slate-400" />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-slate-100">No hay registros</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          No se encontraron registros de auditoría con los filtros actuales.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-medium">Fecha</th>
              <th className="px-6 py-4 font-medium">Tabla / ID</th>
              <th className="px-6 py-4 font-medium">Operación</th>
              <th className="px-6 py-4 font-medium">Usuario</th>
              <th className="px-6 py-4 font-medium">IP Origen</th>
              <th className="px-6 py-4 text-right font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {logs.map((log) => (
              <tr key={log.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-slate-400" />
                    <span>{new Date(log.fechaOperacion).toLocaleString('es-ES')}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{log.tabla}</span>
                    <span className="text-xs text-slate-500">ID: {log.idRegistro || 'N/A'}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getOperationBadge(log.operacion)}`}>
                    {log.operacion}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-slate-400" />
                    <span>{log.username || log.idUsuario || 'Sistema'}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {log.ipOrigen || '-'}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(log)}
                    icon={<Eye size={16} />}
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
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 dark:border-slate-800">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Página <span className="font-medium text-slate-900 dark:text-slate-100">{page + 1}</span> de <span className="font-medium text-slate-900 dark:text-slate-100">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
            >
              Anterior
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
