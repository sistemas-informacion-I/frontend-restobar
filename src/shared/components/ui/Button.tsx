import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader } from './Loader'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
      // Primary - Indigo gradient
      primary:
        'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300',
      
      // Secondary - Neutral
      secondary:
        'border border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition-all duration-300',
      
      // Ghost - Transparent
      ghost:
        'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-all duration-300',
      
      // Danger - Red gradient
      danger:
        'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-rose-500/40 transition-all duration-300',
      
      // Success - Green gradient
      success:
        'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/40 transition-all duration-300',
      
      // Warning - Orange/Yellow gradient (like SI1-ferreteria)
      warning:
        'bg-gradient-to-r from-orange-600 to-yellow-500 text-white shadow-md shadow-orange-600/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-600/25 font-semibold tracking-wider transition-all duration-300',
      
      // Info - Cyan gradient
      info:
        'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md shadow-cyan-500/30 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300',
    }

    const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'min-h-9 px-3.5 py-2 text-xs sm:text-sm',
      md: 'min-h-11 px-5 py-3 text-sm',
      lg: 'min-h-12 px-6 py-3.5 text-sm sm:text-base',
    }

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader size="sm" />
            <span>Procesando...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex items-center">{icon}</span>}
            {children}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
