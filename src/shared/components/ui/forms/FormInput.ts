import { InputHTMLAttributes, forwardRef } from 'react'
import { FormInputView } from './FormInput.view'

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ disabled = false, className = '', ...props }, ref) => {
    return FormInputView({ disabled, className, ref, ...props })
  }
)

FormInput.displayName = 'FormInput'
