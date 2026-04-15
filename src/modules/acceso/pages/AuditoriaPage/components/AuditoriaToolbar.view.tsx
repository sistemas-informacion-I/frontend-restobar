import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { AuditoriaToolbarProps } from './AuditoriaToolbar'

interface AuditoriaToolbarViewProps extends AuditoriaToolbarProps {
  showFilters: boolean
  toggleFilters: () => void
  handleClear: () => void
  hasActiveFilters: boolean | string | undefined
}

export function AuditoriaToolbarView({ 
  filters, 
  onFilterChange, 
  showFilters, 
  toggleFilters, 
  handleClear, 
  hasActiveFilters 
}: AuditoriaToolbarViewProps) {
  return (
    <div className="flex flex-col gap-4 glass-card rounded-2xl p-5 shadow-xl shadow-wine-900/5 overflow-hidden transition-all duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-wine-500 to-wine-900" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Registro Maestro</h2>
          {hasActiveFilters && (
            <span className="flex items-center gap-1.5 rounded-full bg-wine-100/80 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-wine-700 dark:bg-wine-900/40 dark:text-wine-300 backdrop-blur-sm border border-wine-200/50 dark:border-wine-800/20 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-wine-600 animate-ping" />
              Filtros activos
            </span>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={showFilters ? "primary" : "secondary"}
            onClick={toggleFilters}
            icon={<Filter size={18} />}
            className="hover-lift"
          >
            Filtros Avanzados
          </Button>
          {(hasActiveFilters || showFilters) && (
            <Button
              variant="ghost"
              onClick={handleClear}
              icon={<X size={18} />}
              className="text-slate-500 hover:text-wine-600 dark:text-slate-400 dark:hover:text-wine-400 hover:bg-wine-50 dark:hover:bg-wine-900/20"
            >
              Limpiar
            </Button>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-5 animate-in fade-in zoom-in-95 duration-300">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">Tabla</label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-wine-500 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Ej: usuarios..."
                value={filters.tabla || ''}
                onChange={(e) => onFilterChange({ tabla: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm transition-all focus:border-wine-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/30 dark:text-white dark:focus:border-wine-700 dark:focus:bg-black/50"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">Operación</label>
            <select
              value={filters.operacion || ''}
              onChange={(e) => onFilterChange({ operacion: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-wine-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/30 dark:text-white dark:focus:border-wine-700 dark:focus:bg-black/50 appearance-none pointer-events-auto"
            >
              <option value="" className="bg-white dark:bg-wine-950">Todas</option>
              <option value="INSERT" className="bg-white dark:bg-wine-950">INSERT</option>
              <option value="UPDATE" className="bg-white dark:bg-wine-950">UPDATE</option>
              <option value="DELETE" className="bg-white dark:bg-wine-950">DELETE</option>
              <option value="EJECUTAR" className="bg-white dark:bg-wine-950">EJECUTAR</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">ID Usuario</label>
            <input
              type="number"
              placeholder="0..."
              value={filters.idUsuario || ''}
              onChange={(e) => onFilterChange({ idUsuario: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-wine-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/30 dark:text-white dark:focus:border-wine-700 dark:focus:bg-black/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">Desde</label>
            <input
              type="datetime-local"
              value={filters.desde || ''}
              onChange={(e) => onFilterChange({ desde: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-wine-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/30 dark:text-white dark:focus:border-wine-700 dark:focus:bg-black/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 px-1">Hasta</label>
            <input
              type="datetime-local"
              value={filters.hasta || ''}
              onChange={(e) => onFilterChange({ hasta: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-wine-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/30 dark:text-white dark:focus:border-wine-700 dark:focus:bg-black/50"
            />
          </div>
        </div>
      )}
    </div>
  )
}
