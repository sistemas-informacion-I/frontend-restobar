import { Outlet } from 'react-router-dom'
import { ProtectedRoute } from '@/modules/acceso/components/common'
import { Layout } from './Layout'
import { CarritoProvider } from '@/modules/electronico/context/CarritoContext'
import { CarritoDrawer } from '@/modules/electronico/pages/CarritoPage'

export function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <CarritoProvider>
        <Layout>
          <Outlet />
        </Layout>
        {/* Drawer global del carrito — disponible en todas las rutas protegidas */}
        <CarritoDrawer />
      </CarritoProvider>
    </ProtectedRoute>
  )
}
