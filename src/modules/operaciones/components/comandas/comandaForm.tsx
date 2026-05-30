import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { FormSelect } from '@/shared/components/ui/forms'
import { Card } from '@/shared/components/ui/Card'
import { ClipboardList, Trash2, Plus, Users } from 'lucide-react'
import type { Comanda, Mesa, CreateComandaData, UpdateComandaData } from '../../services/types'

interface ComandaFormProps {
  comanda?: Comanda
  mesas?: Mesa[]
  productos?: Array<{ id: number; nombre: string; precio: number }>
  onSubmit: (data: CreateComandaData | UpdateComandaData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  isEditing?: boolean
  tipoServicio?: 'MESA' | 'PARA_LLEVAR' | 'ONLINE'
}

export function ComandaForm({
  comanda,
  mesas = [],
  productos = [],
  onSubmit,
  onCancel,
  isLoading,
  isEditing = false,
  tipoServicio = 'MESA'
}: ComandaFormProps) {
  const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
    defaultValues: {
      tipoServicio: comanda?.tipoServicio || tipoServicio,
      numeroPersonas: comanda?.numeroPersonas,
      observaciones: comanda?.observaciones,
      idMesa: comanda?.idMesa,
      estado: comanda?.estado || 'ABIERTA',
      items: comanda?.items?.map(item => ({
        idProductoFinal: item.idProductoFinal,
        cantidad: item.cantidad,
        notas: item.notas
      })) || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const selectedTipoServicio = watch('tipoServicio')

  const handleAddItem = () => {
    append({
      idProductoFinal: 0,
      cantidad: 1,
      notas: ''
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-in fade-in">
      {/* Tipo de Servicio */}
      <Card className="p-4 bg-wine-500/5 border border-wine-200/50">
        <h3 className="text-sm font-semibold text-wine-700 mb-4">Información General</h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="tipoServicio"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Tipo de Servicio"
                options={[
                  { value: 'MESA', label: 'En Mesa' },
                  { value: 'PARA_LLEVAR', label: 'Para Llevar' },
                  { value: 'ONLINE', label: 'En Línea' }
                ]}
                disabled={isEditing}
                placeholder="Seleccionar tipo"
                {...field}
              />
            )}
          />

          {selectedTipoServicio === 'MESA' && (
            <Controller
              name="idMesa"
              control={control}
              rules={{
                validate: value =>
                  selectedTipoServicio !== 'MESA' || value
                    ? true
                    : 'Mesa es requerida'
              }}
              render={({ field }) => (
                <FormSelect
                  label="Mesa"
                  options={mesas.map(m => ({
                    value: m.idMesa,
                    label: `${m.numeroMesa} (${m.capacidadPersonas} personas)`
                  }))}
                  placeholder="Seleccionar mesa"
                  {...field}
                />
              )}
            />
          )}

          <Input
            label="Personas"
            type="number"
            placeholder="2"
            icon={<Users size={18} />}
            {...register('numeroPersonas', {
              min: { value: 1, message: 'Mínimo 1 persona' }
            })}
            error={errors.numeroPersonas?.message}
          />

          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Estado"
                options={[
                  { value: 'ABIERTA', label: 'Abierta' },
                  { value: 'EN_PREPARACION', label: 'En Preparación' },
                  { value: 'LISTA', label: 'Lista' },
                  { value: 'CERRADA', label: 'Cerrada' }
                ]}
                placeholder="Seleccionar estado"
                {...field}
              />
            )}
          />
        </div>

        <div className="mt-4">
          <textarea
            placeholder="Observaciones (alergias, preferencias, etc.)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-wine-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            rows={3}
            {...register('observaciones')}
          />
        </div>
      </Card>

      {/* Items de la Comanda */}
      <Card className="p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <ClipboardList size={18} className="text-wine-600" />
            Productos
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddItem}
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Agregar
          </Button>
        </div>

        {fields.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
            No hay productos. Haz clic en "Agregar" para añadir items.
          </p>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-2 items-end bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <Controller
                  name={`items.${index}.idProductoFinal` as const}
                  control={control}
                  rules={{
                    required: 'Selecciona un producto',
                    validate: value => (value && value !== 0) || 'Selecciona un producto'
                  }}
                  render={({ field }) => (
                    <FormSelect
                      label="Producto"
                      options={productos.map(p => ({
                        value: p.id,
                        label: `${p.nombre} ($${p.precio})`
                      }))}
                      placeholder="Seleccionar producto"
                      error={errors.items?.[index]?.idProductoFinal?.message}
                      className="flex-1"
                      {...field}
                    />
                  )}
                />

                <Input
                  label="Cantidad"
                  type="number"
                  min={1}
                  {...register(`items.${index}.cantidad`, {
                    required: 'La cantidad es obligatoria',
                    min: { value: 1, message: 'Mínimo 1' }
                  })}
                  error={errors.items?.[index]?.cantidad?.message}
                  className="w-20"
                />

                <Input
                  label="Notas"
                  placeholder="Sin cebolla..."
                  {...register(`items.${index}.notas`)}
                  className="flex-1"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Comanda'}
        </Button>
      </div>
    </form>
  )
}
