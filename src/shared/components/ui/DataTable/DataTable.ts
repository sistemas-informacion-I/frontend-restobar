import { TableColumn } from '../../../hooks/useTableManager'
import { DataTableView } from './DataTable.view'

export interface DataTableProps<T> {
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

  return DataTableView({
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
  })
}
