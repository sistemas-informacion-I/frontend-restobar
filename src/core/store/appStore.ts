import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  roles: string[]
}

export interface AppState {
  // Theme
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
  
  // UI State
  sidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  
  // Global Loading
  loading: boolean
  setLoading: (loading: boolean) => void
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: number
  }>
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()
  (devtools(
    persist(
      (set, get) => ({
        // Theme
        theme: 'light',
        setTheme: (theme: 'light' | 'dark') => set({ theme }),
        toggleTheme: () => {
          set((state: AppState) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light'
            return { theme: newTheme }
          })
        },
        
        // UI State
        sidebarCollapsed: false,
        setSidebarCollapsed: (collapsed: boolean) => set({ sidebarCollapsed: collapsed }),
        toggleSidebar: () => set(
          (state: AppState) => ({ sidebarCollapsed: !state.sidebarCollapsed })
        ),
        
        // Global Loading
        loading: false,
        setLoading: (loading: boolean) => set({ loading }),
        
        // Notifications
        notifications: [],
        addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp'>) => {
          const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          const newNotification = {
            ...notification,
            id,
            timestamp: Date.now()
          }
          set(
            (state: AppState) => ({
              notifications: [...state.notifications, newNotification]
            })
          )
          
          // Auto remove after 5 seconds
          setTimeout(() => {
            const currentStore = get() as AppState
            currentStore.removeNotification(id)
          }, 5000)
        },
        removeNotification: (id: string) => set(
          (state: AppState) => ({
            notifications: state.notifications.filter((n: any) => n.id !== id)
          })
        ),
        clearNotifications: () => set({ notifications: [] })
      }),
      {
        name: 'app-store',
        partialize: (state: AppState) => ({
          theme: state.theme,
          sidebarCollapsed: state.sidebarCollapsed
        })
      }
    ),
    { name: 'AppStore' }
  ))