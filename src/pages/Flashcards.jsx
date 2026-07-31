import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDocument } from '../data/documents.js'
import './Flashcards.css'

export default function Flashcards() {
  const { id } = useParams()
  const doc = getDocument(id)
  const cards = doc.cards || []

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)

  const card = cards[index]
  const isLast = index === cards.length - 1
  const progress = Math.round(((index + (done ? 1 : 0)) / cards.length) * 100)

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

  return (
    <>
      <header className="topbar">
        <div className="topbar__crumb">
          <Link to={`/app/documents/${doc.id}`} className="crumb">{doc.name}</Link>
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
              <Link to={`/app/documents/${doc.id}`} className="btn btn--ghost">Retour au document</Link>
            </div>
          </div>
        ) : (
          <div className="flash__stage">
            <span className="flash__label">{doc.subject} · {doc.name}</span>

            <button
              className={`card3d${flipped ? ' is-flipped' : ''}`}
              onClick={() => setFlipped((f) => !f)}
              aria-label="Retourner la carte"
            >
              <span className="card3d__face card3d__front">
                <span className="card3d__tag">Question</span>
                <span className="card3d__text">{card.q}</span>
                <span className="card3d__hint">Clique pour voir la réponse</span>
              </span>
              <span className="card3d__face card3d__back">
                <span className="card3d__tag">Réponse</span>
                <span className="card3d__text">{card.a}</span>
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
