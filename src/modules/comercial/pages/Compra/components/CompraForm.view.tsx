import { useState, useEffect, useCallback } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Input } from '@/shared/components/ui/Input'
import { FormSelect } from '@/shared/components/ui/forms'
import { Button } from '@/shared/components/ui/Button'
import {
  Hash, Calendar, Building2, User,
  Package, Store, Plus, Trash2, AlertCircle, DollarSign, ListOrdered,
} from 'lucide-react'
import { CompraResponse, CompraRequest, DetalleCompraRequest } from '@/modules/comercial/services/compras.service'
import { Proveedor } from '@/modules/comercial/services/proveedores.service'
import { Empleado } from '@/modules/acceso/services/empleados.service'
import { InventarioItem, StockSucursal } from '@/modules/inventario/services/inventario.service'
import { inventarioService } from '@/modules/inventario/services/inventario.service'

interface CompraFormProps {
  compra?: CompraResponse | null
  onSubmit: (data: CompraRequest) => Promise<void>
  onCancel: () => void
  isLoading: boolean
  proveedores: Proveedor[]
  employees: Empleado[]
  insumos: InventarioItem[]
  sucursales: { idSucursal: number; nombre: string }[]
  sucursalesLoading: boolean
}

interface DetalleFormItem {
  idInventario: number
  idSucursal: number
  cantidad: number
  precioUnitario: number
}

interface CompraFormData {
  idProveedor: number
  idEmpleado: number
  nroFactura: string
  fechaCompra: string
  fechaEntregaProgramada: string
  fechaLimitePago: string
  observaciones: string
  descuento: number
  detalles: DetalleFormItem[]
}

