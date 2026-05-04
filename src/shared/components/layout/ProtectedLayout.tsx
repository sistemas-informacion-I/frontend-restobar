import { Outlet } from 'react-router-dom'
import { ProtectedRoute } from '@/modules/acceso/components/common'
import { Layout } from './Layout'

export function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Layout>
        <Outlet />
      </Layout>
    </ProtectedRoute>
  )
}
