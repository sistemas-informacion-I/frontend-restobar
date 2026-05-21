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

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean
    type: 'activar' | 'desactivar'
    proveedor: Proveedor | null
  }>({ isOpen: false, type: 'desactivar', proveedor: null })

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

  const handleDesactivar = (proveedor: Proveedor) => {
    setConfirmModal({ isOpen: true, type: 'desactivar', proveedor })
  }

  const handleActivar = (proveedor: Proveedor) => {
    setConfirmModal({ isOpen: true, type: 'activar', proveedor })
  }

  const handleConfirm = async () => {
    if (!confirmModal.proveedor) return
    try {
      if (confirmModal.type === 'desactivar') {
        await deactivateProveedor(confirmModal.proveedor.idProveedor)
        showFeedback('Proveedor desactivado correctamente', 'success')
      } else {
        await updateProveedor({
          id: confirmModal.proveedor.idProveedor,
          data: {
            empresa: confirmModal.proveedor.empresa,
            nit: confirmModal.proveedor.nit,
            nombreContacto: confirmModal.proveedor.nombreContacto,
            telefono: confirmModal.proveedor.telefono,
            correo: confirmModal.proveedor.correo,
            direccion: confirmModal.proveedor.direccion,
            categoriaProductos: confirmModal.proveedor.categoriaProductos,
            activo: true
          }
        })
        showFeedback('Proveedor activado correctamente', 'success')
      }
    } catch (error: any) {
      showFeedback(getErrorMessage(error, `${confirmModal.type === 'activar' ? 'Activar' : 'Desactivar'} proveedor`), 'error')
    } finally {
      setConfirmModal({ isOpen: false, type: 'desactivar', proveedor: null })
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
      confirmModal={confirmModal}
      onCloseConfirm={() => setConfirmModal({ isOpen: false, type: 'desactivar', proveedor: null })}
      onConfirm={handleConfirm}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onView={handleView}
      onDesactivar={handleDesactivar}
      onActivar={handleActivar}
      onSubmit={onSubmit}
    />
  )
}
