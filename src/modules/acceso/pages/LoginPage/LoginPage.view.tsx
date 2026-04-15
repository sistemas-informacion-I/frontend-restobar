import { User, Lock, LogIn, Timer } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { AuthBrandHeader, AuthFooterNote, AuthFormCard, AuthPageShell } from './components'

interface LoginPageViewProps {
  register: any
  handleSubmit: any
  errors: any
  onSubmit: (data: any) => Promise<void>
  isLoading: boolean
  errorMessage: string
  isLocked: boolean
  formattedTime: string
}

export function LoginPageView({
  register,
  handleSubmit,
  errors,
  onSubmit,
  isLoading,
  errorMessage,
  isLocked,
  formattedTime
}: LoginPageViewProps) {
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
            <div className={`rounded-2xl border-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-start gap-4 animate-in fade-in zoom-in-95 duration-500 shadow-lg ${
              isLocked 
                ? 'border-wine-300 bg-wine-50 text-wine-900 dark:border-wine-900/40 dark:bg-wine-900/20 dark:text-wine-300 shadow-wine-900/5'
                : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5'
            }`}>
              {isLocked && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wine-600 text-white shadow-lg shadow-wine-900/30">
                  <Timer size={14} className="animate-pulse" />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <span className="leading-tight">{errorMessage}</span>
                {isLocked && (
                  <span className="text-[9px] opacity-60 font-black">
                    REINTENTO DISPONIBLE EN: {formattedTime}
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
