import { ReactNode } from 'react'
import { KeyRound, Mail, Shield, User } from 'lucide-react'
import { UserProfileCardProps } from './UserProfileCard'

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
    <div className="flex items-start gap-4 rounded-2xl bg-white/40 p-4 dark:bg-black/20 border border-wine-100/30 dark:border-wine-900/10 backdrop-blur-sm transition-all duration-300 hover:bg-wine-50/50 dark:hover:bg-wine-900/10 group">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-wine-500/10 text-wine-600 dark:bg-wine-500/10 dark:text-wine-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">{label}</span>
        <span className="break-all text-sm font-bold text-slate-900 dark:text-slate-100">{value}</span>
      </div>
    </div>
  )
}

export function UserProfileCardView({ user, roleText }: UserProfileCardProps & { roleText: string }) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl shadow-wine-900/5 h-full relative overflow-hidden group/card transition-all duration-700 hover:shadow-wine-900/10">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-gradient-to-br from-wine-600/5 to-transparent blur-3xl group-hover/card:scale-150 transition-transform duration-1000" />
      
      <div className="flex flex-col gap-10 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-wine-600 to-wine-950 text-5xl font-black text-white shadow-2xl shadow-wine-900/40 border-[6px] border-white dark:border-wine-800 rotate-3 transition-transform group-hover/card:rotate-0 duration-500">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white dark:bg-wine-900 p-2 shadow-xl shadow-wine-900/20 border border-wine-50">
              <Shield className="text-wine-600 dark:text-wine-400" size={20} />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">{user?.name}</h2>
            {user?.isActive ? (
              <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Operativo
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-xl bg-rose-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-rose-600 dark:text-rose-400 border border-rose-500/20">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Inactivo
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="h-4 w-1 rounded-full bg-wine-600" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">Detalles de Cuenta</h3>
          </div>

          <ProfileInfoItem icon={<User size={18} />} label="Identidad" value={user?.name} />
          <ProfileInfoItem icon={<Mail size={18} />} label="Comunicación" value={user?.email} />
          <ProfileInfoItem icon={<KeyRound size={18} />} label="Autoridad" value={roleText} />
        </div>
      </div>
    </div>
  )
}
