import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Store } from 'lucide-react'


// mejorar
interface Sucursal {
  idSucursal?: number
  nombre: string
  direccion: string
  telefono?: string
  correo?: string
  ciudad?: string
  departamento?: string
  horarioApertura?: string
  horarioCierre?: string
  estadoOperativo?: string
  activo?: boolean
}
//para crear
interface CreateSucursalData {
  nombre: string
  direccion: string
  telefono?: string
  correo?: string
  ciudad?: string
  departamento?: string
  estadoOperativo?: string
}
//para actualizar
interface UpdateSucursalData {
  nombre?: string
  direccion?: string
  telefono?: string
  correo?: string
  ciudad?: string
  departamento?: string
  estadoOperativo?: string
}

interface SucursalFormProps {
  sucursal?: Sucursal
  onSubmit: (data: CreateSucursalData | UpdateSucursalData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface FormData {
  nombre: string
  direccion: string
  telefono: string
  correo: string
  ciudad: string
  departamento: string
  estadoOperativo: string
}

export function SucursalForm({ sucursal, onSubmit, onCancel, isLoading }: SucursalFormProps) {
  const isEdit = !!sucursal

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: sucursal ? {
      nombre: sucursal.nombre || '',
      direccion: sucursal.direccion || '',
      telefono: sucursal.telefono || '',
      correo: sucursal.correo || '',
      ciudad: sucursal.ciudad || '',
      departamento: sucursal.departamento || '',
      estadoOperativo: sucursal.estadoOperativo || '',
    } : {
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      ciudad: '',
      departamento: '',
      estadoOperativo: '',
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      <Input
        label="Nombre"
        type="text"
        placeholder="Nombre de la sucursal"
        icon={<Store size={18} />}
        error={errors.nombre?.message}
        {...register('nombre', {
          required: 'Ingresa el nombre de la sucursal',
          minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
        })}
      />

      <Input
        label="Dirección"
        type="text"
        placeholder="Dirección de la sucursal"
        error={errors.direccion?.message}
        {...register('direccion', {
          required: 'Ingresa la dirección',
        })}
      />

      <Input
        label="Teléfono"
        type="text"
        placeholder="Teléfono de contacto"
        error={errors.telefono?.message}
        {...register('telefono')}
      />

      <Input
        label="Correo"
        type="email"
        placeholder="correo@sucursal.com"
        error={errors.correo?.message}
        {...register('correo', {
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' }
        })}
      />

      <Input
        label="Ciudad"
        type="text"
        placeholder="Ciudad"
        error={errors.ciudad?.message}
        {...register('ciudad')}
      />

      <Input
        label="Departamento"
        type="text"
        placeholder="Departamento"
        error={errors.departamento?.message}
        {...register('departamento')}
      />

      <Input
        label="Estado Operativo"
        type="text"
        placeholder="Ej: Abierta, Cerrada, Mantenimiento"
        error={errors.estadoOperativo?.message}
        {...register('estadoOperativo')}
      />

      <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Guardar Cambios' : 'Crear Sucursal'}
        </Button>
      </div>
    </form>
  )
}