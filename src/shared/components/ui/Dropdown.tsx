import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { ChevronDownIcon } from './Icons'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  close: () => void
}

const DropdownContext = createContext<DropdownContextType | null>(null)

const useDropdownContext = () => {
  const context = useContext(DropdownContext)
  if (!context) {
    throw new Error('Dropdown components must be used within Dropdown.Root')
  }
  return context
}

// Root Component
interface DropdownRootProps {
  children: React.ReactNode
  onOpenChange?: (isOpen: boolean) => void
}

const DropdownRoot: React.FC<DropdownRootProps> = ({ children, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSetIsOpen = (value: boolean) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }

  const context: DropdownContextType = {
    isOpen,
    setIsOpen: handleSetIsOpen,
    close: () => handleSetIsOpen(false),
  }

  return (
    <DropdownContext.Provider value={context}>
      <div ref={containerRef} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  )
}

// Trigger Component
interface DropdownTriggerProps {
  children: React.ReactNode
  showChevron?: boolean
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, showChevron = true }) => {
  const { isOpen, setIsOpen } = useDropdownContext()

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="inline-flex items-center gap-2"
    >
      {children}
      {showChevron && (
        <ChevronDownIcon
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      )}
    </button>
  )
}

// Content Component
interface DropdownContentProps {
  children: React.ReactNode
  align?: 'left' | 'right'
  className?: string
}

const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  align = 'left',
  className = '',
}) => {
  const { isOpen } = useDropdownContext()

  if (!isOpen) return null

  const alignClass = align === 'right' ? 'right-0' : 'left-0'

  return (
    <div
      className={`absolute ${alignClass} z-50 mt-2 min-w-[200px] origin-top rounded-lg bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-all ${className}`}
    >
      {children}
    </div>
  )
}

// Item Component
interface DropdownItemProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  className?: string
  disabled?: boolean
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  onClick,
  href,
  className = '',
  disabled = false,
}) => {
  const { close } = useDropdownContext()

  const handleClick = () => {
    if (!disabled) {
      onClick?.()
      close()
    }
  }

  const baseClass =
    'block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 transition-colors'
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  if (href) {
    return (
      <a
        href={href}
        className={`${baseClass} ${disabledClass} ${className}`}
        onClick={(e) => {
          if (disabled) e.preventDefault()
          handleClick()
        }}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`${baseClass} ${disabledClass} ${className}`}
    >
      {children}
    </button>
  )
}

// Divider Component
const DropdownDivider: React.FC = () => (
  <div className="my-1 border-t border-gray-700" />
)

// Compound Component Export
export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Divider: DropdownDivider,
})
