import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps {
  value?: string | number
  onChange: (value: any) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  icon?: React.ReactNode
  disabled?: boolean
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar...',
  className = '',
  icon,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  const [scrollProgress, setScrollProgress] = useState(0)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100
    setScrollProgress(progress)
    setShowScrollIndicator(true)
    
    // Debounce to hide indicator
    const timer = setTimeout(() => setShowScrollIndicator(false), 1000)
    return () => clearTimeout(timer)
  }

  const handleSelect = (optionValue: any) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex h-14 w-full items-center justify-between rounded-2xl border border-wine-100/50 bg-white/80 px-5 text-sm font-semibold text-slate-900 backdrop-blur-md outline-none transition-all duration-500 hover:bg-white dark:border-white/10 dark:bg-black/40 dark:text-white dark:hover:bg-white/10 ${
          isOpen 
            ? 'border-wine-500/50 bg-wine-50 ring-4 ring-wine-500/10 shadow-[0_0_20px_rgba(159,18,57,0.1)] dark:bg-wine-900/20' 
            : 'shadow-sm shadow-wine-900/5'
        }`}
      >
        <div className="flex items-center gap-3.5 truncate">
          {icon && (
            <div className={`transition-transform duration-500 ${isOpen ? 'scale-110 text-wine-600 dark:text-wine-400' : 'text-wine-500/70 group-hover:text-wine-600 dark:text-wine-400/70'}`}>
              {icon}
            </div>
          )}
          <span className={`truncate tracking-wide transition-colors duration-300 ${isOpen ? 'text-slate-900 dark:text-white' : 'text-slate-600 group-hover:text-slate-900 dark:text-white/80 dark:group-hover:text-white'}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown 
          className={`text-wine-500 transition-all duration-500 ${isOpen ? 'rotate-180 scale-110 text-wine-600 dark:text-wine-400' : 'group-hover:text-wine-600'}`} 
          size={18} 
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-[100] w-full min-w-[260px] overflow-hidden rounded-[2.5rem] border border-wine-100/50 bg-white/90 p-2 shadow-[0_25px_60px_rgba(159,18,57,0.15)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#0f1117]/95 dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)]">
          <div className="absolute inset-0 bg-gradient-to-br from-wine-500/10 to-transparent pointer-events-none" />
          
          {/* Top Fade Mask */}
          <div className="absolute left-0 top-0 z-10 h-10 w-full bg-gradient-to-b from-white dark:from-[#0f1117] to-transparent pointer-events-none opacity-50 dark:opacity-100" />
          
          {/* Custom Scroll Indicator */}
          <div 
            className={`absolute right-2 top-10 h-[calc(100%-80px)] w-1 rounded-full bg-wine-100 dark:bg-white/5 transition-opacity duration-300 ${options.length > 4 ? 'opacity-100' : 'opacity-0'}`}
          >
            <div 
              className="absolute w-full rounded-full bg-gradient-to-b from-wine-400 to-wine-600 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(159,18,57,0.5)]"
              style={{ 
                height: '30%', 
                top: `${scrollProgress * 0.7}%`,
                opacity: showScrollIndicator ? 1 : 0.3
              }}
            />
          </div>

          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="relative max-h-[200px] overflow-y-auto px-1 py-6 scrollbar-none"
          >
            {options.length > 0 ? (
              <div className="flex flex-col gap-2">
                {options.map((option, index) => {
                  const isSelected = option.value === value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleSelect(option.value)}
                      style={{ 
                        transitionDelay: `${index * 30}ms`,
                      }}
                      className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-5 py-4 text-left text-sm transition-all duration-500 transform ${
                        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
                      } ${
                        isSelected
                          ? 'bg-gradient-to-r from-wine-600 to-wine-800 font-bold text-white shadow-xl shadow-wine-900/40'
                          : 'text-slate-600 hover:bg-wine-50 hover:text-wine-900 dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white hover:translate-x-1'
                      }`}
                    >
                      {!isSelected && (
                        <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-wine-500/10 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
                      )}
                      
                      <span className="relative z-10 truncate tracking-wider">{option.label}</span>
                      
                      {isSelected && (
                        <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                          <Check size={14} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 opacity-30">
                <div className="h-1 w-12 rounded-full bg-wine-500/50 mb-3" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white text-slate-900">Sin opciones</span>
              </div>
            )}
          </div>

          {/* Bottom Fade Mask */}
          <div className="absolute bottom-0 left-0 z-10 h-10 w-full bg-gradient-to-t from-white dark:from-[#0f1117] to-transparent pointer-events-none opacity-50 dark:opacity-100" />
        </div>
      )}
    </div>
  )
}

