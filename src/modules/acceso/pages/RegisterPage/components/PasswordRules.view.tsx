interface PasswordRulesViewProps {
  rules: {
    minLength: boolean
    hasNumber: boolean
  }
}

export function PasswordRulesView({ rules }: PasswordRulesViewProps) {
  return (
    <div className="rounded-2xl border border-wine-100/50 bg-wine-50/20 p-5 glass-card dark:border-wine-900/20 dark:bg-black/20">
      <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/60 dark:text-wine-400/60">Requisitos de Seguridad:</p>
      <ul className="flex flex-col gap-2.5">
        <li
          className={`flex items-center gap-2 text-xs font-bold transition-colors ${
            rules.minLength ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'
          }`}
        >
          <div className={`h-1.5 w-1.5 rounded-full ${rules.minLength ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
          Mínimo de 8 caracteres
        </li>
        <li
          className={`flex items-center gap-2 text-xs font-bold transition-colors ${
            rules.hasNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'
          }`}
        >
          <div className={`h-1.5 w-1.5 rounded-full ${rules.hasNumber ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
          Incluir al menos un número
        </li>
      </ul>
    </div>
  )
}
