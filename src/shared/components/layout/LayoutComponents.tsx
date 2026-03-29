import React from 'react'

/**
 * LayoutRoot - Componente raíz que envuelve la estructura principal
 * Similar a app.blade.php en SI1-ferreteria
 */
interface LayoutRootProps {
  children: React.ReactNode
  sidebarOpen?: boolean
}

export const LayoutRoot: React.FC<LayoutRootProps> = ({
  children,
}) => {
  return (
    <div className="relative flex min-h-screen bg-gray-950 text-gray-100">
      {children}
    </div>
  )
}

/**
 * LayoutSidebar - Componente para la barra lateral
 * Patrón composable como en SI1-ferreteria
 */
interface LayoutSidebarProps {
  children: React.ReactNode
  open?: boolean
  onClose?: () => void
  width?: 'sm' | 'md' | 'lg'
}

export const LayoutSidebar: React.FC<LayoutSidebarProps> = ({
  children,
  open = true,
  onClose,
  width = 'md',
}) => {
  const widthClass = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  }[width]

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[100] flex flex-col border-r border-gray-800 bg-gray-900/95 backdrop-blur transition-transform ${widthClass} ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {children}
      </aside>

      {/* Overlay para mobile */}
      {open && (
        <div
          className="fixed inset-0 z-[99] bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  )
}

/**
 * LayoutHeader - Componente para el encabezado
 */
interface LayoutHeaderProps {
  children: React.ReactNode
  sticky?: boolean
  className?: string
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({
  children,
  sticky = true,
  className = '',
}) => {
  const stickyClass = sticky ? 'sticky top-0 z-50' : ''

  return (
    <header
      className={`flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900/90 px-4 backdrop-blur md:h-16 md:px-6 ${stickyClass} ${className}`}
    >
      {children}
    </header>
  )
}

/**
 * LayoutMain - Componente para el contenido principal
 */
interface LayoutMainProps {
  children: React.ReactNode
  hasSidebar?: boolean
}

export const LayoutMain: React.FC<LayoutMainProps> = ({
  children,
  hasSidebar = true,
}) => {
  const marginClass = hasSidebar ? 'md:ml-64' : ''

  return (
    <div className={`flex min-h-screen flex-1 flex-col ${marginClass}`}>
      {children}
    </div>
  )
}

/**
 * LayoutContent - Componente para el contenido con padding
 */
interface LayoutContentProps {
  children: React.ReactNode
  className?: string
}

export const LayoutContent: React.FC<LayoutContentProps> = ({
  children,
  className = '',
}) => {
  return (
    <main className={`flex-1 p-4 sm:p-6 md:p-8 ${className}`}>{children}</main>
  )
}

/**
 * LayoutFooter - Componente para el pie de página
 */
interface LayoutFooterProps {
  children: React.ReactNode
  className?: string
}

export const LayoutFooter: React.FC<LayoutFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <footer className={`border-t border-gray-800 bg-gray-900 px-6 py-4 ${className}`}>
      {children}
    </footer>
  )
}

/**
 * SidebarHeader - Componente para el encabezado del sidebar
 */
interface SidebarHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  showCloseBtn?: boolean
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  onClose,
  showCloseBtn = true,
}) => {
  return (
    <div className="flex items-center gap-3 border-b border-gray-800 p-5">
      {children}
      {showCloseBtn && (
        <button
          className="ml-auto rounded-lg p-2 text-gray-500 transition hover:bg-gray-800 hover:text-gray-100 md:hidden"
          onClick={onClose}
        >
          ✕
        </button>
      )}
    </div>
  )
}

/**
 * SidebarContent - Componente para el contenido del sidebar
 */
interface SidebarContentProps {
  children: React.ReactNode
}

export const SidebarContent: React.FC<SidebarContentProps> = ({ children }) => {
  return <nav className="flex flex-1 flex-col gap-1 p-3">{children}</nav>
}

/**
 * SidebarFooter - Componente para el pie del sidebar (usuario, etc)
 */
interface SidebarFooterProps {
  children: React.ReactNode
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children }) => {
  return <div className="border-t border-gray-800 p-4">{children}</div>
}
