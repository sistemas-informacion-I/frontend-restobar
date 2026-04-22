import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './modules/acceso/context/AuthContext'
import { QueryProvider, ThemeProvider } from './core/providers'
import { ProtectedRoute } from './modules/acceso/components/ProtectedRoute'
import LoginPage from './modules/acceso/pages/LoginPage'
import RegisterPage from './modules/acceso/pages/RegisterPage'
import DashboardPage from './modules/acceso/pages/DashboardPage'
import UsersPage from './modules/acceso/pages/UsersPage'
import RolesPage from './modules/acceso/pages/RolesPage'
import AuditoriaPage from './modules/acceso/pages/AuditoriaPage'
import SucursalesPage from './modules/operaciones/pages/SucursalesPage'
import SectoresPage from './modules/operaciones/pages/SectoresPage'
import MesasPage from './modules/operaciones/pages/MesasPage'

function App() {
  return (
    <QueryProvider>
      <ThemeProvider>
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
            
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  )
}

export default App
