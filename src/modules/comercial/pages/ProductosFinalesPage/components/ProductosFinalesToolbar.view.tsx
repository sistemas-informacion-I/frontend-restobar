import { Search, Plus } from 'lucide-react'

interface ProductosFinalesToolbarProps {
  search: string
  onSearchChange: (search: string) => void
  total: number
  onCreate: () => void
}

export function ProductosFinalesToolbar({
  search,
  onSearchChange,
  total,
  onCreate,
}: ProductosFinalesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-widest text-wine-600 dark:text-wine-400">Comercial</p>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Productos Finales</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Gestiona el catálogo global de {total} producto(s)</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="group relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-wine-600" />
          <input
            type="text"
            placeholder="Buscar por código, nombre..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-2xl border border-wine-100/50 bg-white/90 pl-10 pr-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-400/70 outline-none transition-all duration-300 focus:border-wine-500 focus:bg-white focus:ring-4 focus:ring-wine-500/10 hover:border-wine-300 dark:border-wine-900/30 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-wine-600 dark:focus:bg-black/40"
          />
        </div>
        <button
          onClick={onCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-wine-600 px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-wine-700 active:scale-95 dark:bg-wine-500 dark:hover:bg-wine-600"
        >
          <Plus className="h-4 w-4" />
          Nuevo
        </button>
      </div>
    </div>
  )
}
