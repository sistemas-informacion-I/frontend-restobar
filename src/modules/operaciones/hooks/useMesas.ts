import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { mesaService } from '../services/mesa.service'
import { CreateMesaData, UpdateMesaData, Mesa } from '../services/types'

export const useMesas = () => {
  const { 
    data: mesas = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR<Mesa[]>('/api/mesas', () => mesaService.getAll())

  const { trigger: createMesa, isMutating: isCreating } = useSWRMutation(
    '/api/mesas',
    async (_, { arg }: { arg: CreateMesaData }) => {
      return mesaService.create(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: updateMesa, isMutating: isUpdating } = useSWRMutation(
    '/api/mesas/update',
    async (_, { arg }: { arg: { id: number, data: UpdateMesaData } }) => {
      return mesaService.update(arg.id, arg.data)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: deleteMesa, isMutating: isDeleting } = useSWRMutation(
    '/api/mesas/delete',
    async (_, { arg }: { arg: number }) => {
      return mesaService.delete(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  return {
    mesas,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeleting,
    isSubmitting: isCreating || isUpdating || isDeleting,
    createMesa,
    updateMesa,
    deleteMesa,
    refreshMesas: mutate
  }
}
