import { useForm } from 'react-hook-form'
import { User, CreateUserData, UpdateUserData } from '../../services/api'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Mail, User as UserIcon, CreditCard, Phone } from 'lucide-react'

interface UserFormProps {
  user?: User
  onSubmit: (data: CreateUserData | UpdateUserData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export function UserForm({ user, onSubmit, onCancel, isLoading }: UserFormProps) {
  const isEdit = !!user

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserData | UpdateUserData>({
    defaultValues: user ? {
      ci: user.ci,
      nombre: user.firstName,
      apellido: user.lastName,
      correo: user.email,
      telefono: user.phone,
      sexo: user.gender,
      direccion: user.address,
      activo: user.isActive,
    } : {
      activo: true,
      sexo: 'O',
    },
  })

  const onFormSubmit = async (data: CreateUserData | UpdateUserData) => {
    await onSubmit(data)
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

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Estado</label>
          <select
            {...register('activo', {
              setValueAs: (value) => value === 'true',
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
