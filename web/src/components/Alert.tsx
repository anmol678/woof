import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { AlertType } from '@/contexts/alert'

interface AlertProps {
  type: AlertType
  message: string | undefined
  onClose?: () => void
  variant?: 'inline' | 'toast'
}

export default function Alert({ type, message, onClose, variant = 'inline' }: AlertProps) {
  const Icon = {
    success: CheckCircleIcon,
    error: ExclamationTriangleIcon,
    info: InformationCircleIcon
  }[type]
  return (
    <div className="alert" data-type={type} data-variant={variant}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6" />
        </div>
        <div className="mx-3">
          <p className="text-md font-medium">{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-3 ml-auto inline-flex items-center p-1">
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}
