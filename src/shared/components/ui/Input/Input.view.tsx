import { ReactNode, Ref } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface InputViewProps {
  label?: string
  error?: string
  icon?: ReactNode
  type?: string
  isPassword?: boolean
  showPassword?: boolean
  togglePassword?: () => void
  ref: Ref<HTMLInputElement>
  className?: string
  id?: string
  name?: string
  [key: string]: any
}

export function InputView({
  label,
  error,
  icon,
  type,
  isPassword,
  showPassword,
  togglePassword,
  ref,
  className = '',
  ...props
}: InputViewProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1" htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <div className="relative flex items-center group/input">
        {icon && (
          <span className="pointer-events-none absolute left-4 text-slate-400 group-focus-within/input:text-wine-600 dark:group-focus-within/input:text-wine-400 transition-colors">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          type={type}
          className={`w-full rounded-2xl border bg-slate-50/50 py-3.5 text-sm font-bold text-slate-900 placeholder:text-slate-400/60 transition-all duration-300 focus:bg-white focus:outline-none focus:ring-4 focus:ring-wine-500/10 dark:bg-black/20 dark:text-white dark:placeholder:text-slate-600 dark:focus:bg-black/40 ${icon ? 'pl-12' : 'px-5'} ${error ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10' : 'border-wine-100/50 hover:border-wine-300 focus:border-wine-500 dark:border-wine-900/30 dark:hover:border-wine-700 dark:focus:border-wine-600'} ${className}`}
          {...props}
        />
        {isPassword && togglePassword && (
          <button
            type="button"
            className="absolute right-3 rounded-xl p-2 text-slate-400 transition-all hover:bg-wine-50 hover:text-wine-700 dark:hover:bg-wine-900/30 dark:hover:text-wine-300"
            onClick={togglePassword}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-600 px-1 animate-in slide-in-from-top-1">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </span>
      )}
    </div>
  )
}
