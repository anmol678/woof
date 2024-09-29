'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export type AlertType = 'success' | 'error' | 'info'

interface Alert {
  type: AlertType
  message: string
  duration: number
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (type: AlertType, message: string, duration?: number) => void // Update addAlert signature
  removeAlert: (index: number) => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const addAlert = useCallback((type: AlertType, message: string, duration = 4000) => {
    const newAlert = { type, message, duration }
    setAlerts((prevAlerts) => [...prevAlerts, newAlert])

    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert !== newAlert))
    }, duration)
  }, [])

  const removeAlert = useCallback((index: number) => {
    setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index))
  }, [])

  return <AlertContext.Provider value={{ alerts, addAlert, removeAlert }}>{children}</AlertContext.Provider>
}

export const useAlerts = () => {
  const context = useContext(AlertContext)
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider')
  }
  return context
}
