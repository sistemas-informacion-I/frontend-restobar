interface PasswordRulesProps {
  password?: string
}

export function PasswordRules({ password = '' }: PasswordRulesProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-indigo-50/60 p-4 dark:border-slate-700 dark:bg-indigo-950/20">
      <p className="mb-2 text-xs font-medium text-slate-700 dark:text-slate-300">La contraseña debe contener:</p>
      <ul className="flex flex-col gap-1 text-xs">
        <li
          className={`flex items-center gap-2 ${
            password.length >= 8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Mínimo 8 caracteres
        </li>
        <li
          className={`flex items-center gap-2 ${
            /\d/.test(password) ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Al menos un número
        </li>
      </ul>
    </div>
  )
}
