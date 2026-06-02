import { useState } from 'react'
import { Select } from '@/shared/components/ui/Select/Select'
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
      <div className="grid gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Producto *</span>
        <Select
          value={formData.idProducto ? Number(formData.idProducto) : undefined}
          onChange={(v) => setFormData({ ...formData, idProducto: String(v) })}
          options={productosDisponibles.map((pf) => ({ value: pf.idProductoFinal, label: `${pf.codigo} - ${pf.nombre}` }))}
          placeholder="Selecciona un producto"
          disabled={productosLoading || productosDisponibles.length === 0}
        />
        {productosDisponibles.length === 0 && (
          <p className="text-xs text-slate-500 dark:text-slate-400">Todos los productos ya están asignados</p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Precio (Bs) *</span>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            required
            className="h-14 rounded-2xl border border-wine-100/50 bg-white/80 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-wine-500 focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/40 dark:text-white dark:focus:bg-black/40"
            placeholder="0.00"
          />
        </label>

        <div className="grid gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Disponibilidad *</span>
          <Select
            value={formData.disponible ? 'true' : 'false'}
            onChange={(v) => setFormData({ ...formData, disponible: v === 'true' })}
            options={[
              { value: 'true', label: 'Disponible' },
              { value: 'false', label: 'No disponible' },
            ]}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-2xl border border-wine-100/50 bg-wine-50/40 px-4 py-3 text-sm font-bold uppercase tracking-widest text-wine-700 transition hover:bg-wine-100/60 active:scale-95 disabled:opacity-50 dark:border-wine-900/20 dark:bg-wine-950/20 dark:text-wine-300 dark:hover:bg-wine-900/20"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 rounded-2xl bg-wine-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-wine-900/20 transition hover:bg-wine-700 active:scale-95 disabled:opacity-50 dark:bg-wine-500 dark:hover:bg-wine-600"
          disabled={isLoading || !formData.idProducto}
        >
          {isLoading ? 'Asignando...' : 'Asignar'}
        </button>
      </div>
    </form>
  )
}
