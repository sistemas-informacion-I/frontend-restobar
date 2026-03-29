import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export const QueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
            retry: (failureCount, error: any) => {
              if (error?.status === 404 || error?.status === 401) {
                return false
              }
              return failureCount < 3
            }
          },
          mutations: {
            retry: false
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}