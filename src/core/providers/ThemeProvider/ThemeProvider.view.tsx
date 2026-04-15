import React from 'react'

export const ThemeProviderView: React.FC<{ children: React.ReactNode, value: any, ThemeContext: any }> = ({ children, value, ThemeContext }) => {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
