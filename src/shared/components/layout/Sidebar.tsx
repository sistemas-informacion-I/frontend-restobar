import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Users, Shield, LayoutDashboard, Activity, User, Store, Map, Grid, Truck, Package, LayoutList, ShoppingCart, ChefHat, Utensils, BookOpen, Receipt } from 'lucide-react'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { SidebarView } from './SidebarView'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  sidebarMinimized: boolean
}

export function Sidebar({ sidebarOpen, setSidebarOpen, sidebarMinimized }: SidebarProps) {
  const { user, canRead } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  const sections = [
    {
      title: 'Sistema y Acceso',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
        { path: '/perfil', label: 'Mi Perfil', icon: User, show: true },
        { path: '/users', label: 'Usuarios', icon: Users, show: user?.tipoUsuario === 'S' && canRead('users') },
        { path: '/empleados', label: 'Personal', icon: Users, show: canRead('employees') },
        { path: '/roles', label: 'Roles', icon: Shield, show: user?.tipoUsuario === 'S' && canRead('roles') },
        { path: '/auditoria', label: 'Auditoría', icon: Activity, show: canRead('audit') },
      ]
    },
    {
      title: 'Comercial',
      items: [
        { path: '/proveedores', label: 'Proveedores', icon: Truck, show: canRead('providers') },
        // ── NUEVO ──
        { path: '/categorias', label: 'Categorías', icon: LayoutList, show: canRead('categories') },
        { path: '/compras', label: 'Compras', icon: ShoppingCart, show: canRead('compras') },
        { path: '/productos-finales', label: 'Productos Finales', icon: Utensils, show: canRead('producto') },
        { path: '/catalogo', label: 'Catálogo', icon: BookOpen, show: canRead('catalogo') },
        { path: '/ventas-presencial', label: 'Ventas', icon: Receipt, show: user?.tipoUsuario === 'S' || canRead('ventas') },
      ]
    },
    {
      title: 'Operaciones',
      items: [
        { path: '/sucursales', label: 'Sucursales', icon: Store, show: canRead('sucursales') },
        { path: '/sectores', label: 'Sectores', icon: Map, show: canRead('sectores') },
        { path: '/mesas', label: 'Mesas', icon: Grid, show: canRead('mesas') },
      ]
    },
    {
      title: 'Inventario',
      items: [
        { path: '/inventario', label: 'Insumos', icon: Package, show: canRead('inventario') },
        { path: '/recetas', label: 'Recetas', icon: ChefHat, show: canRead('receta') },
      ]
    }
  ]

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Determine which section should be open based on current path
  useEffect(() => {
    const newExpanded: Record<string, boolean> = {}
    sections.forEach(section => {
      const hasActiveItem = section.items.some(item => item.path === currentPath)
      if (hasActiveItem) {
        newExpanded[section.title] = true
      }
    })

    // If no section matched (e.g. initial login) or currentPath is dashboard, default to first section
    if (Object.keys(newExpanded).length === 0 || currentPath === '/dashboard') {
      newExpanded['Sistema y Acceso'] = true
    }

    setExpandedSections(newExpanded)
  }, [currentPath])

  const toggleSection = (title: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
  }

  return SidebarView({
    user,
    sidebarOpen,
    setSidebarOpen,
    sidebarMinimized,
    navSections: sections,
    expandedSections,
    toggleSection,
    currentPath
  })
}
