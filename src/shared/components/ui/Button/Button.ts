import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react'
import { ButtonView } from './Button.view'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  fullWidth?: boolean
  icon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
      primary:
        'bg-gradient-to-br from-wine-600 to-wine-900 text-white shadow-lg shadow-wine-900/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-wine-900/40 active:scale-95 transition-all duration-300 border border-wine-500/20',
      secondary:
        'border border-slate-200 bg-white/80 text-slate-800 backdrop-blur-sm hover:bg-wine-50 hover:text-wine-900 dark:border-wine-800/30 dark:bg-black/40 dark:text-slate-100 dark:hover:bg-wine-900/20 transition-all duration-300 hover:shadow-md active:scale-95',
      ghost:
        'text-slate-600 hover:bg-wine-50 hover:text-wine-900 dark:text-slate-300 dark:hover:bg-wine-900/30 dark:hover:text-wine-100 transition-all duration-300 active:scale-95',
      danger:
        'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-lg shadow-rose-900/20 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300',
      success:
        'bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-900/20 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300',
      warning:
        'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-900/20 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300',
      info:
        'bg-gradient-to-br from-cyan-500 to-blue-700 text-white shadow-lg shadow-blue-900/20 hover:-translate-y-1 hover:shadow-xl active:scale-95 transition-all duration-300',
    }

    const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
      sm: 'min-h-9 px-3.5 py-2 text-xs sm:text-sm',
      md: 'min-h-11 px-5 py-3 text-sm',
      lg: 'min-h-12 px-6 py-3.5 text-sm sm:text-base',
    }

    const classes = `inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`

    return ButtonView({ ...props, ref, isLoading, classes })
  }
)

Button.displayName = 'Button'
