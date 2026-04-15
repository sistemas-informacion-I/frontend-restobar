import { useState } from 'react'
import { AuditFilters } from '../../../models'
import { AuditoriaToolbarView } from './AuditoriaToolbar.view'

export interface AuditoriaToolbarProps {
  filters: AuditFilters
  onFilterChange: (filters: Partial<AuditFilters>) => void
  onClearFilters: () => void
}

export function AuditoriaToolbar(props: AuditoriaToolbarProps) {
  const [showFilters, setShowFilters] = useState(false)
  const { filters } = props
  const hasActiveFilters = !!(filters.tabla || filters.operacion || filters.idUsuario || filters.desde || filters.hasta)

  const toggleFilters = () => setShowFilters(!showFilters)
  
  const handleClear = () => {
    props.onClearFilters()
    setShowFilters(false)
  }

  return AuditoriaToolbarView({ 
    ...props, 
    showFilters, 
    toggleFilters, 
    handleClear, 
    hasActiveFilters 
  })
}
