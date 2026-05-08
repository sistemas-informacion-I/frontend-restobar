import { useForm, Controller } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { LayoutList, AlignLeft, GitBranch, AlertCircle } from 'lucide-react'
import { Categoria, CreateCategoriaData } from '@/modules/comercial/services/categorias.service'
import { FormSelect } from '@/shared/components/ui/forms'

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
    control,
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

  // Opciones para el select de categoría padre:
  // - Excluye la categoría actual (no puede ser su propio padre)
  // - Excluye categorías inactivas
  const padreOptions = [
    { value: '', label: 'Sin categoría padre (raíz)' },
    ...categorias
      .filter((c) => c.activo && c.idCategoria !== categoria?.idCategoria)
      .map((c) => ({
        value: String(c.idCategoria),
        label: `${'— '.repeat(c.nivel - 1)}${c.nombre}`,
      })),
  ]

  const handleFormSubmit = (data: CategoriaFormValues) => {
    return onSubmit({
      ...data,
      // Convertir string vacío o null del select a null para el backend, de lo contrario a número
      idCategoriaPadre: data.idCategoriaPadre && data.idCategoriaPadre !== '' ? Number(data.idCategoriaPadre) : null,
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

        <div className="flex flex-col gap-1.5 group">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">
            Categoría Padre (opcional)
          </label>
          <div className="relative flex items-center group/input">
            <span className="pointer-events-none absolute left-4 text-slate-400 group-focus-within/input:text-wine-600 dark:group-focus-within/input:text-wine-400 transition-colors">
              <GitBranch size={18} />
            </span>
            <Controller
              name="idCategoriaPadre"
              control={control}
              render={({ field }) => (
                <FormSelect
                  className="pl-12"
                  options={padreOptions}
                  {...field}
                />
              )}
            />
          </div>
          {errors.idCategoriaPadre && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 px-1 animate-in slide-in-from-top-1">
              <AlertCircle size={12} className="shrink-0" />
              {errors.idCategoriaPadre.message as React.ReactNode}
            </span>
          )}
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
