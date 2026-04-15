import { Mail, User as UserIcon, CreditCard, Phone, KeyRound, ShieldAlert, Shield } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Role } from '../../../services/types'

interface UserFormViewProps {
  register: any
  handleSubmit: any
  errors: any
  onFormSubmit: (data: any) => Promise<void>
  isEdit: boolean
  isLoading: boolean
  onCancel: () => void
  availableRoles: Role[]
  rolesLoading: boolean
  searchTerm: string
  setSearchTerm: (value: string) => void
  filteredRoles: Role[]
  selectedRoleIds: number[]
  toggleRole: (id: number) => void
}

export function UserFormView({
  register,
  handleSubmit,
  errors,
  onFormSubmit,
  isEdit,
  isLoading,
  onCancel,
  availableRoles,
  rolesLoading,
  searchTerm,
  setSearchTerm,
  filteredRoles,
  selectedRoleIds,
  toggleRole
}: UserFormViewProps) {
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Sexo</label>
          <select
            {...register('sexo')}
            className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
          >
            <option value="O" className="bg-white dark:bg-wine-950">Otro</option>
            <option value="M" className="bg-white dark:bg-wine-950">Masculino</option>
            <option value="F" className="bg-white dark:bg-wine-950">Femenino</option>
          </select>
        </div>

        {isEdit && (
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 flex items-center gap-2">
              <ShieldAlert size={14} className="text-wine-600" />
              Estado de Acceso
            </label>
            <select
              {...register('estadoAcceso')}
              className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
            >
              <option value="HABILITADO" className="bg-white dark:bg-wine-950">Habilitado</option>
              <option value="SUSPENDIDO" className="bg-white dark:bg-wine-950">Suspendido</option>
              <option value="BLOQUEADO" className="bg-white dark:bg-wine-950">Bloqueado</option>
            </select>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Activo (General)</label>
          <select
            {...register('activo', {
              setValueAs: (value: any) => String(value) === 'true',
            })}
            className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
          >
            <option value="true" className="bg-white dark:bg-wine-950">Activo</option>
            <option value="false" className="bg-white dark:bg-wine-950">Inactivo</option>
          </select>
        </div>
      </div>

      <Input
        label="Dirección"
        type="text"
        placeholder="Dirección completa..."
        icon={<UserIcon size={18} />}
        error={errors.direccion?.message}
        {...register('direccion')}
      />

      {/* Role assignment */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
            <Shield size={14} className="text-wine-600" />
            Roles asignados
          </label>
          <span className="text-[10px] font-black uppercase tracking-widest text-wine-600 dark:text-wine-400">
            {selectedRoleIds.length} seleccionados
          </span>
        </div>

        {rolesLoading ? (
          <p className="text-xs font-bold text-wine-300 animate-pulse">Cargando roles...</p>
        ) : availableRoles.length === 0 ? (
          <p className="text-xs text-slate-400 italic font-medium">No hay roles disponibles.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-wine-400 group-focus-within:text-wine-600 transition-colors">
                <Shield size={14} />
              </span>
              <input
                type="text"
                placeholder="Filtrar roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-wine-50/30 dark:bg-black/40 border-2 border-wine-100/50 dark:border-wine-900/20 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:border-wine-600 transition-all shadow-inner"
              />
            </div>
            
            <div className="grid grid-cols-1 gap-3 rounded-[2rem] border border-wine-100/50 p-4 glass-card dark:border-wine-900/20 overflow-y-auto max-h-[220px] sm:grid-cols-2 custom-scrollbar">
              {filteredRoles.length === 0 ? (
                <p className="col-span-full py-8 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                  No se encontraron resultados
                </p>
              ) : (
                filteredRoles.map(role => {
                  const checked = selectedRoleIds.includes(Number(role.id))
                  return (
                    <label
                      key={role.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-3 transition-all duration-300 ${
                        checked
                          ? 'border-wine-600 bg-wine-600/10 shadow-lg shadow-wine-900/10'
                          : 'border-wine-100/30 bg-white/50 hover:border-wine-200 dark:border-wine-900/10 dark:bg-white/5 dark:hover:border-wine-800'
                      }`}
                    >
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(Number(role.id))}
                          className="peer h-4 w-4 appearance-none rounded border-2 border-wine-200 checked:border-wine-600 checked:bg-wine-600 transition-all"
                        />
                        <div className="absolute h-2 w-2 rounded-full bg-white opacity-0 peer-checked:opacity-100" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className={`text-xs font-black truncate tracking-tight ${checked ? 'text-wine-900 dark:text-wine-100' : 'text-slate-700 dark:text-slate-200'}`}>
                          {role.name}
                        </span>
                        {role.description && (
                          <span className="text-[10px] text-slate-500 dark:text-slate-500 font-medium truncate leading-tight">{role.description}</span>
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

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 border-t border-wine-100/50 pt-6 dark:border-wine-900/20 sm:flex-row">
        <Button type="button" variant="ghost" onClick={onCancel} className="bg-wine-50/50 dark:bg-wine-950/30">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-wine-900/20 min-w-[160px]">
          {isEdit ? 'Guardar Cambios' : 'Crear Usuario'}
        </Button>
      </div>
    </form>
  )
}
