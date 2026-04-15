import { TableColumn } from '../../../hooks/useTableManager'
import { Button } from '../Button'
import { Input } from '../Input'
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from '../Icons'

interface DataTableViewProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading: boolean
  searchable: boolean
  search: string
  onSearchChange?: (search: string) => void
  sortBy?: string | null
  sortDirection?: 'asc' | 'desc'
  handleSort: (key: string, sortable?: boolean) => void
  renderCell: (item: T, column: TableColumn<T>) => any
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage: string
  className: string
}

export const DataTableView = <T extends Record<string, any>>({
  data,
  columns,
  loading,
  searchable,
  search,
  onSearchChange,
  sortBy,
  sortDirection,
  handleSort,
  renderCell,
  onEdit,
  onDelete,
  emptyMessage,
  className
}: DataTableViewProps<T>) => {
  return (
    <div className={`overflow-hidden rounded-[2rem] glass-card shadow-2xl shadow-wine-900/5 ${className}`}>
      {searchable && (
        <div className="border-b border-wine-100/50 p-4 dark:border-wine-900/20 sm:p-5">
          <div className="relative w-full max-w-sm group">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 group-focus-within:text-wine-600 transition-colors" />
            <Input
              type="text"
              placeholder="Buscar registros..."
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-12 !py-2.5 rounded-xl"
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60 transition-all ${column.sortable ? 'cursor-pointer select-none hover:bg-wine-100/50 dark:hover:bg-wine-900/30' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(String(column.key), column.sortable)}
                >
                  <div className="flex items-center justify-between gap-2 whitespace-nowrap">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col leading-none">
                        <ChevronUpIcon
                          className={`h-3 w-3 ${sortBy === String(column.key) && sortDirection === 'asc' ? 'text-wine-600 opacity-100' : 'text-slate-400 opacity-40'}`}
                        />
                        <ChevronDownIcon
                          className={`h-3 w-3 ${sortBy === String(column.key) && sortDirection === 'desc' ? 'text-wine-600 opacity-100' : 'text-slate-400 opacity-40'}`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-12 text-center text-xs font-bold uppercase tracking-widest text-wine-300 animate-pulse">
                  Cargando información...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{emptyMessage}</span>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 text-sm text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                            className="bg-white/50 dark:bg-black/20"
                          >
                            Editar
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(item)}
                          >
                            Eliminar
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
