import { ReactNode, Ref } from 'react'

interface FormSelectViewProps {
  disabled: boolean
  options: Array<{ value: string | number; label: string }>
  className: string
  children?: ReactNode
  ref: Ref<HTMLSelectElement>
  [key: string]: any
}

export const FormSelectView = ({ 
  disabled, 
  options, 
  className, 
  children, 
  ref, 
  ...props 
}: FormSelectViewProps) => (
  <select
    ref={ref}
    disabled={disabled}
    className={`block w-full rounded-2xl bg-white/50 px-4 py-3.5 text-sm font-bold text-slate-900 border-2 border-wine-100/50 outline-none transition-all duration-300 focus:border-wine-300 focus:bg-white focus:shadow-xl focus:shadow-wine-900/5 dark:bg-black/20 dark:border-wine-900/40 dark:text-slate-100 dark:focus:border-wine-600 dark:focus:bg-black/40 ${
      disabled ? 'opacity-50 cursor-not-allowed grayscale' : ''
    } ${className}`}
    {...props}
  >
    {options.length > 0 ? (
      options.map((option) => (
        <option key={option.value} value={option.value} className="bg-white dark:bg-slate-900">
          {option.label}
        </option>
      ))
    ) : (
      children
    )}
  </select>
)
