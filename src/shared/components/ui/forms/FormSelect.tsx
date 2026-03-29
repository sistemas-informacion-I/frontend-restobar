import { SelectHTMLAttributes, forwardRef } from 'react'

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  disabled?: boolean
  options?: Array<{ value: string | number; label: string }>
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ disabled = false, options = [], className = '', children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        disabled={disabled}
        className={`mt-2 block w-full bg-gray-800 border-2 border-gray-600 text-white focus:border-yellow-500 focus:ring-yellow-500 rounded-md shadow-sm transition ${
          disabled ? 'opacity-75 cursor-not-allowed' : ''
        } ${className}`}
        {...props}
      >
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))
        ) : (
          children
        )}
      </select>
    )
  }
)

FormSelect.displayName = 'FormSelect'
