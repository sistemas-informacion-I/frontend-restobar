import { ReactNode, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Users, Shield, LayoutDashboard, Activity, User, Store, Map, Grid } from 'lucide-react'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useAppStore } from '@/core/store/appStore'
import { LayoutView } from './Layout.view'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, canRead } = useAuth()
  const { theme, toggleTheme } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { path: '/perfil', label: 'Mi Perfil', icon: User, show: true },
    { path: '/users', label: 'Usuarios', icon: Users, show: canRead('users') },
    { path: '/roles', label: 'Roles', icon: Shield, show: canRead('roles') },
    { path: '/auditoria', label: 'Auditoría', icon: Activity, show: canRead('audit') },
    { path: '/sucursales', label: 'Sucursales', icon: Store, show: canRead('sucursales') },
    { path: '/sectores', label: 'Sectores', icon: Map, show: canRead('sectores') },
    { path: '/mesas', label: 'Mesas', icon: Grid, show: canRead('mesas') },
  ]

  return LayoutView({
    children,
    user,
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    handleLogout,
    navItems,
    currentPath: location.pathname
  })
}
