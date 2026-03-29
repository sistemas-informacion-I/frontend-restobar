import React, { HTMLAttributes } from 'react'

interface FormErrorProps extends HTMLAttributes<HTMLUListElement> {
  messages?: string | string[] | null
}

export const FormError: React.FC<FormErrorProps> = ({
  messages,
  className = '',
  ...props
}) => {
  if (!messages) return null

  const messageArray = typeof messages === 'string' ? [messages] : messages || []
  if (messageArray.length === 0) return null

  return (
    <ul
      className={`mt-2 text-sm space-y-1 text-red-400 ${className}`}
      {...props}
    >
      {messageArray.map((message, idx) => (
        <li key={idx}>{message}</li>
      ))}
    </ul>
  )
}
