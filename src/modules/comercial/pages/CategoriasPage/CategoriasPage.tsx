import { useState, useMemo, useCallback } from 'react'
import { Categoria, CreateCategoriaData } from '@/modules/comercial/services/categorias.service'
import { useCategorias } from '../../hooks/useCategorias'
import { getErrorMessage } from '@/core/api'
import { CategoriasPageView } from './CategoriasPage.view'
import { useAuth } from '@/modules/acceso/context/AuthContext'

export default function CategoriasPage() {
  const {
    categorias,
    isLoading,
    isSubmitting,
    createCategoria,
    updateCategoria,
    deactivateCategoria,
    loadError,
  } = useCategorias()

  const [search, setSearch] = useState('')
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(null)

  const { hasPermission } = useAuth()
  const canCreate = hasPermission('categories:create')
  const canUpdate = hasPermission('categories:update')

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

  const filteredCategorias = useMemo(() => {
    return categorias.filter((c: Categoria) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase())) ||
      (c.nombreCategoriaPadre && c.nombreCategoriaPadre.toLowerCase().includes(search.toLowerCase()))
    )
  }, [categorias, search])

  const handleCreate = () => {
    setSelectedCategoria(null)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleEdit = (categoria: Categoria) => {
    setSelectedCategoria(categoria)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleView = (categoria: Categoria) => {
    setSelectedCategoria(categoria)
    setIsViewModalOpen(true)
  }

  const handleDesactivar = async (categoria: Categoria) => {
    if (!confirm(`¿Desactivar la categoría "${categoria.nombre}"?`)) return
    try {
      await deactivateCategoria(categoria.idCategoria)
      showFeedback('Categoría desactivada correctamente', 'success')
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Desactivar categoría'), 'error')
    }
  }

  const onSubmit = async (data: CreateCategoriaData) => {
    setFeedbackMessage('')
    setFeedbackType('')
    try {
      if (selectedCategoria) {
        await updateCategoria({ id: selectedCategoria.idCategoria, data })
        showFeedback('Categoría actualizada correctamente', 'success')
      } else {
        await createCategoria(data)
        showFeedback('Categoría registrada correctamente', 'success')
      }
      setIsFormModalOpen(false)
    } catch (error: any) {
      showFeedback(getErrorMessage(error, 'Guardar categoría'), 'error')
    }
  }

  return (
    <CategoriasPageView
      categorias={filteredCategorias}
      allCategorias={categorias}
      total={categorias.length}
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
      selectedCategoria={selectedCategoria}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onView={handleView}
      onDesactivar={handleDesactivar}
      onSubmit={onSubmit}
    />
  )
}
