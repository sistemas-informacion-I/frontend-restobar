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
    USUARIOS: 'Usuarios',
    ROLES: 'Roles',
    PERMISOS: 'Permisos',
    CLIENTES: 'Clientes',
    EMPLEADOS: 'Empleados',
    PROVEEDORES: 'Proveedores',
    SUCURSALES: 'Sucursales',
    SECTORES: 'Sectores',
    MESAS: 'Mesas',
    INVENTARIO: 'Inventario',
    VENTAS: 'Ventas',
    CAJA: 'Caja',
    SESIONES: 'Sesiones',
    AUDITORIA: 'Auditoría',
    Otros: 'Otros',
  }

  return RoleViewView({ role, groupedPermissions, moduleNames })
}
