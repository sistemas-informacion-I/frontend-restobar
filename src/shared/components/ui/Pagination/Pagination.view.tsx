import React from 'react'
import { Button } from '../Button'
import { ChevronLeftIcon, ChevronRightIcon } from '../Icons'

interface PaginationViewProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  showInfo: boolean
  startItem: number
  endItem: number
  totalItems: number
  getVisiblePages: () => (number | string)[]
  className: string
}

export const PaginationView: React.FC<PaginationViewProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showInfo,
  startItem,
  endItem,
  totalItems,
  getVisiblePages,
  className
}) => {
  if (totalPages <= 1) return null

  return (
    <div className={`flex flex-col items-stretch justify-between gap-4 border-t border-wine-100/50 bg-wine-50/20 p-4 backdrop-blur-md dark:border-wine-900/20 dark:bg-black/20 sm:flex-row sm:items-center sm:p-6 ${className}`}>
      {showInfo && (
        <div className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 sm:text-left">
          Mostrando <span className="text-wine-700 dark:text-wine-300">{startItem}</span> a <span className="text-wine-700 dark:text-wine-300">{endItem}</span> de <span className="text-wine-700 dark:text-wine-300">{totalItems}</span> registros
        </div>
      )}
      
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="!px-3 !py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-wine-100/50 dark:border-wine-900/20 hover:bg-wine-50 dark:hover:bg-wine-900/30 transition-all font-bold uppercase tracking-widest text-[10px]"
        >
          <ChevronLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline ml-1">Anterior</span>
        </Button>
        
        <div className="flex items-center gap-1.5">
          {getVisiblePages().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="px-2 text-sm font-bold text-wine-300">...</span>
              ) : (
                <Button
                  variant={page === currentPage ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className={`!h-10 !w-10 !p-0 rounded-xl transition-all duration-300 font-black ${page === currentPage ? 'shadow-lg shadow-wine-900/20 scale-110' : 'bg-white/30 dark:bg-white/5 hover:bg-wine-100 dark:hover:bg-wine-900/30'}`}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="!px-3 !py-2 rounded-xl bg-white/50 dark:bg-black/20 border border-wine-100/50 dark:border-wine-900/20 hover:bg-wine-50 dark:hover:bg-wine-900/30 transition-all font-bold uppercase tracking-widest text-[10px]"
        >
          <span className="hidden sm:inline mr-1">Siguiente</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
