import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Select } from '@/shared/components/ui/Select/Select'
import { Armchair } from 'lucide-react'
import { CreateMesaData, UpdateMesaData, Sector, Mesa } from '../../services/types'

interface MesaFormEditProps {
  mesa?: Mesa
  sectores: Sector[]
  onSubmit: (data: CreateMesaData | UpdateMesaData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface FormData {
  numeroMesa: string
  capacidadPersonas: number
  disponibilidad: string
  idSector: number
}

export function MesaFormEdit({ mesa, sectores, onSubmit, onCancel, isLoading }: MesaFormEditProps) {
  const isEdit = !!mesa

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      numeroMesa: mesa?.numeroMesa || '',
      capacidadPersonas: mesa?.capacidadPersonas || 4,
      disponibilidad: mesa?.disponibilidad || 'DISPONIBLE',
      idSector: mesa?.idSector || 0,
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data)
  }

  const disponibilidadOptions = [
    { value: 'DISPONIBLE', label: 'Disponible' },
    { value: 'OCUPADA', label: 'Ocupada' },
    { value: 'RESERVADA', label: 'Reservada' },
    { value: 'MANTENIMIENTO', label: 'Mantenimiento' },
  ]

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      {isEdit && (
        <div className="rounded-2xl border border-wine-100/50 bg-wine-50/40 p-3 text-sm font-semibold text-wine-700 dark:border-wine-900/20 dark:bg-wine-900/10 dark:text-wine-300">
          Editando mesa: <strong>Mesa {mesa.numeroMesa}</strong>
          {mesa.nombreSector && <span> (Sector: {mesa.nombreSector})</span>}
        </div>
      )}

      {!isEdit && (
        <div className="rounded-2xl border border-wine-100/50 bg-wine-50/40 p-3 text-sm font-semibold text-wine-700 dark:border-wine-900/20 dark:bg-wine-900/10 dark:text-wine-300">
          Nueva mesa
        </div>
      )}

      <Input
        label="Número de mesa"
        type="text"
        placeholder="Ej: 1, 2A, VIP-01"
        icon={<Armchair size={18} />}
        error={errors.numeroMesa?.message}
        {...register('numeroMesa', {
          required: 'Ingresa el número de mesa',
          minLength: { value: 1, message: 'El número debe tener al menos 1 caracter' },
        })}
      />

      <Input
        label="Capacidad (personas)"
        type="number"
        placeholder="Ej: 4"
        icon={<Armchair size={18} />}
        error={errors.capacidadPersonas?.message}
        {...register('capacidadPersonas', {
          required: 'Ingresa la capacidad',
          min: { value: 1, message: 'La capacidad debe ser al menos 1' },
          valueAsNumber: true,
        })}
      />

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 flex items-center gap-2 pl-1">
          Disponibilidad
        </label>
        <Controller
          name="disponibilidad"
          control={control}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={field.onChange}
              options={disponibilidadOptions}
              placeholder="Seleccionar disponibilidad"
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 flex items-center gap-2 pl-1">
          Sector
        </label>
        <Controller
          name="idSector"
          control={control}
          rules={{ validate: (value) => (value && value !== 0 ? true : 'Selecciona un sector') }}
          render={({ field }) => (
            <Select
              value={field.value}
              onChange={(v) => field.onChange(Number(v))}
              options={sectores.map((sector) => ({
                value: sector.idSector,
                label: `${sector.nombre} (${sector.tipoSector})`,
              }))}
              placeholder="Selecciona un sector"
            />
          )}
        />
        {errors.idSector && (
          <span className="text-xs text-rose-500">{errors.idSector.message}</span>
        )}
      </div>

      <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {isEdit ? 'Guardar Cambios' : 'Crear Mesa'}
        </Button>
      </div>
    </form>
  )
}