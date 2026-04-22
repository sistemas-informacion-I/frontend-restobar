// Main API exports - centralized re-exports for all services
// This file provides backward compatibility and a single import point

// Types
export * from '../models'

// Services
export { authService } from './auth.service'
export { usersService } from './users.service'
export { rolesService } from './roles.service'
export { permissionsService } from './permissions.service'
export { auditoriaService } from './auditoria.service'

export {sucursalService} from '../../operaciones/services/sucursal.service'
export {sectorService} from '../../operaciones/services/sector.service'
export {mesaService} from '../../operaciones/services/mesa.service'

// Error handling
export { ErrorHandler } from './error-handler'
export type { ApiError } from './http-client'

// Utility function for error messages
import { ErrorHandler } from './error-handler'
export const getErrorMessage = (error: unknown, context?: string): string => {
  return ErrorHandler.handle(error, context)
}
