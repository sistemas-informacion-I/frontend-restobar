import { ReactNode } from 'react'
import { KeyRound, Mail, Shield, User } from 'lucide-react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { User as AppUser } from '../../services/api'

interface UserProfileCardProps {
  user: AppUser | null
}

function ProfileInfoItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value?: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/70">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
        {icon}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
        <span className="break-all text-sm text-slate-900 dark:text-slate-100">{value}</span>
      </div>
    </div>
  )
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  const roleText = user?.roles && user.roles.length > 0 ? user.roles.map((role) => role.name).join(', ') : 'Sin rol'

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-3xl font-semibold text-white shadow-xl shadow-indigo-500/30">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              {user?.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <Shield size={14} /> Activo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                  <Shield size={14} /> Inactivo
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Mi Perfil</h3>

            <ProfileInfoItem icon={<User size={18} />} label="Nombre" value={user?.name} />
            <ProfileInfoItem icon={<Mail size={18} />} label="Email" value={user?.email} />
            <ProfileInfoItem icon={<KeyRound size={18} />} label="Rol" value={roleText} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
