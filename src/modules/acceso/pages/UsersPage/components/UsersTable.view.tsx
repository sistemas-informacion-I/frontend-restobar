import { Edit, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { UsersTableProps } from './UsersTable'

export function UsersTableView({
  users,
  canUpdateUsers,
  canDeleteUsers,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full border-collapse">
          <thead>
            <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Nombre</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">CI</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Correo</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Rol</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
              <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No se encontraron usuarios</span>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="transition-all duration-300 hover:bg-wine-50/30 dark:hover:bg-wine-900/10 group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 text-sm font-black text-white shadow-lg shadow-wine-900/30 group-hover:scale-110 transition-transform tracking-tighter">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white tracking-tight">{user.name}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{user.ci || 'N/A'}</td>

                  <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">{user.email || 'N/A'}</td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-lg bg-wine-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-wine-700 dark:text-wine-300 border border-wine-100/50 dark:border-wine-900/20">
                      {user.roles?.map((role) => role.name).join(', ') || 'Sin rol'}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1.5 w-fit rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter ${
                          user.isActive
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activo
                          </>
                        ) : (
                          <>
                            <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Inactivo
                          </>
                        )}
                      </span>
                      {user.estadoAcceso && user.estadoAcceso !== 'HABILITADO' && (
                        <span className={`inline-flex items-center gap-1.5 w-fit rounded-lg px-2.5 py-1 text-[9px] font-black uppercase tracking-tighter ${
                          user.estadoAcceso === 'SUSPENDIDO' 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        }`}>
                          {user.estadoAcceso}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30"
                        onClick={() => onView(user)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </Button>

                      {canUpdateUsers && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-white/50 dark:bg-black/20 hover:!bg-wine-50 dark:hover:!bg-wine-900/30"
                          onClick={() => onEdit(user)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                      )}

                      {canDeleteUsers && user.id !== currentUserId && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDelete(user)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
