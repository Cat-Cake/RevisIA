import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

// notify({ type, title, message, duration }) → id | update(id, {...}) | dismiss(id)
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast doit être utilisé dans un <ToastProvider>.')
  return ctx
}
