import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Users, Shield, LayoutDashboard, Activity, User, Store, Map, Grid, Truck } from 'lucide-react'
import { useAuth } from '@/modules/acceso/context/AuthContext'
import { SidebarView } from './Sidebar.view'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const { user, canRead } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  const sections = [
    {
      title: 'Sistema y Acceso',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, show: true },
        { path: '/perfil', label: 'Mi Perfil', icon: User, show: true },
        { path: '/users', label: 'Usuarios', icon: Users, show: canRead('users') },
        { path: '/empleados', label: 'Personal', icon: Users, show: canRead('employees') },
        { path: '/roles', label: 'Roles', icon: Shield, show: canRead('roles') },
        { path: '/auditoria', label: 'Auditoría', icon: Activity, show: canRead('audit') },
      ]
    },
    {
      title: 'Comercial',
      items: [
        { path: '/proveedores', label: 'Proveedores', icon: Truck, show: canRead('providers') },
      ]
    },
    {
      title: 'Operaciones',
      items: [
        { path: '/sucursales', label: 'Sucursales', icon: Store, show: canRead('sucursales') },
        { path: '/sectores', label: 'Sectores', icon: Map, show: canRead('sectores') },
        { path: '/mesas', label: 'Mesas', icon: Grid, show: canRead('mesas') },
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
    navSections: sections,
    expandedSections,
    toggleSection,
    currentPath
  })
}
