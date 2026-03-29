import { Edit2, Eye, Shield, Trash2 } from 'lucide-react'
import { Button, TableCell, TableRow } from '@/shared/components/ui'
import { Role } from '../../services/api'

interface RolesTableProps {
  roles: Role[]
  canUpdateRoles: boolean
  canDeleteRoles: boolean
  onView: (role: Role) => void
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
}

export function RolesTable({
  roles,
  canUpdateRoles,
  canDeleteRoles,
  onView,
  onEdit,
  onDelete,
}: RolesTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="min-w-[720px] w-full border-collapse">
          <thead>
            <TableRow header>
              <TableCell header>Nombre</TableCell>
              <TableCell header>Descripción</TableCell>
              <TableCell header>Permisos</TableCell>
              <TableCell header>Acciones</TableCell>
            </TableRow>
          </thead>
          <tbody>
            {roles.map((role) => (
              <TableRow key={role.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
                      <Shield size={16} />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-slate-100">{role.name}</span>
                  </div>
                </TableCell>

                <TableCell className="text-slate-600 dark:text-slate-300">
                  {role.description || 'Sin descripción'}
                </TableCell>

                <TableCell>
                  {role.permissions && role.permissions.length > 0 ? (
                    <span className="inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                      {role.permissions.length} permisos
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400">Sin permisos</span>
                  )}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                      title="Ver"
                      onClick={() => onView(role)}
                    >
                      <Eye size={16} />
                    </Button>

                    {canUpdateRoles && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-indigo-400 hover:!bg-indigo-50 hover:!text-indigo-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-indigo-500/50 dark:hover:!bg-indigo-500/10 dark:hover:!text-indigo-300"
                        title="Editar"
                        onClick={() => onEdit(role)}
                      >
                        <Edit2 size={16} />
                      </Button>
                    )}

                    {canDeleteRoles && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="!h-8 !w-8 !min-h-8 !rounded-md !px-0 border border-slate-300 !text-slate-500 hover:!border-rose-400 hover:!bg-rose-50 hover:!text-rose-600 dark:border-slate-600 dark:!text-slate-400 dark:hover:!border-rose-500/50 dark:hover:!bg-rose-500/10 dark:hover:!text-rose-300"
                        title="Eliminar"
                        onClick={() => onDelete(role)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
