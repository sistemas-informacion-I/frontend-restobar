import { Mail, Lock, User, UserPlus, CheckCircle, Phone, MapPin } from 'lucide-react'
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
      <div className="relative flex w-full max-w-4xl flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <AuthBrandHeader subtitle="Crea tu cuenta en segundos" />

        <AuthFormCard
          title="Crear Cuenta"
          description="Completa el formulario para registrarte"
          footerText="¿Ya tienes una cuenta?"
          footerLinkLabel="Inicia sesión"
          footerLinkTo="/login"
        >
          {errorMessage && (
            <div className="mb-6 rounded-2xl border-2 border-rose-200 bg-rose-50 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 shadow-lg shadow-rose-900/5 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-rose-500" />
                {errorMessage}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Sección 1: Identidad */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/30 dark:text-wine-400/30 px-1 border-b border-wine-100/30 pb-2">Identidad</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="CI"
                    type="text"
                    placeholder="Documento"
                    icon={<User size={16} />}
                    error={errors.ci?.message}
                    {...register('ci', { required: 'Requerido' })}
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60 px-1">Sexo</label>
                    <select
                      {...register('sexo', { required: 'Requerido' })}
                      className="h-10 rounded-xl border border-wine-100/50 bg-white/50 px-3 text-xs font-bold text-slate-900 outline-none transition-all focus:border-wine-600 focus:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:text-white dark:focus:border-wine-500 shadow-sm"
                    >
                      <option value="" disabled>Seleccionar...</option>
                      <option value="M">M</option>
                      <option value="F">F</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Nombre"
                  type="text"
                  placeholder="Tu nombre"
                  icon={<User size={16} />}
                  error={errors.nombre?.message}
                  {...register('nombre', { required: 'Requerido' })}
                />

                <Input
                  label="Apellido"
                  type="text"
                  placeholder="Tu apellido"
                  icon={<User size={16} />}
                  error={errors.apellido?.message}
                  {...register('apellido', { required: 'Requerido' })}
                />
              </div>

              {/* Sección 2: Contacto */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/30 dark:text-wine-400/30 px-1 border-b border-wine-100/30 pb-2">Contacto</h4>
                <Input
                  label="Correo"
                  type="email"
                  placeholder="nombre@email.com"
                  icon={<Mail size={16} />}
                  error={errors.correo?.message}
                  {...register('correo', {
                    required: 'Requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Correo inválido',
                    },
                  })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Teléfono"
                    type="tel"
                    placeholder="Celular"
                    icon={<Phone size={16} />}
                    error={errors.telefono?.message}
                    {...register('telefono', { required: 'Requerido' })}
                  />
                  <Input
                    label="Usuario"
                    type="text"
                    placeholder="nick"
                    icon={<User size={16} />}
                    error={errors.username?.message}
                    {...register('username', { required: 'Requerido' })}
                  />
                </div>

                <Input
                  label="Dirección"
                  type="text"
                  placeholder="Calle, Nro, Zona..."
                  icon={<MapPin size={16} />}
                  error={errors.direccion?.message}
                  {...register('direccion')}
                />
              </div>

              {/* Sección 3: Seguridad (Ancho Completo) */}
              <div className="md:col-span-2 space-y-4 pt-4 border-t border-wine-100/30">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/30 dark:text-wine-400/30 px-1 border-b border-wine-100/30 pb-2">Seguridad</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Contraseña"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    error={errors.password?.message}
                    {...register('password', {
                      required: 'Requerido',
                      minLength: { value: 8, message: 'Mínimo 8 caracteres' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                        message: 'Debe incluir mayúsculas y números',
                      },
                    })}
                  />

                  <Input
                    label="Confirmar contraseña"
                    type="password"
                    placeholder="••••••••"
                    icon={<Lock size={16} />}
                    error={errors.confirmPassword?.message}
                    {...register('confirmPassword', {
                      required: 'Requerido',
                      validate: (value: string) => value === password || 'No coinciden',
                    })}
                  />
                </div>
                <PasswordRules password={password} />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <Button type="submit" fullWidth className="md:w-auto md:min-w-[320px] h-14 rounded-2xl shadow-xl shadow-wine-900/20" isLoading={isLoading} icon={<UserPlus size={20} />}>
                Finalizar Registro
              </Button>
            </div>
          </form>
        </AuthFormCard>

        <AuthFooterNote />
      </div>
    </AuthPageShell>
  )
}
