'use client'

import { useAlerts } from '@/contexts/alert'
import Alert from '@/components/Alert'

export default function AlertDisplay() {
  const { alerts, removeAlert } = useAlerts()

  return (
    <div className="fixed right-4 top-8 z-50 space-y-2">
      {alerts.map((alert, index) => (
        <Alert
          key={index}
          type={alert.type}
          message={alert.message}
          onClose={() => removeAlert(index)}
          variant="toast"
        />
      ))}
    </div>
  )
}
