import { User, Lock, LogIn, Timer, ArrowLeft, Mail, KeySquare, Send } from 'lucide-react'
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
  successMessage?: string
  isLocked: boolean
  formattedTime: string
  viewMode: 'login' | 'recovery'
  setViewMode: (mode: 'login' | 'recovery') => void
  isCodeSent: boolean
  onSendCode: () => Promise<void>
  onVerifyCode: () => Promise<void>
  onGoBack: () => void
}

export function LoginPageView({
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
}: LoginPageViewProps) {
  return (
    <AuthPageShell>
      <div className="relative flex w-full max-w-md flex-col gap-6">
        <AuthBrandHeader subtitle="Seguridad y simplicidad en un solo lugar" />

        <AuthFormCard
          title={viewMode === 'login' ? 'Iniciar Sesión' : 'Recuperar Cuenta'}
          description={viewMode === 'login' ? 'Ingresa tus credenciales para continuar' : 'Sigue los pasos para restablecer tu acceso'}
          footerText={viewMode === 'login' ? '¿No tienes una cuenta?' : ''}
          footerLinkLabel={viewMode === 'login' ? 'Regístrate aquí' : ''}
          footerLinkTo="/register"
        >
          {(errorMessage || successMessage) && (
            <div className={`rounded-2xl border-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest flex items-start gap-4 animate-in fade-in zoom-in-95 duration-500 shadow-lg ${
              successMessage 
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 shadow-emerald-900/5'
                : isLocked 
                  ? 'border-wine-300 bg-wine-50 text-wine-900 dark:border-wine-900/40 dark:bg-wine-900/20 dark:text-wine-300 shadow-wine-900/5'
                  : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-rose-900/5'
            }`}>
              {isLocked && !successMessage && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wine-600 text-white shadow-lg shadow-wine-900/30">
                  <Timer size={14} className="animate-pulse" />
                </div>
              )}
              {successMessage && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-900/30">
                  <KeySquare size={14} />
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <span className="leading-tight">{successMessage || errorMessage}</span>
                {isLocked && !successMessage && (
                  <span className="text-[9px] opacity-60 font-black">
                    REINTENTO DISPONIBLE EN: {formattedTime}
                  </span>
                )}
              </div>
            </div>
          )}

          {viewMode === 'login' ? (
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
                })}
              />

              <div className="flex flex-col gap-2">
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  icon={<Lock size={18} />}
                  error={errors.password?.message}
                  disabled={isLocked}
                  {...register('password', {
                    required: 'Ingresa tu contraseña',
                  })}
                />
                <button
                  type="button"
                  onClick={() => setViewMode('recovery')}
                  className="self-end text-[9px] font-black uppercase tracking-widest text-wine-600 hover:text-wine-700 dark:text-wine-400 dark:hover:text-wine-300 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

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
          ) : (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex flex-col gap-5">
                <div className="relative flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      label="Correo Electrónico"
                      type="email"
                      placeholder="tu@correo.com"
                      icon={<Mail size={18} />}
                      error={(errors as any).recoveryEmail?.message}
                      {...register('recoveryEmail' as any, {
                        required: 'El correo es necesario',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Correo inválido',
                        },
                      })}
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={onSendCode}
                    isLoading={isLoading && !isCodeSent}
                    variant="secondary"
                    className="h-12 w-12 p-0 flex items-center justify-center shrink-0 rounded-2xl"
                    title="Enviar código"
                  >
                    <Send size={18} />
                  </Button>
                </div>

                <Input
                  label="Código de Verificación"
                  type="text"
                  placeholder="AUTO12"
                  icon={<KeySquare size={18} />}
                  error={(errors as any).recoveryCode?.message}
                  disabled={!isCodeSent}
                  {...register('recoveryCode' as any, {
                    required: isCodeSent ? 'Ingresa el código' : false,
                    maxLength: 6,
                  })}
                />

                <div className="flex flex-col gap-3 mt-2">
                  <Button
                    type="button"
                    onClick={onVerifyCode}
                    fullWidth
                    isLoading={isLoading && isCodeSent}
                    disabled={!isCodeSent}
                    icon={<KeySquare size={18} />}
                  >
                    Verificar y Restablecer
                  </Button>
                  
                  <button
                    onClick={onGoBack}
                    className="flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-wine-900/40 hover:text-wine-900 dark:text-wine-400/40 dark:hover:text-wine-400 transition-all"
                  >
                    <ArrowLeft size={14} />
                    Volver al Inicio
                  </button>
                </div>
              </div>
            </div>
          )}
        </AuthFormCard>

        <AuthFooterNote />
      </div>
    </AuthPageShell>
  )
}
