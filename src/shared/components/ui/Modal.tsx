import React, { createContext, useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'
import { XIcon } from './Icons'

interface ModalContextType {
  isOpen: boolean
  onClose: () => void
  size: 'sm' | 'md' | 'lg' | 'xl'
}

const ModalContext = createContext<ModalContextType | null>(null)

const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal components must be used within Modal.Root')
  }
  return context
}

interface ModalRootProps {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const ModalRoot: React.FC<ModalRootProps> = ({
  children,
  isOpen,
  onClose,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true
}) => {
  useEffect(() => {
    if (!closeOnEscape) return
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEscape])

  if (!isOpen) return null

  const sizeClasses: Record<ModalContextType['size'], string> = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }

  const modal = (
    <ModalContext.Provider value={{ isOpen, onClose, size }}>
      <div className="fixed inset-0 z-[1000] flex items-end justify-center p-2 sm:items-center sm:p-4">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        <div className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:max-h-[90vh] sm:rounded-2xl ${sizeClasses[size]}`}>
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  )

  return createPortal(modal, document.body)
}

interface ModalHeaderProps {
  children: React.ReactNode
  showCloseButton?: boolean
  className?: string
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ 
  children, 
  showCloseButton = true,
  className = '' 
}) => {
  const { onClose } = useModalContext()
  
  return (
    <div className={`flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700 sm:px-6 ${className}`}>
      <div className="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {children}
      </div>
      {showCloseButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="ml-2 !min-h-8 !px-2"
        >
          <XIcon className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => (
  <div className={`flex-1 overflow-y-auto p-5 sm:p-6 ${className}`}>
    {children}
  </div>
)

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => (
  <div className={`flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-slate-700 sm:px-6 ${className}`}>
    {children}
  </div>
)

// Compound component export
export const Modal = {
  Root: ModalRoot,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter
}

// Legacy export for backward compatibility
export default Modal
