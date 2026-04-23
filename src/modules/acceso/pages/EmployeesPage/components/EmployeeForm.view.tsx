import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { User, CreditCard, Mail, Phone, MapPin, Briefcase, KeyRound } from 'lucide-react'
import { Empleado, CreateEmpleadoData } from '@/modules/acceso/services/empleados.service'
import { Role } from '@/modules/acceso/services/api'

interface EmployeeFormProps {
  employee: Empleado | null
  roles: Role[]
  onSubmit: (data: CreateEmpleadoData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function EmployeeForm({ employee, roles, onSubmit, onCancel, isLoading }: EmployeeFormProps) {
  const isEdit = !!employee

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<any>({
    defaultValues: employee ? {
      ci: employee.ci,
      nombre: employee.nombre,
      apellido: employee.apellido,
      username: employee.username,
      telefono: employee.telefono || '',
      sexo: employee.sexo,
      correo: employee.correo || '',
      direccion: employee.direccion || '',
      activo: employee.activo,
      salario: employee.salario,
      turno: employee.turno || '',
      roles: employee.roles || [],
    } : {
      ci: '',
      nombre: '',
      apellido: '',
      username: '',
      password: '',
      telefono: '',
      sexo: 'M',
      correo: '',
      direccion: '',
      activo: true,
      salario: 0,
      turno: 'MA',
      roles: [],
    },
  })

  // Helper to handle role changes since we want an array of numbers
  const handleRoleChange = (roleId: number, checked: boolean) => {
    const currentRoles = getValues('roles') || []
    if (checked) {
      setValue('roles', [...currentRoles, roleId])
    } else {
      setValue('roles', currentRoles.filter((id: number) => id !== roleId))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* User Info */}
        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 flex items-center gap-2">
            Información Básica y Acceso
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>
        </div>

        <Input
          label="Documento de Identidad (CI)"
          type="text"
          placeholder="Número de CI"
          icon={<CreditCard size={18} />}
          error={errors.ci?.message as string}
          {...register('ci', { required: 'El CI es obligatorio' })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Nombre"
            type="text"
            placeholder="Nombres"
            icon={<User size={18} />}
            error={errors.nombre?.message as string}
            {...register('nombre', { required: 'El nombre es obligatorio' })}
          />
          <Input
            label="Apellido"
            type="text"
            placeholder="Apellidos"
            icon={<User size={18} />}
            error={errors.apellido?.message as string}
            {...register('apellido', { required: 'El apellido es obligatorio' })}
          />
        </div>

        <Input
          label="Nombre de Usuario"
          type="text"
          placeholder="Username (opcional)"
          icon={<User size={18} />}
          {...register('username')}
        />

        {!isEdit && (
          <Input
            label="Contraseña Inicial"
            type="password"
            placeholder="Mín. 8 caracteres"
            icon={<KeyRound size={18} />}
            error={errors.password?.message as string}
            {...register('password', { 
               minLength: { value: 8, message: 'Mínimo 8 caracteres' } 
            })}
          />
        )}

        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 mt-2 flex items-center gap-2">
            Datos de Contacto y Perfil
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>
        </div>

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="email@ejemplo.com"
          icon={<Mail size={18} />}
          error={errors.correo?.message as string}
          {...register('correo')}
        />

        <Input
          label="Teléfono"
          type="text"
          placeholder="Nro. celular"
          icon={<Phone size={18} />}
          {...register('telefono')}
        />

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 pl-1">Sexo</label>
          <select
            {...register('sexo')}
            className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
          >
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="O">Otro</option>
          </select>
        </div>

        <Input
          label="Dirección"
          type="text"
          placeholder="Domicilio actual"
          icon={<MapPin size={18} />}
          {...register('direccion')}
        />

        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 mt-2 flex items-center gap-2">
            Datos Laborales
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>
        </div>

        <Input
          label="Salario Mensual (Bs)"
          type="number"
          step="0.01"
          placeholder="0.00"
          icon={<Briefcase size={18} />}
          error={errors.salario?.message as string}
          {...register('salario', { required: 'El salario es obligatorio', min: 0 })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 pl-1">Turno Laboral</label>
          <select
            {...register('turno')}
            className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
          >
            <option value="MA">Mañana</option>
            <option value="TA">Tarde</option>
            <option value="NO">Noche</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 pl-1 mb-3 block">Cargos / Roles Operativos</label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((role) => (
              <label 
                key={role.id} 
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border-2 px-4 py-3 transition-all duration-300 ${
                  watch('roles')?.includes(Number(role.id))
                    ? 'border-wine-600 bg-wine-50/50 dark:border-wine-500 dark:bg-wine-900/20 shadow-lg shadow-wine-900/5'
                    : 'border-wine-100/50 bg-white/50 hover:border-wine-200 dark:border-wine-900/20 dark:bg-black/40'
                }`}
              >
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={watch('roles')?.includes(Number(role.id))}
                    onChange={(e) => handleRoleChange(Number(role.id), e.target.checked)}
                  />
                  <div className={`h-5 w-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                    watch('roles')?.includes(Number(role.id))
                      ? 'border-wine-600 bg-wine-600 dark:border-wine-500 dark:bg-wine-500'
                      : 'border-wine-200 dark:border-wine-800'
                  }`}>
                    {watch('roles')?.includes(Number(role.id)) && (
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-in zoom-in-50 duration-300" />
                    )}
                  </div>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider ${
                  watch('roles')?.includes(Number(role.id))
                    ? 'text-wine-900 dark:text-wine-100'
                    : 'text-wine-900/40 dark:text-wine-400/40'
                }`}>
                  {role.name}
                </span>
              </label>
            ))}
          </div>
          {errors.roles && <p className="mt-2 text-[10px] font-bold text-rose-500 uppercase tracking-widest pl-1">{errors.roles.message as string}</p>}
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 border-t border-wine-100/30 pt-6 dark:border-wine-900/10 sm:flex-row">
        <Button 
          type="button" 
          variant="ghost" 
          onClick={onCancel}
          className="bg-wine-50/50 dark:bg-wine-950/30"
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          isLoading={isLoading}
          className="shadow-lg shadow-wine-900/20 min-w-[200px]"
        >
          {isEdit ? 'Guardar Cambios' : 'Confirmar Contratación'}
        </Button>
      </div>
    </form>
  )
}
