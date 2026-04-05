import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { User, CreateUserData, UpdateUserData } from '../../services/api'
import { Role } from '../../services/types'
import { rolesService } from '../../services/roles.service'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Mail, User as UserIcon, CreditCard, Phone, KeyRound, ShieldAlert, Shield } from 'lucide-react'

interface UserFormProps {
  user?: User
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface UserFormData {
  ci: string
  nombre: string
  apellido: string
  username?: string
  password?: string
  telefono?: string
  sexo?: 'M' | 'F' | 'O'
  correo?: string
  direccion?: string
  activo?: boolean
  estadoAcceso?: string
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isEdit = !!user
  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>(
    user?.roles?.map(r => Number(r.id)) ?? []
  )
  const [rolesLoading, setRolesLoading] = useState(true)

  useEffect(() => {
    rolesService.getAll()
      .then(roles => setAvailableRoles(roles.filter(r => r.isActive)))
      .catch(() => setAvailableRoles([]))
      .finally(() => setRolesLoading(false))
  }, [])

  const filteredRoles = availableRoles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>({
    defaultValues: user ? {
      ci: user.ci,
      nombre: user.firstName,
      apellido: user.lastName,
      correo: user.email,
      telefono: user.phone,
      sexo: user.gender,
      direccion: user.address,
      activo: user.isActive,
      estadoAcceso: user.estadoAcceso,
    } : {
      activo: true,
      sexo: 'O',
      estadoAcceso: 'HABILITADO',
    },
  })

  const toggleRole = (id: number) => {
    setSelectedRoleIds(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    )
  }

  const onFormSubmit = async (data: UserFormData) => {
    await onSubmit({
      ...data,
      roles: selectedRoleIds,
    } as CreateUserData | UpdateUserData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      <Input
        label="CI"
        type="text"
        placeholder="Documento de identidad"
        icon={<CreditCard size={18} />}
        error={errors.ci?.message}
        {...register('ci', {
          required: 'Ingresa el CI del usuario',
        })}
      />

      <Input
        label="Nombre"
        type="text"
        placeholder="Nombre"
        icon={<UserIcon size={18} />}
        error={errors.nombre?.message}
        {...register('nombre', {
          required: 'Ingresa el nombre del usuario',
        })}
      />

      <Input
        label="Apellido"
        type="text"
        placeholder="Apellido"
        icon={<UserIcon size={18} />}
        error={errors.apellido?.message}
        {...register('apellido', {
          required: 'Ingresa el apellido del usuario',
        })}
      />

      {!isEdit && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nombre de usuario"
            type="text"
            placeholder="Username"
            icon={<UserIcon size={18} />}
            error={errors.username?.message}
            {...register('username', {
              required: 'Ingresa el username para el acceso',
            })}
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="Contraseña"
            icon={<KeyRound size={18} />}
            error={errors.password?.message}
            {...register('password', {
              required: 'Ingresa la contraseña inicial',
              minLength: {
                value: 6,
                message: 'La contraseña debe tener al menos 6 caracteres',
              },
            })}
          />
        </div>
      )}

      <Input
        label="Correo"
        type="email"
        placeholder="correo@ejemplo.com"
        icon={<Mail size={18} />}
        error={errors.correo?.message}
        {...register('correo', {
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Correo inválido. Ejemplo válido: nombre@dominio.com',
          },
        })}
      />

      <Input
        label="Teléfono"
        type="text"
        placeholder="Teléfono"
        icon={<Phone size={18} />}
        error={errors.telefono?.message}
        {...register('telefono')}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Sexo</label>
          <select
            {...register('sexo')}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="O">Otro</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        {isEdit && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ShieldAlert size={14} className="text-amber-500" />
              Estado de Acceso
            </label>
            <select
              {...register('estadoAcceso')}
              className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="HABILITADO">Habilitado</option>
              <option value="SUSPENDIDO">Suspendido</option>
              <option value="BLOQUEADO">Bloqueado</option>
            </select>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Activo (General)</label>
          <select
            {...register('activo', {
              setValueAs: (value) => String(value) === 'true',
            })}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>
      </div>

      <Input
        label="Dirección"
        type="text"
        placeholder="Dirección"
        icon={<UserIcon size={18} />}
        error={errors.direccion?.message}
        {...register('direccion')}
      />

      {/* Role assignment */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Shield size={14} className="text-indigo-500" />
            Roles asignados
          </label>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {selectedRoleIds.length} seleccionados
          </span>
        </div>

        {rolesLoading ? (
          <p className="text-xs text-slate-400">Cargando roles...</p>
        ) : availableRoles.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No hay roles disponibles.</p>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Shield size={14} />
              </span>
              <input
                type="text"
                placeholder="Buscar roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 bg-slate-50/50 p-2 dark:border-slate-700 dark:bg-slate-800/30 overflow-y-auto max-h-[180px] sm:grid-cols-2">
              {filteredRoles.length === 0 ? (
                <p className="col-span-full py-4 text-center text-xs text-slate-500">
                  No se encontraron roles que coincidan con la búsqueda.
                </p>
              ) : (
                filteredRoles.map(role => {
                  const checked = selectedRoleIds.includes(Number(role.id))
                  return (
                    <label
                      key={role.id}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-all duration-200 ${
                        checked
                          ? 'border-indigo-500/50 bg-indigo-50 dark:border-indigo-400/30 dark:bg-indigo-400/10'
                          : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-indigo-700/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleRole(Number(role.id))}
                        className="mt-1 h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 focus:ring-indigo-500 focus:ring-offset-2"
                      />
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={`text-xs font-semibold truncate ${checked ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
                          {role.name}
                        </span>
                        {role.description && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate leading-tight">{role.description}</span>
                        )}
                      </div>
                    </label>
                  )
                })
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Guardar Cambios' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  )
}
