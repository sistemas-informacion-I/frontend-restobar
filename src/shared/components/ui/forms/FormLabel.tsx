import React, { LabelHTMLAttributes } from 'react'

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

export const FormLabel: React.FC<FormLabelProps> = ({
  children,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <label
      className={`text-sm font-semibold text-gray-200 flex items-center gap-1 ${className}`}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}
