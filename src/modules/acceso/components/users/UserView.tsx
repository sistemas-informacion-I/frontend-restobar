import { User } from '../../services/api'
import { User as UserIcon, Mail, Shield, Calendar, CheckCircle, XCircle, CreditCard } from 'lucide-react'

interface UserViewProps {
  user: User
}

export function UserView({ user }: UserViewProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 sm:flex-row sm:items-center sm:text-left">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-2xl font-semibold text-white shadow-lg shadow-indigo-500/30">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{user.name}</h3>
          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${user.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'}`}>
            {user.isActive ? (
              <><CheckCircle size={14} /> Activo</>
            ) : (
              <><XCircle size={14} /> Inactivo</>
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Mail size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Correo electrónico</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{user.email}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <CreditCard size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">CI</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{user.ci || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Shield size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Rol</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">
              {user.roles && user.roles.length > 0 
                ? user.roles.map(r => r.name).join(', ') 
                : 'Sin rol asignado'}
            </span>
          </div>
        </div>

        {user.roles && user.roles.length > 0 && user.roles.some(r => r.permissions?.length > 0) && (
          <div className="rounded-xl bg-slate-100 p-4 dark:bg-slate-800/70">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Permisos</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {user.roles.flatMap(role => role.permissions || []).map((p) => (
                <span key={p.id} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                  {p.description || p.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Calendar size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Fecha de creación</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{formatDate(user.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <UserIcon size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">ID de usuario</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
