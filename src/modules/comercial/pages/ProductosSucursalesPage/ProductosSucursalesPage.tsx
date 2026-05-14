import { useState, useMemo, useCallback } from 'react'
import { useProductosSucursales } from '../../hooks/useProductosSucursales'
import { useProductosFinales } from '../../hooks/useProductosFinales'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { ProductosSucursalesPageView } from './ProductosSucursalesPage.view'

export default function ProductosSucursalesPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isAdmin = user?.tipoUsuario === 'E' || user?.tipoUsuario === 'S'
  const sucursalId = user?.sucursalId || 1

  const { productosSucursal, loading: isLoading, error, asignarProducto } = useProductosSucursales(sucursalId)
  const { productos: productosFinales, loading: productosLoading } = useProductosFinales({ activo: true })

  const showFeedback = useCallback((message: string, type: 'error' | 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)
    if (type === 'success') {
      setTimeout(() => {
        setFeedbackMessage('')
        setFeedbackType('')
      }, 5000)
    }
  }, [])

  const filteredProductos = useMemo(() => {
    return productosSucursal.filter(
      (ps) =>
        ps.codigoProducto.toLowerCase().includes(search.toLowerCase()) ||
        ps.nombreProducto.toLowerCase().includes(search.toLowerCase())
    )
  }, [productosSucursal, search])

  const productosDisponibles = productosFinales.filter(
    (pf) => !productosSucursal.some((ps) => ps.idProductoFinal === pf.idProductoFinal)
  )

  const handleCreate = () => {
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleAssign = async (idProducto: number, precio: number, disponible: boolean) => {
    setIsSubmitting(true)
    try {
      await asignarProducto(idProducto, sucursalId, { precio, disponible })
      showFeedback('Producto asignado correctamente', 'success')
      setIsFormModalOpen(false)
    } catch (err: any) {
      showFeedback(err?.message || 'Error al asignar producto', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            Solo administradores pueden gestionar precios y disponibilidad
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProductosSucursalesPageView
      productos={filteredProductos}
      total={productosSucursal.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitting}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (error ? error.message : '')}
      feedbackType={feedbackType || (error ? 'error' : '')}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      productosDisponibles={productosDisponibles}
      productosLoading={productosLoading}
      sucursalId={sucursalId}
      onCreate={handleCreate}
      onAssign={handleAssign}
    />
  )
}
