import { Shield, FileText, Key } from 'lucide-react'
import { RoleViewProps } from './RoleView'

interface RoleViewViewProps extends RoleViewProps {
  groupedPermissions: Record<string, any[] | undefined>
  moduleNames: Record<string, string>
}

export function RoleViewView({ role, groupedPermissions, moduleNames }: RoleViewViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-6 border-b border-wine-100/50 pb-8 text-center dark:border-wine-900/20 sm:flex-row sm:items-start sm:text-left">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-xl shadow-wine-900/40 group-hover:scale-110 transition-transform">
          <Shield size={32} />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{role.name}</h3>
          {role.description ? (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-lg">{role.description}</p>
          ) : (
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 italic">Sin descripción asignada</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4 rounded-3xl bg-wine-50/30 p-5 glass-card dark:bg-white/5 border-wine-100/30 dark:border-wine-900/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400 transition-colors">
            <FileText size={22} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">ID Identificador</span>
            <span className="break-all text-sm font-black text-slate-900 dark:text-white tracking-tighter">{role.id}</span>
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-wine-50/20 p-6 glass-card border-wine-100/50 dark:border-wine-900/20 dark:bg-black/20">
          <div className="mb-6 flex items-center gap-3 border-b border-wine-100/50 pb-4 text-[11px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:border-wine-900/30 dark:text-wine-300">
            <Key size={18} className="text-wine-600" />
            <span>Permisos de Acceso Asignados</span>
            <span className="ml-auto rounded-lg bg-wine-600 px-3 py-1 text-[10px] font-black text-white shadow-lg shadow-wine-900/20">
              {role.permissions?.length || 0}
            </span>
          </div>

          {(role.permissions && role.permissions.length > 0) ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {Object.entries(groupedPermissions).map(([module, perms]) => (
                <div key={module} className="rounded-2xl border border-wine-100/30 bg-white/60 p-5 dark:border-wine-900/10 dark:bg-wine-950/40 transition-all hover:bg-white/80 dark:hover:bg-wine-950/60">
                  <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-wine-700 dark:text-wine-300">
                    <div className="h-1.5 w-1.5 rounded-full bg-wine-500" />
                    {moduleNames[module] || module}
                  </h4>
                  <div className="flex flex-col gap-3">
                    {perms?.map((permission: any) => (
                      <div key={permission.id} className="rounded-xl bg-wine-50/50 px-3 py-2 dark:bg-black/20 border border-wine-100/20 dark:border-wine-800/20">
                        <span className="block text-xs font-black capitalize text-slate-800 dark:text-slate-200">
                          {permission.action}
                        </span>
                        {permission.description && (
                          <span className="mt-0.5 block text-[10px] font-medium text-slate-500 dark:text-slate-500 leading-tight">
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
            <div className="py-12 text-center flex flex-col items-center gap-3">
              <Shield size={32} className="text-slate-300 dark:text-slate-700" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-600">Este rol no posee permisos en la matriz</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
