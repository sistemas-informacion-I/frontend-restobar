import { useCallback, useEffect, useMemo, useState } from 'react'
import { getErrorMessage } from '@/core/api'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useInventario } from '@/modules/inventario/hooks/useInventario'
import { useSucursales } from '@/modules/operaciones/hooks/useSucursales'
import { useProductosFinales } from '@/modules/comercial/hooks/useProductosFinales'
import { useRecetas } from '../../hooks/useRecetas'
import type { Receta, RecetaDuplicarData, RecetaUpsertData } from '../../services/recetas.service'
import { RecetasPageView } from './RecetasPage.view'

export default function RecetasPage() {
  const { user, canRead, canCreate, canUpdate, canDelete } = useAuth()
  const { sucursales } = useSucursales()
  const { insumos } = useInventario()
  const { productos: productosFinales } = useProductosFinales({ activo: true })
  const {
    recetas,
    isLoading,
    loadError,
    isSubmitting,
    createReceta,
    updateReceta,
    deactivateReceta,
    duplicateReceta,
    recalculateCosto,
    deleteReceta,
  } = useRecetas()

  const [search, setSearch] = useState('')
  const [selectedSucursalId, setSelectedSucursalId] = useState<number | undefined>(undefined)

  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [feedbackType, setFeedbackType] = useState<'error' | 'success' | ''>('')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false)

  const [selectedReceta, setSelectedReceta] = useState<Receta | null>(null)

  const isSuperUser = user?.tipoUsuario === 'S'

  useEffect(() => {
    if (isSuperUser) {
      if (!selectedSucursalId && sucursales.length > 0) {
        setSelectedSucursalId(sucursales[0].idSucursal)
      }
      return
    }

    if (user?.sucursalId) {
      setSelectedSucursalId(user.sucursalId)
    }
  }, [isSuperUser, user?.sucursalId, sucursales, selectedSucursalId])

  const canReadRecetas = canRead('inventario')
  const canCreateRecetas = canCreate('inventario')
  const canUpdateRecetas = canUpdate('inventario')
  const canDeleteRecetas = canDelete('inventario')

  const showFeedback = useCallback((message: string, type: 'error' | 'success') => {
    setFeedbackMessage(message)
    setFeedbackType(type)

    if (type === 'success') {
      setTimeout(() => {
        setFeedbackMessage('')
        setFeedbackType('')
      }, 4500)
    }
  }, [])

  const filteredRecetas = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return recetas

    return recetas.filter((r) => {
      return (
        String(r.nombre || '').toLowerCase().includes(term) ||
        String(r.nombreProductoFinal || '').toLowerCase().includes(term) ||
        String(r.versionEtiqueta || '').toLowerCase().includes(term)
      )
    })
  }, [recetas, search])

  const handleCreate = () => {
    setSelectedReceta(null)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleEdit = (receta: Receta) => {
    setSelectedReceta(receta)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsFormModalOpen(true)
  }

  const handleView = (receta: Receta) => {
    setSelectedReceta(receta)
    setIsViewModalOpen(true)
  }

  const handleOpenDuplicate = (receta: Receta) => {
    setSelectedReceta(receta)
    setFeedbackMessage('')
    setFeedbackType('')
    setIsDuplicateModalOpen(true)
  }

  const handleSubmit = async (data: RecetaUpsertData) => {
    setFeedbackMessage('')
    setFeedbackType('')

    try {
      if (selectedReceta) {
        await updateReceta({ id: selectedReceta.idReceta, data })
        showFeedback('Receta actualizada correctamente', 'success')
      } else {
        await createReceta(data)
        showFeedback('Receta creada correctamente', 'success')
      }
      setIsFormModalOpen(false)
    } catch (error) {
      showFeedback(getErrorMessage(error, 'guardar la receta'), 'error')
      throw error
    }
  }

  const handleDeactivate = async (receta: Receta) => {
    if (!receta.activo) return
    if (!confirm(`¿Desactivar la receta "${receta.nombre}"?`)) return

    try {
      await deactivateReceta(receta.idReceta)
      showFeedback('Receta desactivada correctamente', 'success')
    } catch (error) {
      showFeedback(getErrorMessage(error, 'desactivar receta'), 'error')
    }
  }

  const handleDelete = async (receta: Receta) => {
    if (!confirm(`¿Eliminar la receta "${receta.nombre}"? Esta accion no se puede deshacer.`)) return

    try {
      await deleteReceta(receta.idReceta)
      showFeedback('Receta eliminada correctamente', 'success')
    } catch (error) {
      showFeedback(getErrorMessage(error, 'eliminar receta'), 'error')
    }
  }

  const handleDuplicate = async (payload: RecetaDuplicarData) => {
    if (!selectedReceta) return

    try {
      await duplicateReceta({ id: selectedReceta.idReceta, data: payload })
      showFeedback('Receta duplicada correctamente', 'success')
      setIsDuplicateModalOpen(false)
    } catch (error) {
      showFeedback(getErrorMessage(error, 'duplicar receta'), 'error')
      throw error
    }
  }

  const handleRecalculateCosto = async (receta: Receta) => {
    if (!selectedSucursalId) {
      showFeedback('Selecciona una sucursal para recalcular costo', 'error')
      return
    }

    try {
      const result = await recalculateCosto({ id: receta.idReceta, idSucursal: selectedSucursalId })
      showFeedback(`Costo recalculado: Bs ${Number(result.costoTotal).toFixed(2)} (${result.nombreSucursal})`, 'success')
    } catch (error) {
      showFeedback(getErrorMessage(error, 'recalcular costo de receta'), 'error')
    }
  }

  return (
    <RecetasPageView
      recetas={filteredRecetas}
      total={recetas.length}
      isLoading={isLoading}
      isSubmitLoading={isSubmitting}
      search={search}
      onSearchChange={setSearch}
      feedbackMessage={feedbackMessage || (loadError ? getErrorMessage(loadError) : '')}
      feedbackType={feedbackType || (loadError ? 'error' : '')}
      canReadRecetas={canReadRecetas}
      canCreateRecetas={canCreateRecetas}
      canUpdateRecetas={canUpdateRecetas}
      canDeleteRecetas={canDeleteRecetas}
      canSelectSucursal={isSuperUser}
      selectedSucursalId={selectedSucursalId}
      setSelectedSucursalId={setSelectedSucursalId}
      sucursales={sucursales}
      productosFinales={productosFinales}
      insumos={insumos}
      selectedReceta={selectedReceta}
      isFormModalOpen={isFormModalOpen}
      setIsFormModalOpen={setIsFormModalOpen}
      isViewModalOpen={isViewModalOpen}
      setIsViewModalOpen={setIsViewModalOpen}
      isDuplicateModalOpen={isDuplicateModalOpen}
      setIsDuplicateModalOpen={setIsDuplicateModalOpen}
      onCreate={handleCreate}
      onEdit={handleEdit}
      onView={handleView}
      onOpenDuplicate={handleOpenDuplicate}
      onDeactivate={handleDeactivate}
      onDelete={handleDelete}
      onSubmit={handleSubmit}
      onDuplicate={handleDuplicate}
      onRecalculateCosto={handleRecalculateCosto}
    />
  )
}
