import { TextareaHTMLAttributes, forwardRef } from 'react'

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  disabled?: boolean
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ disabled = false, className = '', ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`px-4 py-2 border-2 rounded-md mt-2 block w-full bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-yellow-500 focus:ring-yellow-500 rounded-md shadow-sm resize-none transition ${
          disabled ? 'opacity-75 cursor-not-allowed' : ''
        } ${className}`}
        {...props}
      />
    )
  }
)

FormTextarea.displayName = 'FormTextarea'
