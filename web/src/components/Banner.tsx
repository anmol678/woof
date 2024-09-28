import { CircleCheck, CircleAlert } from 'lucide-react'

interface BannerProps {
  type: 'success' | 'error'
  message: string
}

export default function Banner({ type, message }: BannerProps) {
  const Icon = type === 'success' ? CircleCheck : CircleAlert
  return (
    <div className="banner" data-style={type} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    </div>
  )
}
