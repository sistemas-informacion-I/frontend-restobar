import { Search, Plus } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'

interface MesasToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  total: number
  canCreateMesas: boolean
  onCreateMesa: () => void
}

export function MesasToolbar({
  search,
  onSearchChange,
  total,
  canCreateMesas,
  onCreateMesa,
}: MesasToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Mesas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {total} mesa{total !== 1 ? 's' : ''} en total
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-72">
          <Input
            type="text"
            placeholder="Buscar mesas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>

        {canCreateMesas && (
          <Button onClick={onCreateMesa} className="w-full sm:w-auto">
            <Plus size={18} />
            Nueva Mesa
          </Button>
        )}
      </div>
    </div>
  )
}