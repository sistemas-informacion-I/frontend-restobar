import { Edit2, Eye, Shield, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { RolesTableProps } from './RolesTable'

export function RolesTableView({
  roles,
  canUpdateRoles,
  canDeleteRoles,
  onView,
  onEdit,
  onDelete,
}: RolesTableProps) {
  return (
    <div className="glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse">
          <thead>
            <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Nombre</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Descripción</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Permisos</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
            {roles.map((role) => (
              <tr key={role.id} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-lg shadow-wine-900/20 group-hover:scale-110 transition-transform">
                      <Shield size={20} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white tracking-tight">{role.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  {role.description || 'Sin descripción'}
                </td>

                <td className="px-6 py-4">
                  {role.permissions && role.permissions.length > 0 ? (
                    <span className="inline-flex rounded-lg bg-wine-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-wine-700 dark:text-wine-300 border border-wine-100/50 dark:border-wine-900/20">
                      {role.permissions.length} permisos
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-600">Sin permisos</span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${role.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${role.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {role.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30"
                      title="Ver"
                      onClick={() => onView(role)}
                    >
                      <Eye size={16} />
                    </Button>

                    {canUpdateRoles && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30"
                        title="Editar"
                        onClick={() => onEdit(role)}
                      >
                        <Edit2 size={16} />
                      </Button>
                    )}

                    {canDeleteRoles && (
                      <Button
                        variant="danger"
                        size="sm"
                        title="Eliminar"
                        onClick={() => onDelete(role)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
