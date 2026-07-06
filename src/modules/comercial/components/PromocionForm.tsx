import { useEffect, useState } from 'react'
import { BadgePercent, CalendarDays, Layers, Package, Store, Tag, Ticket } from 'lucide-react'
import type { Promocion, PromocionRequest } from '../models/Promocion'
import type { ProductoFinal } from '../services/productosFinales.service'

interface PromocionFormProps {
  mode: 'create' | 'edit' | 'view'
  promocion?: Promocion | null
  sucursales: Array<{ idSucursal: number; nombre: string }>
  productos: ProductoFinal[]
  isLoading?: boolean
  onCancel: () => void
  onSubmit: (data: PromocionRequest) => Promise<void>
}

interface FormErrors {
  nombre?: string
  valorDescuento?: string
  compraMinima?: string
  fechaFin?: string
  idSucursal?: string
  idProductos?: string
}

const initialState = {
  nombre: '',
  descripcion: '',
  tipo: 'PORCENTAJE',
  valorDescuento: '',
  compraMinima: '',
  fechaInicio: '',
  fechaFin: '',
  estado: 'ACTIVA',
  activo: true,
  idSucursal: '',
  idProductos: [] as number[],
}

export function PromocionForm({ mode, promocion, sucursales, productos, isLoading = false, onCancel, onSubmit }: PromocionFormProps) {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState<FormErrors>({})
  const isViewMode = mode === 'view'

  useEffect(() => {
    if (!promocion) {
      setFormData(initialState)
      return
    }

    setFormData({
      nombre: promocion.nombre ?? '',
      descripcion: promocion.descripcion ?? '',
      tipo: promocion.tipo ?? 'PORCENTAJE',
      valorDescuento: String(promocion.valorDescuento ?? ''),
      compraMinima: promocion.compraMinima != null ? String(promocion.compraMinima) : '',
      fechaInicio: promocion.fechaInicio ?? '',
      fechaFin: promocion.fechaFin ?? '',
      estado: promocion.estado ?? 'ACTIVA',
      activo: Boolean(promocion.activo),
      idSucursal: String(promocion.idSucursal ?? ''),
      idProductos: promocion.productos?.map((producto) => producto.idProductoFinal ?? 0).filter(Boolean) ?? [],
    })
  }, [promocion])

  const validate = () => {
    const nextErrors: FormErrors = {}

    if (!formData.nombre.trim()) {
      nextErrors.nombre = 'El nombre es obligatorio'
    }

    if (Number(formData.valorDescuento) < 0) {
      nextErrors.valorDescuento = 'El descuento no puede ser negativo'
    }

    if (formData.compraMinima && Number(formData.compraMinima) < 0) {
      nextErrors.compraMinima = 'La compra mínima no puede ser negativa'
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      nextErrors.fechaFin = 'Las fechas de inicio y fin son obligatorias'
    } else if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      nextErrors.fechaFin = 'La fecha fin no puede ser anterior a la fecha inicio'
    }

    if (!formData.idSucursal) {
      nextErrors.idSucursal = 'Debe seleccionar una sucursal'
    }

    if (!formData.idProductos.length) {
      nextErrors.idProductos = 'Debe asociar al menos un producto'
    }

    setErrors(nextErrors)
    return nextErrors
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (isViewMode) return
    if (Object.keys(validate()).length) return

    const payload: PromocionRequest = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim() || null,
      tipo: formData.tipo,
      valorDescuento: Number(formData.valorDescuento || 0),
      compraMinima: formData.compraMinima ? Number(formData.compraMinima) : null,
      fechaInicio: formData.fechaInicio,
      fechaFin: formData.fechaFin,
      estado: formData.estado,
      activo: formData.estado === 'ACTIVA',
      idSucursal: Number(formData.idSucursal),
      idProductos: formData.idProductos,
    }

    await onSubmit(payload)
  }

  const toggleProducto = (idProductoFinal: number) => {
    if (isViewMode) return
    setFormData((current) => ({
      ...current,
      idProductos: current.idProductos.includes(idProductoFinal)
        ? current.idProductos.filter((id) => id !== idProductoFinal)
        : [...current.idProductos, idProductoFinal],
    }))
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <section className="rounded-2xl border border-wine-100/40 bg-white/70 p-5 dark:border-wine-900/20 dark:bg-black/20">
        <h4 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
          <Tag size={14} /> Información general
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 md:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Nombre *</span>
            <input
              value={formData.nombre}
              onChange={(event) => setFormData((current) => ({ ...current, nombre: event.target.value }))}
              disabled={isViewMode}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
              placeholder="Ej. Happy Hour"
            />
            {errors.nombre && <span className="text-xs text-rose-600">{errors.nombre}</span>}
          </label>

          <label className="grid gap-2 md:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Descripción</span>
            <textarea
              value={formData.descripcion}
              onChange={(event) => setFormData((current) => ({ ...current, descripcion: event.target.value }))}
              rows={3}
              disabled={isViewMode}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
              placeholder="Detalles de la promoción"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Tipo *</span>
            <div className="relative">
              <Ticket size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wine-700/70 dark:text-wine-300/70" />
              <select
                value={formData.tipo}
                onChange={(event) => setFormData((current) => ({ ...current, tipo: event.target.value }))}
                disabled={isViewMode}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
              >
                <option value="PORCENTAJE">Porcentaje</option>
                <option value="MONTO_FIJO">Monto fijo</option>
                <option value="COMPRA_MINIMA">Compra mínima</option>
                <option value="DOS_POR_UNO">2x1</option>
                <option value="COMBO">Combo</option>
              </select>
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Valor descuento *</span>
            <div className="relative">
              <BadgePercent size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wine-700/70 dark:text-wine-300/70" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.valorDescuento}
                onChange={(event) => setFormData((current) => ({ ...current, valorDescuento: event.target.value }))}
                disabled={isViewMode}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
              />
            </div>
            {errors.valorDescuento && <span className="text-xs text-rose-600">{errors.valorDescuento}</span>}
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Compra mínima</span>
            <div className="relative">
              <Layers size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wine-700/70 dark:text-wine-300/70" />
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.compraMinima}
                onChange={(event) => setFormData((current) => ({ ...current, compraMinima: event.target.value }))}
                disabled={isViewMode}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
              />
            </div>
            {errors.compraMinima && <span className="text-xs text-rose-600">{errors.compraMinima}</span>}
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Sucursal *</span>
            <div className="relative">
              <Store size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-wine-700/70 dark:text-wine-300/70" />
              <select
                value={formData.idSucursal}
                onChange={(event) => setFormData((current) => ({ ...current, idSucursal: event.target.value }))}
                disabled={isViewMode}
                className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
              >
                <option value="">Seleccionar sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.idSucursal} value={sucursal.idSucursal}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </div>
            {errors.idSucursal && <span className="text-xs text-rose-600">{errors.idSucursal}</span>}
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Estado</span>
            <select
              value={formData.estado}
              onChange={(event) => setFormData((current) => ({
                ...current,
                estado: event.target.value,
                activo: event.target.value === 'ACTIVA',
              }))}
              disabled={isViewMode}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
            >
              <option value="ACTIVA">Activa</option>
              <option value="INACTIVA">Inactiva</option>
              <option value="FINALIZADA">Finalizada</option>
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-wine-100/40 bg-white/70 p-5 dark:border-wine-900/20 dark:bg-black/20">
        <h4 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
          <CalendarDays size={14} /> Fechas de vigencia
        </h4>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Fecha inicio *</span>
            <input
              type="date"
              value={formData.fechaInicio}
              onChange={(event) => setFormData((current) => ({ ...current, fechaInicio: event.target.value }))}
              disabled={isViewMode}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Fecha fin *</span>
            <input
              type="date"
              value={formData.fechaFin}
              onChange={(event) => setFormData((current) => ({ ...current, fechaFin: event.target.value }))}
              disabled={isViewMode}
              className="rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
            />
            {errors.fechaFin && <span className="text-xs text-rose-600">{errors.fechaFin}</span>}
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-wine-100/40 bg-white/70 p-5 dark:border-wine-900/20 dark:bg-black/20">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
            <Package size={14} /> Productos asociados *
          </h4>
          <span className="text-xs text-slate-500 dark:text-slate-400">Selecciona al menos uno</span>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {productos.map((producto) => {
            const selected = formData.idProductos.includes(producto.idProductoFinal)
            return (
              <label
                key={producto.idProductoFinal}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition ${selected ? 'border-wine-400 bg-wine-50/70 text-wine-900 dark:border-wine-700 dark:bg-wine-900/20 dark:text-wine-200' : 'border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'}`}
              >
                <input
                  type="checkbox"
                  disabled={isViewMode}
                  checked={selected}
                  onChange={() => toggleProducto(producto.idProductoFinal)}
                />
                <span>{producto.nombre}</span>
              </label>
            )
          })}
        </div>
        {errors.idProductos && <span className="mt-2 block text-xs text-rose-600">{errors.idProductos}</span>}
      </section>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900">
          Cerrar
        </button>
        {!isViewMode && (
          <button type="submit" disabled={isLoading} className="rounded-2xl bg-wine-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-wine-700 disabled:opacity-50">
            {isLoading ? 'Guardando...' : mode === 'edit' ? 'Actualizar' : 'Guardar'}
          </button>
        )}
      </div>
    </form>
  )
}
