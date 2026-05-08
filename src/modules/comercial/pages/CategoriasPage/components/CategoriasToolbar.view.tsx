import { Plus, Search, LayoutList } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'

interface CategoriasToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  canCreate: boolean
  onCreate: () => void
}

export function CategoriasToolbar({
  search,
  onSearchChange,
  total,
  canCreate,
  onCreate,
}: CategoriasToolbarProps) {
  return (
    <>
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
              <LayoutList size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
              Categorías
            </h1>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40 ml-1">
            Gestión de Categorías de Productos
          </p>
        </div>

        {canCreate && (
          <Button
            onClick={onCreate}
            className="h-12 rounded-2xl px-6 shadow-xl shadow-wine-900/20 active:scale-95 transition-transform"
          >
            <Plus size={18} className="mr-2 stroke-[3px]" />
            <span className="font-black uppercase tracking-widest text-[10px]">Nueva Categoría</span>
          </Button>
        )}
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-xl">
          <Input
            type="text"
            placeholder="Buscar por nombre de categoría..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-12 !rounded-2xl border-wine-100/50 bg-white/50 backdrop-blur-sm focus:border-wine-600 dark:border-wine-900/20 dark:bg-black/20"
            icon={<Search size={18} className="text-wine-900/40" />}
          />
        </div>
        <div className="flex items-center gap-3 px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
            Total de
          </span>
          <span className="inline-flex h-8 items-center rounded-xl bg-wine-600 px-4 text-[11px] font-black tracking-widest text-white shadow-lg shadow-wine-900/20">
            {total} CATEGORÍAS
          </span>
        </div>
      </div>
    </>
  )
}
