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

  const filteredProductos = useMemo(() => {
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(search.toLowerCase()) ||
        (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase())) ||
        (p.nombreCategoria && p.nombreCategoria.toLowerCase().includes(search.toLowerCase()))
    )
  }, [productos, search])

  const handleEdit = (producto: CatalogoProducto) => {
    setSelectedProducto(producto)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleAgregarCarrito = useCallback(async (producto: CatalogoProducto) => {
    await agregarItem({
      idProductoFinal: producto.idProductoFinal,
      cantidad: 1,
    })
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
      productos={filteredProductos}
      total={productos.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitting}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (loadError ? getErrorMessage(loadError) : '')}
      feedbackType={feedbackType || (loadError ? 'error' : '')}
      canUpdate={canUpdate}
      isAdmin={isAdmin}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      selectedProducto={selectedProducto}
      onEdit={handleEdit}
      onAgregarCarrito={handleAgregarCarrito}
      onSubmit={onSubmit}
      sucursales={sucursales ?? []}
      sucursalId={sucursalId}
      onSucursalChange={handleSucursalChange}
    />
  )
}
