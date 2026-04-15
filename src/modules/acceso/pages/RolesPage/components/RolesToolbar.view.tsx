import { Plus, Search, Shield } from 'lucide-react'
import { Button, Input } from '@/shared/components/ui'
import { RolesToolbarProps } from './RolesToolbar'

export function RolesToolbarView({
  search,
  onSearchChange,
  total,
  canCreateRoles,
  onCreateRole,
}: RolesToolbarProps) {
  return (
    <>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="flex items-center gap-3 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-xl shadow-wine-900/20">
              <Shield size={28} />
            </div>
            Gestión de Roles
          </h1>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 ml-[3.75rem]">Administración de privilegios y accesos</p>
        </div>
        {canCreateRoles && (
          <Button onClick={onCreateRole} icon={<Plus size={18} />} className="shadow-xl shadow-wine-900/20">
            Nuevo Rol
          </Button>
        )}
      </header>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-2 glass-card rounded-[1.5rem] border-wine-100/50 dark:border-wine-900/20">
        <div className="w-full max-w-md">
          <Input
            type="text"
            placeholder="Buscar roles por nombre o descripción..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            icon={<Search size={18} className="text-wine-600/50" />}
            className="!py-3 rounded-xl border-none bg-transparent"
          />
        </div>
        <div className="flex items-center gap-2 pr-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Total registros:</span>
          <span className="rounded-lg bg-wine-500/10 px-3 py-1 text-xs font-black text-wine-700 dark:text-wine-300 border border-wine-100/50 dark:border-wine-900/20">
            {total}
          </span>
        </div>
      </div>
    </>
  )
}
