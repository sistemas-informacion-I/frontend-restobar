import { FormSelectView } from './FormSelect.view'

export interface FormSelectProps {
  label?: string
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
  className?: string
  value?: any
  onChange?: (val: any) => void
  [key: string]: any
}

export const FormSelect = ({ 
  label,
  disabled = false, 
  options = [], 
  className = '', 
  value,
  onChange,
  ...props 
}: FormSelectProps) => {
  return FormSelectView({ label, disabled, options, className, value, onChange, ...props })
}

FormSelect.displayName = 'FormSelect'
