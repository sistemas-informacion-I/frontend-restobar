import { useForm } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { LayoutList, AlignLeft, GitBranch } from 'lucide-react'
import { Categoria, CreateCategoriaData } from '@/modules/comercial/services/categorias.service'

interface CategoriaFormProps {
  categoria: Categoria | null
  categorias: Categoria[]
  onSubmit: (data: CreateCategoriaData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface CategoriaFormValues {
  nombre: string
  descripcion: string
  idCategoriaPadre: string
}

export function CategoriaForm({ categoria, categorias, onSubmit, onCancel, isLoading }: CategoriaFormProps) {
  const isEdit = !!categoria

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoriaFormValues>({
    defaultValues: categoria
      ? {
          nombre: categoria.nombre,
          descripcion: categoria.descripcion || '',
          idCategoriaPadre: categoria.idCategoriaPadre ? String(categoria.idCategoriaPadre) : '',
        }
      : {
          nombre: '',
          descripcion: '',
          idCategoriaPadre: '',
        },
  })

  const handleFormSubmit = (data: CategoriaFormValues) => {
    return onSubmit({
      ...data,
      idCategoriaPadre: data.idCategoriaPadre && data.idCategoriaPadre !== ''
        ? Number(data.idCategoriaPadre)
        : null,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-5">

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 flex items-center gap-2">
            Datos de la Categoría
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>
        </div>

        <Input
          label="Nombre"
          type="text"
          placeholder="Ej: Platos principales, Bebidas frías..."
          icon={<LayoutList size={18} />}
          error={errors.nombre?.message as string}
          {...register('nombre', { required: 'El nombre es obligatorio' })}
        />

        <Input
          label="Descripción (opcional)"
          type="text"
          placeholder="Breve descripción de la categoría"
          icon={<AlignLeft size={18} />}
          {...register('descripcion')}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">
            Categoría Padre (opcional)
          </label>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-4 text-slate-400">
              <GitBranch size={18} />
            </span>
            <select
              className="w-full pl-12 h-12 rounded-2xl border border-wine-100/50 bg-white/50 text-sm font-medium text-slate-900 dark:bg-black/20 dark:text-white dark:border-wine-900/20 focus:outline-none focus:border-wine-600 transition-colors appearance-none"
              {...register('idCategoriaPadre')}
            >
              <option value="">Sin categoría padre (raíz)</option>
              {categorias
                .filter(c => c.activo && c.idCategoria !== categoria?.idCategoria)
                .map(c => (
                  <option key={c.idCategoria} value={c.idCategoria}>
                    {'— '.repeat(c.nivel - 1)}{c.nombre}
                  </option>
                ))}
            </select>
          </div>
          <p className="text-[10px] text-wine-900/30 dark:text-wine-100/20 px-1 mt-0.5">
            Si seleccionas una categoría padre, el nivel se calculará automáticamente.
          </p>
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
          className="shadow-lg shadow-wine-900/20 min-w-[200px]"
        >
          {isEdit ? 'Guardar Cambios' : 'Registrar Categoría'}
        </Button>
      </div>
    </form>
  )
}
