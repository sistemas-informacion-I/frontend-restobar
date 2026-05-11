import { Search, Plus, DollarSign } from 'lucide-react'

interface ProductosSucursalesToolbarProps {
  search: string
  onSearchChange: (search: string) => void
  total: number
  sucursalId: number
  onCreate: () => void
}

export function ProductosSucursalesToolbar({
  search,
  onSearchChange,
  total,
  sucursalId,
  onCreate,
}: ProductosSucursalesToolbarProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-wine-600 dark:text-wine-400">Comercial</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Precios por Sucursal</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Gestiona {total} producto(s) asignado(s) a tu sucursal</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código, nombre..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-wine-500 focus:ring-2 focus:ring-wine-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500 dark:focus:border-wine-400"
            />
          </div>
          <button
            onClick={onCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-wine-600 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-wine-700 active:scale-95 dark:bg-wine-500 dark:hover:bg-wine-600"
          >
            <Plus className="h-4 w-4" />
            Asignar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-slate-300 bg-blue-50/50 px-4 py-3 dark:border-slate-600 dark:bg-blue-900/20">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300">
            Sucursal #{sucursalId} - Aquí gestiona los precios y disponibilidad de productos para tu sucursal
          </p>
        </div>
      </div>
    </div>
  )
}
