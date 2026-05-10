import { useState, useMemo, useCallback } from 'react'
import {
  CompraResponse,
  CompraRequest,
  EstadoPago,
} from '@/modules/comercial/services/compras.service'
import { useCompras } from '../../hooks/useCompras'
import { useProveedores } from '../../hooks/useProveedores'
import { useEmployees } from '@/modules/acceso/hooks/useEmployees'
import { useSucursales } from '@/modules/operaciones/hooks/useSucursales'
import { useInventario } from '@/modules/inventario/hooks/useInventario'
import { getErrorMessage } from '@/core/api'
import { CompraView } from './Compra.view'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export default function Compra() {
  const [filtroProveedor, setFiltroProveedor] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [search, setSearch] = useState('')

  const filtros = useMemo(() => ({
    idProveedor: filtroProveedor ? Number(filtroProveedor) : undefined,
    estadoPago: filtroEstado ? (filtroEstado as EstadoPago) : undefined,
  }), [filtroProveedor, filtroEstado])

  const {
    compras,
    isLoading,
    isSubmitting,
    createCompra,
    updateCompra,
    deleteCompra,
    cambiarEstadoPago,
    loadError,
  } = useCompras(filtros)

  const { proveedores } = useProveedores()
  const { employees } = useEmployees()
  const { sucursales, isLoading: sucursalesLoading } = useSucursales()
  const { insumos } = useInventario()
  const { hasPermission } = useAuth()

  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCompra, setSelectedCompra] = useState<CompraResponse | null>(null)

  const canCreate = hasPermission('compras:create')
  const canUpdate = hasPermission('compras:update')
  const canDelete = hasPermission('compras:delete')

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

  const filteredCompras = useMemo(() => {
    if (!search) return compras
    const q = search.toLowerCase()
    return compras.filter(
      (c) =>
        c.nroFactura.toLowerCase().includes(q) ||
        c.nombreProveedor.toLowerCase().includes(q)
    )
  }, [compras, search])

  const handleCreate = () => {
    setSelectedCompra(null)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleEdit = (compra: CompraResponse) => {
    setSelectedCompra(compra)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleView = (compra: CompraResponse) => {
    setSelectedCompra(compra)
    setIsViewModalOpen(true)
  }

  const handleDeleteClick = (compra: CompraResponse) => {
    setSelectedCompra(compra)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedCompra) return
    try {
      await deleteCompra(selectedCompra.idCompra)
      showFeedback('Compra eliminada correctamente', 'success')
      setIsDeleteModalOpen(false)
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Eliminar compra'), 'error')
    }
  }

  const handleCambiarEstado = async (compra: CompraResponse, nuevoEstado: EstadoPago) => {
    try {
      await cambiarEstadoPago({ id: compra.idCompra, estadoPago: nuevoEstado })
      showFeedback(`Estado cambiado a ${nuevoEstado}`, 'success')
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Cambiar estado'), 'error')
    }
  }

  const onSubmit = async (data: CompraRequest) => {
    setFeedbackMessage('')
    setFeedbackType('')
    try {
      if (selectedCompra) {
        await updateCompra({ id: selectedCompra.idCompra, data })
        showFeedback('Compra actualizada correctamente', 'success')
      } else {
        await createCompra(data)
        showFeedback('Compra registrada correctamente', 'success')
      }
      setIsFormModalOpen(false)
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Guardar compra'), 'error')
    }
  }

  return (
    <CompraView
      compras={filteredCompras}
      total={compras.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitting}
      isDeleting={false}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (loadError ? getErrorMessage(loadError) : '')}
      feedbackType={feedbackType || (loadError ? 'error' : '')}
      canCreate={canCreate}
      canUpdate={canUpdate}
      canDelete={canDelete}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      isViewModalOpen={isViewModalOpen}
      setIsViewModalOpen={setIsViewModalOpen}
      isDeleteModalOpen={isDeleteModalOpen}
      setIsDeleteModalOpen={setIsDeleteModalOpen}
      selectedCompra={selectedCompra}
      proveedores={proveedores}
      employees={employees}
      insumos={insumos}
      sucursales={sucursales.map((s: any) => ({ idSucursal: s.idSucursal, nombre: s.nombre }))}
      sucursalesLoading={sucursalesLoading}
      filtroProveedor={filtroProveedor}
      onFiltroProveedorChange={setFiltroProveedor}
      filtroEstado={filtroEstado}
      onFiltroEstadoChange={setFiltroEstado}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onView={handleView}
      onDeleteClick={handleDeleteClick}
      onDeleteConfirm={handleDeleteConfirm}
      onCambiarEstado={handleCambiarEstado}
      onSubmit={onSubmit}
    />
  )
}
