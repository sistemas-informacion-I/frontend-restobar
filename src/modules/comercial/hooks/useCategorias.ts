import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { CategoriasService, Categoria, CreateCategoriaData } from '../services/categorias.service'

export const useCategorias = () => {
  const {
    data: categorias = [],
    error: loadError,
    isLoading,
    mutate,
  } = useSWR<Categoria[]>('/api/categorias', () => CategoriasService.getAll())

  const { trigger: createCategoria, isMutating: isCreating } = useSWRMutation(
    '/api/categorias',
    async (_, { arg }: { arg: CreateCategoriaData }) => {
      return CategoriasService.create(arg)
    },
    { onSuccess: () => mutate() }
  )

  const { trigger: updateCategoria, isMutating: isUpdating } = useSWRMutation(
    '/api/categorias/update',
    async (_, { arg }: { arg: { id: number; data: CreateCategoriaData } }) => {
      return CategoriasService.update(arg.id, arg.data)
    },
    { onSuccess: () => mutate() }
  )

  const { trigger: deactivateCategoria, isMutating: isDeactivating } = useSWRMutation(
    '/api/categorias/deactivate',
    async (_, { arg }: { arg: number }) => {
      return CategoriasService.desactivar(arg)
    },
    { onSuccess: () => mutate() }
  )

  return {
    categorias,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeactivating,
    isSubmitting: isCreating || isUpdating || isDeactivating,
    createCategoria,
    updateCategoria,
    deactivateCategoria,
    refreshCategorias: mutate,
  }
}
