import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { AuditLog, AuditFilters, auditoriaService, getErrorMessage, AuditPage } from '../../services/api'
import { AuditoriaPageView } from './AuditoriaPage.view'

export function AuditoriaPage() {
  const { canRead } = useAuth()
  const [data, setData] = useState<AuditPage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // State for filtering and pagination
  const [filters, setFilters] = useState<AuditFilters>({
    page: 0,
    size: 20,
  })

  // State for detail modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)

  const fetchLogs = useCallback(async () => {
    if (!canRead('audit')) {
      setError('No tienes permisos para ver el registro de auditoría.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')
    try {
      const response = await auditoriaService.getAll(filters)
      setData(response)
    } catch (err) {
      setError(getErrorMessage(err, 'cargar registros de auditoría'))
    } finally {
      setIsLoading(false)
    }
  }, [filters, canRead])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

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
    canRead,
    error,
    isLoading,
    filters,
    handleFilterChange,
    handleClearFilters,
    data,
    handlePageChange,
    selectedLog,
    setSelectedLog
  })
}
