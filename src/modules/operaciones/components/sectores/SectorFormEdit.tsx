import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Grid3X3 } from 'lucide-react'

interface CreateSectorData {
  nombre: string
  descripcion?: string
  tipoSector: string
  idSucursal?: number
}

interface UpdateSectorData {
  nombre?: string
  descripcion?: string
  tipoSector?: string
}

interface SectorFormEditProps {
  sector?: {
    idSector: number
    nombre: string
    descripcion?: string
    tipoSector: string
    nombreSucursal?: string
    idSucursal: number
  }
  nombreSucursal?: string
  onSubmit: (data: CreateSectorData | UpdateSectorData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface FormData {
  nombre: string
  descripcion: string
  tipoSector: string
}

export function SectorFormEdit({ sector, nombreSucursal, onSubmit, onCancel, isLoading }: SectorFormEditProps) {
  const isEdit = !!sector

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: sector?.nombre || '',
      descripcion: sector?.descripcion || '',
      tipoSector: sector?.tipoSector || 'SALON',
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data)
  }

  const tipoSectorOptions = [
    { value: 'SALON', label: 'Salón' },
    { value: 'BARRA', label: 'Barra' },
    { value: 'TERRAZA', label: 'Terraza' },
    { value: 'VIP', label: 'VIP' },
    { value: 'COCINA', label: 'Cocina' },
  ]

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      {isEdit && (
        <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          Editando sector: <strong>{sector.nombre}</strong>
          {sector.nombreSucursal && <span> (Sucursal: {sector.nombreSucursal})</span>}
        </div>
      )}

      {!isEdit && nombreSucursal && (
        <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          Creando sector para: <strong>{nombreSucursal}</strong>
        </div>
      )}

      <Input
        label="Nombre del sector"
        type="text"
        placeholder="Ej: Zona Principal, Barra de Tragos"
        icon={<Grid3X3 size={18} />}
        error={errors.nombre?.message}
        {...register('nombre', {
          required: 'Ingresa el nombre del sector',
          minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
        })}
      />

      <Input
        label="Descripción"
        type="text"
        placeholder="Descripción opcional del sector"
        error={errors.descripcion?.message}
        {...register('descripcion')}
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          Tipo de Sector
        </label>
        <select
          {...register('tipoSector', { required: 'Selecciona un tipo de sector' })}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        >
          {tipoSectorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.tipoSector && (
          <span className="text-xs text-rose-500">{errors.tipoSector.message}</span>
        )}
      </div>

      <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Guardar Cambios' : 'Crear Sector'}
        </Button>
      </div>
    </form>
  )
}