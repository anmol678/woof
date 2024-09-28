import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/utils/styles'
import Loader from '@/components/Loader'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  'data-style'?: 'primary' | 'secondary' | 'action' | 'danger'
}

export default function Button({ className, isLoading, ...props }: ButtonProps) {
  return (
    <button className={cn('button', className)} {...props} disabled={isLoading}>
      {props.children}
      {isLoading && <Loader className="absolute right-4" />}
    </button>
  )
}
