import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, UserPlus, CheckCircle } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { authService, getErrorMessage, RegisterData } from '../services/api'
import { AuthBrandHeader, AuthFooterNote, AuthFormCard, AuthPageShell, AuthStatusCard, PasswordRules } from '../components/auth'

interface RegisterFormData extends RegisterData {
  confirmPassword: string
}

export default function RegisterPage() {
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

  if (isSuccess) {
    return (
      <AuthPageShell>
        <div className="relative w-full max-w-md">
          <AuthStatusCard
            icon={
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                <CheckCircle size={64} />
              </div>
            }
            title="¡Registro Exitoso!"
            message={successMessage}
            action={
              <Button onClick={() => navigate('/login')} fullWidth>
                Ir a Iniciar Sesión
              </Button>
            }
          />
        </div>
      </AuthPageShell>
    )
  }

  return (
    <AuthPageShell>
      <div className="relative flex w-full max-w-md flex-col gap-6">
        <AuthBrandHeader subtitle="Crea tu cuenta en segundos" />

        <AuthFormCard
          title="Crear Cuenta"
          description="Completa el formulario para registrarte"
          footerText="¿Ya tienes una cuenta?"
          footerLinkLabel="Inicia sesión"
          footerLinkTo="/login"
        >
          {errorMessage && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="CI"
              type="text"
              placeholder="Documento de identidad"
              icon={<User size={18} />}
              error={errors.ci?.message}
              {...register('ci', {
                required: 'Ingresa tu CI',
              })}
            />

            <Input
              label="Nombre"
              type="text"
              placeholder="Tu nombre"
              icon={<User size={18} />}
              error={errors.nombre?.message}
              {...register('nombre', {
                required: 'Ingresa tu nombre',
              })}
            />

            <Input
              label="Apellido"
              type="text"
              placeholder="Tu apellido"
              icon={<User size={18} />}
              error={errors.apellido?.message}
              {...register('apellido', {
                required: 'Ingresa tu apellido',
              })}
            />

            <Input
              label="Correo"
              type="email"
              placeholder="tu@email.com"
              icon={<Mail size={18} />}
              error={errors.correo?.message}
              {...register('correo', {
                required: 'Ingresa un correo',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Correo inválido. Ejemplo válido: nombre@dominio.com',
                },
              })}
            />

            <Input
              label="Usuario"
              type="text"
              placeholder="usuario"
              icon={<User size={18} />}
              error={errors.username?.message}
              {...register('username', {
                required: 'Ingresa un usuario',
              })}
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.password?.message}
              {...register('password', {
                required: 'Ingresa una contraseña segura',
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres',
                },
                maxLength: {
                  value: 128,
                  message: 'La contraseña no puede exceder 128 caracteres',
                },
                pattern: {
                  value: /^(?=.*\d).*$/,
                  message: 'La contraseña debe incluir al menos un número',
                },
              })}
            />

            <Input
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              icon={<Lock size={18} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Confirma tu contraseña para continuar',
                validate: (value) => value === password || 'Las contraseñas no coinciden. Verifica ambas.',
              })}
            />

            <PasswordRules password={password} />

            <Button type="submit" fullWidth isLoading={isLoading} icon={<UserPlus size={18} />}>
              Crear Cuenta
            </Button>
          </form>
        </AuthFormCard>

        <AuthFooterNote />
      </div>
    </AuthPageShell>
  )
}
