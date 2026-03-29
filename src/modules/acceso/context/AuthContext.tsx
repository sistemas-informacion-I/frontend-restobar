import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { User, authService, LoginData, ErrorHandler } from '../services/api'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginData) => Promise<void>
  logout: () => Promise<void>
  updateUser: (user: User) => void
  hasPermission: (permissionName: string) => boolean
  hasAnyPermission: (permissionNames: string[]) => boolean
  canCreate: (module: string) => boolean
  canRead: (module: string) => boolean
  canUpdate: (module: string) => boolean
  canDelete: (module: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Try to get user profile - this validates the HttpOnly cookie automatically
        const userData = await authService.getProfile()
        setUser(userData)
      } catch (error) {
        // If unauthorized, user is not logged in (cookie expired/invalid)
        if (ErrorHandler.isUnauthorized(error)) {
          setUser(null)
        }
        // For other errors, we don't clear the user state
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginData) => {
    const userData = await authService.login(credentials)
    setUser(userData)
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch {
      // Even if logout fails on server, clear local state
    } finally {
      setUser(null)
    }
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  const hasPermission = useCallback((permissionName: string): boolean => {
    if (!user) return false

    if (user.authorities?.includes(permissionName)) {
      return true
    }

    if (user.permissions?.some((permission) => permission.name === permissionName)) {
      return true
    }

    return user.roles?.some(role => 
      role.permissions?.some((p) => p.name === permissionName)
    ) || false
  }, [user])

  const hasAnyPermission = useCallback((permissionNames: string[]): boolean => {
    return permissionNames.some((p) => hasPermission(p))
  }, [hasPermission])

  const canCreate = useCallback((module: string): boolean => {
    return hasPermission(`${module}:create`)
  }, [hasPermission])

  const canRead = useCallback((module: string): boolean => {
    return hasPermission(`${module}:read`)
  }, [hasPermission])

  const canUpdate = useCallback((module: string): boolean => {
    return hasPermission(`${module}:update`)
  }, [hasPermission])

  const canDelete = useCallback((module: string): boolean => {
    return hasPermission(`${module}:delete`)
  }, [hasPermission])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        hasPermission,
        hasAnyPermission,
        canCreate,
        canRead,
        canUpdate,
        canDelete,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
