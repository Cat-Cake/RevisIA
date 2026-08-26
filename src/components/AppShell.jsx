import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogoIcon, GridIcon, DocsIcon, ChartIcon, GearIcon } from './icons.jsx'
import { authService } from '../services/authService.js'
import './AppShell.css'

const items = [
  { to: '/app', label: 'Tableau de bord', icon: <GridIcon />, end: true },
  { to: '/app/documents', label: 'Mes documents', icon: <DocsIcon /> },
  { to: '/app/historique', label: 'Historique', icon: <ChartIcon /> },
  { to: '/app/parametres', label: 'Paramètres', icon: <GearIcon /> },
]

function initials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

export default function AppShell() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    authService.me()
      .then((data) => { if (!cancelled) setUser(data) })
      .catch(() => { if (!cancelled) navigate('/connexion') })
    return () => { cancelled = true }
  }, [navigate])

  async function handleLogout() {
    try {
      await authService.logout()
    } finally {
      navigate('/connexion')
    }
  }

  const name = user?.nom || user?.name
  const email = user?.email

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link to="/app" className="sidebar__brand">
          <span className="sidebar__mark"><LogoIcon /></span>
          <span>RévisIA</span>
        </Link>

        <nav className="sidebar__nav">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) => `sidebar__link${isActive ? ' is-active' : ''}`}
            >
              <span className="sidebar__icon">{it.icon}</span>
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__user">
          <span className="avatar">{initials(name)}</span>
          <div className="sidebar__usermeta">
            <span className="sidebar__username">{name || 'Mon compte'}</span>
            <span className="sidebar__usermail">{email || ''}</span>
          </div>
          <button type="button" className="sidebar__logout" onClick={handleLogout} aria-label="Se déconnecter">
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