export function CompraForm({
  compra,
  onSubmit,
  onCancel,
  isLoading,
  proveedores,
  employees,
  insumos,
  sucursales,
  sucursalesLoading,
}: CompraFormProps) {
  const isEdit = !!compra
  const [stockCache, setStockCache] = useState<Record<number, StockSucursal[]>>({})
  const [resolvingStocks, setResolvingStocks] = useState<Record<string, boolean>>({})

  const proveedorOptions = [
    { value: '', label: 'Seleccionar proveedor' },
    ...proveedores.map((p) => ({
      value: p.idProveedor,
      label: p.empresa,
    })),
  ]

  const empleadoOptions = [
    { value: '', label: 'Seleccionar empleado' },
    ...employees.filter((e) => e.activo).map((e) => ({
      value: e.idEmpleado,
      label: `${e.nombre} ${e.apellido}`,
    })),
  ]

  const productoOptions = [
    { value: '', label: 'Seleccionar producto' },
    ...insumos.map((i) => ({
      value: i.idInventario,
      label: `${i.nombre} (${i.codigo})`,
    })),
  ]

  const sucursalOptions = [
    { value: '', label: 'Seleccionar sucursal' },
    ...sucursales.map((s) => ({
      value: s.idSucursal,
      label: s.nombre,
    })),
  ]

  const buildDefaultDetalles = (): DetalleFormItem[] => {
    if (!compra || !compra.detalles.length) return [{ idInventario: 0 as any, idSucursal: 0 as any, cantidad: 1, precioUnitario: 0 as any }]

    return compra.detalles.map((d) => ({
      idInventario: 0 as any,
      idSucursal: 0 as any,
      cantidad: d.cantidad,
      precioUnitario: d.precioUnitario,
    }))
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompraFormData>({
    defaultValues: {
      idProveedor: compra?.idProveedor || ('' as any),
      idEmpleado: compra?.idEmpleado || ('' as any),
      nroFactura: compra?.nroFactura || '',
      fechaCompra: compra?.fechaCompra || '',
      fechaEntregaProgramada: compra?.fechaEntregaProgramada || '',
      fechaLimitePago: compra?.fechaLimitePago || '',
      observaciones: compra?.observaciones || '',
      descuento: compra?.descuento || 0,
      detalles: buildDefaultDetalles(),
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'detalles',
  })

  const watchDetalles = watch('detalles')

  const resolveStock = useCallback(async (index: number, idInventario: number, idSucursal: number) => {
    if (!idInventario || !idSucursal) return

    const key = `${index}`
    setResolvingStocks((prev) => ({ ...prev, [key]: true }))

    try {
      if (!stockCache[idSucursal]) {
        const stock = await inventarioService.listarStockPorSucursal(idSucursal)
        setStockCache((prev) => ({ ...prev, [idSucursal]: stock }))
      }

      const stockItems = stockCache[idSucursal]
      const match = stockItems?.find((s) => s.idInventario === idInventario)

      if (match) {
        setValue(`detalles.${index}.precioUnitario`, match.precioUnitario)
      }
    } catch {
      // stock resolve failed silently, user can still proceed
    } finally {
      setResolvingStocks((prev) => ({ ...prev, [key]: false }))
    }
  }, [stockCache, setValue])

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      if (!name || !name.startsWith('detalles.')) return
      const match = name.match(/detalles\.(\d+)\.(idInventario|idSucursal)/)
      if (!match) return

      const index = parseInt(match[1])
      const detalles = values.detalles as any as DetalleFormItem[] | undefined
      if (!detalles || !detalles[index]) return

      const det = detalles[index]
      if (det.idInventario && det.idSucursal) {
        resolveStock(index, Number(det.idInventario), Number(det.idSucursal))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, resolveStock])

  const mapToRequest = (data: CompraFormData): CompraRequest => {
    const detalles: DetalleCompraRequest[] = data.detalles
      .filter((d) => d.idInventario && d.idSucursal)
      .map((d) => {
        const stock = stockCache[d.idSucursal]?.find((s) => s.idInventario === d.idInventario)
        return {
          idStock: stock?.idStock ?? 0,
          cantidad: d.cantidad,
          precioUnitario: d.precioUnitario,
        }
      })
      .filter((d) => d.idStock > 0)

    return {
      idProveedor: Number(data.idProveedor),
      idEmpleado: Number(data.idEmpleado),
      nroFactura: data.nroFactura,
      fechaCompra: data.fechaCompra,
      fechaEntregaProgramada: data.fechaEntregaProgramada || undefined,
      fechaLimitePago: data.fechaLimitePago || undefined,
      observaciones: data.observaciones || undefined,
      descuento: data.descuento || 0,
      detalles,
    }
  }

  const handleFormSubmit = async (data: CompraFormData) => {
    const request = mapToRequest(data)
    if (request.detalles.length === 0) return
    await onSubmit(request)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 flex items-center gap-2">
            Información de la Compra
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>
        </div>

        <div className="flex flex-col gap-1.5 group">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">
            Proveedor <span className="text-rose-500">*</span>
          </label>
          <Controller
            name="idProveedor"
            control={control}
            rules={{ required: 'El proveedor es obligatorio', validate: (v) => Number(v) > 0 || 'Selecciona un proveedor' }}
            render={({ field }) => (
              <FormSelect
                {...field}
                options={proveedorOptions}
                icon={<Building2 size={18} />}
                placeholder="Seleccionar proveedor"
              />
            )}
          />
          {errors.idProveedor && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 px-1">
              <AlertCircle size={12} />
              {errors.idProveedor.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5 group">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">
            Empleado <span className="text-rose-500">*</span>
          </label>
          <Controller
            name="idEmpleado"
            control={control}
            rules={{ required: 'El empleado es obligatorio', validate: (v) => Number(v) > 0 || 'Selecciona un empleado' }}
            render={({ field }) => (
              <FormSelect
                {...field}
                options={empleadoOptions}
                icon={<User size={18} />}
                placeholder="Seleccionar empleado"
              />
            )}
          />
          {errors.idEmpleado && (
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 px-1">
              <AlertCircle size={12} />
              {errors.idEmpleado.message}
            </span>
          )}
        </div>

        <Input
          label="N° Factura"
          type="text"
          placeholder="Número de factura"
          icon={<Hash size={18} />}
          error={errors.nroFactura?.message}
          {...register('nroFactura', { required: 'El número de factura es obligatorio' })}
        />

        <Input
          label="Fecha de Compra"
          type="date"
          icon={<Calendar size={18} />}
          error={errors.fechaCompra?.message}
          {...register('fechaCompra', { required: 'La fecha es obligatoria' })}
        />

        <Input
          label="Fecha Entrega Programada"
          type="date"
          icon={<Calendar size={18} />}
          {...register('fechaEntregaProgramada')}
        />

        <Input
          label="Fecha Límite de Pago"
          type="date"
          icon={<Calendar size={18} />}
          {...register('fechaLimitePago')}
        />

        <div className="md:col-span-2 flex flex-col gap-1.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">
            Observaciones
          </label>
          <textarea
            {...register('observaciones')}
            placeholder="Notas adicionales sobre la compra..."
            maxLength={500}
            className="min-h-[80px] w-full rounded-2xl border border-wine-100/50 bg-white/50 px-4 py-3 text-sm font-bold text-slate-800 placeholder:text-slate-400 backdrop-blur-sm focus:border-wine-600 focus:outline-none dark:border-wine-900/20 dark:bg-black/20 dark:text-slate-200 dark:placeholder:text-slate-600"
          />
        </div>

        <Input
          label="Descuento (Bs)"
          type="number"
          placeholder="0.00"
          step="0.01"
          icon={<DollarSign size={18} />}
          {...register('descuento', { valueAsNumber: true, min: { value: 0, message: 'Debe ser >= 0' } })}
        />

        <div className="md:col-span-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/40 dark:text-wine-100/30 mb-4 mt-2 flex items-center gap-2">
            Detalles de Compra
            <div className="h-px flex-1 bg-wine-100/50 dark:bg-wine-900/20" />
          </h3>

          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-[2rem] border border-wine-100/30 bg-white/30 p-5 dark:border-wine-900/20 dark:bg-black/10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
                    Producto #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="!text-rose-500 hover:!bg-rose-50 dark:hover:!bg-rose-900/20"
                    >
                      <Trash2 size={14} /> Quitar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40 px-1">
                      Producto <span className="text-rose-500">*</span>
                    </label>
                    <Controller
                      name={`detalles.${index}.idInventario`}
                      control={control}
                      rules={{ validate: (v) => Number(v) > 0 || 'Selecciona un producto' }}
                      render={({ field: f }) => (
                        <FormSelect
                          {...f}
                          options={productoOptions}
                          icon={<Package size={16} />}
                          placeholder="Seleccionar producto"
                        />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40 px-1">
                      Sucursal <span className="text-rose-500">*</span>
                    </label>
                    <Controller
                      name={`detalles.${index}.idSucursal`}
                      control={control}
                      rules={{ validate: (v) => Number(v) > 0 || 'Selecciona una sucursal' }}
                      render={({ field: f }) => (
                        <FormSelect
                          {...f}
                          options={sucursalOptions}
                          icon={<Store size={16} />}
                          placeholder="Seleccionar sucursal"
                          disabled={sucursalesLoading}
                        />
                      )}
                    />
                  </div>

                  {resolvingStocks[`${index}`] && (
                    <div className="md:col-span-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-wine-500">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-wine-300 border-t-wine-600" />
                      Buscando stock...
                    </div>
                  )}

                  {Number(watchDetalles?.[index]?.idInventario) > 0 && Number(watchDetalles?.[index]?.idSucursal) > 0 && !resolvingStocks[`${index}`] && (
                    <div className="md:col-span-2">
                      {(() => {
                        const idInv = Number(watchDetalles[index].idInventario)
                        const idSuc = Number(watchDetalles[index].idSucursal)
                        const stock = stockCache[idSuc]?.find((s) => s.idInventario === idInv)
                        const prod = insumos.find((i) => i.idInventario === idInv)
                        const suc = sucursales.find((s) => s.idSucursal === idSuc)
                        return stock ? (
                          <div className="rounded-xl bg-emerald-50/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-900/20">
                            Stock disponible: {stock.cantidad} unidades en {suc?.nombre || ''}
                          </div>
                        ) : (
                          <div className="rounded-xl bg-yellow-50/50 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-yellow-700 dark:bg-yellow-900/10 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-900/20">
                            No hay registro de stock para {prod?.nombre || 'este producto'} en {suc?.nombre || 'esta sucursal'}. Se creará automáticamente.
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  <Input
                    label="Cantidad"
                    type="number"
                    placeholder="1"
                    icon={<ListOrdered size={16} />}
                    {...register(`detalles.${index}.cantidad`, {
                      required: 'Obligatorio',
                      min: { value: 1, message: 'Mínimo 1' },
                      valueAsNumber: true,
                    })}
                  />

                  <Input
                    label="Precio Unitario (Bs)"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    icon={<DollarSign size={16} />}
                    {...register(`detalles.${index}.precioUnitario`, {
                      required: 'Obligatorio',
                      min: { value: 0.01, message: 'Debe ser > 0' },
                      valueAsNumber: true,
                    })}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="ghost"
              onClick={() => append({ idInventario: 0 as any, idSucursal: 0 as any, cantidad: 1, precioUnitario: 0 as any })}
              className="border-2 border-dashed border-wine-100/50 !rounded-[2rem] py-6 text-[10px] font-black uppercase tracking-widest text-wine-500 hover:border-wine-600 hover:text-wine-700 dark:border-wine-900/20 dark:text-wine-400"
            >
              <Plus size={16} className="mr-2" /> Agregar Producto
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 border-t border-wine-100/30 pt-6 dark:border-wine-900/10 sm:flex-row">
        <Button type="button" variant="ghost" onClick={onCancel} className="bg-wine-50/50 dark:bg-wine-950/30">
          Cancelar
        </Button>
        <Button type="submit" isLoading={isLoading} className="shadow-lg shadow-wine-900/20 min-w-[200px]">
          {isEdit ? 'Guardar Cambios' : 'Registrar Compra'}
        </Button>
      </div>
    </form>
  )
}
