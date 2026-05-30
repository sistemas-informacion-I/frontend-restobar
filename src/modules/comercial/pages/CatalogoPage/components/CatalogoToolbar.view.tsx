import { Search, ShoppingBag, Store, LayoutGrid, List, X, Eye, SlidersHorizontal, Tag } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Select } from '@/shared/components/ui/Select/Select'
import { Sucursal } from '@/modules/acceso/services/types'

interface CatalogoToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  isAdmin: boolean
  vistaPrevia: boolean
  onVistaPreviaChange: (v: boolean) => void
  sucursales: Sucursal[]
  sucursalId: number | null
  onSucursalChange: (id: number) => void
  viewMode: 'table' | 'grid'
  onViewModeChange: (mode: 'table' | 'grid') => void
  sortBy: 'nombre' | 'precio_asc' | 'precio_desc' | 'recientes'
  onSortByChange: (sort: 'nombre' | 'precio_asc' | 'precio_desc' | 'recientes') => void
  onlyAvailable: boolean
  onOnlyAvailableChange: (v: boolean) => void
  onClearFilters: () => void
  categories: { id: number; nombre: string }[]
  selectedCategoryId: number | null
  onSelectedCategoryChange: (id: number | null) => void
}

export function CatalogoToolbar({
  search, onSearchChange, total, isAdmin,
  vistaPrevia, onVistaPreviaChange,
  sucursales, sucursalId, onSucursalChange,
  viewMode, onViewModeChange, sortBy, onSortByChange,
  onlyAvailable, onOnlyAvailableChange, onClearFilters,
  categories, selectedCategoryId, onSelectedCategoryChange,
}: CatalogoToolbarProps) {
  const hasActiveFilters = search || onlyAvailable || selectedCategoryId !== null || sortBy !== 'nombre'

  const sucursalOptions = sucursales.map(s => ({ value: s.idSucursal, label: s.nombre }))

  const categoryOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categories.map(c => ({ value: c.id, label: c.nombre })),
  ]

  const sortOptions = [
    { value: 'nombre', label: 'Nombre A-Z' },
    { value: 'precio_asc', label: 'Precio: menor a mayor' },
    { value: 'precio_desc', label: 'Precio: mayor a menor' },
    { value: 'recientes', label: 'Más recientes' },
  ]

  return (
    <>
      <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-wine-600/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400">
              <ShoppingBag size={28} />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-4xl">
                {vistaPrevia ? 'Vista Previa del Cliente' : 'Catálogo Online'}
              </h1>
              {vistaPrevia && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Eye size={10} /> Modo vista previa
                </span>
              )}
            </div>
          </div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-300/40 ml-1">
            {vistaPrevia ? 'Así es como ven tus clientes el catálogo' : (isAdmin ? 'Gestión del catálogo por sucursal' : 'Productos disponibles')}
          </p>
        </div>

        <div className="w-52">
          <Select
            value={sucursalId ?? ''}
            onChange={(value) => onSucursalChange(Number(value))}
            options={sucursalOptions}
            placeholder="Seleccionar sucursal..."
            icon={<Store size={16} />}
          />
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4 w-full">
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

          <div className="w-44">
            <Select
              value={selectedCategoryId ?? ''}
              onChange={(value) => onSelectedCategoryChange(value ? Number(value) : null)}
              options={categoryOptions}
              placeholder="Categoría"
              icon={<Tag size={16} />}
            />
          </div>

          <div className="w-44">
            <Select
              value={sortBy}
              onChange={(value) => onSortByChange(value as any)}
              options={sortOptions}
              placeholder="Ordenar"
              icon={<SlidersHorizontal size={16} />}
            />
          </div>

          <label className="flex items-center gap-2 whitespace-nowrap text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer px-1">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => onOnlyAvailableChange(e.target.checked)}
              className="h-5 w-5 rounded border-wine-300 text-wine-600 focus:ring-wine-500"
            />
            Solo disponibles
          </label>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="!rounded-xl text-xs"
              icon={<X size={14} />}
            >
              Limpiar
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-300/40">
            Total
          </span>
          <span className="inline-flex h-8 items-center rounded-xl bg-wine-600 px-4 text-[11px] font-black tracking-widest text-white shadow-lg shadow-wine-900/20">
            {total} PRODUCTOS
          </span>

          <div className="ml-2 flex rounded-xl border border-wine-100/50 bg-white/50 dark:border-wine-900/20 dark:bg-black/20">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-2.5 transition-all ${viewMode === 'table' ? 'bg-wine-600 text-white' : 'text-slate-500 hover:text-wine-600'}`}
              title="Vista tabla"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-2.5 transition-all ${viewMode === 'grid' ? 'bg-wine-600 text-white' : 'text-slate-500 hover:text-wine-600'}`}
              title="Vista grilla"
            >
              <LayoutGrid size={18} />
            </button>
          </div>

          {isAdmin && (
            <Button
              variant={vistaPrevia ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => onVistaPreviaChange(!vistaPrevia)}
              className={`!rounded-xl text-xs ${vistaPrevia ? '!border-wine-500 !bg-wine-50 !text-wine-700 dark:!bg-wine-900/20 dark:!text-wine-300' : ''}`}
              icon={<Eye size={14} />}
            >
              Vista Previa
            </Button>
          )}
        </div>
      </div>
    </>
  )
}
