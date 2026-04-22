import { Plus, Search } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'

interface EmpleadosToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  canCreateEmpleados: boolean
  onCreateEmpleado: () => void
}

export function EmpleadosToolbar({
  searchTerm,
  onSearchChange,
  canCreateEmpleados,
  onCreateEmpleado,
}: EmpleadosToolbarProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Empleados</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Gestiona los empleados registrados</p>
        </div>
        {canCreateEmpleados && (
          <Button icon={<Plus size={18} />} onClick={onCreateEmpleado}>
            Nuevo Empleado
          </Button>
        )}
      </div>

      <div className="mb-5 w-full max-w-md">
        <Input
          type="text"
          placeholder="Buscar empleados..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>
    </>
  )
}
