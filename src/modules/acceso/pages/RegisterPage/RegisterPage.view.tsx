import { Mail, Lock, User, UserPlus, CheckCircle } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { 
  AuthBrandHeader, 
  AuthFooterNote, 
  AuthFormCard, 
  AuthPageShell, 
  AuthStatusCard 
} from '../LoginPage/components'
import { PasswordRules } from './components'

interface RegisterPageViewProps {
  register: any
  handleSubmit: any
  errors: any
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  isSuccess: boolean
  successMessage: string
  errorMessage: string
  password?: string
  navigate: any
}

export function RegisterPageView({
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
}: RegisterPageViewProps) {
  if (isSuccess) {
    return (
      <AuthPageShell>
        <div className="relative w-full max-w-md">
          <AuthStatusCard
            icon={
              <div className="inline-flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 animate-in zoom-in-50 duration-500">
                <CheckCircle size={48} className="drop-shadow-lg" />
              </div>
            }
            title="¡Registro Exitoso!"
            message={successMessage}
            action={
              <Button onClick={() => navigate('/login')} fullWidth size="lg">
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
            <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-lg shadow-rose-900/5 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                {errorMessage}
              </div>
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

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 px-1">Sexo</label>
              <select
                {...register('sexo', { required: 'Selecciona tu sexo' })}
                className="h-12 rounded-2xl border-2 border-wine-100/50 bg-white/50 px-4 text-sm font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500 shadow-sm"
              >
                <option value="" disabled className="bg-white dark:bg-wine-950 font-medium">Seleccionar sexo...</option>
                <option value="M" className="bg-white dark:bg-wine-950">Masculino</option>
                <option value="F" className="bg-white dark:bg-wine-950">Femenino</option>
                <option value="O" className="bg-white dark:bg-wine-950">Otro</option>
              </select>
              {errors.sexo && (
                <span className="px-1 text-[10px] font-bold text-rose-500 animate-in fade-in slide-in-from-top-1">
                  {errors.sexo.message}
                </span>
              )}
            </div>

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
                validate: (value: string) => value === password || 'Las contraseñas no coinciden. Verifica ambas.',
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
