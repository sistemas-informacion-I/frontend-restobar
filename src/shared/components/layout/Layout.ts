import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useAppStore } from '@/core/store/appStore'
import { LayoutView } from './Layout.view'


interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { logout } = useAuth()
  const { theme, toggleTheme } = useAppStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarMinimized, setSidebarMinimized] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch {
      navigate('/login')
    }
  }

  return LayoutView({
    children,
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen,
    sidebarMinimized,
    setSidebarMinimized,
    handleLogout
  })
}
