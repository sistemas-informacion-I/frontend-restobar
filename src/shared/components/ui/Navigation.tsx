import React from 'react'

/**
 * NavLink - Componente para enlaces de navegación
 * Soporta activos, iconos y diferentes variantes
 */
interface NavLinkProps {
  href?: string
  onClick?: () => void
  active?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  badge?: number | string
  className?: string
}

export const NavLink: React.FC<NavLinkProps> = ({
  href,
  onClick,
  active = false,
  icon,
  children,
  badge,
  className = '',
}) => {
  const baseClass =
    'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium'
  const activeClass = active
    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
    : 'text-gray-300 hover:bg-gray-800 hover:text-white'

  const content = (
    <>
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span className="ml-auto flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-xs font-bold text-white">
          {badge}
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <a href={href} className={`${baseClass} ${activeClass} ${className}`}>
        {content}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`w-full ${baseClass} ${activeClass} ${className}`}
    >
      {content}
    </button>
  )
}

/**
 * NavGroup - Agrupar enlaces de navegación con títulos
 */
interface NavGroupProps {
  label?: string
  children: React.ReactNode
}

export const NavGroup: React.FC<NavGroupProps> = ({ label, children }) => {
  return (
    <div>
      {label && (
        <h3 className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {label}
        </h3>
      )}
      <div className="space-y-1">{children}</div>
    </div>
  )
}

/**
 * Navigation - Componente contenedor principal para navegación
 */
interface NavigationProps {
  children: React.ReactNode
  orientation?: 'vertical' | 'horizontal'
  className?: string
}

export const Navigation: React.FC<NavigationProps> = ({
  children,
  orientation = 'vertical',
  className = '',
}) => {
  const baseClass = orientation === 'vertical' ? 'flex flex-col space-y-2' : 'flex gap-2'

  return <nav className={`${baseClass} ${className}`}>{children}</nav>
}
