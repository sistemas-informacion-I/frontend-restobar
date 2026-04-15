import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/Card'
import { AuthFormCardProps } from './AuthFormCard'

export function AuthFormCardView({
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthFormCardProps) {
  return (
    <Card className="glass-card rounded-[2.5rem] border-2 border-wine-100/50 shadow-2xl shadow-wine-900/5 overflow-hidden">
      <CardHeader className="pt-10 px-8 pb-4">
        <h2 className="mb-2 text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wine-900/40 dark:text-wine-400/40 leading-relaxed">{description}</p>
      </CardHeader>

      <CardContent className="px-8 py-6">{children}</CardContent>

      <CardFooter className="px-8 pb-10 pt-4 bg-wine-50/20 dark:bg-black/20 border-t border-wine-100/30 dark:border-wine-900/10">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {footerText}{' '}
          <Link
            to={footerLinkTo}
            className="text-wine-700 hover:text-wine-900 dark:text-wine-300 dark:hover:text-white transition-all underline underline-offset-4 decoration-2 decoration-wine-500/30 hover:decoration-wine-500"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
