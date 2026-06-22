import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './modules/acceso/context/AuthContext'
import { QueryProvider, ThemeProvider } from './core/providers'
import LoginPage from './modules/acceso/pages/LoginPage'
import RegisterPage from './modules/acceso/pages/RegisterPage'
import DashboardPage from './modules/acceso/pages/DashboardPage'
import UsersPage from './modules/acceso/pages/UsersPage'
import RolesPage from './modules/acceso/pages/RolesPage'
import AuditoriaPage from './modules/acceso/pages/AuditoriaPage'
import PerfilPersonalPage from './modules/acceso/pages/PerfilPersonalPage'


import { SWRConfig } from 'swr'
import { httpClient } from './core/api/http-client'
import SucursalesPage from './modules/operaciones/pages/SucursalesPage'
import SectoresPage from './modules/operaciones/pages/SectoresPage'
import MesasPage from './modules/operaciones/pages/MesasPage'
import ComandasPage from './modules/operaciones/pages/ComandasPage'
import { PreparacionPage } from './modules/operaciones/pages/PreparacionPage'
import EmployeesPage from './modules/acceso/pages/EmployeesPage'
import ProveedoresPage from './modules/comercial/pages/ProveedoresPage'
import InventarioPage from './modules/inventario/pages/InventarioPage'
import { Toaster } from 'sonner'

import { ProtectedLayout } from './shared/components/layout/ProtectedLayout'
import { PublicLayout } from './shared/components/layout/PublicLayout'
import CategoriasPage from './modules/comercial/pages/CategoriasPage'
import Compra from './modules/comercial/pages/Compra'
import ProductosFinalesPage from './modules/comercial/pages/ProductosFinalesPage'
import RecetasPage from './modules/inventario/pages/RecetasPage'
import NotasSalidaPage from './modules/inventario/pages/NotasSalidaPage/index'

import CatalogoPage from './modules/comercial/pages/CatalogoPage'
import CarritoPage from './modules/electronico/pages/CarritoPage'
import MisPedidosPage from './modules/electronico/pages/MisPedidosPage'
import PedidoDetailPage from './modules/electronico/pages/PedidoDetailPage'
import PasarelaPagoPage from './modules/electronico/pages/PasarelaPagoPage'
import MetodosPagoPage from './modules/electronico/pages/MetodosPagoPage'
import VentasPage from './modules/comercial/pages/VentasPage'
import CheckoutPage from './modules/electronico/pages/CheckoutPage'
import PayPalSuccessPage from './modules/electronico/pages/PayPalSuccessPage'
import ReservasPage from './modules/electronico/pages/ReservasPage'
import PanelReservasPage from './modules/electronico/pages/PanelReservasPage'
import { EntregasPage } from './modules/electronico/pages/EntregasPage'
import { SeguimientoEntregaPage } from './modules/electronico/pages/SeguimientoEntregaPage'
import { CarritoProvider } from './modules/electronico/context/CarritoContext'

import ReportesPage from './modules/operaciones/pages/ReportesPage/ReportesPage'
import CajaPage from './modules/comercial/pages/CajaPage'

function App() {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => httpClient.get(url),
        revalidateOnFocus: false,
        shouldRetryOnError: false
      }}
    >
      <QueryProvider>
        <ThemeProvider>
          <Toaster
            richColors
            position="top-right"
            duration={3500}
            visibleToasts={4}
            expand={false}
            closeButton
            toastOptions={{
              className: 'rounded-2xl px-4 py-3 text-sm font-medium',
            }}
          />
          <AuthProvider>
            <CarritoProvider>
              <Routes>
                {/* Public Routes (no auth required) */}
                <Route element={<PublicLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/paypal/success" element={<PayPalSuccessPage />} />
                  <Route path="/paypal/cancel" element={<CheckoutPage />} />
                  <Route path="/reservas" element={<ReservasPage />} />
                </Route>

                {/* Protected Routes (auth required) */}
                <Route element={<ProtectedLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/roles" element={<RolesPage />} />
                  <Route path="/auditoria" element={<AuditoriaPage />} />
                  <Route path="/perfil" element={<PerfilPersonalPage />} />
                  <Route path="/sucursales" element={<SucursalesPage />} />
                  <Route path="/sectores" element={<SectoresPage />} />
                  <Route path="/mesas" element={<MesasPage />} />
                  <Route path="/comandas" element={<ComandasPage />} />
                  <Route path="/cocina" element={<PreparacionPage />} />
                  <Route path="/empleados" element={<EmployeesPage />} />
                  <Route path="/proveedores" element={<ProveedoresPage />} />
                  <Route path="/inventario" element={<InventarioPage />} />
                  <Route path="/restobar" element={<DashboardPage />} />
                  <Route path="/categorias" element={<CategoriasPage />} />
                  <Route path="/compras" element={<Compra />} />
                  <Route path="/productos-finales" element={<ProductosFinalesPage />} />
                  <Route path="/ventas" element={<VentasPage />} />
                  <Route path="/caja" element={<CajaPage />} />
                  <Route path="/recetas" element={<RecetasPage />} />
                  <Route path="/notas-salida" element={<NotasSalidaPage />} />
                  <Route path="/catalogo" element={<CatalogoPage />} />
                  <Route path="/carrito" element={<CarritoPage />} />
                  <Route path="/pasarela-pago/:idComanda?" element={<PasarelaPagoPage />} />
                  <Route path="/mis-pedidos" element={<MisPedidosPage />} />
                  <Route path="/metodos-pago" element={<MetodosPagoPage />} />
                  <Route path="/mis-pedidos/:id" element={<PedidoDetailPage />} />
                  <Route path="/reservas/panel" element={<PanelReservasPage />} />
                  <Route path="/entregas" element={<EntregasPage />} />
                  <Route path="/entregas/:id/seguimiento" element={<SeguimientoEntregaPage />} />
                  <Route path="/reportes" element={<ReportesPage />} />
                </Route>

                <Route path="/" element={<Navigate to="/catalogo" replace />} />
                <Route path="*" element={<Navigate to="/catalogo" replace />} />
              </Routes>
            </CarritoProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </SWRConfig>
  )
}

export default App
