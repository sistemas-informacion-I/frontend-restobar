import React from 'react'

interface FormLabelViewProps {
  children: React.ReactNode
  required: boolean
  className: string
  htmlFor?: string
}

export const FormLabelView: React.FC<FormLabelViewProps> = ({
  children,
  required,
  className,
  htmlFor,
}) => (
  <label
    htmlFor={htmlFor}
    className={`block mb-2 text-sm font-semibold text-gray-200 flex items-center gap-1 ${className}`}
  >
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
)
