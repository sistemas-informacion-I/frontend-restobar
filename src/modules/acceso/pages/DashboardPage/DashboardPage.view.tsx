import { Layout } from '@/shared/components/layout/Layout'
import { DashboardWelcome, PermissionsCard, QuickLinksCard, UserProfileCard } from './components'

interface DashboardPageViewProps {
  user: any
  availableLinks: any[]
  permissions: any[]
}

export function DashboardPageView({ user, availableLinks, permissions }: DashboardPageViewProps) {
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
