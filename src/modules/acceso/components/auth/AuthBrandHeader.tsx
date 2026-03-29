import { Sparkles } from 'lucide-react'

interface AuthBrandHeaderProps {
  subtitle: string
}

export function AuthBrandHeader({ subtitle }: AuthBrandHeaderProps) {
  return (
    <div className="text-center">
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-500/30">
        <Sparkles size={32} />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Auth System</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>
    </div>
  )
}
