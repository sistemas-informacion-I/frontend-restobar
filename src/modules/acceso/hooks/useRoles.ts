import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { Role, CreateRoleData, UpdateRoleData } from '../models/role.model'
import { rolesService } from '../services/roles.service'

export const useRoles = () => {
  const { 
    data: roles = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR<Role[]>('/roles', () => rolesService.getAll())

  const { trigger: createRole, isMutating: isCreating } = useSWRMutation(
    '/roles',
    async (_, { arg }: { arg: CreateRoleData }) => {
      return rolesService.create(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: updateRole, isMutating: isUpdating } = useSWRMutation(
    '/roles/update',
    async (_, { arg }: { arg: { id: string, data: UpdateRoleData } }) => {
      return rolesService.update(arg.id, arg.data)
    },
    {
      onSuccess: () => mutate()
    }
  )

  const { trigger: deleteRole, isMutating: isDeleting } = useSWRMutation(
    '/roles/delete',
    async (_, { arg }: { arg: string }) => {
      return rolesService.delete(arg)
    },
    {
      onSuccess: () => mutate()
    }
  )

  return {
    roles,
    isLoading,
    loadError,
    isCreating,
    isUpdating,
    isDeleting,
    isSubmitting: isCreating || isUpdating || isDeleting,
    createRole,
    updateRole,
    deleteRole,
    refreshRoles: mutate
  }
}
