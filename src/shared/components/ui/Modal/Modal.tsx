import React, { createContext, useContext, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../Button'
import { XIcon } from '../Icons'
import { 
  ModalRootView, 
  ModalHeaderView, 
  ModalBodyView, 
  ModalFooterView 
} from './Modal.view'

interface ModalContextType {
  isOpen: boolean
  onClose: () => void
  size: 'sm' | 'md' | 'lg' | 'xl'
}

const ModalContext = createContext<ModalContextType | null>(null)

const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) throw new Error('Modal components must be used within Modal.Root')
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
      if (e.key === 'Escape' && isOpen) onClose()
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

  const sizeClasses: Record<ModalContextType['size'], string> = {
    sm: 'max-w-sm',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  }

  if (!isOpen) return null

  const modal = (
    <ModalContext.Provider value={{ isOpen, onClose, size }}>
      {ModalRootView({ 
        children, 
        sizeClass: sizeClasses[size], 
        isOpen, 
        onClose, 
        closeOnOverlayClick 
      })}
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
  return ModalHeaderView({ 
    children, 
    showCloseButton, 
    className, 
    onClose, 
    XIcon, 
    Button 
  })
}

interface ModalBodyProps {
  children: React.ReactNode
  className?: string
}

const ModalBody: React.FC<ModalBodyProps> = ({ children, className = '' }) => 
  ModalBodyView({ children, className })

interface ModalFooterProps {
  children: React.ReactNode
  className?: string
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, className = '' }) => 
  ModalFooterView({ children, className })

export const Modal = {
  Root: ModalRoot,
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter
}

export default Modal
