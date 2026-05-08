import { Edit, Eye, Trash2 } from 'lucide-react'
import { Button, TableContainer } from '@/shared/components/ui'
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
    <div className="flex flex-col gap-4">
      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {users.length === 0 ? (
          <div className="glass-card rounded-[2.5rem] border-2 border-dashed border-wine-100/50 bg-wine-50/5 py-12 text-center dark:border-wine-900/20">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">No hay usuarios</span>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="glass-card overflow-hidden rounded-[2rem] border border-wine-100/50 bg-white/50 p-6 dark:border-wine-900/20 dark:bg-black/20 shadow-xl shadow-wine-900/5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-lg shadow-wine-900/30">
                    <span className="font-black text-xl">{user.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight leading-none">{user.name}</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-600 dark:text-wine-400">CI: {user.ci || 'N/A'}</span>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm border ${
                  user.isActive
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  {user.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex flex-col gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Correo:</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{user.email || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Tipo:</span>
                    <span className={`inline-flex rounded-lg px-2 py-0.5 text-[9px] font-black uppercase ${
                      user.tipoUsuario === 'S' ? 'bg-purple-500/10 text-purple-600' : 'bg-blue-500/10 text-blue-600'
                    }`}>
                      {user.tipoUsuario === 'S' ? 'Superuser' : user.tipoUsuario === 'E' ? 'Empleado' : 'Cliente'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">Rol:</span>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                      {user.roles?.map(r => r.name).join(', ') || 'Sin rol'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="ghost"
                  className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                  onClick={() => onView(user)}
                >
                  <Eye size={16} className="mr-2" /> Detalle
                </Button>
                {canUpdateUsers && (
                  <Button
                    variant="ghost"
                    className="!rounded-xl bg-white dark:bg-white/5 border border-wine-100/50 dark:border-wine-900/20 text-[10px] font-black uppercase tracking-widest h-12"
                    onClick={() => onEdit(user)}
                  >
                    <Edit size={16} className="mr-2" /> Editar
                  </Button>
                )}
                {canDeleteUsers && user.id !== currentUserId && (
                  <Button
                    variant="danger"
                    className="!rounded-xl h-12 col-span-2 shadow-lg shadow-rose-900/10"
                    onClick={() => onDelete(user)}
                  >
                    <Trash2 size={16} className="mr-2" /> Eliminar Usuario
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block glass-card rounded-[2.5rem] shadow-2xl shadow-wine-900/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
        <TableContainer>
          <table className="min-w-[680px] w-full border-collapse">
            <thead>
              <tr className="border-b border-wine-100/50 bg-wine-50/30 dark:border-wine-900/20 dark:bg-wine-950/20">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Nombre</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">CI</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Correo</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Tipo</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Rol</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Estado</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300/60">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-wine-50 dark:divide-wine-950/30">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
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
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-tighter ${
                        user.tipoUsuario === 'S' 
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : user.tipoUsuario === 'E'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20'
                      }`}>
                        {user.tipoUsuario === 'S' ? 'SU' : user.tipoUsuario === 'E' ? 'EMP' : 'CLI'}
                      </span>
                    </td>

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
        </TableContainer>
      </div>
    </div>
  )
}
