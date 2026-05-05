import { ReactNode } from 'react'
import { Select } from '../Select/Select'

interface FormSelectViewProps {
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
)
