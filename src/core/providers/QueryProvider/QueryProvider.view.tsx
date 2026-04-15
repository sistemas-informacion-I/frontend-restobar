import { QueryClientProvider } from '@tanstack/react-query'

export const QueryProviderView: React.FC<{ children: React.ReactNode, queryClient: any }> = ({ children, queryClient }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
