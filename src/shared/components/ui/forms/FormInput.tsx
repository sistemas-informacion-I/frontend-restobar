import { InputHTMLAttributes, forwardRef } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ disabled = false, className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        disabled={disabled}
        className={`px-4 py-2 border-2 rounded-md mt-2 block w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500 transition ${
          disabled ? 'opacity-75 cursor-not-allowed' : ''
        } ${className}`}
        {...props}
      />
    )
  }
)

FormInput.displayName = 'FormInput'
