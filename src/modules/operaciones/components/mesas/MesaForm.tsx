import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Armchair, Users, Info } from 'lucide-react'
import { CreateMesaData } from '../../services/types'

interface MesaFormProps {
  nombreSector: string
  onSubmit: (data: CreateMesaData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface FormData {
  numeroMesa: string
  capacidadPersonas: number
}

export function MesaForm({ nombreSector, onSubmit, onCancel, isLoading }: MesaFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      numeroMesa: '',
      capacidadPersonas: 4,
    },
  })

  const onFormSubmit = async (data: FormData) => {
    await onSubmit({
      numeroMesa: data.numeroMesa,
      capacidadPersonas: data.capacidadPersonas,
      idSector: 0,
    })
  }

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-3 rounded-2xl bg-wine-50/50 p-4 border border-wine-100/30 dark:bg-wine-900/10 dark:border-wine-900/20">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-wine-950/40 text-wine-600 shadow-sm">
          <Info size={18} />
        </div>
        <p className="text-sm font-bold text-wine-900/70 dark:text-wine-300/70 tracking-tight leading-tight">
          Estás registrando una nueva mesa dentro del sector: <span className="text-wine-600 dark:text-wine-400">{nombreSector}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Input
          label="Nro. de Mesa / Identificador"
          type="text"
          placeholder="Ej: M-10, Terraza-4..."
          icon={<Armchair size={18} />}
          error={errors.numeroMesa?.message}
          {...register('numeroMesa', {
            required: 'Debes asignar un número o identificación a la mesa',
            minLength: { value: 1, message: 'Identificación demasiado corta' },
          })}
        />

        <Input
          label="Capacidad de Comensales"
          type="number"
          placeholder="Ej: 4"
          icon={<Users size={18} />}
          error={errors.capacidadPersonas?.message}
          {...register('capacidadPersonas', {
            required: 'Especifica cuántas personas caben',
            min: { value: 1, message: 'La capacidad mínima es de 1 persona' },
            valueAsNumber: true,
          })}
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
          Crear Mesa
        </Button>
      </div>
    </form>
  )
}