import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { AuditFilters } from '../../services/api'
import { useState } from 'react'

interface AuditoriaToolbarProps {
  filters: AuditFilters
  onFilterChange: (filters: Partial<AuditFilters>) => void
  onClearFilters: () => void
}

export function AuditoriaToolbar({ filters, onFilterChange, onClearFilters }: AuditoriaToolbarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const hasActiveFilters = filters.tabla || filters.operacion || filters.idUsuario || filters.desde || filters.hasta

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Registros de Auditoría</h2>
          {hasActiveFilters && (
            <span className="flex h-5 items-center justify-center rounded-full bg-blue-100 px-2 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              Filtros activos
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showFilters ? "primary" : "secondary"}
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter size={18} />}
          >
            Filtros
          </Button>
          {(hasActiveFilters || showFilters) && (
            <Button
              variant="ghost"
              onClick={() => {
                onClearFilters()
                setShowFilters(false)
              }}
              icon={<X size={18} />}
              className="text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-5 animate-in slide-in-from-top-2">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Tabla</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Buscar tabla..."
                value={filters.tabla || ''}
                onChange={(e) => onFilterChange({ tabla: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-800"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Operación</label>
            <select
              value={filters.operacion || ''}
              onChange={(e) => onFilterChange({ operacion: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-800"
            >
              <option value="">Todas</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="EJECUTAR">EJECUTAR</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">ID Usuario</label>
            <input
              type="number"
              placeholder="ID..."
              value={filters.idUsuario || ''}
              onChange={(e) => onFilterChange({ idUsuario: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Desde</label>
            <input
              type="datetime-local"
              value={filters.desde || ''}
              onChange={(e) => onFilterChange({ desde: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Hasta</label>
            <input
              type="datetime-local"
              value={filters.hasta || ''}
              onChange={(e) => onFilterChange({ hasta: e.target.value })}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:focus:border-blue-500 dark:focus:bg-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  )
}
