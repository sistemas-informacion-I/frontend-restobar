import { SelectHTMLAttributes, forwardRef } from 'react'
import { FormSelectView } from './FormSelect.view'

export interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ disabled = false, options = [], className = '', children, ...props }, ref) => {
    return FormSelectView({ disabled, options, className, children, ref, ...props })
  }
)

FormSelect.displayName = 'FormSelect'
