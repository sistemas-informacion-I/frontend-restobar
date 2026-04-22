import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { User } from 'lucide-react'
import { Input } from '@/shared/components/ui/Input'
import { Button } from '@/shared/components/ui/Button'
import { Mail, Phone, MapPin, UserIcon, Lock, Eye, EyeOff } from 'lucide-react'
import { UpdateProfileData, ChangePasswordData } from '../../services/auth.service'

interface ProfileEditFormProps {
  user: {
    firstName: string
    lastName: string
    phone?: string
    email: string
    address?: string
  }
  onSubmitProfile: (data: UpdateProfileData) => Promise<void>
  onSubmitPassword: (data: ChangePasswordData) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

interface ProfileFormData {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  direccion: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function ProfileEditForm({ user, onSubmitProfile, onSubmitPassword, onCancel, isLoading }: ProfileEditFormProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      nombre: user.firstName,
      apellido: user.lastName,
      telefono: user.phone || '',
      correo: user.email,
      direccion: user.address || '',
    },
  })

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onProfileSubmit = async (data: ProfileFormData) => {
    await onSubmitProfile({
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono || undefined,
      correo: data.correo || undefined,
      direccion: data.direccion || undefined,
    })
  }

  const onPasswordSubmit = async (data: PasswordFormData) => {
    await onSubmitPassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    })
    passwordForm.reset()
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === 'profile'
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <User size={16} className="mr-2 inline" />
          Información Personal
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('password')}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === 'password'
              ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          <Lock size={16} className="mr-2 inline" />
          Cambiar Contraseña
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="flex flex-col gap-5">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            Los cambios realizados aquí se guardarán directamente en tu cuenta de usuario.
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Nombre"
              type="text"
              placeholder="Tu nombre"
              icon={<UserIcon size={18} />}
              error={profileForm.formState.errors.nombre?.message}
              {...profileForm.register('nombre', {
                required: 'El nombre es requerido',
              })}
            />

            <Input
              label="Apellido"
              type="text"
              placeholder="Tu apellido"
              icon={<UserIcon size={18} />}
              error={profileForm.formState.errors.apellido?.message}
              {...profileForm.register('apellido', {
                required: 'El apellido es requerido',
              })}
            />
          </div>

          <Input
            label="Correo electrónico"
            type="email"
            placeholder="correo@ejemplo.com"
            icon={<Mail size={18} />}
            error={profileForm.formState.errors.correo?.message}
            {...profileForm.register('correo', {
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Correo inválido',
              },
            })}
          />

          <Input
            label="Teléfono"
            type="text"
            placeholder="Tu número de teléfono"
            icon={<Phone size={18} />}
            error={profileForm.formState.errors.telefono?.message}
            {...profileForm.register('telefono')}
          />

          <Input
            label="Dirección"
            type="text"
            placeholder="Tu dirección"
            icon={<MapPin size={18} />}
            error={profileForm.formState.errors.direccion?.message}
            {...profileForm.register('direccion')}
          />

          <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Guardar cambios
            </Button>
          </div>
        </form>
      )}

      {/* Password Tab */}
      {activeTab === 'password' && (
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="flex flex-col gap-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            Deberás ingresar tu contraseña actual para poder cambiarla.
          </div>

          <div className="relative">
            <Input
              label="Contraseña actual"
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Ingresa tu contraseña actual"
              icon={<Lock size={18} />}
              error={passwordForm.formState.errors.currentPassword?.message}
              {...passwordForm.register('currentPassword', {
                required: 'La contraseña actual es requerida',
              })}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Nueva contraseña"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="Ingresa la nueva contraseña"
              icon={<Lock size={18} />}
              error={passwordForm.formState.errors.newPassword?.message}
              {...passwordForm.register('newPassword', {
                required: 'La nueva contraseña es requerida',
                minLength: {
                  value: 6,
                  message: 'La contraseña debe tener al menos 6 caracteres',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirmar nueva contraseña"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirma la nueva contraseña"
              icon={<Lock size={18} />}
              error={passwordForm.formState.errors.confirmPassword?.message}
              {...passwordForm.register('confirmPassword', {
                required: 'Debes confirmar la contraseña',
                validate: (value) =>
                  value === passwordForm.watch('newPassword') || 'Las contraseñas no coinciden',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="mt-2 flex flex-col-reverse justify-end gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:gap-3">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Cambiar contraseña
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
