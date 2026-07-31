import { Link } from 'react-router-dom'
import { BellIcon, PlusIcon, DotsIcon, FileIcon } from '../components/icons.jsx'
import './Documents.css'

const docs = [
  { id: 'fonctions-derivees', name: 'Les fonctions dérivées.pdf', meta: 'Mathématiques · 18 pages', progress: 100, status: 'Terminé', tone: 'ok', color: 'a' },
  { id: 'seconde-guerre-mondiale', name: 'La Seconde Guerre mondiale.pdf', meta: 'Histoire · 32 pages', progress: 60, status: 'En cours', tone: 'progress', color: 'b' },
  { name: 'Phrasal verbs — cours anglais.pdf', meta: 'Anglais · 12 pages', progress: 40, status: 'En cours', tone: 'progress', color: 'c' },
  { name: 'La photosynthèse.pdf', meta: 'SVT · 9 pages', progress: 0, status: 'À réviser', tone: 'todo', color: 'd' },
  { name: "L'accord du participe passé.pdf", meta: 'Français · 6 pages', progress: 100, status: 'Terminé', tone: 'ok', color: 'e' },
]

export default function Documents() {
  return (
    <>
      <header className="topbar">
        <div>
          <h1>Mes documents</h1>
          <p>Tous tes cours importés, prêts à réviser.</p>
        </div>
        <div className="topbar__actions">
          <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
          <button className="btn btn--primary btn--sm">
            <PlusIcon /> Importer un PDF
          </button>
        </div>
      </header>

      <div className="docs">
        <div className="docs__grid">
          {docs.map((d) => (
            <article className="doc-card" key={d.name}>
              <div className="doc-card__head">
                <span className={`doc-card__thumb doc-card__thumb--${d.color}`}>
                  <FileIcon />
                </span>
                <span className={`badge badge--${d.tone}`}>{d.status}</span>
              </div>

              <h3 className="doc-card__name">{d.name}</h3>
              <p className="doc-card__meta">{d.meta}</p>

              <div className="doc-card__progress">
                <div className="progress">
                  <span className="progress__bar" style={{ width: `${d.progress}%` }} />
                </div>
                <span className="doc-card__pct">{d.progress}%</span>
              </div>

              <div className="doc-card__foot">
                {d.id ? (
                  <Link to={`/app/documents/${d.id}`} className="btn btn--primary btn--sm doc-card__cta">
                    {d.progress === 100 ? 'Revoir' : 'Réviser'}
                  </Link>
                ) : (
                  <button className="btn btn--primary btn--sm doc-card__cta">
                    {d.progress === 100 ? 'Revoir' : 'Réviser'}
                  </button>
                )}
                <button className="iconbtn iconbtn--sm" aria-label="Options"><DotsIcon /></button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
