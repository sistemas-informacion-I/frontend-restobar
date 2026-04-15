import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { useAuth } from '../../context/AuthContext'
import { ErrorHandler } from '../../services/error-handler'
import type { LoginData } from '../../services/api'
import { LoginPageView } from './LoginPage.view'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const { 
    formattedTime, 
    isActive: isLocked, 
    start: startCountdown, 
    stop: stopCountdown 
  } = useCountdown()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginData>({
    mode: 'onBlur',
  })

  // Limpiar mensaje de error cuando el bloqueo termina
  useEffect(() => {
    if (!isLocked && errorMessage.includes('bloqueada')) {
      setErrorMessage('')
    }
  }, [isLocked, errorMessage])

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    setErrorMessage('')
    stopCountdown()

    try {
      await login(data)
      navigate('/dashboard')
    } catch (error) {
      if (ErrorHandler.isLockoutError(error)) {
        const lockedUntil = ErrorHandler.getLockoutUntil(error)
        if (lockedUntil) {
          const diffInSeconds = Math.ceil((lockedUntil.getTime() - Date.now()) / 1000)
          if (diffInSeconds > 0) {
            startCountdown(diffInSeconds)
            reset({ password: '' })
          }
        }
      }
      setErrorMessage(ErrorHandler.handle(error, 'iniciar sesión'))
    } finally {
      setIsLoading(false)
    }
  }

  return LoginPageView({
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    errorMessage,
    isLocked,
    formattedTime
  })
}
