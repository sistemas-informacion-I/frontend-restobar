import React from 'react'

interface NavLinkViewProps {
  href?: string
  onClick?: () => void
  active: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  badge?: number | string
  className: string
  baseClass: string
  activeClass: string
}

export const NavLinkView: React.FC<NavLinkViewProps> = ({
  href,
  onClick,
  icon,
  children,
  badge,
  className,
  baseClass,
  activeClass
}) => {
  const content = (
    <>
      {icon && <span className="flex items-center">{icon}</span>}
      <span>{children}</span>
      {badge && (
        <span className="ml-auto flex items-center justify-center h-5 w-5 rounded-full bg-wine-600 text-[10px] font-black text-white shadow-lg shadow-wine-900/30">
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

interface NavGroupViewProps {
  label?: string
  children: React.ReactNode
}

export const NavGroupView: React.FC<NavGroupViewProps> = ({ label, children }) => (
  <div className="py-2">
    {label && (
      <h3 className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-wine-900/30 dark:text-wine-400/30 font-sans mb-1">
        {label}
      </h3>
    )}
    <div className="space-y-2">{children}</div>
  </div>
)

interface NavigationContainerViewProps {
  children: React.ReactNode
  baseClass: string
  className: string
}

export const NavigationContainerView: React.FC<NavigationContainerViewProps> = ({
  children,
  baseClass,
  className
}) => (
  <nav className={`${baseClass} ${className}`}>{children}</nav>
)
