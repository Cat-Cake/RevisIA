import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { documentService } from '../services/documentService.js'
import { generationService } from '../services/generationService.js'
import { ApiError } from '../services/apiClient.js'
import './Flashcards.css'

function cardQuestion(c) {
  return c.question || c.q || c.recto
}

function cardAnswer(c) {
  return c.reponse || c.a || c.verso
}

export default function Flashcards() {
  const { id } = useParams()
  const [docName, setDocName] = useState('')
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    documentService.getById(id)
      .then((doc) => setDocName(doc.nom || doc.titre || doc.name || ''))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    generationService.getFlashcards(id)
      .then((data) => { if (!cancelled) setCards(data.flashcards || data || []) })
      .catch(async (err) => {
        if (err instanceof ApiError && err.status === 404) {
          try {
            const data = await generationService.generateFlashcards(id)
            if (!cancelled) setCards(data.flashcards || data || [])
            return
          } catch (genErr) {
            if (!cancelled) setError(genErr.message || 'Impossible de générer les flashcards.')
            return
          }
        }
        if (!cancelled) setError(err.message || 'Impossible de charger les flashcards.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const card = cards[index]
  const isLast = index === cards.length - 1
  const progress = cards.length ? Math.round(((index + (done ? 1 : 0)) / cards.length) * 100) : 0

  function advance() {
    if (isLast) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setFlipped(false)
  }

  function restart() {
    setIndex(0)
    setFlipped(false)
    setDone(false)
  }

  if (loading) return <p className="detail__status">Chargement des flashcards…</p>
  if (error) return <p className="detail__status detail__status--error">{error}</p>
  if (cards.length === 0) return <p className="detail__status">Aucune flashcard disponible.</p>

  return (
    <>
      <header className="topbar">
        <div className="topbar__crumb">
          <Link to={`/app/documents/${id}`} className="crumb">{docName}</Link>
          <span className="crumb__sep">/</span>
          <h1>Flashcards</h1>
        </div>
      </header>

      <div className="flash">
        {done ? (
          <div className="flash__done">
            <div className="flash__done-badge">✓</div>
            <h2>Série terminée !</h2>
            <p>Tu as parcouru les {cards.length} cartes de ce cours.</p>
            <div className="flash__done-actions">
              <button className="btn btn--primary" onClick={restart}>Recommencer</button>
              <Link to={`/app/documents/${id}`} className="btn btn--ghost">Retour au document</Link>
            </div>
          </div>
        ) : (
          <div className="flash__stage">
            <span className="flash__label">{docName}</span>

            <button
              className={`card3d${flipped ? ' is-flipped' : ''}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label="Retourner la carte"
            >
              <span className="card3d__face card3d__front">
                <span className="card3d__tag">Question</span>
                <span className="card3d__text">{cardQuestion(card)}</span>
                <span className="card3d__hint">Clique pour voir la réponse</span>
              </span>
              <span className="card3d__face card3d__back">
                <span className="card3d__tag">Réponse</span>
                <span className="card3d__text">{cardAnswer(card)}</span>
                <span className="card3d__hint">Clique pour revoir la question</span>
              </span>
            </button>

            <span className="flash__count">Carte {index + 1} sur {cards.length}</span>

            <div className="flash__actions">
              <button className="btn btn--ghost flash__btn flash__btn--review" onClick={advance}>
                À revoir
              </button>
              <button className="btn flash__btn flash__btn--ok" onClick={advance}>
                Acquise
              </button>
            </div>

            <div className="flash__progress">
              <span className="flash__progress-fill" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
