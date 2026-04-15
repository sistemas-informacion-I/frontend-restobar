import React from 'react'
import { 
  LayoutRootView, 
  LayoutSidebarView, 
  LayoutHeaderView, 
  LayoutMainView, 
  LayoutContentView, 
  LayoutFooterView, 
  SidebarHeaderView, 
  SidebarContentView, 
  SidebarFooterView 
} from './LayoutComponents.view'

export const LayoutRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => 
  LayoutRootView({ children })

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
  const widthClass = { sm: 'w-48', md: 'w-64', lg: 'w-80' }[width]
  return LayoutSidebarView({ children, open, onClose, widthClass })
}

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
  return LayoutHeaderView({ children, stickyClass, className })
}

interface LayoutMainProps {
  children: React.ReactNode
  hasSidebar?: boolean
}

export const LayoutMain: React.FC<LayoutMainProps> = ({
  children,
  hasSidebar = true,
}) => {
  const marginClass = hasSidebar ? 'md:ml-64' : ''
  return LayoutMainView({ children, marginClass })
}

interface LayoutContentProps {
  children: React.ReactNode
  className?: string
}

export const LayoutContent: React.FC<LayoutContentProps> = ({
  children,
  className = '',
}) => LayoutContentView({ children, className })

interface LayoutFooterProps {
  children: React.ReactNode
  className?: string
}

export const LayoutFooter: React.FC<LayoutFooterProps> = ({
  children,
  className = '',
}) => LayoutFooterView({ children, className })

interface SidebarHeaderProps {
  children: React.ReactNode
  onClose?: () => void
  showCloseBtn?: boolean
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  onClose,
  showCloseBtn = true,
}) => SidebarHeaderView({ children, onClose, showCloseBtn })

export const SidebarContent: React.FC<{ children: React.ReactNode }> = ({ children }) => 
  SidebarContentView({ children })

export const SidebarFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => 
  SidebarFooterView({ children })
