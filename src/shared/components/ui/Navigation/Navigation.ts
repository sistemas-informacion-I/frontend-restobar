import React from 'react'
import { 
  NavLinkView, 
  NavGroupView, 
  NavigationContainerView 
} from './Navigation.view'

export interface NavLinkProps {
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
  const baseClass = 'flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium'
  const activeClass = active
    ? 'bg-orange-600 text-white shadow-md shadow-orange-600/25'
    : 'text-gray-300 hover:bg-gray-800 hover:text-white'

  return NavLinkView({
    href,
    onClick,
    active,
    icon,
    children,
    badge,
    className,
    baseClass,
    activeClass
  })
}

export interface NavGroupProps {
  label?: string
  children: React.ReactNode
}

export const NavGroup: React.FC<NavGroupProps> = ({ label, children }) => 
  NavGroupView({ label, children })

export interface NavigationProps {
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
  return NavigationContainerView({ children, baseClass, className })
}
