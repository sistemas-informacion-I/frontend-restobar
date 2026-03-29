interface DashboardWelcomeProps {
  userName?: string
}

export function DashboardWelcome({ userName }: DashboardWelcomeProps) {
  return (
    <div className="text-center">
      <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-slate-100 sm:text-3xl">
        ¡Bienvenido,{' '}
        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">{userName}</span>!
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">Panel de administración del sistema</p>
    </div>
  )
}
