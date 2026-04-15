import { PasswordRulesView } from './PasswordRules.view'

export interface PasswordRulesProps {
  password?: string
}

export function PasswordRules({ password = '' }: PasswordRulesProps) {
  const rules = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password)
  }
  
  return PasswordRulesView({ rules })
}
