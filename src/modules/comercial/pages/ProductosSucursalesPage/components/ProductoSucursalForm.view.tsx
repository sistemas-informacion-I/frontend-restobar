import { useState } from 'react'
import { ProductoFinal } from '../../../services/productosFinales.service'

interface ProductoSucursalFormProps {
  productosDisponibles: ProductoFinal[]
  productosLoading: boolean
  isLoading: boolean
  onCancel: () => void
  onSubmit: (idProducto: number, precio: number, disponible: boolean) => Promise<void>
}

export function ProductoSucursalForm({
  productosDisponibles,
  productosLoading,
  isLoading,
  onCancel,
  onSubmit,
}: ProductoSucursalFormProps) {
  const [formData, setFormData] = useState({
    idProducto: '',
    precio: '',
    disponible: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.idProducto || !formData.precio) return

    await onSubmit(
      Number(formData.idProducto),
      Number(formData.precio),
      formData.disponible
    )
    setFormData({ idProducto: '', precio: '', disponible: true })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <label className="grid gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Producto *</span>
        <select
          value={formData.idProducto}
          onChange={(e) => setFormData({ ...formData, idProducto: e.target.value })}
          required
          disabled={productosLoading || productosDisponibles.length === 0}
          className="rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 py-3 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:focus:bg-black/40 focus:ring-2 focus:ring-wine-500/10 disabled:opacity-50 dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500"
        >
          <option value="">Selecciona un producto</option>
          {productosDisponibles.map((pf) => (
            <option key={pf.idProductoFinal} value={pf.idProductoFinal}>
              {pf.codigo} - {pf.nombre}
            </option>
          ))}
        </select>
        {productosDisponibles.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">Todos los productos ya están asignados</p>
        )}
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase tracking-widest text-slate-700 dark:text-slate-300">Precio (Bs) *</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
            className="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
            placeholder="0.00"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold uppercase tracking-widest text-wine-700 dark:text-wine-300">Disponibilidad *</span>
          <select
            value={formData.disponible ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, disponible: e.target.value === 'true' })}
            className="rounded-xl border-2 border-wine-100/50 bg-white/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-500/10 dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-400 dark:focus:ring-wine-900/30"
          >
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm font-bold uppercase tracking-widest text-slate-700 transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-wine-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-wine-700 active:scale-95 disabled:opacity-50 dark:bg-wine-500 dark:hover:bg-wine-600"
          disabled={isLoading || !formData.idProducto}
        >
          {isLoading ? 'Asignando...' : 'Asignar'}
        </button>
      </div>
    </form>
  )
}
