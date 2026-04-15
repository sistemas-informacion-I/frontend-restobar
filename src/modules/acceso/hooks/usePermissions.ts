import useSWR from 'swr'
import { Permission } from '../models/permission.model'
import { permissionsService } from '../services/permissions.service'

export const usePermissions = () => {
  const { 
    data: permissions = [], 
    error: loadError, 
    isLoading, 
    mutate 
  } = useSWR<Permission[]>('/permisos', () => permissionsService.getAll())

  return {
    permissions,
    isLoading,
    loadError,
    refreshPermissions: mutate
  }
}
