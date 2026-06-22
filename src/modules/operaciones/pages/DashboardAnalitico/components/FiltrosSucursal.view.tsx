import { Store } from 'lucide-react'
import { Select } from '@/shared/components/ui/Select/Select'
import { FiltrosSucursalProps } from './FiltrosSucursal'

export function FiltrosSucursalView({
  fechaInicio,
  fechaFin,
  idSucursal,
  sucursales,
  showSucursalFilter,
  onFechaInicioChange,
  onFechaFinChange,
  onSucursalChange,
}: FiltrosSucursalProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-3xl bg-white p-5 shadow-2xl shadow-wine-900/5 dark:bg-black/35">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-wine-700 dark:text-wine-300">
          Fecha inicio
        </label>
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => onFechaInicioChange(e.target.value)}
          className="rounded-xl border border-wine-200 bg-white/80 px-4 py-2 text-sm text-wine-800 outline-none focus:border-wine-500 dark:border-wine-800 dark:bg-black/50 dark:text-wine-200"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-wine-700 dark:text-wine-300">
          Fecha fin
        </label>
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => onFechaFinChange(e.target.value)}
          className="rounded-xl border border-wine-200 bg-white/80 px-4 py-2 text-sm text-wine-800 outline-none focus:border-wine-500 dark:border-wine-800 dark:bg-black/50 dark:text-wine-200"
        />
      </div>

      {showSucursalFilter && (
        <div className="w-full sm:min-w-[220px]">
          <Select
            value={idSucursal}
            onChange={(val) => onSucursalChange(val ? Number(val) : undefined)}
            options={sucursales.map((s) => ({ value: s.idSucursal, label: s.nombre }))}
            placeholder="Todas las sucursales"
            icon={<Store size={18} />}
          />
        </div>
      )}
    </div>
  )
}
