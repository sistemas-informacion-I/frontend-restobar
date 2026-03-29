import { Role } from '../../services/api'
import { Shield, FileText, Key } from 'lucide-react'

interface RoleViewProps {
  role: Role
}

export function RoleView({ role }: RoleViewProps) {
  // Agrupar permisos por módulo
  const groupedPermissions = role.permissions?.reduce((acc, permission) => {
    const module = permission.module || 'Otros'
    if (!acc[module]) {
      acc[module] = []
    }
    acc[module].push(permission)
    return acc
  }, {} as Record<string, typeof role.permissions>) || {}

  const moduleNames: Record<string, string> = {
    users: 'Usuarios',
    roles: 'Roles',
    permissions: 'Permisos',
    Otros: 'Otros',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
          <Shield size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{role.name}</h3>
          {role.description && (
            <p className="text-sm text-slate-600 dark:text-slate-300">{role.description}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <FileText size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">ID del rol</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{role.id}</span>
          </div>
        </div>

        <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800/70">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-medium text-slate-700 dark:border-slate-700 dark:text-slate-300">
            <Key size={18} />
            <span>Permisos asignados</span>
            <span className="ml-auto rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
              {role.permissions?.length || 0}
            </span>
          </div>

          {Object.keys(groupedPermissions).length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module} className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900/50">
                  <h4 className="mb-2 text-sm font-semibold capitalize text-indigo-600 dark:text-indigo-400">
                    {moduleNames[module] || module}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {perms?.map((permission) => (
                      <div key={permission.id} className="rounded-md bg-slate-100 px-2 py-1.5 dark:bg-slate-800">
                        <span className="block text-sm capitalize text-slate-800 dark:text-slate-100">
                          {permission.action}
                        </span>
                        {permission.description && (
                          <span className="block text-xs text-slate-500 dark:text-slate-400">
                            {permission.description}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
              Este rol no tiene permisos asignados
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
