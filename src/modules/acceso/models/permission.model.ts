export interface Permission {
  id: string
  name: string
  description: string
  module: string
  action: string
  isActive?: boolean
  createdAt?: string
}
