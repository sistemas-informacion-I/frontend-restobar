import { ReactNode } from 'react'
import { Select } from '../Select/Select'

interface FormSelectViewProps {
  label?: string
  disabled: boolean
  options: Array<{ value: string | number; label: string }>
  className: string
  value?: any
  onChange?: (val: any) => void
  onBlur?: () => void
  name?: string
  placeholder?: string
  icon?: ReactNode
  [key: string]: any
}

export const FormSelectView = ({ 
  label,
  disabled, 
  options, 
  className, 
  value,
  onChange,
  onBlur,
  name,
  placeholder,
  icon,
  ...props 
}: FormSelectViewProps) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 px-1">
        {label}
      </label>
    )}
    <Select
      value={value}
      onChange={onChange || (() => {})}
      options={options}
      disabled={disabled}
      className={className}
      placeholder={placeholder}
      icon={icon}
      {...props}
    />
  </div>
)
