import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Layout } from '@/shared/components/layout/Layout'
import { User, Mail, Shield, Phone, MapPin, Calendar, UserCheck, AlertCircle, FileText, Pencil, CheckCircle, XCircle } from 'lucide-react'
import { ProfileEditForm } from '../components/auth/ProfileEditForm'
import { authService, UpdateProfileData, ChangePasswordData } from '../services/auth.service'
import { Button } from '@/shared/components/ui/Button'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  if (!user) {
    return (
      <Layout>
        <div className="flex items-center justify-center p-8">
          <p className="text-slate-500 dark:text-slate-400">Cargando información del usuario...</p>
        </div>
      </Layout>
    )
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleUpdateProfile = async (data: UpdateProfileData) => {
    setIsLoading(true)
    try {
      const updatedUser = await authService.updateProfile(data)
      updateUser(updatedUser)
      setIsEditing(false)
      showNotification('success', 'Perfil actualizado correctamente')
    } catch (error: any) {
      showNotification('error', error.message || 'Error al actualizar el perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async (data: ChangePasswordData) => {
    setIsLoading(true)
    try {
      await authService.changePassword(data)
      showNotification('success', 'Contraseña actualizada correctamente')
    } catch (error: any) {
      showNotification('error', error.message || 'Error al cambiar la contraseña')
    } finally {
      setIsLoading(false)
    }
  }

  const getGenderLabel = (gender?: string) => {
    switch (gender) {
      case 'M':
        return 'Masculino'
      case 'F':
        return 'Femenino'
      case 'O':
        return 'Otro'
      default:
        return 'No especificado'
    }
  }

  // Modo edición
  if (isEditing) {
    return (
      <Layout>
        {/* Notificación */}
        {notification && (
          <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200'
          }`}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
        )}

        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Editar Perfil</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Modifica tu información personal</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <ProfileEditForm
              user={{
                firstName: user.firstName,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                address: user.address,
              }}
              onSubmitProfile={handleUpdateProfile}
              onSubmitPassword={handleChangePassword}
              onCancel={() => setIsEditing(false)}
              isLoading={isLoading}
            />
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 shadow-lg transition-all ${
          notification.type === 'success' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/80 dark:text-green-200' 
            : 'bg-red-100 text-red-800 dark:bg-red-900/80 dark:text-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      <div className="mx-auto max-w-2xl">
        {/* Encabezado */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Mi Perfil</h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Visualiza y edita tu información personal</p>
          </div>
          <Button onClick={() => setIsEditing(true)} variant="primary">
            <Pencil size={16} className="mr-2" />
            Editar
          </Button>
        </div>

        {/* Tarjeta principal del perfil */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {/* Avatar y nombre */}
          <div className="mb-8 flex items-center gap-6">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-4xl font-semibold text-white">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{user.name}</h2>
              <p className="text-slate-600 dark:text-slate-400">
                {user.roles?.[0]?.name || 'Sin rol asignado'}
              </p>
            </div>
          </div>

          {/* Información del usuario */}
          <div className="space-y-6 border-t border-slate-200 pt-6 dark:border-slate-700">
            {/* Nombre */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <User size={20} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Nombre
                </label>
                <p className="mt-1 text-slate-900 dark:text-slate-100">{user.firstName || 'No registrado'}</p>
              </div>
            </div>

            {/* Apellido */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <User size={20} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Apellido
                </label>
                <p className="mt-1 text-slate-900 dark:text-slate-100">{user.lastName || 'No registrado'}</p>
              </div>
            </div>

            {/* Sexo/Género */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Género
                </label>
                <p className="mt-1 text-slate-900 dark:text-slate-100">{getGenderLabel(user.gender)}</p>
              </div>
            </div>

            {/* Email */}
            {user.email && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Mail size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Correo Electrónico
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">{user.email}</p>
                </div>
              </div>
            )}

            {/* Teléfono */}
            {user.phone && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  <Phone size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Teléfono
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Dirección */}
            {user.address && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  <MapPin size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Dirección
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">{user.address}</p>
                </div>
              </div>
            )}

            {/* CI */}
            {user.ci && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                  <UserCheck size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Cédula de Identidad (CI)
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">{user.ci}</p>
                </div>
              </div>
            )}

            {/* Usuario/Username */}
            {user.username && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Usuario
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">{user.username}</p>
                </div>
              </div>
            )}

            {/* Roles */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Roles Asignados
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role) => (
                      <span
                        key={role.name}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
                      >
                        {role.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 dark:text-slate-400">Sin roles asignados</span>
                  )}
                </div>
              </div>
            </div>

            {/* Estado de Acceso */}
            {user.estadoAcceso && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                  <AlertCircle size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Estado de Acceso
                  </label>
                  <div className="mt-2">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      user.estadoAcceso === 'HABILITADO' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                        : user.estadoAcceso === 'SUSPENDIDO'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {user.estadoAcceso}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Fecha de Registro */}
            {user.createdAt && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
                  <Calendar size={20} />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Fecha de Registro
                  </label>
                  <p className="mt-1 text-slate-900 dark:text-slate-100">
                    {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Estado Activo */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-100 text-lime-600 dark:bg-lime-900/30 dark:text-lime-400">
                <UserCheck size={20} />
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Estado
                </label>
                <div className="mt-2">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    user.isActive 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                  }`}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Roles Activos</p>
              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
                {user.roles?.length || 0}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Estado de Acceso</p>
              <p className={`mt-2 text-sm font-bold ${
                user.estadoAcceso === 'HABILITADO' ? 'text-green-600 dark:text-green-400' :
                user.estadoAcceso === 'SUSPENDIDO' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {user.estadoAcceso || 'N/A'}
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Cuenta</p>
              <p className={`mt-2 text-sm font-bold ${
                user.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
              }`}>
                {user.isActive ? 'Activa' : 'Inactiva'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
