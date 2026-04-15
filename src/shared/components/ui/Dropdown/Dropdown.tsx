import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { 
  DropdownRootView, 
  DropdownTriggerView, 
  DropdownContentView, 
  DropdownItemView, 
  DropdownDividerView 
} from './Dropdown.view'

interface DropdownContextType {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  close: () => void
}

const DropdownContext = createContext<DropdownContextType | null>(null)

const useDropdownContext = () => {
  const context = useContext(DropdownContext)
  if (!context) throw new Error('Dropdown components must be used within Dropdown.Root')
  return context
}

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
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
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
      {DropdownRootView({ children, containerRef })}
    </DropdownContext.Provider>
  )
}

interface DropdownTriggerProps {
  children: React.ReactNode
  showChevron?: boolean
}

const DropdownTrigger: React.FC<DropdownTriggerProps> = ({ children, showChevron = true }) => {
  const { isOpen, setIsOpen } = useDropdownContext()
  return DropdownTriggerView({ 
    children, 
    showChevron, 
    isOpen, 
    onClick: () => setIsOpen(!isOpen) 
  })
}

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
  const alignClass = align === 'right' ? 'right-0' : 'left-0'
  return DropdownContentView({ children, isOpen, alignClass, className })
}

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

  const baseClass = 'block w-full px-4 py-2 text-left text-sm text-gray-200 hover:bg-gray-700 transition-colors'
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'

  return DropdownItemView({
    children,
    onClick: handleClick,
    href,
    className,
    disabled,
    baseClass,
    disabledClass,
  })
}

const DropdownDivider: React.FC = () => DropdownDividerView({})

export const Dropdown = Object.assign(DropdownRoot, {
  Trigger: DropdownTrigger,
  Content: DropdownContent,
  Item: DropdownItem,
  Divider: DropdownDivider,
})
