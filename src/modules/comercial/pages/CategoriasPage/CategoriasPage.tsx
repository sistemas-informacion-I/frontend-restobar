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
    activateCategoria,
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

  // Primero agrupa: padre seguido de sus hijos en orden
  const categoriasPorPadre = useMemo(() => {
    const construirArbol = (lista: Categoria[]): Categoria[] => {
      const resultado: Categoria[] = []
      // Raíces primero, ordenadas por nombre
      const raices = lista
        .filter(c => !c.idCategoriaPadre)
        .sort((a, b) => a.nombre.localeCompare(b.nombre))

      const agregarConHijos = (cat: Categoria) => {
        resultado.push(cat)
        // Hijos directos de esta categoría, ordenados por nombre
        const hijos = lista
          .filter(c => c.idCategoriaPadre === cat.idCategoria)
          .sort((a, b) => a.nombre.localeCompare(b.nombre))
        hijos.forEach(agregarConHijos) // recursivo para múltiples niveles
      }

      raices.forEach(agregarConHijos)
      return resultado
    }

    return construirArbol(categorias)
  }, [categorias])

  // Luego filtra sobre el árbol ya ordenado
  const filteredCategorias = useMemo(() => {
    if (!search.trim()) return categoriasPorPadre
    return categoriasPorPadre.filter(c =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase())) ||
      (c.nombreCategoriaPadre && c.nombreCategoriaPadre.toLowerCase().includes(search.toLowerCase()))
    )
  }, [categoriasPorPadre, search])

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    mensaje: string
    onConfirm: () => void
  }>({ open: false, mensaje: '', onConfirm: () => {} })

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

  const handleDesactivar = (categoria: Categoria) => {
    setConfirmModal({
      open: true,
      mensaje: `¿Desactivar la categoría "${categoria.nombre}"?`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }))
        try {
          await deactivateCategoria(categoria.idCategoria)
          showFeedback('Categoría desactivada correctamente', 'success')
        } catch (error: any) {
          showFeedback(getErrorMessage(error, 'Desactivar categoría'), 'error')
        }
      }
    })
  }

  const handleActivar = (categoria: Categoria) => {
    setConfirmModal({
      open: true,
      mensaje: `¿Reactivar la categoría "${categoria.nombre}"?`,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }))
        try {
          await activateCategoria(categoria.idCategoria)
          showFeedback('Categoría reactivada correctamente', 'success')
        } catch (error: any) {
          showFeedback(getErrorMessage(error, 'Reactivar categoría'), 'error')
        }
      }
    })
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
      onActivar={handleActivar}
      confirmModal={confirmModal}
      onConfirmModalClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
    />
  )
}
