import { Edit, Eye, Trash2, UserCheck, UserX } from 'lucide-react'
import { Button, TableCell, TableRow } from '@/shared/components/ui'
import { User } from '../../services/api'

interface UsersTableProps {
  users: User[]
  canUpdateUsers: boolean
  canDeleteUsers: boolean
  currentUserId?: string
  onView: (user: User) => void
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({
  users,
  canUpdateUsers,
  canDeleteUsers,
  currentUserId,
  onView,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-[680px] w-full border-collapse">
          <thead>
            <TableRow header>
              <TableCell header>Nombre</TableCell>
              <TableCell header>CI</TableCell>
              <TableCell header>Correo</TableCell>
              <TableCell header>Rol</TableCell>
              <TableCell header>Estado</TableCell>
              <TableCell header>Acciones</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <TableRow hover={false}>
                <TableCell colSpan={6} className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
                  No se encontraron usuarios
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-sm font-semibold text-white">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-slate-900 dark:text-slate-100">{user.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-700 dark:text-slate-300">{user.ci || 'N/A'}</TableCell>

                  <TableCell className="text-slate-700 dark:text-slate-300">{user.email || 'N/A'}</TableCell>

                  <TableCell>
                    <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {user.roles?.map((role) => role.name).join(', ') || 'Sin rol'}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center gap-1 w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          user.isActive
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
                        }`}
                      >
                        {user.isActive ? (
                          <>
                            <UserCheck size={14} /> Activo
                          </>
                        ) : (
                          <>
                            <UserX size={14} /> Inactivo
                          </>
                        )}
                      </span>
                      {user.estadoAcceso && user.estadoAcceso !== 'HABILITADO' && (
                        <span className={`inline-flex items-center gap-1 w-fit rounded-full px-3 py-1 text-xs font-medium ${
                          user.estadoAcceso === 'SUSPENDIDO' 
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'
                        }`}>
                          {user.estadoAcceso}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                        onClick={() => onView(user)}
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </Button>

                      {canUpdateUsers && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                          onClick={() => onEdit(user)}
                          title="Editar"
                        >
                          <Edit size={16} />
                        </Button>
                      )}

                      {canDeleteUsers && user.id !== currentUserId && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-rose-400 hover:!bg-rose-50 hover:!text-rose-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-rose-500/50 dark:hover:!bg-rose-500/10 dark:hover:!text-rose-300"
                          onClick={() => onDelete(user)}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
