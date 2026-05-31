import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import type { UnidadMedida, InventarioItem } from '@/modules/inventario/services/inventario.service'
import type { ProductoFinal } from '@/modules/comercial/services/productosFinales.service'
import type { Receta, RecetaUpsertData } from '../../../services/recetas.service'

interface SucursalOption {
  idSucursal: number
  nombre: string
}

interface RecetaFormProps {
  receta: Receta | null
  productosFinales: ProductoFinal[]
  insumos: InventarioItem[]
  sucursales: SucursalOption[]
  canSelectSucursal: boolean
  defaultSucursalId?: number
  isLoading: boolean
  onCancel: () => void
  onSubmit: (data: RecetaUpsertData) => Promise<void>
}

interface IngredienteFormItem {
  idInventario: number
  cantidad: string
  unidadMedida: UnidadMedida
  notas: string
}

const UNIDADES: UnidadMedida[] = ['KG', 'GRAMO', 'LITRO', 'ML', 'UNIDAD']

const toDateInput = (value?: string) => {
  if (!value) return ''
  return value.slice(0, 10)
}

export function RecetaForm({
  receta,
  productosFinales,
  insumos,
  sucursales,
  canSelectSucursal,
  defaultSucursalId,
  isLoading,
  onCancel,
  onSubmit,
}: RecetaFormProps) {
  const [idProductoFinal, setIdProductoFinal] = useState<number>(receta?.idProductoFinal || productosFinales[0]?.idProductoFinal || 0)
  const [idSucursalReferencia, setIdSucursalReferencia] = useState<number>(
    receta?.idSucursalReferencia || defaultSucursalId || sucursales[0]?.idSucursal || 0
  )
  const [nombre, setNombre] = useState(receta?.nombre || '')
  const [descripcion, setDescripcion] = useState(receta?.descripcion || '')
  const [tiempoPreparacion, setTiempoPreparacion] = useState<string>(receta?.tiempoPreparacion ? String(receta.tiempoPreparacion) : '')
  const [instrucciones, setInstrucciones] = useState(receta?.instrucciones || '')
  const [versionEtiqueta, setVersionEtiqueta] = useState(receta?.versionEtiqueta || '')
  const [fechaVigenciaInicio, setFechaVigenciaInicio] = useState(toDateInput(receta?.fechaVigenciaInicio))
  const [fechaVigenciaFin, setFechaVigenciaFin] = useState(toDateInput(receta?.fechaVigenciaFin))
  const [activo, setActivo] = useState(receta?.activo ?? true)
  const [ingredientes, setIngredientes] = useState<IngredienteFormItem[]>(
    receta?.ingredientes?.length
      ? receta.ingredientes.map((item) => ({
          idInventario: item.idInventario,
          cantidad: String(item.cantidad ?? ''),
          unidadMedida: item.unidadMedida,
          notas: item.notas || '',
        }))
      : [{ idInventario: insumos[0]?.idInventario || 0, cantidad: '', unidadMedida: 'UNIDAD', notas: '' }]
  )

  const ingredientOptions = useMemo(
    () => insumos.map((i) => ({ value: i.idInventario, label: `${i.codigo} - ${i.nombre}` })),
    [insumos]
  )

  const addIngrediente = () => {
    setIngredientes((prev) => [...prev, { idInventario: insumos[0]?.idInventario || 0, cantidad: '', unidadMedida: 'UNIDAD', notas: '' }])
  }

  const removeIngrediente = (index: number) => {
    setIngredientes((prev) => prev.filter((_, idx) => idx !== index))
  }

  const updateIngrediente = (index: number, key: keyof IngredienteFormItem, value: string | number) => {
    setIngredientes((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [key]: value,
            }
          : item
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: RecetaUpsertData = {
      idProductoFinal,
      idSucursalReferencia,
      nombre,
      descripcion: descripcion.trim() || undefined,
      tiempoPreparacion: tiempoPreparacion ? Number(tiempoPreparacion) : undefined,
      instrucciones: instrucciones.trim() || undefined,
      versionEtiqueta: versionEtiqueta.trim() || undefined,
      fechaVigenciaInicio: fechaVigenciaInicio || undefined,
      fechaVigenciaFin: fechaVigenciaFin || undefined,
      activo,
      ingredientes: ingredientes.map((item) => ({
        idInventario: Number(item.idInventario),
        cantidad: Number(item.cantidad),
        unidadMedida: item.unidadMedida,
        notas: item.notas.trim() || undefined,
      })),
    }

    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Producto Final *</span>
          <select
            value={idProductoFinal}
            onChange={(e) => setIdProductoFinal(Number(e.target.value))}
            required
            className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
          >
            {productosFinales.map((p) => (
              <option key={p.idProductoFinal} value={p.idProductoFinal}>
                {p.codigo} - {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Sucursal Referencia *</span>
          <select
            value={idSucursalReferencia}
            onChange={(e) => setIdSucursalReferencia(Number(e.target.value))}
            required
            disabled={!canSelectSucursal}
            className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
          >
            {sucursales.map((s) => (
              <option key={s.idSucursal} value={s.idSucursal}>
                {s.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 md:col-span-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Nombre *</span>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            maxLength={150}
            required
            className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
            placeholder="Ej: Mojito Clasico"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Version</span>
          <input
            type="text"
            value={versionEtiqueta}
            onChange={(e) => setVersionEtiqueta(e.target.value)}
            maxLength={80}
            className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
            placeholder="v1.0"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Tiempo (min)</span>
          <input
            type="number"
            min="0"
            value={tiempoPreparacion}
            onChange={(e) => setTiempoPreparacion(e.target.value)}
            className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Vigencia inicio</span>
          <input
            type="date"
            value={fechaVigenciaInicio}
            onChange={(e) => setFechaVigenciaInicio(e.target.value)}
            className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Vigencia fin</span>
          <input
            type="date"
            value={fechaVigenciaFin}
            onChange={(e) => setFechaVigenciaFin(e.target.value)}
            className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Descripcion</span>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          rows={3}
          className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
          placeholder="Detalle breve de la receta"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Instrucciones</span>
        <textarea
          value={instrucciones}
          onChange={(e) => setInstrucciones(e.target.value)}
          rows={4}
          className="rounded-2xl border border-wine-100/50 bg-slate-50/50 px-4 py-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white"
          placeholder="Paso a paso de preparacion"
        />
      </label>

      <div className="rounded-2xl border border-wine-100/40 bg-wine-50/25 p-4 dark:border-wine-900/20 dark:bg-wine-900/10">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-wine-800 dark:text-wine-300">Ingredientes</h3>
          <button
            type="button"
            onClick={addIngrediente}
            className="inline-flex items-center gap-2 rounded-xl border border-wine-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest text-wine-700 transition hover:bg-wine-50 dark:border-wine-800 dark:bg-black/20 dark:text-wine-300 dark:hover:bg-wine-900/20"
          >
            <Plus className="h-3.5 w-3.5" />
            Agregar
          </button>
        </div>

        <div className="space-y-3">
          {ingredientes.map((item, index) => (
            <div key={index} className="grid gap-2 rounded-xl border border-wine-100/40 bg-white/80 p-3 dark:border-wine-900/20 dark:bg-black/20 md:grid-cols-12">
              <div className="md:col-span-4">
                <select
                  value={item.idInventario}
                  onChange={(e) => updateIngrediente(index, 'idInventario', Number(e.target.value))}
                  required
                  className="w-full rounded-lg border border-wine-100/50 bg-slate-50/50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-500/10 dark:border-wine-900/20 dark:bg-black/20 dark:text-white"
                >
                  {ingredientOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  required
                  value={item.cantidad}
                  onChange={(e) => updateIngrediente(index, 'cantidad', e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Cant."
                />
              </div>

              <div className="md:col-span-2">
                <select
                  value={item.unidadMedida}
                  onChange={(e) => updateIngrediente(index, 'unidadMedida', e.target.value as UnidadMedida)}
                  required
                  className="w-full rounded-lg border border-wine-100/50 bg-slate-50/50 px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-500/10 dark:border-wine-900/20 dark:bg-black/20 dark:text-white"
                >
                  {UNIDADES.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <input
                  type="text"
                  value={item.notas}
                  onChange={(e) => updateIngrediente(index, 'notas', e.target.value)}
                  maxLength={500}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="Notas"
                />
              </div>

              <div className="flex items-center justify-end md:col-span-1">
                <button
                  type="button"
                  onClick={() => removeIngrediente(index)}
                  disabled={ingredientes.length === 1}
                  className="rounded-lg border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/20"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <label className="inline-flex items-center gap-2">
        <input
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-wine-600 focus:ring-wine-500"
        />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Receta activa</span>
      </label>

      <div className="flex flex-col-reverse gap-3 border-t border-wine-100/30 pt-4 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-2xl border border-wine-100/40 bg-wine-50/50 px-5 py-3 text-sm font-bold uppercase tracking-widest text-wine-700 transition hover:bg-wine-100/60 disabled:opacity-50 dark:border-wine-900/20 dark:bg-wine-950/20 dark:text-wine-300"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !idProductoFinal || !idSucursalReferencia || ingredientes.length === 0}
          className="rounded-2xl bg-wine-600 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-wine-900/20 transition hover:bg-wine-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-wine-500 dark:hover:bg-wine-600"
        >
          {isLoading ? 'Guardando...' : 'Guardar Receta'}
        </button>
      </div>
    </form>
  )
}
