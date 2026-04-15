import React from 'react'
import { FormErrorView } from './FormError.view'

export interface FormErrorProps {
  error?: string | string[] | null
  className?: string
}

export const FormError: React.FC<FormErrorProps> = ({ error, className = '' }) => {
  return FormErrorView({ error, className })
}
