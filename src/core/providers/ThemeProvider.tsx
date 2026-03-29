import React, { createContext, useContext, useEffect } from 'react'
import { useAppStore } from '../store/appStore'

interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme, toggleTheme } = useAppStore()

  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body
    const isDark = theme === 'dark'
    
    root.classList.toggle('dark', isDark)
    root.classList.toggle('light', !isDark)
    body.classList.toggle('dark', isDark)
    body.classList.toggle('light', !isDark)

    root.setAttribute('data-theme', theme)
    root.style.colorScheme = isDark ? 'dark' : 'light'
  }, [theme])

  const value: ThemeContextType = {
    theme,
    setTheme,
    toggleTheme
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}