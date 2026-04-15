import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { AuditLog, AuditFilters } from '../../models'
import { useAuditoria } from '../../hooks/useAuditoria'
import { getErrorMessage } from '../../services/api'
import { AuditoriaPageView } from './AuditoriaPage.view'

export function AuditoriaPage() {
  const { canRead } = useAuth()
  
  // State for filtering and pagination (initial state)
  const [filters, setFilters] = useState<AuditFilters>({
    page: 0,
    size: 20,
  })

  // Hook for data fetching
  const { 
    auditPage, 
    isLoading, 
    loadError 
  } = useAuditoria(filters)

  // State for detail modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const handleFilterChange = (newFilters: Partial<AuditFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      // Reset to page 0 if filters change (other than page itself)
      ...(!('page' in newFilters) ? { page: 0 } : {})
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      page: 0,
      size: 20
    })
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }


  return AuditoriaPageView({
    canRead: (p: string) => canRead(p as any),
    error: loadError ? getErrorMessage(loadError, 'cargar registros de auditoría') : '',
    isLoading,
    filters,
    handleFilterChange,
    handleClearFilters,
    data: auditPage,
    handlePageChange,
    selectedLog,
    setSelectedLog
  })
}

