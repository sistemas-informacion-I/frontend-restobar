import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import {
  recetasService,
  type Receta,
  type RecetaUpsertData,
  type RecetaDuplicarData,
  type RecetasFilter,
} from '../services/recetas.service'

export const useRecetas = (filters?: RecetasFilter) => {
  const key = ['recetas', filters]

  const {
    data: recetas = [],
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<Receta[]>(key, () => recetasService.getAll(filters), {
    revalidateOnFocus: false,
  })

  const { trigger: createReceta, isMutating: isCreating } = useSWRMutation(
    '/api/recetas/create',
    async (_, { arg }: { arg: RecetaUpsertData }) => recetasService.create(arg),
    { onSuccess: () => mutate() }
  )

  const { trigger: updateReceta, isMutating: isUpdating } = useSWRMutation(
    '/api/recetas/update',
    async (_, { arg }: { arg: { id: number; data: RecetaUpsertData } }) => recetasService.update(arg.id, arg.data),
    { onSuccess: () => mutate() }
  )

  const { trigger: deactivateReceta, isMutating: isDeactivating } = useSWRMutation(
    '/api/recetas/deactivate',
    async (_, { arg }: { arg: number }) => recetasService.desactivar(arg),
    { onSuccess: () => mutate() }
  )

  const { trigger: duplicateReceta, isMutating: isDuplicating } = useSWRMutation(
    '/api/recetas/duplicate',
    async (_, { arg }: { arg: { id: number; data: RecetaDuplicarData } }) => recetasService.duplicar(arg.id, arg.data),
    { onSuccess: () => mutate() }
  )

  const { trigger: recalculateCosto, isMutating: isRecalculating } = useSWRMutation(
    '/api/recetas/recalculate',
    async (_, { arg }: { arg: { id: number; idSucursal: number } }) => recetasService.recalcularCosto(arg.id, arg.idSucursal),
    { onSuccess: () => mutate() }
  )

  const { trigger: deleteReceta, isMutating: isDeleting } = useSWRMutation(
    '/api/recetas/delete',
    async (_, { arg }: { arg: number }) => recetasService.delete(arg),
    { onSuccess: () => mutate() }
  )

  return {
    recetas,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeactivating,
    isDuplicating,
    isRecalculating,
    isDeleting,
    isSubmitting: isCreating || isUpdating || isDeactivating || isDuplicating || isRecalculating || isDeleting,
    createReceta,
    updateReceta,
    deactivateReceta,
    duplicateReceta,
    recalculateCosto,
    deleteReceta,
    refreshRecetas: mutate,
  }
}
