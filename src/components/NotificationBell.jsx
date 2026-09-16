import { useEffect, useRef, useState } from 'react'
import { BellIcon, CheckIcon, SparkIcon } from './icons.jsx'
import { useToast } from './useToast.js'
import './NotificationBell.css'

function timeAgo(timestamp) {
  const seconds = Math.round((Date.now() - timestamp) / 1000)
  if (seconds < 10) return "à l'instant"
  if (seconds < 60) return `il y a ${seconds} s`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `il y a ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  return `il y a ${days} j`
}

export default function NotificationBell() {
  const { history, unreadCount, markAllRead, clearHistory, dismiss } = useToast()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  // Ferme le panneau au clic extérieur ou à l'échap
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function toggle() {
    setOpen((prev) => {
      const next = !prev
      if (next) markAllRead()
      return next
    })
  }

  return (
    <div className="notif-bell" ref={rootRef}>
      <button
        type="button"
        className="iconbtn notif-bell__trigger"
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="notif-bell__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-bell__panel" role="menu">
          <div className="notif-bell__head">
            <h4>Notifications</h4>
            {history.length > 0 && (
              <button type="button" className="notif-bell__clear" onClick={clearHistory}>
                Tout effacer
              </button>
            )}
          </div>

          <div className="notif-bell__list">
            {history.length === 0 && (
              <p className="notif-bell__empty">Aucune notification pour le moment.</p>
            )}
            {history.map((n) => (
              <div key={n.id} className={`notif-item notif-item--${n.type}`}>
                <span className="notif-item__icon">
                  {n.type === 'loading' && <span className="notif-item__spinner" />}
                  {n.type === 'success' && <CheckIcon />}
                  {n.type === 'error' && <span className="notif-item__bang">!</span>}
                  {n.type === 'info' && <SparkIcon />}
                </span>
                <div className="notif-item__body">
                  <strong className="notif-item__title">{n.title}</strong>
                  {n.message && <span className="notif-item__message">{n.message}</span>}
                  <span className="notif-item__time">{timeAgo(n.createdAt)}</span>
                </div>
                <button
                  type="button"
                  className="notif-item__close"
                  aria-label="Supprimer la notification"
                  onClick={() => dismiss(n.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
