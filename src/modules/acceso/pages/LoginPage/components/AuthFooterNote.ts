import { AuthFooterNoteView } from './AuthFooterNote.view'

export interface AuthFooterNoteProps {
  text?: string
}

export function AuthFooterNote({ text = '© 2026 Auth System. Todos los derechos reservados.' }: AuthFooterNoteProps) {
  return AuthFooterNoteView({ text })
}
