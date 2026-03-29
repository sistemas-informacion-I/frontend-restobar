import { forwardRef, InputHTMLAttributes, useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, type, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor={props.id || props.name}>
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && <span className="pointer-events-none absolute left-3 text-slate-400 dark:text-slate-500">{icon}</span>}
          <input
            ref={ref}
            type={inputType}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition hover:border-slate-300 focus:border-indigo-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 ${icon ? 'pl-11' : ''} ${error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 dark:border-slate-700'} ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute right-2 rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <span className="flex items-center gap-1.5 text-xs text-rose-500">
            <AlertCircle size={14} />
            {error}
          </span>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
