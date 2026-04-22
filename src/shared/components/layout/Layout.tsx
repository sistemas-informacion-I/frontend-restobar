import { ReactNode } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { LogOut, Users, Shield, LayoutDashboard, Sparkles, Menu, X, Sun, Moon, Activity, User, Briefcase } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/Button'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { useAppStore } from '@/core/providers'

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
      // Even if logout fails, navigate to login
      navigate('/login')
    }
  }

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
    { path: '/perfil', label: 'Perfil', icon: User, show: true },
    { path: '/users', label: 'Usuarios', icon: Users, show: canRead('users') },
    { path: '/empleados', label: 'Empleados', icon: Briefcase, show: true },
    { path: '/roles', label: 'Roles', icon: Shield, show: canRead('roles') },
    { path: '/auditoria', label: 'Auditoría', icon: Activity, show: canRead('audit') },
  ]

  return (
    <div className="relative flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[100] flex w-64 flex-col border-r border-slate-200 bg-white/95 backdrop-blur transition-transform dark:border-slate-700 dark:bg-slate-900/95 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center gap-3 border-b border-slate-200 p-5 dark:border-slate-700">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            <Sparkles size={24} />
          </div>
          <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">Auth System</span>
          <button 
            className="ml-auto rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navItems.filter(item => item.show).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${location.pathname === item.path ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">{user?.name}</span>
              <span className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.roles?.[0]?.name || 'Sin rol'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-[99] bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col md:ml-64">
        <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 md:h-16 md:justify-end md:px-6">
          <button 
            className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              onClick={toggleTheme}
              icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            >
              {theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              icon={<LogOut size={18} />}
              className="md:!px-4"
            >
              Cerrar Sesión
            </Button>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
