import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardFooter, CardHeader } from '@/shared/components/ui/Card'

interface AuthFormCardProps {
  title: string
  description: string
  footerText: string
  footerLinkLabel: string
  footerLinkTo: string
  children: ReactNode
}

export function AuthFormCard({
  title,
  description,
  footerText,
  footerLinkLabel,
  footerLinkTo,
  children,
}: AuthFormCardProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
      </CardHeader>

      <CardContent>{children}</CardContent>

      <CardFooter>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {footerText}{' '}
          <Link
            to={footerLinkTo}
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            {footerLinkLabel}
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
