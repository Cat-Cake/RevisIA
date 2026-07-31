import { BellIcon, FileIcon } from '../components/icons.jsx'
import { history, historyStats } from '../data/documents.js'
import './History.css'

function scoreTone(s) {
  if (s >= 85) return 'ok'
  if (s >= 70) return 'progress'
  return 'low'
}

export default function History() {
  const stats = [
    { value: historyStats.completed, label: 'Quiz terminés' },
    { value: `${historyStats.average} %`, label: 'Score moyen' },
    { value: `${historyStats.best} %`, label: 'Meilleur score' },
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
                <th>Catégorie</th>
                <th>Date</th>
                <th className="ta-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>
                    <div className="hist-doc">
                      <span className="hist-doc__icon"><FileIcon /></span>
                      <span className="hist-doc__name">{h.doc}</span>
                    </div>
                  </td>
                  <td className="hist-muted">{h.subject}</td>
                  <td className="hist-muted">{h.date}</td>
                  <td className="ta-right">
                    <span className={`score score--${scoreTone(h.score)}`}>{h.score} %</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </>
  )
}
