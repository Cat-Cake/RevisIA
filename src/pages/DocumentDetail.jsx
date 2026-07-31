import { Link, useParams } from 'react-router-dom'
import { BellIcon, FileIcon, CardsIcon, CheckIcon, SparkIcon } from '../components/icons.jsx'
import { getDocument } from '../data/documents.js'
import './DocumentDetail.css'

export default function DocumentDetail() {
  const { id } = useParams()
  const doc = getDocument(id)

  return (
    <>
      <header className="topbar">
        <div className="topbar__crumb">
          <Link to="/app/documents" className="crumb">Mes documents</Link>
          <span className="crumb__sep">/</span>
          <h1>{doc.name}</h1>
        </div>
        <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
      </header>

      <div className="detail">
        <div className="detail__grid">
          <div className="detail__main">
            {/* En-tête document */}
            <section className="doc-hero">
              <span className={`doc-hero__thumb doc-hero__thumb--${doc.color}`}><FileIcon /></span>
              <div className="doc-hero__meta">
                <h2>{doc.name}</h2>
                <p>{doc.subject} · {doc.pages} pages · Importé le 12 mars 2026</p>
                <div className="doc-hero__actions">
                  <Link to={`/app/documents/${doc.id}/quiz`} className="btn btn--primary btn--sm">Réviser</Link>
                  <button className="btn btn--ghost btn--sm">Télécharger</button>
                </div>
              </div>
            </section>

            {/* Résumé */}
            <section className="panel">
              <div className="panel__head"><h3>Résumé</h3></div>
              <p className="detail__summary">{doc.summary}</p>
            </section>

            {/* Cartes d'action */}
            <div className="detail__actions">
              <article className="action-card">
                <span className="action-card__icon"><CardsIcon /></span>
                <h4>Flashcards</h4>
                <p>{doc.flashcards} cartes générées pour t'entraîner.</p>
                <Link to={`/app/documents/${doc.id}/flashcards`} className="btn btn--ghost btn--sm action-card__cta">
                  Réviser
                </Link>
              </article>

              <article className="action-card action-card--accent">
                <span className="action-card__icon action-card__icon--accent"><CheckIcon /></span>
                <h4>Quiz</h4>
                <p>{doc.quizCount} questions pour tester tes connaissances.</p>
                <Link to={`/app/documents/${doc.id}/quiz`} className="btn btn--primary btn--sm action-card__cta">
                  Passer le quiz
                </Link>
              </article>
            </div>
          </div>

          {/* Panneau latéral : points clés */}
          <aside className="panel detail__aside">
            <div className="panel__head">
              <h3><span className="aside__spark"><SparkIcon /></span> Analyse IA</h3>
            </div>
            <ul className="keypoints">
              {doc.keyPoints.map((p, i) => (
                <li key={i}><span className="keypoints__dot" />{p}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  )
}
