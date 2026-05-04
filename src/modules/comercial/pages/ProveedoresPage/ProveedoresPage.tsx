import { useState, useMemo, useCallback } from 'react'
import { Proveedor, CreateProveedorData } from '@/modules/comercial/services/proveedores.service'
import { useProveedores } from '../../hooks/useProveedores'
import { getErrorMessage } from '@/core/api'
import { ProveedoresPageView } from './ProveedoresPage.view'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export default function ProveedoresPage() {
  const {
    proveedores,
    isLoading,
    isSubmitting,
    createProveedor,
    updateProveedor,
    deactivateProveedor,
    loadError
  } = useProveedores()

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

  const filteredProveedores = useMemo(() => {
    return proveedores.filter((p: Proveedor) =>
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
      await deactivateProveedor(proveedor.idProveedor)
      showFeedback('Proveedor desactivado correctamente', 'success')
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Desactivar proveedor'), 'error')
    }
  }

  const onSubmit = async (data: CreateProveedorData) => {
    setFeedbackMessage('')
    setFeedbackType('')
    try {
      if (selectedProveedor) {
        await updateProveedor({ id: selectedProveedor.idProveedor, data })
        showFeedback('Proveedor actualizado correctamente', 'success')
      } else {
        await createProveedor(data)
        showFeedback('Proveedor registrado correctamente', 'success')
      }
      setIsFormModalOpen(false)
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Guardar proveedor'), 'error')
    }
  }

  return (
    <ProveedoresPageView
      proveedores={filteredProveedores}
      total={proveedores.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitting}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (loadError ? getErrorMessage(loadError) : '')}
      feedbackType={feedbackType || (loadError ? 'error' : '')}
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
