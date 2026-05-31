import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
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
        <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
          Editando mesa: <strong>Mesa {mesa.numeroMesa}</strong>
          {mesa.nombreSector && <span> (Sector: {mesa.nombreSector})</span>}
        </div>
      )}

      {!isEdit && (
        <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
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
        <select
          {...register('disponibilidad')}
          className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:focus:bg-black/40 dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
        >
          {disponibilidadOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 flex items-center gap-2 pl-1">
          Sector
        </label>
        <select
          {...register('idSector', { required: 'Selecciona un sector', valueAsNumber: true })}
          className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:focus:bg-black/40 dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
        >
          <option value={0}>Selecciona un sector</option>
          {sectores.map((sector) => (
            <option key={sector.idSector} value={sector.idSector}>
              {sector.nombre} ({sector.tipoSector})
            </option>
          ))}
        </select>
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