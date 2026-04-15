import { useAuth } from '../../context/AuthContext'
import { Shield, Users } from 'lucide-react'
import { DashboardPageView } from './DashboardPage.view'

export function DashboardPage() {
  const { user, canRead } = useAuth()

  const quickLinks = [
    {
      title: 'Usuarios',
      description: 'Gestionar usuarios del sistema',
      icon: Users,
      href: '/users',
      permission: 'users',
      color: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-300',
    },
    {
      title: 'Roles',
      description: 'Administrar roles y permisos',
      icon: Shield,
      href: '/roles',
      permission: 'roles',
      color: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-300',
    },
  ]

  const availableLinks = quickLinks.filter(link => canRead(link.permission))
  const permissions = user?.roles?.flatMap((role: any) => role.permissions || []) || []

  return DashboardPageView({ user, availableLinks, permissions })
}
