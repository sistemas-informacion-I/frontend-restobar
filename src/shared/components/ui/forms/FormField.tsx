import React, { HTMLAttributes } from 'react'

interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string
  name?: string
  error?: string | string[] | null
  required?: boolean
  children: React.ReactNode
}

/**
 * FormField - Componente contenedor para campos de formulario
 * Agrupa label, input/select/textarea y mensajes de error en un patrón consistente
 * Similar a field.blade.php en SI1-ferreteria
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  error,
  required = false,
  children,
  className = '',
  ...props
}) => {
  return (
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

      {/* Renderizar children (FormInput, FormSelect, FormTextarea) */}
      {children}

      {/* Mostrar errores si existen */}
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
}
