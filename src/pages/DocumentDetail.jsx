import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FileIcon, CardsIcon, CheckIcon, SparkIcon } from '../components/icons.jsx'
import { documentService } from '../services/documentService.js'
import { generationService } from '../services/generationService.js'
import { useToast } from '../components/useToast.js'
import './DocumentDetail.css'
import NotificationBell from '../components/NotificationBell.jsx'

const GENERATION_POLL_INTERVAL = 5000

export default function DocumentDetail() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 'checking' | 'none' | 'generating' | 'ready' | 'error'
  const [summaryStatus, setSummaryStatus] = useState('checking')
  const [summaryError, setSummaryError] = useState(null)

  const { notify, update, dismiss } = useToast()
  // Notification persistante de la génération de fond (flashcards + quiz)
  const bgToastId = useRef(null)

  useEffect(() => {
    let stopped = false
    let timer = null
    setLoading(true)
    setError(null)

    function poll() {
      documentService.getById(id)
        .then((data) => {
          if (stopped) return
          const document = data?.document ?? data
          setDoc(document)
          if (document?.generationEnCours) {
            if (bgToastId.current === null) {
              bgToastId.current = notify({
                type: 'loading',
                title: 'Génération en cours…',
                message: `L'IA prépare les flashcards et le quiz de « ${document.nom || document.titre || document.name || 'ce document'} ».`,
                duration: 0,
              })
            }
            timer = setTimeout(poll, GENERATION_POLL_INTERVAL)
          } else if (bgToastId.current !== null) {
            update(bgToastId.current, {
              type: 'success',
              title: 'Génération terminée',
              message: 'Les flashcards et le quiz sont prêts.',
            })
            bgToastId.current = null
          }
        })
        .catch((err) => { if (!stopped) setError(err.message || 'Document introuvable.') })
        .finally(() => { if (!stopped) setLoading(false) })
    }

    poll()
    return () => {
      stopped = true
      clearTimeout(timer)
      // On quitte la page : la notification « en cours » n'a plus personne pour la conclure
      if (bgToastId.current !== null) {
        dismiss(bgToastId.current)
        bgToastId.current = null
      }
    }
  }, [id, notify, update, dismiss])

  useEffect(() => {
    let cancelled = false
    setSummaryStatus('checking')
    generationService.getSummary(id)
      .then((data) => {
        if (cancelled) return
        if (!data?.court && !data?.detaille) {
          setSummaryStatus('none')
        } else {
          setSummary(data)
          setSummaryStatus('ready')
        }
      })
      .catch((err) => {
        if (cancelled) return
        setSummaryError(err.message || 'Impossible de vérifier le résumé.')
        setSummaryStatus('error')
      })
    return () => { cancelled = true }
  }, [id])

  async function handleGenerateSummary() {
    setSummaryStatus('generating')
    setSummaryError(null)
    const toastId = notify({
      type: 'loading',
      title: 'Génération du résumé en cours…',
      message: 'Cela peut prendre une minute.',
      duration: 0,
    })
    try {
      const data = await generationService.generateSummary(id)
      setSummary(data)
      setSummaryStatus('ready')
      update(toastId, {
        type: 'success',
        title: 'Résumé généré',
        message: 'Le résumé de ce document est prêt à être consulté.',
      })
    } catch (err) {
      const message = err.message || 'La génération du résumé a échoué.'
      setSummaryError(message)
      setSummaryStatus('error')
      update(toastId, { type: 'error', title: 'Échec de la génération', message })
    }
  }

  if (loading) return <p className="detail__status">Chargement…</p>
  if (error) return <p className="detail__status detail__status--error">{error}</p>
  if (!doc) return null

  const name = doc.nom || doc.titre || doc.name
  const shortSummary = summary?.court?.contenu
  const detailedSummary = summary?.detaille?.contenu
  const extractedText = doc.texte || doc.texte_extrait || doc.contenu

  return (
    <>
      <header className="topbar">
        <div className="topbar__crumb">
          <Link to="/app/documents" className="crumb">Mes documents</Link>
          <span className="crumb__sep">/</span>
          <h1>{name}</h1>
        </div>
        <NotificationBell />
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

              {summaryStatus === 'checking' && (
                <p className="detail__summary">Vérification du résumé…</p>
              )}

              {summaryStatus === 'none' && (
                <div className="detail__summary">
                  <p>Aucun résumé n'a encore été généré pour ce document.</p>
                  <button className="btn btn--primary btn--sm" onClick={handleGenerateSummary}>
                    <SparkIcon /> Générer le résumé
                  </button>
                </div>
              )}

              {summaryStatus === 'generating' && (
                <p className="detail__summary">Génération du résumé en cours… cela peut prendre une minute.</p>
              )}

              {summaryStatus === 'error' && (
                <div className="detail__summary">
                  <p className="detail__status--error">{summaryError}</p>
                  <button className="btn btn--ghost btn--sm" onClick={handleGenerateSummary}>Réessayer</button>
                </div>
              )}

              {summaryStatus === 'ready' && (
                <>
                  <p className="detail__summary">{shortSummary || 'Résumé indisponible.'}</p>
                  {detailedSummary && (
                    <details className="detail__summary-more">
                      <summary>Voir le résumé détaillé</summary>
                      <p className="detail__summary">{detailedSummary}</p>
                    </details>
                  )}
                </>
              )}
            </section>

            {doc.generationEnCours && (
              <p className="detail__status">
                Les flashcards et le quiz sont en cours de génération par l'IA…
              </p>
            )}

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
