import { forwardRef, InputHTMLAttributes, ReactNode, useState } from 'react'
import { InputView } from './Input.view'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type

    const togglePassword = () => setShowPassword(!showPassword)

    return InputView({ 
      ...props, 
      ref, 
      type: inputType, 
      isPassword, 
      showPassword, 
      togglePassword 
    })
  }
)

Input.displayName = 'Input'
