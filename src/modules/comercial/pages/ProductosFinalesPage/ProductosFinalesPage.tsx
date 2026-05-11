import { useState, useMemo, useCallback, useEffect } from 'react'
import { useProductosFinales } from '../../hooks/useProductosFinales'
import { useProductosSucursales, ProductoSucursal } from '../../hooks/useProductosSucursales'
import { useCategorias } from '../../hooks/useCategorias'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useSucursales } from '@/modules/operaciones/hooks/useSucursales'
import type { ProductoFinal, ProductoFinalRequest } from '../../services/productosFinales.service'
import { ProductosFinalesPageView } from './ProductosFinalesPage.view'

export default function ProductosFinalesPage() {
  const { productos, loading: isLoading, error, createProducto, updateProducto, deleteProducto } = useProductosFinales()
  const { productos: productosActivos, loading: productosActivosLoading } = useProductosFinales({ activo: true })
  const { categorias } = useCategorias()
  const { sucursales } = useSucursales()
  const { user } = useAuth()

  const [search, setSearch] = useState('')
  const [searchSucursal, setSearchSucursal] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isSucursalFormModalOpen, setIsSucursalFormModalOpen] = useState(false)
  const [isSucursalEditModalOpen, setIsSucursalEditModalOpen] = useState(false)
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>(undefined)
  const [selectedProducto, setSelectedProducto] = useState<ProductoFinal | null>(null)
  const [selectedProductoSucursal, setSelectedProductoSucursal] = useState<ProductoSucursal | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSucursalSubmitting, setIsSucursalSubmitting] = useState(false)

  const isSuperUser = user?.tipoUsuario === 'S'
  const isSucursalAdmin = user?.tipoUsuario === 'E'
  const canAccessProductosFinales = isSuperUser || isSucursalAdmin
  const {
    productosSucursal,
    loading: isSucursalLoading,
    error: sucursalError,
    asignarProducto,
    actualizarAsignacion,
  } = useProductosSucursales(selectedSucursalId)

  useEffect(() => {
    if (isSuperUser) {
      if (sucursales.length > 0 && !selectedSucursalId) {
        setSelectedSucursalId(sucursales[0].idSucursal)
      }
      return
    }

    if (isSucursalAdmin && user?.sucursalId) {
      setSelectedSucursalId(user.sucursalId)
    }
  }, [isSuperUser, isSucursalAdmin, user?.sucursalId, sucursales, selectedSucursalId])

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
    return productos.filter((p: ProductoFinal) =>
      p.codigo.toLowerCase().includes(search.toLowerCase()) ||
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(search.toLowerCase()))
    )
  }, [productos, search])

  const productosSucursalEnriquecidos = useMemo(() => {
    const productosPorId = new Map(productos.map((p) => [p.idProductoFinal, p]))

    return productosSucursal.map((ps) => {
      const productoMaestro = productosPorId.get(ps.idProductoFinal)
      return {
        ...ps,
        codigoProducto: ps.codigoProducto || productoMaestro?.codigo || '',
        nombreProducto: ps.nombreProducto || productoMaestro?.nombre || '',
      }
    })
  }, [productosSucursal, productos])

  const filteredProductosSucursal = useMemo(() => {
    const term = searchSucursal.toLowerCase()
    return productosSucursalEnriquecidos.filter(
      (ps) =>
        String(ps.codigoProducto ?? '').toLowerCase().includes(term) ||
        String(ps.nombreProducto ?? '').toLowerCase().includes(term)
    )
  }, [productosSucursalEnriquecidos, searchSucursal])

  const productosDisponibles = useMemo(() => {
    return productosActivos.filter(
      (pf) => !productosSucursal.some((ps) => ps.idProductoFinal === pf.idProductoFinal)
    )
  }, [productosActivos, productosSucursal])

  const handleCreate = () => {
    setSelectedProducto(null)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleEdit = (producto: ProductoFinal) => {
    setSelectedProducto(producto)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleView = (producto: ProductoFinal) => {
    setSelectedProducto(producto)
    setIsViewModalOpen(true)
  }

  const handleDelete = async (producto: ProductoFinal) => {
    if (!confirm(`¿Eliminar el producto "${producto.nombre}"?`)) return
    setIsSubmitting(true)
    try {
      await deleteProducto(producto.idProductoFinal)
      showFeedback('Producto eliminado correctamente', 'success')
    } catch (err: any) {
      showFeedback(err?.message || 'Error al eliminar el producto', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const onSubmit = async (data: ProductoFinalRequest, file?: File) => {
    setFeedbackMessage('')
    setFeedbackType('')
    setIsSubmitting(true)
    try {
      if (selectedProducto) {
        await updateProducto(selectedProducto.idProductoFinal, data, file)
        showFeedback('Producto actualizado correctamente', 'success')
      } else {
        await createProducto(data, file)
        showFeedback('Producto creado correctamente', 'success')
      }
      setIsFormModalOpen(false)
    } catch (error: any) {
      showFeedback(error?.message || 'Error al guardar el producto', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreateSucursal = () => {
    setFeedbackMessage('')
    setFeedbackType('')
    setIsSucursalFormModalOpen(true)
  }

  const handleAssignSucursal = async (idProducto: number, precio: number, disponible: boolean) => {
    if (!selectedSucursalId) return
    setIsSucursalSubmitting(true)
    try {
      await asignarProducto(idProducto, selectedSucursalId, { precio, disponible, activo: true })
      showFeedback('Producto asignado correctamente a la sucursal', 'success')
      setIsSucursalFormModalOpen(false)
    } catch (err: any) {
      showFeedback(err?.message || 'Error al asignar producto en sucursal', 'error')
    } finally {
      setIsSucursalSubmitting(false)
    }
  }

  const handleOpenSucursalEdit = (productoSucursal: ProductoSucursal) => {
    setSelectedProductoSucursal(productoSucursal)
    setIsSucursalEditModalOpen(true)
  }

  const handleUpdateSucursal = async (precio: number, disponible: boolean, activo: boolean) => {
    if (!selectedSucursalId || !selectedProductoSucursal) return
    setIsSucursalSubmitting(true)
    try {
      await actualizarAsignacion(selectedProductoSucursal.idProductoFinal, selectedSucursalId, {
        precio,
        disponible,
        activo,
      })
      showFeedback('Precio y estado actualizados correctamente', 'success')
      setIsSucursalEditModalOpen(false)
      setSelectedProductoSucursal(null)
    } catch (err: any) {
      showFeedback(err?.message || 'Error al actualizar la asignación', 'error')
    } finally {
      setIsSucursalSubmitting(false)
    }
  }

  if (!canAccessProductosFinales) {
    return (
      <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-xs font-bold uppercase tracking-widest shadow-lg dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            No tienes permisos para gestionar productos finales
          </div>
        </div>
      </div>
    )
  }

  return (
    <ProductosFinalesPageView
      productos={filteredProductos}
      total={productos.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitting}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (error ? error.message : '')}
      feedbackType={feedbackType || (error ? 'error' : '')}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      isViewModalOpen={isViewModalOpen}
      setIsViewModalOpen={setIsViewModalOpen}
      canManageMaster={isSuperUser}
      canSelectSucursal={isSuperUser}
      canAssignSucursal={isSuperUser}
      canEditSucursal={true}
      selectedSucursalId={selectedSucursalId}
      setSelectedSucursalId={setSelectedSucursalId}
      sucursales={sucursales}
      selectedProducto={selectedProducto}
      selectedProductoSucursal={selectedProductoSucursal}
      categorias={categorias}
      searchSucursal={searchSucursal}
      onSearchSucursalChange={setSearchSucursal}
      productosSucursal={filteredProductosSucursal}
      totalSucursal={productosSucursal.length}
      isSucursalLoading={isSucursalLoading}
      isSucursalFormModalOpen={isSucursalFormModalOpen}
      setIsSucursalFormModalOpen={setIsSucursalFormModalOpen}
      isSucursalEditModalOpen={isSucursalEditModalOpen}
      setIsSucursalEditModalOpen={setIsSucursalEditModalOpen}
      productosDisponibles={productosDisponibles}
      productosDisponiblesLoading={productosActivosLoading}
      onCreate={handleCreate}
      onCreateSucursal={handleCreateSucursal}
      onEditSucursal={handleOpenSucursalEdit}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
      onSubmit={onSubmit}
      onAssignSucursal={handleAssignSucursal}
      onUpdateSucursal={handleUpdateSucursal}
      isSucursalSubmitLoading={isSucursalSubmitting}
      sucursalErrorMessage={sucursalError?.message || ''}
    />
  )
}
