import { useEffect, useState } from 'react'
import { BellIcon, FileIcon } from '../components/icons.jsx'
import { resultService } from '../services/resultService.js'
import './History.css'

function scoreTone(s) {
  if (s >= 85) return 'ok'
  if (s >= 70) return 'progress'
  return 'low'
}

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function History() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    resultService.list()
      .then((data) => { if (!cancelled) setResults(Array.isArray(data) ? data : data?.results || []) })
      .catch((err) => { if (!cancelled) setError(err.message || "Impossible de charger l'historique.") })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const scores = results.map((r) => r.score ?? 0)
  const stats = [
    { value: results.length, label: 'Quiz terminés' },
    { value: `${scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0} %`, label: 'Score moyen' },
    { value: `${scores.length ? Math.max(...scores) : 0} %`, label: 'Meilleur score' },
  ]

  return (
    <>
      <header className="topbar">
        <div>
          <h1>Historique</h1>
          <p>Retrouve tes quiz passés et ta progression.</p>
        </div>
        <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
      </header>

      <div className="history">
        {loading && <p>Chargement…</p>}
        {error && <p className="history__error">{error}</p>}

        {!loading && !error && (
          <>
            <section className="hist-stats">
              {stats.map((s) => (
                <article className="hist-stat" key={s.label}>
                  <span className="hist-stat__value">{s.value}</span>
                  <span className="hist-stat__label">{s.label}</span>
                </article>
              ))}
            </section>

            <section className="panel hist-table-wrap">
              <table className="hist-table">
                <thead>
                  <tr>
                    <th>Document</th>
                    <th>Date</th>
                    <th className="ta-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {results.length === 0 && (
                    <tr><td colSpan={3}>Aucun quiz réalisé pour l'instant.</td></tr>
                  )}
                  {results.map((h) => (
                    <tr key={h.id}>
                      <td>
                        <div className="hist-doc">
                          <span className="hist-doc__icon"><FileIcon /></span>
                          <span className="hist-doc__name">{h.document_nom || h.document?.nom || h.doc}</span>
                        </div>
                      </td>
                      <td className="hist-muted">{formatDate(h.date || h.created_at || h.date_creation)}</td>
                      <td className="ta-right">
                        <span className={`score score--${scoreTone(h.score ?? 0)}`}>{h.score ?? 0} %</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </>
        )}
      </div>
    </>
  )
}
