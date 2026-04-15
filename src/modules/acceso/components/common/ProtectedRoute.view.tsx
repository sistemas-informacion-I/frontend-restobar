import { Navigate } from 'react-router-dom'
import { Loader } from '@/shared/components/ui/Loader'

interface ProtectedRouteViewProps {
  children: React.ReactNode
  isAuthenticated: boolean
  isLoading: boolean
  location: any
}

export function ProtectedRouteView({ 
  children, 
  isAuthenticated, 
  isLoading, 
  location 
}: ProtectedRouteViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader size="lg" />
        <span className="text-xs font-black uppercase tracking-widest text-wine-900/40 dark:text-wine-400/40">
          Autenticando...
        </span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
