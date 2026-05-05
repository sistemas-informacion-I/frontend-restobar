import { Plus, MapPin, Search } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import { Input } from '@/shared/components/ui/Input'
import { Select } from '@/shared/components/ui'

interface InventarioToolbarProps {
  search: string
  setSearch: (val: string) => void
  selectedSucursalId?: number
  setSelectedSucursalId: (id: number) => void
  sucursales: any[]
  onOpenCreateModal: () => void
  user: any
}

export function InventarioToolbar({
  search,
  setSearch,
  selectedSucursalId,
  setSelectedSucursalId,
  sucursales,
  onOpenCreateModal,
  user
}: InventarioToolbarProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="flex-1">
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
          Inventario <span className="text-wine-600">Gaira</span>
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          Gestiona el catálogo global e insumos por sucursal
        </p>
        <div className="mt-6 max-w-md">
          <Input 
            placeholder="Buscar por nombre, código o marca..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={18} />}
            className="h-12 rounded-2xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 min-w-fit">
        {user?.tipoUsuario === 'S' && (
          <Select
            value={selectedSucursalId}
            onChange={(val) => setSelectedSucursalId(val)}
            options={sucursales.map(s => ({ value: s.idSucursal, label: s.nombre }))}
            placeholder="Seleccionar Sucursal"
            className="w-full sm:min-w-[240px]"
            icon={<MapPin size={18} />}
          />
        )}

        <Button 
          onClick={onOpenCreateModal} 
          className={`h-14 rounded-2xl px-6 shadow-lg shadow-wine-900/20 ${user?.tipoUsuario !== 'S' ? 'sm:col-start-2' : ''}`}
          icon={<Plus size={18} />}
        >
          Nuevo Insumo
        </Button>
      </div>
    </div>
  )
}
