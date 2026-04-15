import { Layout } from '@/shared/components/layout/Layout'
import { AuditoriaTable, AuditoriaToolbar, AuditoriaDetail } from './components'

interface AuditoriaPageViewProps {
  canRead: (p: string) => boolean
  error: string
  isLoading: boolean
  filters: any
  handleFilterChange: (f: any) => void
  handleClearFilters: () => void
  data: any
  handlePageChange: (p: number) => void
  selectedLog: any
  setSelectedLog: (l: any) => void
}

export function AuditoriaPageView({
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
}: AuditoriaPageViewProps) {
  if (!canRead('audit')) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/10 py-16 dark:border-wine-900/20 dark:bg-black/20">
          <div className="rounded-2xl bg-rose-500/10 p-4 text-rose-600 shadow-lg shadow-rose-900/10 mb-6">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Acceso Bloqueado</h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            No posees el nivel de seguridad requerido para esta sección.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Auditoría del Sistema</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">
            Monitorización continua de operaciones y flujo de datos
          </p>
        </div>

        {error && (
          <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-4 text-xs font-bold uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-lg shadow-rose-900/5">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-rose-500" />
              {error}
            </div>
          </div>
        )}

        <AuditoriaToolbar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <div className="relative min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center rounded-[2.5rem] bg-white/30 backdrop-blur-md dark:bg-black/30">
              <div className="flex flex-col items-center gap-3">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-wine-200 border-t-wine-600 dark:border-wine-900/20 dark:border-t-wine-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-wine-900 dark:text-wine-300">Rastreando logs...</span>
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
