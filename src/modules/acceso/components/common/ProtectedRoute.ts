import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { ProtectedRouteView } from './ProtectedRoute.view'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  return ProtectedRouteView({ 
    children, 
    isAuthenticated, 
    isLoading, 
    location 
  })
}

