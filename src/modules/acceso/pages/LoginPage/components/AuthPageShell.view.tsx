import { AuthPageShellProps } from './AuthPageShell'

export function AuthPageShellView({ children }: AuthPageShellProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-app-gradient" />
      {children}
    </div>
  )
}
