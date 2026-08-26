import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { documentService } from '../services/documentService.js'
import { generationService } from '../services/generationService.js'
import { ApiError } from '../services/apiClient.js'
import { TickIcon } from '../components/icons.jsx'
import './Quiz.css'

function questionText(q) {
  return q.question || q.enonce || q.texte || q.text
}

function questionOptions(q) {
  return q.options || q.choix || q.reponses_possibles || []
}

export default function Quiz() {
  const { id } = useParams()
  const [docName, setDocName] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState({}) // index -> chosen option index

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    documentService.getById(id)
      .then((doc) => setDocName(doc.nom || doc.titre || doc.name || ''))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    generationService.getQuiz(id)
      .then((data) => { if (!cancelled) setQuestions(data.questions || data || []) })
      .catch(async (err) => {
        if (err instanceof ApiError && err.status === 404) {
          try {
            const data = await generationService.generateQuiz(id)
            if (!cancelled) setQuestions(data.questions || data || [])
            return
          } catch (genErr) {
            if (!cancelled) setError(genErr.message || 'Impossible de générer le quiz.')
            return
          }
        }
        if (!cancelled) setError(err.message || 'Impossible de charger le quiz.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const question = questions[current]
  const answered = selected !== null
  const isLast = current === questions.length - 1
  const progress = questions.length ? Math.round((current / questions.length) * 100) : 0

  function choose(i) {
    if (answered) return
    setSelected(i)
    setAnswers((a) => ({ ...a, [current]: i }))
  }

  async function next() {
    if (!isLast) {
      setCurrent((c) => c + 1)
      setSelected(answers[current + 1] ?? null)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const payload = questions.map((q, i) => ({
        question_id: q.id ?? i,
        reponse: answers[i],
      }))
      const data = await generationService.submitQuiz(id, { reponses: payload })
      setResult(data)
    } catch (err) {
      setError(err.message || 'Échec de la soumission du quiz.')
    } finally {
      setSubmitting(false)
    }
  }

  function goTo(i) {
    setCurrent(i)
    setSelected(answers[i] ?? null)
  }

  if (loading) return <p className="detail__status">Chargement du quiz…</p>
  if (error && !result) return <p className="detail__status detail__status--error">{error}</p>
  if (!loading && questions.length === 0) return <p className="detail__status">Aucune question disponible.</p>

  if (result) {
    const corrections = result.correction || result.corrections || []
    return (
      <>
        <header className="topbar">
          <div className="topbar__crumb">
            <Link to={`/app/documents/${id}`} className="crumb">{docName}</Link>
            <span className="crumb__sep">/</span>
            <h1>Résultat du quiz</h1>
          </div>
        </header>
        <div className="quiz">
          <div className="panel quiz__card">
            <h2 className="quiz__question">Score : {result.score ?? 0}{typeof result.score === 'number' && result.score <= 1 ? '' : ' %'}</h2>
            {corrections.length > 0 && (
              <ul className="options">
                {corrections.map((c, i) => (
                  <li key={i}>
                    <p className="option">
                      {questionText(questions[i]) || `Question ${i + 1}`} — {c.correct || c.est_correct ? 'Correct' : 'Incorrect'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="quiz__foot">
              <Link to={`/app/documents/${id}`} className="btn btn--primary quiz__next">Retour au document</Link>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar__crumb">
          <Link to={`/app/documents/${id}`} className="crumb">{docName}</Link>
          <span className="crumb__sep">/</span>
          <h1>Quiz</h1>
        </div>
      </header>

      <div className="quiz">
        <div className="quiz__grid">
          <div className="quiz__main">
            <div className="quiz__progress">
              <div className="quiz__bar">
                <span className="quiz__bar-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="quiz__count">Question {current + 1} sur {questions.length}</span>
            </div>

            <div className="panel quiz__card">
              <h2 className="quiz__question">{questionText(question)}</h2>

              <ul className="options">
                {questionOptions(question).map((opt, i) => (
                  <li key={i}>
                    <button
                      className={`option${selected === i ? ' option--selected' : ''}`}
                      onClick={() => choose(i)}
                      disabled={answered}
                    >
                      <span className="option__letter">{String.fromCharCode(65 + i)}</span>
                      <span className="option__text">{typeof opt === 'string' ? opt : opt.texte || opt.text}</span>
                      {selected === i && <span className="option__check"><TickIcon /></span>}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="quiz__foot">
                {error && <p className="quiz__feedback is-wrong">{error}</p>}
                <button
                  className="btn btn--primary quiz__next"
                  onClick={next}
                  disabled={!answered || submitting}
                >
                  {submitting ? 'Envoi…' : isLast ? 'Terminer' : 'Question suivante'}
                </button>
              </div>
            </div>
          </div>

          <aside className="panel quiz__aside">
            <div className="panel__head"><h3>Progression</h3></div>
            <div className="dots">
              {questions.map((_, i) => {
                let cls = 'dot'
                if (i === current) cls += ' dot--current'
                else if (answers[i] !== undefined) cls += ' dot--ok'
                return (
                  <button key={i} className={cls} onClick={() => goTo(i)}>{i + 1}</button>
                )
              })}
            </div>
            <div className="quiz__hint">
              <p>Réponds à chaque question puis passe à la suivante. Le score et la correction s'affichent une fois le quiz terminé.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
