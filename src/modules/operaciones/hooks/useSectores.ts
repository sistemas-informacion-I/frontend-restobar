import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { sectorService } from '../services/sector.service'
import { CreateSectorData, UpdateSectorData } from '../services/types'

export const useSectores = () => {
  const { 
    data: sectores = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR('/api/sectores', () => sectorService.getAll())

  const { trigger: createSector, isMutating: isCreating } = useSWRMutation(
    '/api/sectores',
    async (_, { arg }: { arg: CreateSectorData }) => {
      return sectorService.create(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: updateSector, isMutating: isUpdating } = useSWRMutation(
    '/api/sectores/update',
    async (_, { arg }: { arg: { id: number, data: UpdateSectorData } }) => {
      return sectorService.update(arg.id, arg.data)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: deleteSector, isMutating: isDeleting } = useSWRMutation(
    '/api/sectores/delete',
    async (_, { arg }: { arg: number }) => {
      return sectorService.delete(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  return {
    sectores,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeleting,
    isSubmitting: isCreating || isUpdating || isDeleting,
    createSector,
    updateSector,
    deleteSector,
    refreshSectores: mutate
  }
}
