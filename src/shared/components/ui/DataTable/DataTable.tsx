import { TableColumn } from '../../../hooks/useTableManager'
import { Button } from '../Button'
import { Input } from '../Input'
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from '../Icons'

interface DataTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  searchable?: boolean
  search?: string
  onSearchChange?: (search: string) => void
  sortBy?: string | null
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  emptyMessage?: string
  className?: string
}

export const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  searchable = true,
  search = '',
  onSearchChange,
  sortBy,
  sortDirection,
  onSort,
  onEdit,
  onDelete,
  emptyMessage = 'No data available',
  className = ''
}: DataTableProps<T>) => {
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key)
    }
  }

  const renderCell = (item: T, column: TableColumn<T>) => {
    const value = typeof column.key === 'string' 
      ? item[column.key] 
      : column.key in item 
        ? item[column.key as keyof T]
        : ''
    
    if (column.render) {
      return column.render(item, value)
    }
    
    return value?.toString() || ''
  }

  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      {searchable && (
        <div className="border-b border-slate-200 p-3 dark:border-slate-700 sm:p-4">
          <div className="relative w-full max-w-xs">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-slate-100 dark:bg-slate-800/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:border-slate-700 dark:text-slate-200 ${column.sortable ? 'cursor-pointer select-none hover:bg-slate-200/60 dark:hover:bg-slate-700/50' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(String(column.key), column.sortable)}
                >
                  <div className="flex items-center justify-between gap-2 whitespace-nowrap">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col leading-none">
                        <ChevronUpIcon
                          className={`h-3 w-3 ${sortBy === String(column.key) && sortDirection === 'asc' ? 'text-indigo-500 opacity-100' : 'text-slate-400 opacity-60'}`}
                        />
                        <ChevronDownIcon
                          className={`h-3 w-3 ${sortBy === String(column.key) && sortDirection === 'desc' ? 'text-indigo-500 opacity-100' : 'text-slate-400 opacity-60'}`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:border-slate-700 dark:text-slate-200">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-sm italic text-slate-500 dark:text-slate-400">
                  <div className="inline-flex items-center gap-2">Loading...</div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-sm italic text-slate-500 dark:text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id || index} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="border-b border-slate-200 px-3 py-3 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-200">
                      {renderCell(item, column)}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="border-b border-slate-200 px-3 py-3 text-sm dark:border-slate-700">
                      <div className="flex gap-2">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(item)}
                          >
                            Edit
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onDelete(item)}
                          >
                            Delete
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