import { Link } from 'react-router-dom'
import { DocsIcon, CheckIcon, ChartIcon, CardsIcon, BellIcon, FileIcon } from '../components/icons.jsx'
import './Dashboard.css'

const stats = [
  { icon: <DocsIcon />, value: '5', label: 'Documents importés' },
  { icon: <CheckIcon />, value: '4', label: 'Quiz terminés' },
  { icon: <ChartIcon />, value: '86 %', label: 'Taux de réussite' },
  { icon: <CardsIcon />, value: '4', label: 'Séries de flashcards' },
]

const recent = [
  { name: 'Les fonctions dérivées.pdf', meta: 'Mathématiques · 18 pages', status: 'Terminé', tone: 'ok' },
  { name: 'La Seconde Guerre mondiale.pdf', meta: 'Histoire · 32 pages', status: 'En cours', tone: 'progress' },
  { name: 'Phrasal verbs — cours anglais.pdf', meta: 'Anglais · 12 pages', status: 'En cours', tone: 'progress' },
]

const activity = [
  { dot: 'ok', text: 'Quiz terminé — Les fonctions dérivées (92 %)' },
  { dot: 'coral', text: 'Quiz personnalisé — La Seconde Guerre mondiale' },
  { dot: 'progress', text: 'Flashcards révisées — La Seconde Guerre mondiale' },
  { dot: 'ok', text: 'Quiz terminé — Les fonctions dérivées (86 %)' },
]

export default function Dashboard() {
  return (
    <>
      <header className="topbar">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bonjour Louis, voici où en sont tes révisions.</p>
        </div>
        <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
      </header>

      <div className="dash">
        <section className="stat-cards">
          {stats.map((s) => (
            <article className="stat-card" key={s.label}>
              <span className="stat-card__icon">{s.icon}</span>
              <span className="stat-card__value">{s.value}</span>
              <span className="stat-card__label">{s.label}</span>
            </article>
          ))}
        </section>

        <section className="resume">
          <div className="resume__text">
            <h2>Reprends « Les fonctions dérivées.pdf »</h2>
            <p>Il te reste 8 flashcards à revoir avant ton prochain quiz.</p>
          </div>
          <Link to="/app/documents" className="btn btn--light">Continuer</Link>
        </section>

        <div className="dash__cols">
          <section className="panel">
            <div className="panel__head">
              <h3>Mes documents récents</h3>
              <Link to="/app/documents" className="panel__link">Voir tout</Link>
            </div>
            <ul className="doc-list">
              {recent.map((d) => (
                <li className="doc-row" key={d.name}>
                  <span className="doc-row__icon"><FileIcon /></span>
                  <div className="doc-row__meta">
                    <span className="doc-row__name">{d.name}</span>
                    <span className="doc-row__sub">{d.meta}</span>
                  </div>
                  <span className={`badge badge--${d.tone}`}>{d.status}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <div className="panel__head">
              <h3>Dernières activités</h3>
            </div>
            <ul className="activity">
              {activity.map((a, i) => (
                <li className="activity__row" key={i}>
                  <span className={`activity__dot activity__dot--${a.dot}`} />
                  <span>{a.text}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  )
}
