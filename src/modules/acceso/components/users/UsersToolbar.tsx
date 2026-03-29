import { Plus, Search } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'

interface UsersToolbarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  canCreateUsers: boolean
  onCreateUser: () => void
}

export function UsersToolbar({
  searchTerm,
  onSearchChange,
  canCreateUsers,
  onCreateUser,
}: UsersToolbarProps) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">Usuarios</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Gestiona los usuarios del sistema</p>
        </div>
        {canCreateUsers && (
          <Button icon={<Plus size={18} />} onClick={onCreateUser}>
            Nuevo Usuario
          </Button>
        )}
      </div>

      <div className="mb-5 w-full max-w-md">
        <Input
          type="text"
          placeholder="Buscar usuarios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search size={18} />}
        />
      </div>
    </>
  )
}
