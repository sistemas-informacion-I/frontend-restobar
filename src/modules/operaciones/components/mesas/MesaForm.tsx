import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Armchair } from 'lucide-react'
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
    <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-5">
      <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">
        Creando mesa en sector: <strong>{nombreSector}</strong>
      </div>

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

      <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading}>
          Crear Mesa
        </Button>
      </div>
    </form>
  )
}