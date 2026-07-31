import { Link, NavLink } from 'react-router-dom'
import { LogoIcon } from './icons.jsx'

const links = [
  { label: 'Fonctionnalités', to: '/fonctionnalites' },
  { label: 'Comment ça marche', to: '/comment-ca-marche' },
  { label: 'Tarifs', to: '/tarifs' },
]

export default function Nav() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <Link to="/" className="brand">
          <span className="brand__mark"><LogoIcon /></span>
          <span className="brand__name">RévisIA</span>
        </Link>
        <nav className="nav__links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/connexion" className="btn btn--primary btn--sm">Se connecter</Link>
      </div>
    </header>
  )
}
