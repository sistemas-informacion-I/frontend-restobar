import { Search, ShoppingBag, Store } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Sucursal } from '@/modules/acceso/services/types'

interface CatalogoToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  isAdmin: boolean
  sucursales: Sucursal[]
  sucursalId: number | null
  onSucursalChange: (id: number) => void
}

export function CatalogoToolbar({
  search, onSearchChange, total, isAdmin,
  sucursales, sucursalId, onSucursalChange
}: CatalogoToolbarProps) {
  return (
    <>
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
              <ShoppingBag size={28} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
              Catálogo Online
            </h1>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40 ml-1">
            {isAdmin ? 'Gestión del catálogo por sucursal' : 'Productos disponibles'}
          </p>
        </div>

        {/* Selector de sucursal */}
        <div className="flex items-center gap-2">
          <Store size={16} className="text-wine-600 shrink-0" />
          <select
            value={sucursalId ?? ''}
            onChange={(e) => onSucursalChange(Number(e.target.value))}
            className="h-10 rounded-xl border border-wine-100/50 bg-white/50 px-3 text-xs font-bold text-slate-700 backdrop-blur-sm focus:border-wine-600 focus:outline-none dark:border-wine-900/20 dark:bg-black/20 dark:text-slate-200"
          >
            <option value="" disabled>Seleccionar sucursal...</option>
            {sucursales.map(s => (
              <option key={s.idSucursal} value={s.idSucursal}>
                {s.nombre}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-xl">
          <Input
            type="text"
            placeholder="Buscar por nombre o descripción..."
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
            {total} PRODUCTOS
          </span>
        </div>
      </div>
    </>
  )
}
