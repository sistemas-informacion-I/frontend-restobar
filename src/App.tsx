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
import EmployeesPage from './modules/acceso/pages/EmployeesPage'
import ProveedoresPage from './modules/comercial/pages/ProveedoresPage'
import InventarioPage from './modules/inventario/pages/InventarioPage'
import { Toaster } from 'sonner'

import { ProtectedLayout } from './shared/components/layout/ProtectedLayout'
import CategoriasPage from './modules/comercial/pages/CategoriasPage'

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
          <Toaster richColors position="top-right" />
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Rutas Protegidas (Comparten el mismo Layout) */}
              <Route element={<ProtectedLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/roles" element={<RolesPage />} />
                <Route path="/auditoria" element={<AuditoriaPage />} />
                <Route path="/perfil" element={<PerfilPersonalPage />} />
                <Route path="/sucursales" element={<SucursalesPage />} />
                <Route path="/sectores" element={<SectoresPage />} />
                <Route path="/mesas" element={<MesasPage />} />
                <Route path="/empleados" element={<EmployeesPage />} />
                <Route path="/proveedores" element={<ProveedoresPage />} />
                <Route path="/inventario" element={<InventarioPage />} />
                <Route path="/restobar" element={<DashboardPage />} />
                <Route path="/categorias" element={<CategoriasPage />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </SWRConfig>
  )
}

export default App
