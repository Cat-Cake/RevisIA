import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckIcon, SparkIcon } from './icons.jsx'
import { ToastContext } from './useToast.js'
import './Toast.css'

const DEFAULT_DURATION = 5000
const HISTORY_LIMIT = 30

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  // Historique complet consultable depuis la cloche de la navbar (les toasts flottants
  // finissent toujours par disparaître, l'historique lui reste tant qu'on ne le vide pas)
  const [history, setHistory] = useState([])
  const timers = useRef(new Map())
  const nextId = useRef(1)

  const dismiss = useCallback((id) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
    setHistory((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const schedule = useCallback((id, duration) => {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    // duration = 0 → notification persistante (génération en cours)
    if (!duration) return
    timers.current.set(id, setTimeout(() => dismiss(id), duration))
  }, [dismiss])

  // notify({ type, title, message, duration }) → id, pour pouvoir la mettre à jour ensuite
  const notify = useCallback(({ type = 'info', title, message, duration = DEFAULT_DURATION }) => {
    const id = nextId.current++
    const entry = { id, type, title, message, createdAt: Date.now(), read: false }
    setToasts((prev) => [...prev, entry])
    setHistory((prev) => [entry, ...prev].slice(0, HISTORY_LIMIT))
    schedule(id, duration)
    return id
  }, [schedule])

  // Remplace le contenu d'une notification existante (ex : « en cours » → « terminé »)
  const update = useCallback((id, { type, title, message, duration = DEFAULT_DURATION }) => {
    let found = false
    const patch = (t) => {
      if (t.id !== id) return t
      found = true
      return { ...t, type: type ?? t.type, title: title ?? t.title, message: message ?? t.message, createdAt: Date.now(), read: false }
    }
    setToasts((prev) => prev.map(patch))
    // La notif conclue remonte en tête de l'historique et redevient non-lue
    setHistory((prev) => {
      const existing = prev.find((t) => t.id === id)
      if (!existing) return prev
      return [patch(existing), ...prev.filter((t) => t.id !== id)].slice(0, HISTORY_LIMIT)
    })
    schedule(id, duration)
    return found
  }, [schedule])

  const markAllRead = useCallback(() => {
    setHistory((prev) => prev.map((t) => (t.read ? t : { ...t, read: true })))
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const unreadCount = history.filter((t) => !t.read).length

  const value = useMemo(
    () => ({ notify, update, dismiss, history, unreadCount, markAllRead, clearHistory }),
    [notify, update, dismiss, history, unreadCount, markAllRead, clearHistory],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toasts" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <span className="toast__icon">
              {t.type === 'loading' && <span className="toast__spinner" />}
              {t.type === 'success' && <CheckIcon />}
              {t.type === 'error' && <span className="toast__bang">!</span>}
              {t.type === 'info' && <SparkIcon />}
            </span>
            <div className="toast__body">
              <strong className="toast__title">{t.title}</strong>
              {t.message && <span className="toast__message">{t.message}</span>}
            </div>
            <button
              type="button"
              className="toast__close"
              aria-label="Fermer la notification"
              onClick={() => dismiss(t.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
