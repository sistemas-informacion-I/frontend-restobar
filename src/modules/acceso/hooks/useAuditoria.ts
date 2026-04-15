import useSWR from 'swr'
import { AuditPage, AuditFilters } from '../models/auditoria.model'
import { auditoriaService } from '../services/auditoria.service'

export const useAuditoria = (filters: AuditFilters) => {
  const { 
    data: auditPage, 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR<AuditPage>(
    ['/auditoria', filters], 
    () => auditoriaService.getAll(filters)
  )

  return {
    auditPage,
    isLoading,
    loadError,
    refreshAudit: mutate
  }
}
