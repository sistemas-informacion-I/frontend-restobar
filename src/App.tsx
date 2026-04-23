import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './modules/acceso/context/AuthContext'
import { QueryProvider, ThemeProvider } from './core/providers'
import { ProtectedRoute } from './modules/acceso/components/common'
import LoginPage from './modules/acceso/pages/LoginPage'
import RegisterPage from './modules/acceso/pages/RegisterPage'
import DashboardPage from './modules/acceso/pages/DashboardPage'
import UsersPage from './modules/acceso/pages/UsersPage'
import RolesPage from './modules/acceso/pages/RolesPage'
import AuditoriaPage from './modules/acceso/pages/AuditoriaPage'
import PerfilPersonalPage from './modules/acceso/pages/PerfilPersonalPage'

import { SWRConfig } from 'swr'
import { httpClient } from './modules/acceso/services/http-client'
import SucursalesPage from './modules/operaciones/pages/SucursalesPage'
import SectoresPage from './modules/operaciones/pages/SectoresPage'
import MesasPage from './modules/operaciones/pages/MesasPage'
import EmployeesPage from './modules/acceso/pages/EmployeesPage'
import { Toaster } from 'sonner'

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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auditoria"
              element={
                <ProtectedRoute>
                  <AuditoriaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <PerfilPersonalPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sucursales"
              element={
                <ProtectedRoute>
                  <SucursalesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sectores"
              element={
                <ProtectedRoute>
                  <SectoresPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mesas"
              element={
                <ProtectedRoute>
                  <MesasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/empleados"
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            
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
