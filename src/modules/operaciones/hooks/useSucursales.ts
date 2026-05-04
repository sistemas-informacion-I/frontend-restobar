import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sucursalService } from '../services/sucursal.service'
import { CreateSucursalData, UpdateSucursalData } from '../services/types'

export const useSucursales = () => {
  const { 
    data: sucursales = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR('/api/sucursal', () => sucursalService.getAll())

  const { trigger: createSucursal, isMutating: isCreating } = useSWRMutation(
    '/api/sucursal',
    async (_, { arg }: { arg: CreateSucursalData }) => {
      return sucursalService.create(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: updateSucursal, isMutating: isUpdating } = useSWRMutation(
    '/api/sucursal/update',
    async (_, { arg }: { arg: { id: number, data: UpdateSucursalData } }) => {
      return sucursalService.update(arg.id, arg.data)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: deleteSucursal, isMutating: isDeleting } = useSWRMutation(
    '/api/sucursal/delete',
    async (_, { arg }: { arg: number }) => {
      return sucursalService.delete(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  return {
    sucursales,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeleting,
    isSubmitting: isCreating || isUpdating || isDeleting,
    createSucursal,
    updateSucursal,
    deleteSucursal,
    refreshSucursales: mutate
  }
}
