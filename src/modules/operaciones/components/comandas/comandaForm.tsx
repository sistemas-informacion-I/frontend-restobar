import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { FormSelect } from '@/shared/components/ui/forms'
import { Card } from '@/shared/components/ui/Card'
import { ClipboardList, Trash2, Plus, Users, Store, Grid3X3, Armchair, UserRound } from 'lucide-react'
import type { Comanda, Mesa, Sector, Cliente, CreateComandaData, UpdateComandaData } from '../../services/types'

interface ComandaFormProps {
  comanda?: Comanda
  mesas?: Mesa[]
  sectores?: Sector[]
  clientes?: Cliente[]
  sucursalNombre?: string
  productos?: Array<{ id: number; nombre: string; precio: number }>
  promociones?: Array<{ id: number; nombre: string; productos: Array<{ idProductoFinal: number; nombre: string }> }>
  onSubmit: (data: CreateComandaData | UpdateComandaData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  isEditing?: boolean
  tipoServicio?: 'MESA' | 'PARA_LLEVAR' | 'ONLINE'
}

export function ComandaForm({
  comanda,
  mesas = [],
  sectores = [],
  clientes = [],
  sucursalNombre,
  productos = [],
  promociones = [],
  onSubmit,
  onCancel,
  isLoading,
  isEditing = false,
  tipoServicio = 'MESA'
}: ComandaFormProps) {
  const { register, handleSubmit, control, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      tipoServicio: comanda?.tipoServicio || tipoServicio,
      numeroPersonas: comanda?.numeroPersonas,
      observaciones: comanda?.observaciones,
      idMesa: comanda?.idMesa,
      idCliente: comanda?.idCliente,
      idPromocion: comanda?.idPromocion,
      estado: comanda?.estado || 'ABIERTA',
      items: comanda?.items?.map(item => ({
        idProductoFinal: item.idProductoFinal,
        cantidad: item.cantidad,
        notas: item.notas,
        esPromocion: item.esPromocion,
        idPromocion: item.idPromocion
      })) || []
    }
  })

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'items'
  })

  const selectedTipoServicio = watch('tipoServicio')
  const selectedPromocionId = watch('idPromocion')
  const prevPromocionIdRef = useRef<number | undefined>(comanda?.idPromocion)

  // Sector seleccionado (no se envía al backend, sólo filtra las mesas disponibles)
  const [selectedSectorId, setSelectedSectorId] = useState<number | undefined>(comanda?.idSector)

  // Mesas que pertenecen al sector elegido
  const mesasDelSector = useMemo(
    () => (selectedSectorId ? mesas.filter(m => m.idSector === selectedSectorId) : []),
    [mesas, selectedSectorId]
  )

  // Al cambiar de sector, limpiamos la mesa elegida si ya no pertenece al sector
  useEffect(() => {
    const idMesaActual = watch('idMesa')
    if (idMesaActual && !mesasDelSector.some(m => m.idMesa === idMesaActual)) {
      setValue('idMesa', undefined)
    }
  }, [selectedSectorId, mesasDelSector, setValue, watch])

  // Si el servicio deja de ser MESA, no debe enviarse mesa ni sector
  useEffect(() => {
    if (selectedTipoServicio !== 'MESA') {
      setValue('idMesa', undefined)
      setSelectedSectorId(undefined)
    }
  }, [selectedTipoServicio, setValue])

  const handleAddItem = () => {
    append({
      idProductoFinal: 0,
      cantidad: 1,
      notas: '',
      esPromocion: false,
      idPromocion: undefined
    })
  }

  useEffect(() => {
    const promoId = selectedPromocionId ? Number(selectedPromocionId) : undefined
    const prevPromoId = prevPromocionIdRef.current

    if (promoId === prevPromoId && promociones.length > 0) {
      return
    }

    const currentItems = (watch('items') || []) as Array<{
      idProductoFinal: number
      cantidad: number
      notas?: string
      esPromocion?: boolean
      idPromocion?: number
    }>

    const manualItems = currentItems
      .filter((item) => !item?.esPromocion)
      .map((item) => ({
        idProductoFinal: item.idProductoFinal,
        cantidad: item.cantidad,
        notas: item.notas,
        esPromocion: false,
        idPromocion: undefined,
      }))

    const promocion = promociones.find((p) => p.id === promoId)
    const promoItems = promocion
      ? promocion.productos.map((producto) => ({
          idProductoFinal: producto.idProductoFinal,
          cantidad: 1,
          notas: '',
          esPromocion: true,
          idPromocion: promocion.id,
        }))
      : []

    replace([...manualItems, ...promoItems])
    prevPromocionIdRef.current = promoId
  }, [promociones, replace, selectedPromocionId, watch])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 animate-in fade-in">
      {/* Información General */}
      <Card className="p-5 border border-wine-100/50 dark:border-wine-900/20 bg-wine-50/20 dark:bg-wine-950/10">
        <h3 className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/50 dark:text-wine-300/50">
          Información General
        </h3>

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
            name="idPromocion"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Promoción (opcional)"
                options={[
                  { value: '', label: 'Sin promoción' },
                  ...promociones.map((p) => ({ value: p.id, label: p.nombre }))
                ]}
                placeholder="Seleccionar promoción"
                value={field.value}
                onChange={(val) => field.onChange(val ? Number(val) : undefined)}
              />
            )}
          />

          <Controller
            name="idCliente"
            control={control}
            render={({ field }) => (
              <FormSelect
                label="Cliente (necesario para facturar)"
                icon={<UserRound size={18} />}
                options={[
                  { value: 0, label: 'Anónimo / Sin cliente' },
                  ...clientes.map(c => {
                    const nombre = c.nombreCompleto || c.razonSocial || `Cliente #${c.idCliente}`
                    return {
                      value: c.idCliente,
                      label: c.nit ? `${nombre} · NIT ${c.nit}` : nombre
                    }
                  })
                ]}
                placeholder="Anónimo / Sin cliente"
                value={field.value}
                onChange={(val) => field.onChange(val ? Number(val) : undefined)}
              />
            )}
          />
        </div>

        {/* Ubicación (sólo servicio en mesa) */}
        {selectedTipoServicio === 'MESA' && (
          <div className="mt-4 rounded-2xl border border-wine-100/50 bg-white/60 p-4 dark:border-wine-900/20 dark:bg-black/20">
            <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-wine-700 dark:text-wine-300">
              <Store size={14} />
              {sucursalNombre ? `Sucursal: ${sucursalNombre}` : 'Ubicación de la mesa'}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormSelect
                label="Sector"
                icon={<Grid3X3 size={18} />}
                options={sectores.map(s => ({
                  value: s.idSector,
                  label: s.nombre
                }))}
                value={selectedSectorId}
                onChange={(val) => setSelectedSectorId(val ? Number(val) : undefined)}
                placeholder={sectores.length ? 'Seleccionar sector' : 'No hay sectores'}
                disabled={sectores.length === 0}
              />

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
                    icon={<Armchair size={18} />}
                    options={mesasDelSector.map(m => ({
                      value: m.idMesa,
                      label: `Mesa ${m.numeroMesa} · ${m.capacidadPersonas} pers.`
                    }))}
                    placeholder={
                      !selectedSectorId
                        ? 'Primero elige un sector'
                        : mesasDelSector.length === 0
                        ? 'Sin mesas libres en el sector'
                        : 'Seleccionar mesa'
                    }
                    disabled={!selectedSectorId || mesasDelSector.length === 0}
                    error={(errors as Record<string, { message?: string }>).idMesa?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-4">
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
        )}

        <div className="mt-4">
          <label className="mb-1.5 block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">
            Observaciones
          </label>
          <textarea
            placeholder="Alergias, preferencias, etc."
            className="w-full rounded-2xl border border-wine-100/50 bg-white/80 px-4 py-3 text-sm text-slate-900 outline-none transition-all focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/20 dark:bg-black/30 dark:text-white"
            rows={3}
            {...register('observaciones')}
          />
        </div>
      </Card>

      {/* Items de la Comanda */}
      <Card className="p-5 border border-wine-100/50 dark:border-wine-900/20">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/50 dark:text-wine-300/50">
            <ClipboardList size={16} className="text-wine-600" />
            Productos
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleAddItem}
            className="flex items-center gap-2 !rounded-xl border border-wine-100/50 text-[10px] font-black uppercase tracking-widest dark:border-wine-900/20"
          >
            <Plus size={16} />
            Agregar
          </Button>
        </div>

        {fields.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-wine-100/50 py-8 text-center dark:border-wine-900/20">
            <ClipboardList size={28} className="text-wine-200 dark:text-wine-900/40" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
              No hay productos. Haz clic en "Agregar"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-2xl border border-wine-100/50 bg-wine-50/20 p-4 dark:border-wine-900/20 dark:bg-wine-950/10"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-700 dark:text-wine-300">
                    Producto {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="!rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-900/20"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                {/* El selector de producto ocupa toda la fila para tener espacio de sobra */}
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
                      {...field}
                    />
                  )}
                />

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[120px_1fr]">
                  <Input
                    label="Cantidad"
                    type="number"
                    min={1}
                    {...register(`items.${index}.cantidad`, {
                      required: 'La cantidad es obligatoria',
                      min: { value: 1, message: 'Mínimo 1' }
                    })}
                    error={errors.items?.[index]?.cantidad?.message}
                  />

                  <Input
                    label="Notas"
                    placeholder="Sin cebolla, término medio..."
                    {...register(`items.${index}.notas`)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end pt-4 border-t border-wine-100/50 dark:border-wine-900/20">
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
