import { Role } from '../../../models'
import { RoleViewView } from './RoleView.view'

export interface RoleViewProps {
  role: Role
}

export function RoleView({ role }: RoleViewProps) {
  const groupedPermissions = role.permissions?.reduce((acc, permission) => {
    const module = permission.module || 'Otros'
    if (!acc[module]) {
      acc[module] = []
    }
    acc[module].push(permission)
    return acc
  }, {} as Record<string, typeof role.permissions>) || {}

  const moduleNames: Record<string, string> = {
    users: 'Usuarios',
    roles: 'Roles',
    permissions: 'Permisos',
    Otros: 'Otros',
  }

  return RoleViewView({ role, groupedPermissions, moduleNames })
}
