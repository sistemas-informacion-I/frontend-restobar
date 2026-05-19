import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { DollarSign, AlertTriangle } from 'lucide-react'
import { CatalogoProducto, CatalogoUpdateRequest } from '../../../models/catalogo.model'

interface CatalogoFormProps {
  producto: CatalogoProducto | null
  isLoading: boolean
  onSubmit: (data: CatalogoUpdateRequest) => Promise<void>
  onCancel: () => void
}

export function CatalogoForm({ producto, isLoading, onSubmit, onCancel }: CatalogoFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CatalogoUpdateRequest>({
    defaultValues: {
      precio: producto?.precio ?? 0,
      disponible: producto?.disponible ?? false,
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">

      {producto && !producto.hayStock && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-900/30 dark:bg-amber-900/10">
          <AlertTriangle size={18} className="text-amber-600 dark:text-amber-400 shrink-0" />
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">
            Sin stock — no se puede activar la disponibilidad hasta reponer ingredientes
          </p>
        </div>
      )}

      <Input
        label="Precio (Bs.)"
        type="number"
        step="0.01"
        min="0"
        placeholder="0.00"
        icon={<DollarSign size={18} />}
        error={errors.precio?.message}
        {...register('precio', {
          required: 'El precio es obligatorio',
          min: { value: 0, message: 'El precio debe ser mayor o igual a 0' },
          valueAsNumber: true,
        })}
      />

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-wine-900/60 dark:text-wine-300/60">
          Disponibilidad en catálogo
        </label>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="true"
              disabled={!producto?.hayStock}
              {...register('disponible', { setValueAs: (v) => v === 'true' })}
              className="accent-wine-600"
            />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Disponible</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="false"
              {...register('disponible', { setValueAs: (v) => v === 'true' })}
              className="accent-wine-600"
            />
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">No disponible</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col-reverse justify-end gap-3 border-t border-wine-100/30 pt-6 dark:border-wine-900/10 sm:flex-row">
        <Button type="button" variant="ghost" onClick={onCancel} className="bg-wine-50/50 dark:bg-wine-950/30">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-wine-900/20 min-w-[200px]">
          Guardar Cambios
        </Button>
      </div>
    </form>
  )
}
