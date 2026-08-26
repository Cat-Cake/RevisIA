import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BellIcon, FileIcon, CardsIcon, CheckIcon, SparkIcon } from '../components/icons.jsx'
import { documentService } from '../services/documentService.js'
import { generationService } from '../services/generationService.js'
import { ApiError } from '../services/apiClient.js'
import './DocumentDetail.css'

export default function DocumentDetail() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    documentService.getById(id)
      .then((data) => { if (!cancelled) setDoc(data) })
      .catch((err) => { if (!cancelled) setError(err.message || 'Document introuvable.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    let cancelled = false
    setSummaryLoading(true)
    generationService.getSummary(id)
      .then((data) => { if (!cancelled) setSummary(data) })
      .catch(async (err) => {
        if (err instanceof ApiError && err.status === 404) {
          try {
            const data = await generationService.generateSummary(id)
            if (!cancelled) setSummary(data)
          } catch {
            // La génération a échoué, on laisse le panneau vide.
          }
        }
      })
      .finally(() => { if (!cancelled) setSummaryLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) return <p className="detail__status">Chargement…</p>
  if (error) return <p className="detail__status detail__status--error">{error}</p>
  if (!doc) return null

  const name = doc.nom || doc.titre || doc.name
  const shortSummary = summary?.resume_court || summary?.court || summary?.short
  const detailedSummary = summary?.resume_detaille || summary?.detaille || summary?.detailed
  const extractedText = doc.texte || doc.texte_extrait || doc.contenu

  return (
    <>
      <header className="topbar">
        <div className="topbar__crumb">
          <Link to="/app/documents" className="crumb">Mes documents</Link>
          <span className="crumb__sep">/</span>
          <h1>{name}</h1>
        </div>
        <button className="iconbtn" aria-label="Notifications"><BellIcon /></button>
      </header>

      <div className="detail">
        <div className="detail__grid">
          <div className="detail__main">
            {/* En-tête document */}
            <section className="doc-hero">
              <span className="doc-hero__thumb doc-hero__thumb--a"><FileIcon /></span>
              <div className="doc-hero__meta">
                <h2>{name}</h2>
                <div className="doc-hero__actions">
                  <Link to={`/app/documents/${id}/quiz`} className="btn btn--primary btn--sm">Réviser</Link>
                </div>
              </div>
            </section>

            {/* Résumé */}
            <section className="panel">
              <div className="panel__head"><h3>Résumé</h3></div>
              {summaryLoading && <p className="detail__summary">Génération du résumé…</p>}
              {!summaryLoading && shortSummary && <p className="detail__summary">{shortSummary}</p>}
              {!summaryLoading && !shortSummary && <p className="detail__summary">Résumé indisponible.</p>}
              {!summaryLoading && detailedSummary && (
                <details className="detail__summary-more">
                  <summary>Voir le résumé détaillé</summary>
                  <p className="detail__summary">{detailedSummary}</p>
                </details>
              )}
            </section>

            {/* Cartes d'action */}
            <div className="detail__actions">
              <article className="action-card">
                <span className="action-card__icon"><CardsIcon /></span>
                <h4>Flashcards</h4>
                <p>Génère des flashcards pour t'entraîner sur ce document.</p>
                <Link to={`/app/documents/${id}/flashcards`} className="btn btn--ghost btn--sm action-card__cta">
                  Réviser
                </Link>
              </article>

              <article className="action-card action-card--accent">
                <span className="action-card__icon action-card__icon--accent"><CheckIcon /></span>
                <h4>Quiz</h4>
                <p>Teste tes connaissances avec un quiz généré à partir de ce document.</p>
                <Link to={`/app/documents/${id}/quiz`} className="btn btn--primary btn--sm action-card__cta">
                  Passer le quiz
                </Link>
              </article>
            </div>
          </div>

          {/* Panneau latéral : texte extrait */}
          <aside className="panel detail__aside">
            <div className="panel__head">
              <h3><span className="aside__spark"><SparkIcon /></span> Texte extrait</h3>
            </div>
            <p className="detail__extract">
              {extractedText ? extractedText.slice(0, 800) : "Aucun texte extrait disponible."}
              {extractedText && extractedText.length > 800 ? '…' : ''}
            </p>
          </aside>
        </div>
      </div>
    </>
  )
}
