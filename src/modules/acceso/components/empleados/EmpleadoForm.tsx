import { useForm } from 'react-hook-form'
import { Empleado, CreateEmpleadoData, UpdateEmpleadoData } from '../../services/api'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Mail, User as UserIcon, CreditCard, Phone, MapPin, Lock, Hash, DollarSign } from 'lucide-react'

interface EmpleadoFormProps {
  empleado?: Empleado
  onSubmit: (data: CreateEmpleadoData | UpdateEmpleadoData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface EmpleadoFormData {
  ci: string
  nombre: string
  apellido: string
  username?: string
  password?: string
  telefono?: string
  sexo?: 'M' | 'F' | 'O'
  correo?: string
  direccion?: string
  codigoEmpleado?: string
  salario?: number
  turno?: 'AM' | 'PM'
  fechaContratacion?: string
  activo?: boolean
}

export function EmpleadoForm({ empleado, onSubmit, onCancel, isLoading }: EmpleadoFormProps) {
  const isEdit = !!empleado

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmpleadoFormData>({
    defaultValues: empleado ? {
      ci: empleado.ci,
      nombre: empleado.firstName,
      apellido: empleado.lastName,
      username: empleado.username,
      correo: empleado.email,
      telefono: empleado.phone,
      sexo: empleado.gender,
      direccion: empleado.address,
      codigoEmpleado: empleado.codigoEmpleado,
      salario: empleado.salary,
      turno: empleado.turno,
      fechaContratacion: empleado.hireDate,
      activo: empleado.isActive,
    } : {
      activo: true,
      sexo: 'O',
      turno: 'AM',
    },
  })

  const onFormSubmit = async (data: EmpleadoFormData) => {
    await onSubmit(data as CreateEmpleadoData | UpdateEmpleadoData)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
        Al guardar, el sistema creará o actualizará el usuario vinculado al empleado en una sola operación.
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="CI"
          type="text"
          placeholder="Documento de identidad"
          icon={<CreditCard size={18} />}
          error={errors.ci?.message}
          {...register('ci', {
            required: 'Ingresa el CI del empleado',
          })}
        />

        <Input
          label="Código de empleado"
          type="text"
          placeholder="Ej. EMP-001"
          icon={<Hash size={18} />}
          error={errors.codigoEmpleado?.message}
          {...register('codigoEmpleado')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Nombre"
          type="text"
          placeholder="Nombre"
          icon={<UserIcon size={18} />}
          error={errors.nombre?.message}
          {...register('nombre', {
            required: 'Ingresa el nombre del empleado',
          })}
        />

        <Input
          label="Apellido"
          type="text"
          placeholder="Apellido"
          icon={<UserIcon size={18} />}
          error={errors.apellido?.message}
          {...register('apellido', {
            required: 'Ingresa el apellido del empleado',
          })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Usuario"
          type="text"
          placeholder="Si lo dejas vacío se usará el CI"
          icon={<UserIcon size={18} />}
          error={errors.username?.message}
          {...register('username')}
        />

        <Input
          label={isEdit ? 'Nueva contraseña' : 'Contraseña temporal'}
          type="password"
          placeholder={isEdit ? 'Opcional para cambiarla' : 'Opcional'}
          icon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

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
        <Input
          label="Salario"
          type="number"
          step="0.01"
          placeholder="Salario"
          icon={<DollarSign size={18} />}
          error={errors.salario?.message}
          {...register('salario', {
            required: 'Ingresa el salario del empleado',
            setValueAs: (value) => value ? Number(value) : undefined,
          })}
        />

        <Input
          label="Fecha de contratación"
          type="date"
          icon={<UserIcon size={18} />}
          error={errors.fechaContratacion?.message}
          {...register('fechaContratacion')}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Turno</label>
          <select
            {...register('turno')}
            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="AM">Mañana (AM)</option>
            <option value="PM">Tarde (PM)</option>
          </select>
        </div>

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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Activo</label>
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
        icon={<MapPin size={18} />}
        error={errors.direccion?.message}
        {...register('direccion')}
      />

      <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Guardar cambios' : 'Crear empleado'}
        </Button>
      </div>
    </form>
  )
}
