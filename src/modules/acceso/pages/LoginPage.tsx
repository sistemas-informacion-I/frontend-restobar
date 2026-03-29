import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { User, Lock, LogIn } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { getErrorMessage, LoginData } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { AuthBrandHeader, AuthFooterNote, AuthFormCard, AuthPageShell } from '../components/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true)
    setErrorMessage('')
    try {
      await login(data)
      navigate('/dashboard')
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'iniciar sesión'))
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
            <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Usuario"
              type="text"
              placeholder="tu_usuario"
              icon={<User size={18} />}
              error={errors.username?.message}
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
              {...register('password', {
                required: 'Ingresa tu contraseña',
                maxLength: {
                  value: 128,
                  message: 'La contraseña no puede exceder 128 caracteres',
                },
              })}
            />

            <Button type="submit" fullWidth isLoading={isLoading} icon={<LogIn size={18} />}>
              Iniciar Sesión
            </Button>
          </form>
        </AuthFormCard>

        <AuthFooterNote />
      </div>
    </AuthPageShell>
  )
}
