import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Grid3X3, Info, Layers } from 'lucide-react'

interface CreateSectorData {
  nombre: string
  descripcion?: string
  tipoSector: string
}

interface SectorFormProps {
  nombreSucursal: string
  onSubmit: (data: CreateSectorData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface FormData {
  nombre: string
  descripcion: string
  tipoSector: string
}

export function SectorForm({ nombreSucursal, onSubmit, onCancel, isLoading }: SectorFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      nombre: '',
      descripcion: '',
      tipoSector: 'SALON',
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data)
  }

  const tipoSectorOptions = [
    { value: 'SALON', label: 'Salón Principal' },
    { value: 'TERRAZA', label: 'Terraza' },
    { value: 'VIP', label: 'Zona VIP' },
    { value: 'BARRA', label: 'Barra de Tragos' },
    { value: 'COCINA', label: 'Área de Cocina' },
  ]

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 rounded-2xl bg-wine-50/50 p-4 border border-wine-100/30 dark:bg-wine-900/10 dark:border-wine-900/20">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-wine-950/40 text-wine-600 shadow-sm">
          <Info size={18} />
        </div>
        <p className="text-sm font-bold text-wine-900/70 dark:text-wine-300/70 tracking-tight leading-tight">
          Vas a crear una sub-área administrativa para: <span className="text-wine-600 dark:text-wine-400">{nombreSucursal}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Input
          label="Nombre del Sector"
          type="text"
          placeholder="Ej: Planta Alta, Terraza Norte..."
          icon={<Layers size={18} />}
          error={errors.nombre?.message}
          {...register('nombre', {
            required: 'Ingresa el nombre descriptivo del sector',
            minLength: { value: 2, message: 'El nombre es muy corto' },
          })}
        />

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 flex items-center gap-2 pl-1">
            <Grid3X3 size={14} className="text-wine-600" />
            Tipo de Sector
          </label>
          <select
            {...register('tipoSector', { required: 'Elige una de las categorías' })}
            className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
          >
            {tipoSectorOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-white dark:bg-wine-950">
                {option.label}
              </option>
            ))}
          </select>
          {errors.tipoSector && (
            <span className="text-[10px] font-bold uppercase tracking-widest text-rose-500 mt-1 pl-1">{errors.tipoSector.message}</span>
          )}
        </div>

        <Input
          label="Descripción Adicional"
          type="text"
          placeholder="Información utilitaria sobre el sector..."
          icon={<Info size={18} />}
          error={errors.descripcion?.message}
          {...register('descripcion')}
        />
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
          className="shadow-lg shadow-wine-900/20 min-w-[160px]"
        >
          Crear Sector
        </Button>
      </div>
    </form>
  )
}