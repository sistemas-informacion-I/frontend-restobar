import { useState, useCallback, useMemo } from 'react'

export interface TableColumn<T> {
  key: keyof T | string
  title: string
  render?: (item: T, value: any) => React.ReactNode
  sortable?: boolean
  width?: string
}

export interface TableOptions {
  initialPageSize?: number
  searchable?: boolean
  sortable?: boolean
}

export interface UseTableManagerReturn<T> {
  data: T[]
  loading: boolean
  search: string
  setSearch: (search: string) => void
  editingItem: T | null
  showModal: boolean
  setShowModal: (show: boolean) => void
  currentPage: number
  pageSize: number
  totalPages: number
  handleCreate: () => void
  handleEdit: (item: T) => void
  handleDelete: (item: T) => Promise<void>
  handleSave: (item: Partial<T>) => Promise<void>
  goToPage: (page: number) => void
  sortBy: string | null
  sortDirection: 'asc' | 'desc'
  handleSort: (key: string) => void
}

export const useTableManager = <T extends Record<string, any>>(
  initialData: T[],
  options: TableOptions = {}
): UseTableManagerReturn<T> => {
  const {
    initialPageSize = 10,
    searchable = true,
    sortable = true
  } = options

  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<T | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(initialPageSize)
  const [sortBy, setSortBy] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = data

    // Search filtering
    if (searchable && search) {
      filtered = data.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      )
    }

    // Sorting
    if (sortable && sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortBy]
        const bVal = b[sortBy]
        
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [data, search, sortBy, sortDirection, searchable, sortable])

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize)
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return processedData.slice(startIndex, startIndex + pageSize)
  }, [processedData, currentPage, pageSize])

  const handleCreate = useCallback(() => {
    setEditingItem(null)
    setShowModal(true)
  }, [])

  const handleEdit = useCallback((item: T) => {
    setEditingItem(item)
    setShowModal(true)
  }, [])

  const handleDelete = useCallback(async (item: T) => {
    setLoading(true)
    try {
      // Here you would make the API call to delete
      // For now, just remove from local state
      setData(prev => prev.filter(d => d !== item))
    } catch (error) {
      console.error('Error deleting item:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSave = useCallback(async (item: Partial<T>) => {
    setLoading(true)
    try {
      if (editingItem) {
        // Update existing
        setData(prev => 
          prev.map(d => d === editingItem ? { ...d, ...item } : d)
        )
      } else {
        // Create new
        const newItem = { ...item, id: Date.now() }
        setData(prev => [...prev, newItem as unknown as T])
      }
      setShowModal(false)
      setEditingItem(null)
    } catch (error) {
      console.error('Error saving item:', error)
    } finally {
      setLoading(false)
    }
  }, [editingItem])

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }, [totalPages])

  const handleSort = useCallback((key: string) => {
    if (sortBy === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(key)
      setSortDirection('asc')
    }
  }, [sortBy])

  return {
    data: paginatedData,
    loading,
    search,
    setSearch,
    editingItem,
    showModal,
    setShowModal,
    currentPage,
    pageSize,
    totalPages,
    handleCreate,
    handleEdit,
    handleDelete,
    handleSave,
    goToPage,
    sortBy,
    sortDirection,
    handleSort
  }
}