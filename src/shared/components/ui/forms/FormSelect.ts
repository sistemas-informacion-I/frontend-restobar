import { FormSelectView } from './FormSelect.view'

export interface FormSelectProps {
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  className?: string
  value?: any
  onChange?: (val: any) => void
  [key: string]: any
}

export const FormSelect = ({ 
  disabled = false, 
  options = [], 
  className = '', 
  value,
  onChange,
  ...props 
}: FormSelectProps) => {
  return FormSelectView({ disabled, options, className, value, onChange, ...props })
}

FormSelect.displayName = 'FormSelect'
