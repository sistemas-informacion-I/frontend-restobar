import React from 'react'
import { ChevronDownIcon } from '../Icons'

interface DropdownRootViewProps {
  children: React.ReactNode
  containerRef: React.RefObject<any>
}

export const DropdownRootView: React.FC<DropdownRootViewProps> = ({ children, containerRef }) => (
  <div ref={containerRef} className="relative inline-block">
    {children}
  </div>
)

interface DropdownTriggerViewProps {
  children: React.ReactNode
  showChevron: boolean
  isOpen: boolean
  onClick: () => void
}

export const DropdownTriggerView: React.FC<DropdownTriggerViewProps> = ({ 
  children, 
  showChevron, 
  isOpen, 
  onClick 
}) => (
  <button onClick={onClick} className="inline-flex items-center gap-2">
    {children}
    {showChevron && (
      <ChevronDownIcon
        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    )}
  </button>
)

interface DropdownContentViewProps {
  children: React.ReactNode
  isOpen: boolean
  alignClass: string
  className: string
}

export const DropdownContentView: React.FC<DropdownContentViewProps> = ({ 
  children, 
  isOpen, 
  alignClass, 
  className 
}) => {
  if (!isOpen) return null

  return (
    <div
      className={`absolute ${alignClass} z-50 mt-3 min-w-[240px] origin-top rounded-2xl bg-white/70 backdrop-blur-2xl py-2 shadow-2xl ring-1 ring-wine-100/50 dark:bg-black/80 dark:ring-wine-900/40 transition-all animate-in fade-in zoom-in-95 duration-200 ${className}`}
    >
      {children}
    </div>
  )
}

interface DropdownItemViewProps {
  children: React.ReactNode
  onClick: () => void
  href?: string
  className?: string
  disabled: boolean
  baseClass: string
  disabledClass: string
}

export const DropdownItemView: React.FC<DropdownItemViewProps> = ({
  children,
  onClick,
  href,
  className = '',
  baseClass,
  disabledClass,
  disabled
}) => {
  const itemClasses = `${baseClass} ${disabledClass} ${className} flex items-center gap-3 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-wine-50 hover:text-wine-900 dark:text-slate-300 dark:hover:bg-wine-900/30 dark:hover:text-wine-100 transition-all duration-300`

  if (href) {
    return (
      <a
        href={href}
        className={itemClasses}
        onClick={(e) => {
          if (disabled) e.preventDefault()
          onClick()
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={itemClasses}
    >
      {children}
    </button>
  )
}

export const DropdownDividerView: React.FC = () => (
  <div className="my-1 border-t border-wine-100/30 dark:border-wine-900/10" />
)
