import { AuditLog } from '../../../models'
import { AuditoriaDetailView } from './AuditoriaDetail.view'

export interface AuditoriaDetailProps {
  log: AuditLog
  onClose: () => void
}

export function AuditoriaDetail(props: AuditoriaDetailProps) {
  const formatJson = (obj: Record<string, unknown> | undefined) => {
    if (!obj) return null
    return JSON.stringify(obj, null, 2)
  }

  return AuditoriaDetailView({ ...props, formatJson })
}
