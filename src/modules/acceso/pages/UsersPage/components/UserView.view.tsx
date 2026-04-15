import { User as UserIcon, Mail, Shield, Calendar, CreditCard } from 'lucide-react'
import { UserViewProps } from './UserView'

interface UserViewViewProps extends UserViewProps {
  formatDate: (dateStr?: string) => string
}

export function UserViewView({ user, formatDate }: UserViewViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center gap-6 border-b border-wine-100/50 pb-8 text-center dark:border-wine-900/20 sm:flex-row sm:items-center sm:text-left">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-wine-600 to-wine-900 text-3xl font-black text-white shadow-xl shadow-wine-900/40">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h3>
          <span className={`inline-flex w-fit items-center gap-2 rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest ${user.isActive ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 border border-rose-500/20'}`}>
            {user.isActive ? (
              <><div className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Activo</>
            ) : (
              <><div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Inactivo</>
            )}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-4 rounded-3xl bg-wine-50/20 p-5 glass-card dark:bg-white/5 border-wine-100/30 dark:border-wine-900/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
            <Mail size={22} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Correo electrónico</span>
            <span className="break-all text-sm font-black text-slate-900 dark:text-white tracking-tighter">{user.email}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-3xl bg-wine-50/20 p-5 glass-card dark:bg-white/5 border-wine-100/30 dark:border-wine-900/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
            <CreditCard size={22} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">CI Identidad</span>
            <span className="break-all text-sm font-black text-slate-900 dark:text-white tracking-tighter">{user.ci || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-3xl bg-wine-50/20 p-5 glass-card dark:bg-white/5 border-wine-100/30 dark:border-wine-900/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
            <UserIcon size={22} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Username / ID</span>
            <span className="break-all text-sm font-black text-slate-900 dark:text-white tracking-tighter">
              {user.username || 'N/A'} <span className="text-wine-400 text-[10px] opacity-60">(Ref: {user.id})</span>
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-3xl bg-wine-50/20 p-5 glass-card dark:bg-white/5 border-wine-100/30 dark:border-wine-900/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
            <Shield size={22} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Estado de Acceso</span>
            <span className="break-all text-sm font-black text-slate-900 dark:text-white tracking-tighter">
              {user.estadoAcceso || 'HABILITADO'} 
              <span className="ml-2 text-wine-400 text-[10px] opacity-60">({user.intentosFallidos ?? 0} fallos)</span>
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-3xl bg-wine-50/20 p-5 glass-card dark:bg-white/5 border-wine-100/30 dark:border-wine-900/10 sm:col-span-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
            <Shield size={22} />
          </div>
          <div className="flex min-w-0 flex-col gap-1 w-full">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Privilegios (Roles)</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {user.roles && user.roles.length > 0 
                ? user.roles.map(r => (
                  <span key={r.id} className="rounded-lg bg-wine-600 px-3 py-1 text-[10px] font-black text-white shadow-lg shadow-wine-900/20 uppercase tracking-widest">
                    {r.name}
                  </span>
                ))
                : <span className="text-xs font-bold text-slate-400">Sin rol asignado</span>}
            </div>
          </div>
        </div>

        {user.roles && user.roles.length > 0 && user.roles.some(r => r.permissions?.length > 0) && (
          <div className="rounded-[2.5rem] bg-wine-50/20 p-6 glass-card border-wine-100/50 dark:border-wine-900/20 dark:bg-black/20 sm:col-span-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-300">Resumen de Capacidades (Permisos)</span>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {Array.from(new Set(user.roles.flatMap(role => role.permissions || []).map(p => JSON.stringify(p)))).map(pStr => {
                const p = JSON.parse(pStr);
                return (
                  <span key={p.id} className="rounded-xl bg-white/60 dark:bg-wine-950/40 px-3 py-2 text-[10px] font-black uppercase tracking-tighter text-wine-700 dark:text-wine-300 border border-wine-100/30 dark:border-wine-900/20 transition-all hover:scale-105">
                    {p.action}
                  </span>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 rounded-3xl bg-wine-50/20 p-5 glass-card dark:bg-white/5 border-wine-100/30 dark:border-wine-900/10 sm:col-span-2">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:text-wine-400">
            <Calendar size={22} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Registro de Alta</span>
            <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">{formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
