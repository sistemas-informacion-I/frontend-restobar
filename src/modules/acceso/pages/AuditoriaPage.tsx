import { useState, useCallback, useEffect } from 'react'
import { Layout } from '@/shared/components/layout'
import { useAuth } from '../context/AuthContext'
import { AuditLog, AuditFilters, auditoriaService, getErrorMessage, AuditPage } from '../services/api'
import { AuditoriaTable, AuditoriaToolbar, AuditoriaDetail } from '../components/auditoria'
import { Loader2 } from 'lucide-react'

export default function AuditoriaPage() {
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

  if (!canRead('audit')) {
    return (
      <Layout>
        <div className="flex h-[50vh] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="rounded-full bg-rose-100 p-3 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Acceso Denegado</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Auditoría</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Rastrea todas las acciones y eventos del sistema en tiempo real.
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        <AuditoriaToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50 backdrop-blur-sm dark:bg-slate-900/50">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Cargando registros...</span>
              </div>
            </div>
          )}

          <div className={`${isLoading ? 'opacity-50' : 'opacity-100'} transition-opacity duration-200`}>
            <AuditoriaTable
              logs={data?.content || []}
              page={data?.number || 0}
              totalPages={data?.totalPages || 0}
              onPageChange={handlePageChange}
              onViewDetails={setSelectedLog}
            />
          </div>
        </div>

        {selectedLog && (
          <AuditoriaDetail
            log={selectedLog}
            onClose={() => setSelectedLog(null)}
          />
        )}
      </div>
    </Layout>
  )
}
