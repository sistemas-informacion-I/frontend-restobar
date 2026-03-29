interface AuthFooterNoteProps {
  text?: string
}

export function AuthFooterNote({ text = '© 2026 Auth System. Todos los derechos reservados.' }: AuthFooterNoteProps) {
  return <p className="text-center text-xs text-slate-500 dark:text-slate-400">{text}</p>
}
