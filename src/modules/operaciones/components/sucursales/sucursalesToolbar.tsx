import { Plus, Search, Store } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'

interface SucursalesToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  canCreateSucursales: boolean
  onCreateSucursal: () => void
}

export function SucursalesToolbar({
  search,
  onSearchChange,
  total,
  canCreateSucursales,
  onCreateSucursal,
}: SucursalesToolbarProps) {
  return (
    <>
      <header className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
            <Store size={28} />
            Gestión de Sucursales
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Administra las sucursales del sistema</p>
        </div>
        {canCreateSucursales && (
          <Button onClick={onCreateSucursal} icon={<Plus size={18} />}>
            Nueva Sucursal
          </Button>
        )}
      </header>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Buscar sucursales..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
          {total} sucursales
        </span>
      </div>
    </>
  )
}