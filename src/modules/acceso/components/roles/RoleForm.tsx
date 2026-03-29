import { useForm } from 'react-hook-form'
import { Role, Permission, CreateRoleData, UpdateRoleData } from '../../services/api'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Shield, FileText } from 'lucide-react'

interface RoleFormProps {
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
    } : {
      nombre: '',
      descripcion: '',
      nivelAcceso: 1,
      activo: true,
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data)
  }

  // Agrupar permisos por módulo
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

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      <Input
        label="Nombre del rol"
        type="text"
        placeholder="Ej: Administrador, Editor, Viewer"
        icon={<Shield size={18} />}
        error={errors.nombre?.message}
        {...register('nombre', {
          required: 'Ingresa un nombre para el rol',
          minLength: { value: 2, message: 'El nombre del rol debe tener al menos 2 caracteres' },
          maxLength: { value: 50, message: 'El nombre del rol no puede exceder 50 caracteres' },
        })}
      />

      <Input
        label="Descripción"
        type="text"
        placeholder="Descripción del rol"
        icon={<FileText size={18} />}
        error={errors.descripcion?.message}
        {...register('descripcion', {
          maxLength: { value: 200, message: 'La descripción del rol no puede exceder 200 caracteres' },
        })}
      />

      <Input
        label="Nivel de acceso"
        type="number"
        placeholder="1"
        error={errors.nivelAcceso?.message}
        {...register('nivelAcceso', {
          valueAsNumber: true,
          min: { value: 1, message: 'El nivel de acceso debe ser mayor a 0' },
        })}
      />

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input
            type="checkbox"
            {...register('activo')}
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
          />
          Rol activo
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Permisos
        </label>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Vista de permisos disponibles. La asignación se gestiona desde endpoints específicos de roles.
        </p>

        <div className="grid max-h-80 grid-cols-1 gap-4 overflow-y-auto rounded-xl border border-slate-200 p-3 dark:border-slate-700 sm:grid-cols-2">
          {Object.entries(groupedPermissions).map(([module, perms]) => (
            <div key={module} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
              <h4 className="mb-3 border-b border-slate-200 pb-2 text-sm font-semibold capitalize text-indigo-600 dark:border-slate-700 dark:text-indigo-400">
                {moduleNames[module] || module}
              </h4>
              <div className="flex flex-col gap-2">
                {perms.map((permission) => (
                  <div key={permission.id} className="rounded-lg px-2 py-2 text-sm text-slate-800 dark:text-slate-100">
                    <span className="capitalize">{permission.action}</span>
                    {permission.description && (
                      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                        {permission.description}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Guardar Cambios' : 'Crear Rol'}
        </Button>
      </div>
    </form>
  )
}
