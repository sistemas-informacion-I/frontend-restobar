import React from 'react'

interface ModalRootViewProps {
  children: React.ReactNode
  sizeClass: string
  isOpen: boolean
  onClose: () => void
  closeOnOverlayClick?: boolean
}

export const ModalRootView: React.FC<ModalRootViewProps> = ({
  children,
  sizeClass,
  isOpen,
  onClose,
  closeOnOverlayClick
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center p-2 sm:items-center sm:p-4 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-wine-950/40 backdrop-blur-md"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      <div className={`relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-[2rem] glass-card shadow-2xl shadow-wine-900/40 sm:max-h-[90vh] sm:rounded-[2.5rem] animate-in zoom-in-95 slide-in-from-bottom-10 sm:slide-in-from-bottom-0 duration-500 ${sizeClass}`}>
        {children}
      </div>
    </div>
  )
}

interface ModalHeaderViewProps {
  children: React.ReactNode
  showCloseButton: boolean
  className: string
  onClose: () => void
  XIcon: React.FC<any>
  Button: React.FC<any>
}

export const ModalHeaderView: React.FC<ModalHeaderViewProps> = ({
  children,
  showCloseButton,
  className,
  onClose,
  XIcon,
  Button
}) => (
  <div className={`flex items-center justify-between border-b border-wine-100 px-6 py-5 dark:border-wine-900/30 sm:px-8 ${className}`}>
    <div className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
      {children}
    </div>
    {showCloseButton && (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClose}
        className="ml-2 !h-10 !w-10 !p-0 rounded-full hover:bg-wine-50 dark:hover:bg-wine-900/30"
      >
        <XIcon className="h-5 w-5" />
      </Button>
    )}
  </div>
)

interface ModalBodyViewProps {
  children: React.ReactNode
  className: string
}

export const ModalBodyView: React.FC<ModalBodyViewProps> = ({ children, className }) => (
  <div className={`flex-1 overflow-y-auto p-6 sm:p-8 ${className}`}>
    {children}
  </div>
)

interface ModalFooterViewProps {
  children: React.ReactNode
  className: string
}

export const ModalFooterView: React.FC<ModalFooterViewProps> = ({ children, className }) => (
  <div className={`flex flex-wrap justify-end gap-3 border-t border-wine-100 bg-wine-50/20 px-6 py-5 dark:border-wine-900/30 dark:bg-black/20 sm:px-8 ${className}`}>
    {children}
  </div>
)
