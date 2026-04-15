import { useForm } from 'react-hook-form'
import { Role, Permission, CreateRoleData, UpdateRoleData } from '../../../services/api'
import { RoleFormView } from './RoleForm.view'

export interface RoleFormProps {
  role?: Role
  permissions: Permission[]
  onSubmit: (data: CreateRoleData | UpdateRoleData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface FormData {
  nombre: string
  descripcion: string
  nivelAcceso: number
  activo: boolean
  permisos: string[]
}

export function RoleForm({ role, permissions, onSubmit, onCancel, isLoading }: RoleFormProps) {
  const isEdit = !!role

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: role ? {
      nombre: role.name,
      descripcion: role.description || '',
      nivelAcceso: role.accessLevel || 1,
      activo: role.isActive,
      permisos: role.permissions?.map(p => p.id) || [],
    } : {
      nombre: '',
      descripcion: '',
      nivelAcceso: 1,
      activo: true,
      permisos: [],
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      ...data,
      permisos: data.permisos?.map(Number) || []
    })
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const module = permission.module || 'Otros'
    if (!acc[module]) {
      acc[module] = []
    }
    acc[module].push(permission)
    return acc
  }, {} as Record<string, Permission[]>)

  const moduleNames: Record<string, string> = {
    users: 'Usuarios',
    roles: 'Roles',
    permissions: 'Permisos',
    Otros: 'Otros',
  }

  return RoleFormView({
    register,
    handleSubmit,
    errors,
    onFormSubmit,
    isEdit,
    isLoading,
    onCancel,
    groupedPermissions,
    moduleNames
  })
}
