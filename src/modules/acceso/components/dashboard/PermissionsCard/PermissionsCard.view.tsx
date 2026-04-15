import { PermissionsCardProps } from './PermissionsCard'

export function PermissionsCardView({ permissions }: PermissionsCardProps) {
  return (
    <div className="glass-card rounded-[2.5rem] p-8 shadow-2xl shadow-wine-900/5 relative overflow-hidden group/permissions transition-all duration-700 hover:shadow-wine-900/10">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-gradient-to-br from-wine-600/5 to-transparent blur-2xl group-hover/permissions:scale-150 transition-transform duration-1000" />
      
      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex items-center gap-3">
          <div className="h-4 w-1.5 rounded-full bg-gradient-to-b from-wine-600 to-wine-900" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 font-sans">
            Esquema de Autorización (Permisos)
          </h3>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {permissions.map((permission) => (
            <span
              key={permission.id}
              className="rounded-xl bg-white/60 dark:bg-wine-950/40 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-wine-700 dark:text-wine-300 border border-wine-100/50 dark:border-wine-900/20 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-wine-600 hover:text-white hover:border-wine-600 shadow-sm"
            >
              {permission.description || permission.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
