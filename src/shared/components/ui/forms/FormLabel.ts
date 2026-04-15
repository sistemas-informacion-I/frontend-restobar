import React from 'react'
import { FormLabelView } from './FormLabel.view'

export interface FormLabelProps {
  children: React.ReactNode
  required?: boolean
  className?: string
  htmlFor?: string
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  className = '',
  htmlFor,
}) => {
  return FormLabelView({ children, required, className, htmlFor })
}
