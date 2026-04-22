import { Empleado } from '../../services/api'
import { Mail, Calendar, CheckCircle, XCircle, CreditCard, MapPin, DollarSign, Phone, Hash, User, Clock } from 'lucide-react'

interface EmpleadoViewProps {
  empleado: Empleado
}

export function EmpleadoView({ empleado }: EmpleadoViewProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return 'N/A'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'BOB',
    }).format(amount)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-4 border-b border-slate-200 pb-6 text-center dark:border-slate-700 sm:flex-row sm:items-center sm:text-left">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-2xl font-semibold text-white shadow-lg shadow-emerald-500/30">
          {(empleado.name || '?').charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{empleado.name}</h3>
          <span className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${empleado.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400'}`}>
            {empleado.isActive ? (
              <><CheckCircle size={14} /> Activo</>
            ) : (
              <><XCircle size={14} /> Inactivo</>
            )}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CreditCard size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">CI</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{empleado.ci || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Mail size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Correo electrónico</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{empleado.email || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Phone size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Teléfono</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{empleado.phone || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Hash size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Código de empleado</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{empleado.codigoEmpleado || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <User size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Usuario</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{empleado.username || 'N/A'}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Salario</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100 font-semibold">{formatCurrency(empleado.salary)}</span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Clock size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Turno</span>
            <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-sm font-medium ${
              empleado.turno === 'AM' 
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400' 
                : empleado.turno === 'PM'
                ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}>
              {empleado.turno === 'AM' ? 'Mañana (AM)' : empleado.turno === 'PM' ? 'Tarde (PM)' : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Calendar size={18} />
          </div>
          <div className="flex min-w-0 flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Fecha de Contratación</span>
            <span className="break-all text-sm text-slate-900 dark:text-slate-100">{formatDate(empleado.hireDate)}</span>
          </div>
        </div>

        {empleado.address && (
          <div className="flex items-start gap-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MapPin size={18} />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Dirección</span>
              <span className="break-all text-sm text-slate-900 dark:text-slate-100">{empleado.address}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
