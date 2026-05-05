import React from 'react'

interface SwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  icon?: React.ReactNode
}

export const Switch: React.FC<SwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  icon
}) => {
  return (
    <div 
      className={`group flex items-center justify-between gap-4 rounded-3xl border border-wine-100/50 bg-white/60 p-4 transition-all duration-500 hover:bg-white dark:border-wine-900/20 dark:bg-black/40 dark:hover:bg-black/60 ${disabled ? 'opacity-50 grayscale' : ''}`}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-500 ${
            checked 
              ? 'bg-wine-600 text-white shadow-lg shadow-wine-900/20' 
              : 'bg-wine-50 text-wine-600 dark:bg-wine-900/20 dark:text-wine-400'
          }`}>
            {icon}
          </div>
        )}
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-white">
            {label}
          </span>
          {description && (
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              {description}
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-all duration-500 focus:outline-none focus:ring-4 focus:ring-wine-500/10 ${
          checked 
            ? 'bg-gradient-to-r from-wine-600 to-wine-900 shadow-lg shadow-wine-900/20' 
            : 'bg-slate-200 dark:bg-slate-800'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-all duration-500 ease-spring ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
