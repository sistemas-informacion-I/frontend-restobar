import { Shield, Key, Calendar, Clock } from 'lucide-react'
import { RoleViewProps } from './RoleView'

interface RoleViewViewProps extends RoleViewProps {
  groupedPermissions: Record<string, any[] | undefined>
  moduleNames: Record<string, string>
}

export function RoleViewView({ role, groupedPermissions, moduleNames }: RoleViewViewProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Info Section - Consistent with Form layout but read-only */}
      <div className="flex flex-col gap-5 border-b border-wine-100/30 pb-6 dark:border-wine-900/10">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-wine-600 to-wine-950 text-white shadow-lg shadow-wine-900/30">
            <Shield size={28} />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="truncate text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {role.name}
            </h3>
            <p className="mt-1.5 text-[10px] font-black uppercase tracking-widest text-wine-600 dark:text-wine-400">
              Nivel de Acceso: {role.accessLevel || 0}
            </p>
          </div>
        </div>

        {role.description && (
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-black/20 border border-slate-100 dark:border-slate-800">
            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Descripción del Rol</span>
            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
              "{role.description}"
            </p>
          </div>
        )}

        <div className="flex items-center gap-3 px-1">
          <div className={`h-2.5 w-2.5 rounded-full ${role.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Estado: {role.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      {/* Permissions Matrix - Matching RoleForm style and scroll */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 px-1">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">
            Matriz de Permisos Asignados
          </label>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            Visualización de los privilegios otorgados a este perfil.
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-6 rounded-[2.5rem] border border-wine-100/50 bg-wine-50/10 p-5 dark:border-wine-900/20 dark:bg-black/20 custom-scrollbar">
          {Object.keys(groupedPermissions).length > 0 ? (
            Object.entries(groupedPermissions).map(([module, perms]) => (
              <div key={module} className="space-y-3">
                {/* Sticky Header with Badge - Matching RoleForm */}
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 rounded-2xl border border-wine-100 bg-white/95 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-wine-700 backdrop-blur shadow-sm dark:border-wine-500/20 dark:bg-wine-950/80 dark:text-wine-400">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-wine-500" />
                    {moduleNames[module] || module}
                  </div>
                  <span className="bg-wine-100 dark:bg-wine-500/20 text-wine-700 dark:text-wine-400 px-2.5 py-0.5 rounded-full text-[9px] font-black tabular-nums">
                    {perms?.length || 0}
                  </span>
                </div>

                {/* Permissions List - Matching RoleForm items styling */}
                <div className="space-y-1 pl-2">
                  {perms?.map((permission: any) => (
                    <div 
                      key={permission.id} 
                      className="flex items-start gap-4 rounded-xl border border-transparent p-3 transition-all hover:bg-white dark:hover:bg-wine-900/20 group"
                    >
                      <div className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-wine-100 dark:bg-wine-950">
                        <Key size={10} className="text-wine-600 dark:text-wine-400" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-xs font-black capitalize text-slate-800 dark:text-slate-200">
                          {permission.action}
                        </span>
                        {permission.description && (
                          <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 leading-snug line-clamp-2">
                            {permission.description}
                          </span>
                        )}
                        <span className="mt-1 text-[8px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest tabular-nums">
                          Ref: {permission.id}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
              <Shield size={32} className="text-wine-300 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900">Sin privilegios asociados</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer / Meta Section - Matching the premium vibe */}
      <div className="mt-2 flex flex-col gap-2 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-black/10">
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} className="text-wine-600/50" />
            <span>Registro creado</span>
          </div>
          <span className="text-slate-600 dark:text-slate-300 tabular-nums">
            {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-wine-600/50" />
            <span>Última revisión</span>
          </div>
          <span className="text-slate-600 dark:text-slate-300 tabular-nums">
            {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
}
