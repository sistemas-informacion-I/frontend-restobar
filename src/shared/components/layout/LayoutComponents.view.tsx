import React from 'react'

export const LayoutRootView: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative flex min-h-screen bg-gray-950 text-gray-100">
    {children}
  </div>
)

interface LayoutSidebarViewProps {
  children: React.ReactNode
  open: boolean
  onClose?: () => void
  widthClass: string
}

export const LayoutSidebarView: React.FC<LayoutSidebarViewProps> = ({
  children,
  open,
  onClose,
  widthClass,
}) => (
  <>
    <aside
      className={`fixed inset-y-0 left-0 z-[100] flex flex-col border-r border-gray-800 bg-gray-900/95 backdrop-blur transition-transform ${widthClass} ${
        open ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}
    >
      {children}
    </aside>
    {open && (
      <div
        className="fixed inset-0 z-[99] bg-black/50 md:hidden"
        onClick={onClose}
      />
    )}
  </>
)

interface LayoutHeaderViewProps {
  children: React.ReactNode
  stickyClass: string
  className: string
}

export const LayoutHeaderView: React.FC<LayoutHeaderViewProps> = ({
  children,
  stickyClass,
  className,
}) => (
  <header
    className={`flex h-14 items-center justify-between border-b border-gray-800 bg-gray-900/90 px-4 backdrop-blur md:h-16 md:px-6 ${stickyClass} ${className}`}
  >
    {children}
  </header>
)

interface LayoutMainViewProps {
  children: React.ReactNode
  marginClass: string
}

export const LayoutMainView: React.FC<LayoutMainViewProps> = ({ children, marginClass }) => (
  <div className={`flex min-h-screen flex-1 flex-col ${marginClass}`}>
    {children}
  </div>
)

interface LayoutContentViewProps {
  children: React.ReactNode
  className: string
}

export const LayoutContentView: React.FC<LayoutContentViewProps> = ({ children, className }) => (
  <main className={`flex-1 p-4 sm:p-6 md:p-8 ${className}`}>{children}</main>
)

interface LayoutFooterViewProps {
  children: React.ReactNode
  className: string
}

export const LayoutFooterView: React.FC<LayoutFooterViewProps> = ({ children, className }) => (
  <footer className={`border-t border-gray-800 bg-gray-900 px-6 py-4 ${className}`}>
    {children}
  </footer>
)

interface SidebarHeaderViewProps {
  children: React.ReactNode
  onClose?: () => void
  showCloseBtn: boolean
}

export const SidebarHeaderView: React.FC<SidebarHeaderViewProps> = ({
  children,
  onClose,
  showCloseBtn,
}) => (
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

export const SidebarContentView: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <nav className="flex flex-1 flex-col gap-1 p-3">{children}</nav>
)

export const SidebarFooterView: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border-t border-gray-800 p-4">{children}</div>
)
