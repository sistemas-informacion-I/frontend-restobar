import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCountdown } from '@/shared/hooks/useCountdown'
import { useAuth } from '../../context/AuthContext'
import { ErrorHandler } from '../../services/error-handler'
import type { LoginData } from '../../models'
import { LoginPageView } from './LoginPage.view'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [viewMode, setViewMode] = useState<'login' | 'recovery'>('login')
  const [isCodeSent, setIsCodeSent] = useState(false)
  
  const { 
    formattedTime, 
    isActive: isLocked, 
    start: startCountdown, 
    stop: stopCountdown 
  } = useCountdown()

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
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

  // Recovery Handlers
  const onSendCode = async () => {
    const email = (getValues() as any).recoveryEmail
    if (!email) {
      setErrorMessage('Ingresa un correo para enviar el código.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')
    try {
      // Import dynamic or use authService directly (it's in context/services)
      const { authService } = await import('../../services/auth.service')
      await authService.sendResetCode(email)
      setIsCodeSent(true)
      setSuccessMessage('El código de verificación ha sido enviado a tu correo.')
    } catch (error) {
      setErrorMessage(ErrorHandler.handle(error, 'enviar el código de recuperación'))
    } finally {
      setIsLoading(false)
    }
  }

  const onVerifyCode = async () => {
    const email = (getValues() as any).recoveryEmail
    const code = (getValues() as any).recoveryCode

    if (!email || !code) {
      setErrorMessage('Ingresa el correo y el código de verificación.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    try {
      const { authService } = await import('../../services/auth.service')
      await authService.verifyResetCode(email, code)
      setSuccessMessage('Contraseña restablecida. Revisa tu correo con tu nueva contraseña.')
      setIsCodeSent(false)
      setValue('recoveryCode' as any, '')
    } catch (error) {
      setErrorMessage(ErrorHandler.handle(error, 'verificar el código'))
    } finally {
      setIsLoading(false)
    }
  }

  const onGoBack = () => {
    setViewMode('login')
    setErrorMessage('')
    setSuccessMessage('')
    setIsCodeSent(false)
    reset()
  }

  return LoginPageView({
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    errorMessage,
    successMessage,
    isLocked,
    formattedTime,
    viewMode,
    setViewMode,
    isCodeSent,
    onSendCode,
    onVerifyCode,
    onGoBack
  })
}
