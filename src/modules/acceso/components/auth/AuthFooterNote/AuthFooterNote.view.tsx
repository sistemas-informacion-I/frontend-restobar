import { AuthFooterNoteProps } from './AuthFooterNote'

export function AuthFooterNoteView({ text }: AuthFooterNoteProps) {
  return <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40">{text}</p>
}
