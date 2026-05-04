import { useState, useEffect, useMemo, useCallback } from 'react'
import { ProveedoresService, Proveedor, CreateProveedorData } from '@/modules/comercial/services/proveedores.service'
import { getErrorMessage } from '@/core/api'
import { ProveedoresPageView } from './ProveedoresPage.view'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitLoading, setIsSubmitLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedProveedor, setSelectedProveedor] = useState<Proveedor | null>(null)

  const { hasPermission } = useAuth()

  const canCreate = hasPermission('providers:create')
  const canUpdate = hasPermission('providers:update')

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

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await ProveedoresService.getAll()
      setProveedores(data)
    } catch (error) {
      showFeedback(getErrorMessage(error, 'Cargar proveedores'), 'error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredProveedores = useMemo(() => {
    return proveedores.filter(p =>
      p.empresa.toLowerCase().includes(search.toLowerCase()) ||
      p.nombreContacto.toLowerCase().includes(search.toLowerCase()) ||
      (p.nit && p.nit.includes(search)) ||
      (p.categoriaProductos && p.categoriaProductos.toLowerCase().includes(search.toLowerCase()))
    )
  }, [proveedores, search])

  const handleCreate = () => {
    setSelectedProveedor(null)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleEdit = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleView = (proveedor: Proveedor) => {
    setSelectedProveedor(proveedor)
    setIsViewModalOpen(true)
  }

  const handleDesactivar = async (proveedor: Proveedor) => {
    if (!confirm(`¿Desactivar al proveedor "${proveedor.empresa}"?`)) return
    try {
      await ProveedoresService.desactivar(proveedor.idProveedor)
      showFeedback('Proveedor desactivado correctamente', 'success')
      loadData()
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Desactivar proveedor'), 'error')
    }
  }

  const onSubmit = async (data: CreateProveedorData) => {
    setIsSubmitLoading(true)
    setFeedbackMessage('')
    setFeedbackType('')
    try {
      if (selectedProveedor) {
        await ProveedoresService.update(selectedProveedor.idProveedor, data)
        showFeedback('Proveedor actualizado correctamente', 'success')
      } else {
        await ProveedoresService.create(data)
        showFeedback('Proveedor registrado correctamente', 'success')
      }
      setIsFormModalOpen(false)
      loadData()
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Guardar proveedor'), 'error')
    } finally {
      setIsSubmitLoading(false)
    }
  }

  return (
    <ProveedoresPageView
      proveedores={filteredProveedores}
      total={proveedores.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitLoading}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage}
      feedbackType={feedbackType}
      canCreate={canCreate}
      canUpdate={canUpdate}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      isViewModalOpen={isViewModalOpen}
      setIsViewModalOpen={setIsViewModalOpen}
      selectedProveedor={selectedProveedor}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onView={handleView}
      onDesactivar={handleDesactivar}
      onSubmit={onSubmit}
    />
  )
}
