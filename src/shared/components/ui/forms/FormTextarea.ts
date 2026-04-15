import { TextareaHTMLAttributes, forwardRef } from 'react'
import { FormTextareaView } from './FormTextarea.view'

export interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  disabled?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ disabled = false, className = '', ...props }, ref) => {
    return FormTextareaView({ disabled, className, ref, ...props })
  }
)

FormTextarea.displayName = 'FormTextarea'
