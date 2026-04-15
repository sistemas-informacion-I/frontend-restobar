import { Plus, Search } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'
import { UsersToolbarProps } from './UsersToolbar'

export function UsersToolbarView({
  searchTerm,
  onSearchChange,
  canCreateUsers,
  onCreateUser,
}: UsersToolbarProps) {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Usuarios</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Gestión de personal y accesos de seguridad</p>
        </div>
        {canCreateUsers && (
          <Button icon={<Plus size={18} />} onClick={onCreateUser} className="shadow-xl shadow-wine-900/20">
            Nuevo Usuario
          </Button>
        )}
      </div>

      <div className="mb-6 w-full max-w-md p-2 glass-card rounded-[1.5rem] border-wine-100/50 dark:border-wine-900/20">
        <Input
          type="text"
          placeholder="Buscar usuarios por nombre, correo o CI..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          icon={<Search size={18} className="text-wine-600/50" />}
          className="!py-3 rounded-xl border-none bg-transparent"
        />
      </div>
    </>
  )
}
