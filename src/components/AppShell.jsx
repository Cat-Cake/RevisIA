import { Link, NavLink, Outlet } from 'react-router-dom'
import { LogoIcon, GridIcon, DocsIcon, ChartIcon, GearIcon } from './icons.jsx'
import './AppShell.css'

const items = [
  { to: '/app', label: 'Tableau de bord', icon: <GridIcon />, end: true },
  { to: '/app/documents', label: 'Mes documents', icon: <DocsIcon /> },
  { to: '/app/historique', label: 'Historique', icon: <ChartIcon /> },
  { to: '/app/parametres', label: 'Paramètres', icon: <GearIcon /> },
]

export default function AppShell() {
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
          <span className="avatar">LP</span>
          <div className="sidebar__usermeta">
            <span className="sidebar__username">Louis Petit</span>
            <span className="sidebar__usermail">louis@exemple.fr</span>
          </div>
        </div>
      </aside>

      <div className="content">
        <Outlet />
      </div>
    </div>
  )
}
