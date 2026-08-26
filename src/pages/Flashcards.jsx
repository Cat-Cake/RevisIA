import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { documentService } from '../services/documentService.js'
import { generationService } from '../services/generationService.js'
import './Flashcards.css'

const GENERATION_POLL_INTERVAL = 4000

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
  const [bgGenerating, setBgGenerating] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    documentService.getById(id)
      .then((data) => setDocName((data?.document ?? data)?.nom || ''))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    let stopped = false
    let timer = null
    setLoading(true)
    setError(null)

    function poll() {
      generationService.getFlashcards(id)
        .then((data) => {
          if (stopped) return
          setCards(data?.flashcards || [])
          setBgGenerating(!!data?.generationEnCours)
          if (data?.generationEnCours) {
            timer = setTimeout(poll, GENERATION_POLL_INTERVAL)
          }
        })
        .catch((err) => { if (!stopped) setError(err.message || 'Impossible de charger les flashcards.') })
        .finally(() => { if (!stopped) setLoading(false) })
    }

    poll()
    return () => { stopped = true; clearTimeout(timer) }
  }, [id])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const data = await generationService.generateFlashcards(id)
      setCards(data?.flashcards || [])
    } catch (err) {
      setError(err.message || 'Impossible de générer les flashcards.')
    } finally {
      setGenerating(false)
    }
  }

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

  if (cards.length === 0) {
    return (
      <div className="detail__status">
        {generating || bgGenerating ? (
          <p>Génération des flashcards en cours… cela peut prendre une minute.</p>
        ) : (
          <>
            <p>{error || "Aucune flashcard n'a encore été générée pour ce document."}</p>
            <button className="btn btn--primary btn--sm" onClick={handleGenerate}>
              {error ? 'Réessayer' : 'Générer les flashcards'}
            </button>
          </>
        )}
      </div>
    )
  }

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
