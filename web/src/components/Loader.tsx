import { cn } from '@/utils/styles'

interface LoaderProps {
  className?: string
  'data-style'?: 'accent' | null
}

export default function Loader({ className, 'data-style': style }: LoaderProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="loader" data-style={style}></div>
    </div>
  )
}
