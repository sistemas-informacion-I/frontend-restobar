import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { ProveedoresService, Proveedor, CreateProveedorData } from '../services/proveedores.service'

export const useProveedores = () => {
  const { 
    data: proveedores = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR<Proveedor[]>('/api/proveedores', () => ProveedoresService.getAll())

  const { trigger: createProveedor, isMutating: isCreating } = useSWRMutation(
    '/api/proveedores',
    async (_, { arg }: { arg: CreateProveedorData }) => {
      return ProveedoresService.create(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: updateProveedor, isMutating: isUpdating } = useSWRMutation(
    '/api/proveedores/update',
    async (_, { arg }: { arg: { id: number, data: Partial<CreateProveedorData> } }) => {
      return ProveedoresService.update(arg.id, arg.data)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: deactivateProveedor, isMutating: isDeactivating } = useSWRMutation(
    '/api/proveedores/deactivate',
    async (_, { arg }: { arg: number }) => {
      return ProveedoresService.desactivar(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  return {
    proveedores,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeactivating,
    isSubmitting: isCreating || isUpdating || isDeactivating,
    createProveedor,
    updateProveedor,
    deactivateProveedor,
    refreshProveedores: mutate
  }
}
