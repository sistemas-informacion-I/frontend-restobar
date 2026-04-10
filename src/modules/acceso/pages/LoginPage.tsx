import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { User, Lock, LogIn, Timer } from 'lucide-react'

import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { useCountdown } from '@/shared/hooks/useCountdown'

import { useAuth } from '../context/AuthContext'
import { AuthBrandHeader, AuthFooterNote, AuthFormCard, AuthPageShell } from '../components/auth'
import { ErrorHandler } from '../services/error-handler'
import type { LoginData } from '../services/api'

export default function LoginPage() {
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

  return (
    <AuthPageShell>
      <div className="relative flex w-full max-w-md flex-col gap-6">
        <AuthBrandHeader subtitle="Seguridad y simplicidad en un solo lugar" />

        <AuthFormCard
          title="Iniciar Sesión"
          description="Ingresa tus credenciales para continuar"
          footerText="¿No tienes una cuenta?"
          footerLinkLabel="Regístrate aquí"
          footerLinkTo="/register"
        >
          {errorMessage && (
            <div className={`rounded-lg border px-3 py-2 text-sm flex items-start gap-3 ${
              isLocked 
                ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300'
                : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300'
            }`}>
              {isLocked && <Timer size={16} className="mt-0.5 shrink-0" />}
              <div className="flex flex-col">
                <span>{errorMessage}</span>
                {isLocked && (
                  <span>
                    Espera: {formattedTime}
                  </span>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Usuario"
              type="text"
              placeholder="tu_usuario"
              icon={<User size={18} />}
              error={errors.username?.message}
              disabled={isLocked}
              {...register('username', {
                required: 'Ingresa tu usuario para continuar',
                maxLength: {
                  value: 255,
                  message: 'El usuario no puede exceder 255 caracteres',
                },
              })}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              disabled={isLocked}
              {...register('password', {
                required: 'Ingresa tu contraseña',
                maxLength: {
                  value: 128,
                  message: 'La contraseña no puede exceder 128 caracteres',
                },
              })}
            />

            <Button 
              type="submit" 
              fullWidth 
              isLoading={isLoading} 
              disabled={isLocked}
              icon={isLocked ? <Timer size={18} /> : <LogIn size={18} />}
              variant={isLocked ? 'secondary' : 'primary'}
            >
              {isLocked ? `Bloqueado (${formattedTime})` : 'Iniciar Sesión'}
            </Button>
          </form>
        </AuthFormCard>

        <AuthFooterNote />
      </div>
    </AuthPageShell>
  )
}
