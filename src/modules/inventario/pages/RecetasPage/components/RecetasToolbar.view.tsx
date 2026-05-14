import { Plus, Search } from 'lucide-react'

interface RecetasToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  canCreate: boolean
  onCreate: () => void
}

export function RecetasToolbar({
  search,
  onSearchChange,
  total,
  canCreate,
  onCreate,
}: RecetasToolbarProps) {
  return (
    <div className="rounded-[1.75rem] border border-wine-100/30 bg-white/80 p-5 shadow-[0_10px_35px_-18px_rgba(69,10,10,0.2)] backdrop-blur dark:border-wine-900/20 dark:bg-black/25">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white md:text-3xl">
            Recetas <span className="text-wine-600">Gaira</span>
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            Gestiona recetas y composición de productos finales
          </p>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-wine-700/70 dark:text-wine-300/70">
            Total registradas: {total}
          </p>
        </div>

        {canCreate && (
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-wine-600 px-5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-wine-900/20 transition hover:bg-wine-700 active:scale-95 dark:bg-wine-500 dark:hover:bg-wine-600"
          >
            <Plus className="h-4 w-4" />
            Nueva Receta
          </button>
        )}
      </div>

      <div className="group relative mt-4 max-w-xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-wine-600" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por receta, producto o versión..."
          className="w-full rounded-2xl border border-wine-100/50 bg-white/90 py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400/70 outline-none transition-all duration-300 hover:border-wine-300 focus:border-wine-500 focus:bg-white focus:ring-4 focus:ring-wine-500/10 dark:border-wine-900/30 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-wine-600 dark:focus:bg-black/40"
        />
      </div>
    </div>
  )
}
