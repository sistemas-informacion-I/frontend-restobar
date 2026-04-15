import React from 'react'

interface FormFieldViewProps {
  label?: string
  name?: string
  error: string | string[] | null | undefined
  required: boolean
  children: React.ReactNode
  className: string
  [key: string]: any
}

export const FormFieldView: React.FC<FormFieldViewProps> = ({
  label,
  name,
  error,
  required,
  children,
  className,
  ...props
}) => (
  <div className={`w-full ${className}`} {...props}>
    {label && (
      <label
        htmlFor={name}
        className="text-sm font-semibold text-gray-200 flex items-center gap-1 mb-2 block"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
    )}

    {children}

    {error && (
      <ul className="mt-2 text-sm space-y-1 text-red-400">
        {typeof error === 'string' ? (
          <li>{error}</li>
        ) : Array.isArray(error) ? (
          error.map((err, idx) => <li key={idx}>{err}</li>)
        ) : null}
      </ul>
    )}
  </div>
)
