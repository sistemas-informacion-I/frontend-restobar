import { useAuth } from '../context/AuthContext'
import { Layout } from '@/shared/components/layout/Layout'
import { Shield, Users } from 'lucide-react'
import { DashboardWelcome, PermissionsCard, QuickLinksCard, UserProfileCard } from '../components/dashboard'

export default function DashboardPage() {
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
  const permissions = user?.roles?.flatMap((role) => role.permissions || []) || []

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <DashboardWelcome userName={user?.name} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <UserProfileCard user={user} />
          <QuickLinksCard links={availableLinks} />
        </div>

        <PermissionsCard permissions={permissions} />
      </div>
    </Layout>
  )
}
