import { PasswordRulesView } from './PasswordRules.view'

export interface PasswordRulesProps {
  password?: string
}

export function PasswordRules({ password = '' }: PasswordRulesProps) {
  const rules = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
  }
  
  return PasswordRulesView({ rules })
}
