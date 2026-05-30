import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { comandaService } from '../services/comanda.service'
import type { Comanda, CreateComandaData, UpdateComandaData, UpdateDetalleComandaData } from '../services/types'

/**
 * Hook para gestionar comandas con SWR
 * Proporciona caching automático y mutaciones optimistas
 */
export const useComandas = () => {
  // Obtener todas las comandas
  const {
    data: comandas = [],
    error: loadError,
    isLoading,
    mutate
  } = useSWR<Comanda[]>(
    '/api/comandas',
    () => comandaService.getAll(),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000
    }
  )

  // Crear nueva comanda
  const { trigger: createComanda, isMutating: isCreating } = useSWRMutation(
    '/api/comandas/create',
    async (_, { arg }: { arg: CreateComandaData }) => {
      const response = await comandaService.create(arg)
      await mutate()
      return response
    }
  )

  // Actualizar comanda
  const { trigger: updateComanda, isMutating: isUpdating } = useSWRMutation(
    '/api/comandas/update',
    async (_, { arg }: { arg: { id: number; data: UpdateComandaData } }) => {
      const response = await comandaService.update(arg.id, arg.data)
      await mutate()
      return response
    }
  )

  // Cerrar comanda
  const { trigger: closeComanda, isMutating: isClosing } = useSWRMutation(
    '/api/comandas/close',
    async (_, { arg }: { arg: number }) => {
      const response = await comandaService.close(arg)
      await mutate()
      return response
    }
  )

  const { trigger: updateDetalle, isMutating: isUpdatingDetalle } = useSWRMutation(
    '/api/comandas/detalles/update',
    async (_, { arg }: { arg: { idComanda: number; idDetalle: number; data: UpdateDetalleComandaData } }) => {
      const response = await comandaService.updateDetalle(arg.idComanda, arg.idDetalle, arg.data)
      await mutate()
      return response
    }
  )

  const { trigger: cancelarDetalle, isMutating: isCancellingDetalle } = useSWRMutation(
    '/api/comandas/detalles/cancelar',
    async (_, { arg }: { arg: { idComanda: number; idDetalle: number } }) => {
      const response = await comandaService.cancelarDetalle(arg.idComanda, arg.idDetalle)
      await mutate()
      return response
    }
  )

  const { trigger: deleteDetalle, isMutating: isDeletingDetalle } = useSWRMutation(
    '/api/comandas/detalles/delete',
    async (_, { arg }: { arg: { idComanda: number; idDetalle: number } }) => {
      const response = await comandaService.deleteDetalle(arg.idComanda, arg.idDetalle)
      await mutate()
      return response
    }
  )

  return {
    // Data
    comandas,
    
    // Loading states
    isLoading,
    isCreating,
    isUpdating,
    isClosing,
    isUpdatingDetalle,
    isCancellingDetalle,
    isDeletingDetalle,
    isSubmitting: isCreating || isUpdating || isClosing || isUpdatingDetalle || isCancellingDetalle || isDeletingDetalle,
    
    // Errors
    loadError,
    
    // Mutations
    createComanda,
    updateComanda,
    closeComanda,
    updateDetalle,
    cancelarDetalle,
    deleteDetalle,
    
    // Utilities
    refreshComandas: mutate
  }
}

/**
 * Hook para obtener una comanda específica
 */
export const useComanda = (id: number | null) => {
  const {
    data: comanda,
    error: loadError,
    isLoading,
    mutate
  } = useSWR<Comanda>(
    id ? `/api/comandas/${id}` : null,
    () => (id ? comandaService.getOne(id) : Promise.resolve(undefined as any)),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000
    }
  )

  const { trigger: updateComanda, isMutating: isUpdating } = useSWRMutation(
    id ? `/api/comandas/${id}/update` : null,
    async (_, { arg }: { arg: UpdateComandaData }) => {
      if (!id) return
      const response = await comandaService.update(id, arg)
      await mutate()
      return response
    }
  )

  const { trigger: closeComanda, isMutating: isClosing } = useSWRMutation(
    id ? `/api/comandas/${id}/close` : null,
    async () => {
      if (!id) return
      const response = await comandaService.close(id)
      await mutate()
      return response
    }
  )

  const { trigger: updateDetalle, isMutating: isUpdatingDetalle } = useSWRMutation(
    id ? `/api/comandas/${id}/detalles/update` : null,
    async (_, { arg }: { arg: { idDetalle: number; data: UpdateDetalleComandaData } }) => {
      if (!id) return
      const response = await comandaService.updateDetalle(id, arg.idDetalle, arg.data)
      await mutate()
      return response
    }
  )

  const { trigger: cancelarDetalle, isMutating: isCancellingDetalle } = useSWRMutation(
    id ? `/api/comandas/${id}/detalles/cancelar` : null,
    async (_, { arg }: { arg: { idDetalle: number } }) => {
      if (!id) return
      const response = await comandaService.cancelarDetalle(id, arg.idDetalle)
      await mutate()
      return response
    }
  )

  const { trigger: deleteDetalle, isMutating: isDeletingDetalle } = useSWRMutation(
    id ? `/api/comandas/${id}/detalles/delete` : null,
    async (_, { arg }: { arg: { idDetalle: number } }) => {
      if (!id) return
      const response = await comandaService.deleteDetalle(id, arg.idDetalle)
      await mutate()
      return response
    }
  )

  return {
    comanda,
    isLoading,
    isUpdating,
    isClosing,
    isUpdatingDetalle,
    isCancellingDetalle,
    isDeletingDetalle,
    isSubmitting: isUpdating || isClosing || isUpdatingDetalle || isCancellingDetalle || isDeletingDetalle,
    loadError,
    updateComanda,
    closeComanda,
    updateDetalle,
    cancelarDetalle,
    deleteDetalle,
    refreshComanda: mutate
  }
}
