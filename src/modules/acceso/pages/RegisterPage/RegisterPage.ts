import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { authService, getErrorMessage, RegisterData } from '../../services/api'
import { RegisterPageView } from './RegisterPage.view'

interface RegisterFormData extends RegisterData {
  confirmPassword: string
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    mode: 'onBlur',
  })

  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      const { confirmPassword, ...registerData } = data
      void confirmPassword
      await authService.register(registerData)
      setSuccessMessage('Registro completado correctamente.')
      setIsSuccess(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'registrar tu cuenta'))
    } finally {
      setIsLoading(false)
    }
  }

  return RegisterPageView({
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    isSuccess,
    successMessage,
    errorMessage,
    password,
    navigate
  })
}
