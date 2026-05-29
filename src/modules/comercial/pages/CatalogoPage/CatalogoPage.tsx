import { useState, useMemo, useCallback } from 'react'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useCatalogo } from '../../hooks/useCatalogo'
import { useSucursales } from '@/modules/operaciones/hooks/useSucursales'
import { getErrorMessage } from '@/core/api'
import { CatalogoPageView } from './CatalogoPage.view'
import { CatalogoProducto, CatalogoUpdateRequest } from '../../models/catalogo.model'
import { useCarrito } from '@/modules/electronico/hooks/useCarrito'

export default function CatalogoPage() {
  const { user, hasPermission } = useAuth()
  const { agregarItem, setSucursalId: setCarritoSucursal } = useCarrito()
  const { sucursales } = useSucursales()

  const [search, setSearch] = useState('')
  const [sucursalId, setSucursalId] = useState<number | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState<CatalogoProducto | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [sortBy, setSortBy] = useState<'nombre' | 'precio_asc' | 'precio_desc' | 'recientes'>('nombre')
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [vistaPrevia, setVistaPrevia] = useState(false)

  const canUpdate = hasPermission('catalogo:update')
  const isAdmin = user?.roles?.some(r =>
    r.name === 'ADMIN' || r.name === 'EMPLEADO' || r.name === 'SUPERADMIN'
  ) ?? false

  const { productos, isLoading, isSubmitting, loadError, actualizarProducto } = useCatalogo(
    sucursalId ?? undefined,
    isAdmin
  )

  const showFeedback = useCallback((message: string, type: 'error' | 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    if (type === 'success') {
      setTimeout(() => { setFeedbackMessage(''); setFeedbackType('') }, 5000)
    }
  }, [])

  const handleSucursalChange = useCallback((id: number) => {
    setSucursalId(id)
    setCarritoSucursal(id)
  }, [setCarritoSucursal])

  const handleClearFilters = useCallback(() => {
    setSearch('')
    setSortBy('nombre')
    setOnlyAvailable(false)
  }, [])

  const filteredProductos = useMemo(() => {
    let result = productos

    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchLower) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(searchLower)) ||
          (p.nombreCategoria && p.nombreCategoria.toLowerCase().includes(searchLower))
      )
    }

    if (onlyAvailable) {
      result = result.filter((p) => p.disponible && p.hayStock)
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'precio_asc':
          return a.precio - b.precio
        case 'precio_desc':
          return b.precio - a.precio
        case 'recientes':
          return 0
        case 'nombre':
        default:
          return a.nombre.localeCompare(b.nombre)
      }
    })

    return result
  }, [productos, search, sortBy, onlyAvailable])

  const uniqueCategories = useMemo(() => {
    const cats = new Map<number, string>()
    productos.forEach(p => {
      if (p.idCategoria && p.nombreCategoria) {
        cats.set(p.idCategoria, p.nombreCategoria)
      }
    })
    return Array.from(cats.entries()).map(([id, nombre]) => ({ id, nombre }))
  }, [productos])

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)

  const displayedProductos = useMemo(() => {
    if (selectedCategoryId === null) return filteredProductos
    return filteredProductos.filter(p => p.idCategoria === selectedCategoryId)
  }, [filteredProductos, selectedCategoryId])

  const handleEdit = (producto: CatalogoProducto) => {
    setSelectedProducto(producto)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleAgregarCarrito = useCallback(async (producto: CatalogoProducto, sourceEl?: HTMLElement) => {
    await agregarItem({
      idProductoFinal: producto.idProductoFinal,
      cantidad: 1,
    }, sourceEl)
  }, [agregarItem])

  const onSubmit = async (data: CatalogoUpdateRequest) => {
    if (!selectedProducto) return
    setFeedbackMessage('')
    setFeedbackType('')
    try {
      await actualizarProducto(selectedProducto.idProductoFinal, data)
      showFeedback('Producto actualizado correctamente', 'success')
      setIsFormModalOpen(false)
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Actualizar producto'), 'error')
    }
  }

  return (
    <CatalogoPageView
      productos={displayedProductos}
      total={displayedProductos.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitting}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (loadError ? getErrorMessage(loadError) : '')}
      feedbackType={feedbackType || (loadError ? 'error' : '')}
      canUpdate={canUpdate}
      isAdmin={isAdmin}
      vistaPrevia={vistaPrevia}
      onVistaPreviaChange={setVistaPrevia}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      selectedProducto={selectedProducto}
      onEdit={handleEdit}
      onAgregarCarrito={handleAgregarCarrito}
      onSubmit={onSubmit}
      sucursales={sucursales ?? []}
      sucursalId={sucursalId}
      onSucursalChange={handleSucursalChange}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      sortBy={sortBy}
      onSortByChange={setSortBy}
      onlyAvailable={onlyAvailable}
      onOnlyAvailableChange={setOnlyAvailable}
      onClearFilters={handleClearFilters}
      categories={uniqueCategories}
      selectedCategoryId={selectedCategoryId}
      onSelectedCategoryChange={setSelectedCategoryId}
    />
  )
}
