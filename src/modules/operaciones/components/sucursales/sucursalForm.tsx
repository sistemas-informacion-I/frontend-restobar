import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { FormSelect } from '@/shared/components/ui/forms'
import { Store, MapPin, Phone, Mail, Globe, Activity, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EmpleadosService, Empleado } from '@/modules/acceso/services/empleados.service'

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
  idResponsable?: number
}

interface SucursalFormProps {
  sucursal?: Sucursal
  onSubmit: (data: any) => Promise<void>
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
  idUsuarioResponsable?: number
}

export function SucursalForm({ sucursal, onSubmit, onCancel, isLoading }: SucursalFormProps) {
  const isEdit = !!sucursal
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [loadingEmpleados, setLoadingEmpleados] = useState(false)

  useEffect(() => {
    const fetchEmpleados = async () => {
      setLoadingEmpleados(true)
      try {
        const data = await EmpleadosService.getAll()
        setEmpleados(data)
      } catch (error) {
        console.error('Error fetching empleados:', error)
      } finally {
        setLoadingEmpleados(false)
      }
    }
    fetchEmpleados()
  }, [])

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
      idUsuarioResponsable: sucursal.idResponsable
    } : {
      nombre: '',
      direccion: '',
      telefono: '',
      correo: '',
      ciudad: '',
      departamento: '',
      estadoOperativo: 'ACTIVO',
      idUsuarioResponsable: undefined
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <Input
            label="Nombre de la Sucursal"
            type="text"
            placeholder="Ej: La Gaira Central"
            icon={<Store size={18} />}
            error={errors.nombre?.message as string}
            {...register('nombre', {
              required: 'El nombre es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
          />
        </div>

        <div className="md:col-span-2">
          <Input
            label="Dirección Física"
            type="text"
            placeholder="Av. Las Américas #123..."
            icon={<MapPin size={18} />}
            error={errors.direccion?.message as string}
            {...register('direccion', {
              required: 'La dirección es obligatoria',
            })}
          />
        </div>

        <Input
          label="Teléfono"
          type="text"
          placeholder="+591 ..."
          icon={<Phone size={18} />}
          error={errors.telefono?.message as string}
          {...register('telefono')}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          placeholder="sucursal@restobar.com"
          icon={<Mail size={18} />}
          error={errors.correo?.message as string}
          {...register('correo', {
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' }
          })}
        />

        <Input
          label="Ciudad"
          type="text"
          placeholder="Ej: Santa Cruz"
          icon={<Globe size={18} />}
          error={errors.ciudad?.message as string}
          {...register('ciudad')}
        />

        <Input
          label="Departamento"
          type="text"
          placeholder="Ej: Santa Cruz"
          icon={<Globe size={18} />}
          error={errors.departamento?.message as string}
          {...register('departamento')}
        />

        <Input
          label="Estado Operativo"
          type="text"
          placeholder="Ej: Abierta, Cerrada, Mantenimiento"
          icon={<Activity size={18} />}
          error={errors.estadoOperativo?.message as string}
          {...register('estadoOperativo')}
        />

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <User size={16} className="text-wine-500" />
            Responsable de Sucursal
          </label>
          <FormSelect
            {...register('idUsuarioResponsable', { 
              required: 'Debe asignar un responsable',
              valueAsNumber: true 
            })}
            options={[
              { value: '', label: loadingEmpleados ? 'Cargando empleados...' : 'Seleccione un responsable' },
              ...empleados.map(e => ({ 
                value: e.idUsuario, 
                label: `${e.nombre} ${e.apellido} (${e.username})` 
              }))
            ]}
            disabled={loadingEmpleados}
          />
          {errors.idUsuarioResponsable && (
            <span className="text-xs font-bold text-rose-500 px-1 uppercase tracking-widest">
              {errors.idUsuarioResponsable.message}
            </span>
          )}
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
          className="shadow-lg shadow-wine-900/20 min-w-[180px]"
        >
          {isEdit ? 'Guardar Cambios' : 'Registrar Sucursal'}
        </Button>
      </div>
    </form>
  )
}