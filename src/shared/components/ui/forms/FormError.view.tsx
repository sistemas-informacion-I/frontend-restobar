import React from 'react'

interface FormErrorViewProps {
  error: string | string[] | null | undefined
  className: string
}

export const FormErrorView: React.FC<FormErrorViewProps> = ({ error, className }) => {
  if (!error) return null

  return (
    <ul className={`mt-2 text-sm space-y-1 text-red-400 ${className}`}>
      {typeof error === 'string' ? (
        <li>{error}</li>
      ) : Array.isArray(error) ? (
        error.map((err, idx) => <li key={idx}>{err}</li>)
      ) : null}
    </ul>
  )
}
