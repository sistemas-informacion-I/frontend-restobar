import { AuditLog } from '../../../models'
import { AuditoriaTableView } from './AuditoriaTable.view'

export interface AuditoriaTableProps {
  logs: AuditLog[]
  onViewDetails: (log: AuditLog) => void
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function AuditoriaTable(props: AuditoriaTableProps) {
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

  return AuditoriaTableView({ ...props, getOperationBadge })
}
