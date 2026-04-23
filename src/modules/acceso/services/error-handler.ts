import type { ApiError } from './http-client'

// Re-export ApiError type for convenience
export type { ApiError } from './http-client'

export class ErrorHandler {
  private static withContext(message: string, context?: string): string {
    if (!context) return message
    return `No fue posible ${context}: ${message}`
  }

  private static normalizeMessage(message: string): string {
    const lower = message.toLowerCase()

    if (
      (lower.includes('correo') || lower.includes('email')) &&
      (lower.includes('no registrado') || lower.includes('no existe') || lower.includes('not registered') || lower.includes('not found'))
    ) {
      return 'No encontramos una cuenta con ese correo.'
    }

    if (lower.includes('email') && (lower.includes('exist') || lower.includes('already'))) {
      return 'Este correo ya está registrado. Usa otro correo o inicia sesión.'
    }

    if (lower.includes('correo') && lower.includes('registrado')) {
      return 'Este correo ya está registrado. Usa otro correo o inicia sesión.'
    }

    if (lower.includes('invalid credentials') || lower.includes('credenciales')) {
      return 'Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.'
    }

    if (lower.includes('bloqueada') || lower.includes('locked')) {
      return 'Tu cuenta está temporalmente bloqueada.'
    }

    if (lower.includes('suspendida') || lower.includes('suspended')) {
      return 'Tu cuenta ha sido suspendida. Contacta con soporte.'
    }

    if (lower.includes('incorrect password') || lower.includes('contraseña incorrecta')) {
      return 'La contraseña es incorrecta. Intenta nuevamente.'
    }

    if (lower.includes('unauthorized')) {
      return 'No autorizado.'
    }

    if (lower.includes('name') && lower.includes('required')) {
      return 'El nombre es obligatorio.'
    }

    if (lower.includes('email') && lower.includes('required')) {
      return 'El correo electrónico es obligatorio.'
    }

    if (lower.includes('password') && lower.includes('required')) {
      return 'La contraseña es obligatoria.'
    }

    if (lower.includes('password') && lower.includes('at least')) {
      return 'La contraseña debe tener al menos 8 caracteres.'
    }

    if (lower.includes('password') && lower.includes('weak')) {
      return 'La contraseña es débil. Usa al menos 8 caracteres, incluyendo un número.'
    }

    if (lower.includes('role') && lower.includes('required')) {
      return 'Debes seleccionar al menos un rol.'
    }

    if (lower.includes('permission') && lower.includes('required')) {
      return 'Debes seleccionar al menos un permiso.'
    }

    if (lower.includes('ci') && (lower.includes('registrado') || lower.includes('exist') || lower.includes('already'))) {
      return 'Este número de CI ya está registrado en el sistema.'
    }

    if (lower.includes('salario') && lower.includes('obligatorio')) {
      return 'El salario es un campo obligatorio.'
    }

    if (lower.includes('código') && lower.includes('registrado')) {
      return 'Este código de empleado ya está asignado.'
    }

    if (lower.includes('not found')) {
      return 'No encontramos la información solicitada.'
    }

    if (lower.includes('token') && (lower.includes('invalid') || lower.includes('expired'))) {
      return 'El enlace o token ya no es válido. Solicita uno nuevo.'
    }

    return message
  }

  static handle(error: unknown, context?: string): string {
    if (error && typeof error === 'object' && 'code' in error) {
      const apiError = error as ApiError

      if (apiError.code === 'NETWORK_ERROR') {
        return this.withContext(
          'No pudimos conectarnos al servidor. Revisa tu internet e intenta otra vez.',
          context
        )
      }

      if (apiError.code === 'UNAUTHORIZED') {
        const normalized = this.normalizeMessage(apiError.message || '')
        const lower = (apiError.message || '').toLowerCase()

        if (
          normalized &&
          normalized !== 'No autorizado.' &&
          normalized !== 'Ha ocurrido un error inesperado.'
        ) {
          return this.withContext(normalized, context)
        }

        if (
          lower.includes('expired') ||
          lower.includes('session') ||
          lower.includes('sesión')
        ) {
          return this.withContext(
            'Tu sesión expiró. Inicia sesión nuevamente para continuar.',
            context
          )
        }

        return this.withContext(
          'No autorizado. Verifica tus credenciales e intenta de nuevo.',
          context
        )
      }

      if (apiError.code === 'ACCOUNT_LOCKED') {
        const normalized = this.normalizeMessage(apiError.message || '')
        return this.withContext(
          normalized || 'Demasiados intentos fallidos. Por favor, intenta de nuevo en unos minutos.',
          context
        )
      }

      if (apiError.code === 'FORBIDDEN') {
        return this.withContext('No tienes permisos para realizar esta acción.', context)
      }

      if (apiError.code === 'VALIDATION_ERROR') {
        if (apiError.details && apiError.details.length > 0) {
          const details = apiError.details.slice(0, 2).map((detail) => this.normalizeMessage(detail)).join(' ')
          return this.withContext(`Revisa estos campos: ${details}`, context)
        }
        return this.withContext(this.normalizeMessage(apiError.message), context)
      }

      return this.withContext(this.normalizeMessage(apiError.message), context)
    }

    if (error instanceof Error) {
      return this.withContext(this.normalizeMessage(error.message), context)
    }

    if (context) {
      return `No fue posible ${context}. Intenta nuevamente.`
    }

    return 'Ha ocurrido un error inesperado.'
  }

  static isUnauthorized(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      return (error as ApiError).code === 'UNAUTHORIZED'
    }
    return false
  }

  static isForbidden(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      return (error as ApiError).code === 'FORBIDDEN'
    }
    return false
  }

  static isValidationError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      return (error as ApiError).code === 'VALIDATION_ERROR'
    }
    return false
  }

  static isLockoutError(error: unknown): boolean {
    if (error && typeof error === 'object' && 'code' in error) {
      return (error as ApiError).code === 'ACCOUNT_LOCKED'
    }
    return false
  }

  static getLockoutUntil(error: unknown): Date | null {
    if (this.isLockoutError(error)) {
      const apiError = error as ApiError
      if (apiError.metadata?.lockedUntil) {
        return new Date(apiError.metadata.lockedUntil)
      }
    }
    return null
  }
}