import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DocsIcon, CheckIcon, ChartIcon, BellIcon, FileIcon } from '../components/icons.jsx'
import { dashboardService } from '../services/dashboardService.js'
import { documentService } from '../services/documentService.js'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentDocs, setRecentDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    Promise.all([dashboardService.getStats(), documentService.list()])
      .then(([statsData, docs]) => {
        if (cancelled) return
        setStats(statsData)
        setRecentDocs((Array.isArray(docs) ? docs : docs?.results || []).slice(0, 3))
      })
      .catch((err) => { if (!cancelled) setError(err.message || 'Impossible de charger le tableau de bord.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const statCards = stats ? [
    { icon: <DocsIcon />, value: stats.nb_documents ?? 0, label: 'Documents importés' },
    { icon: <CheckIcon />, value: stats.nb_quiz ?? 0, label: 'Quiz terminés' },
    { icon: <ChartIcon />, value: `${stats.score_moyen ?? 0} %`, label: 'Score moyen' },
  ] : []

  const activity = stats?.activite_recente ?? []
  const inProgress = recentDocs[0]

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Tableau de bord</h1>
          <p>Voici où en sont tes révisions.</p>
        </div>
        <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
      </header>

      <div className="dash">
        {loading && <p>Chargement…</p>}
        {error && <p className="dash__error">{error}</p>}

        {!loading && !error && (
          <>
            <section className="stat-cards">
              {statCards.map((s) => (
                <article className="stat-card" key={s.label}>
                  <span className="stat-card__icon">{s.icon}</span>
                  <span className="stat-card__value">{s.value}</span>
                  <span className="stat-card__label">{s.label}</span>
                </article>
              ))}
            </section>

            {inProgress && (
              <section className="resume">
                <div className="resume__text">
                  <h2>Reprends « {inProgress.nom || inProgress.titre || inProgress.name} »</h2>
                  <p>Continue là où tu t'es arrêté.</p>
                </div>
                <Link to={`/app/documents/${inProgress.id}`} className="btn btn--light">Continuer</Link>
              </section>
            )}

            <div className="dash__cols">
              <section className="panel">
                <div className="panel__head">
                  <h3>Mes documents récents</h3>
                  <Link to="/app/documents" className="panel__link">Voir tout</Link>
                </div>
                <ul className="doc-list">
                  {recentDocs.length === 0 && <li className="doc-row">Aucun document pour l'instant.</li>}
                  {recentDocs.map((d) => (
                    <li className="doc-row" key={d.id}>
                      <span className="doc-row__icon"><FileIcon /></span>
                      <div className="doc-row__meta">
                        <span className="doc-row__name">{d.nom || d.titre || d.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="panel">
                <div className="panel__head">
                  <h3>Dernières activités</h3>
                </div>
                <ul className="activity">
                  {activity.length === 0 && <li className="activity__row">Aucune activité récente.</li>}
                  {activity.map((a, i) => (
                    <li className="activity__row" key={i}>
                      <span className="activity__dot activity__dot--progress" />
                      <span>{a.description || a.message || a.text}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </>
        )}
      </div>
    </>
  )
}
