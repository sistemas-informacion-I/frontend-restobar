import React, { HTMLAttributes } from 'react'
import { FormFieldView } from './FormField.view'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  name?: string
  error?: string | string[] | null
  required?: boolean
  children: React.ReactNode
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  required = false,
  children,
  className = '',
  ...props
}) => {
  return FormFieldView({
    label,
    name,
    error,
    required,
    children,
    className,
    ...props
  })
}
