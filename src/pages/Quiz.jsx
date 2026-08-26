import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { documentService } from '../services/documentService.js'
import { generationService } from '../services/generationService.js'
import { TickIcon } from '../components/icons.jsx'
import './Quiz.css'

const GENERATION_POLL_INTERVAL = 4000

function questionText(q) {
  return q.question || q.enonce || q.texte || q.text
}

function questionOptions(q) {
  return q.propositions || q.options || q.choix || q.reponses_possibles || []
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
      generationService.getQuiz(id)
        .then((data) => {
          if (stopped) return
          setQuestions(data?.quiz || [])
          setBgGenerating(!!data?.generationEnCours)
          if (data?.generationEnCours) {
            timer = setTimeout(poll, GENERATION_POLL_INTERVAL)
          }
        })
        .catch((err) => { if (!stopped) setError(err.message || 'Impossible de charger le quiz.') })
        .finally(() => { if (!stopped) setLoading(false) })
    }

    poll()
    return () => { stopped = true; clearTimeout(timer) }
  }, [id])

  async function handleGenerate() {
    setGenerating(true)
    setError(null)
    try {
      const data = await generationService.generateQuiz(id)
      setQuestions(data?.quiz || [])
    } catch (err) {
      setError(err.message || 'Impossible de générer le quiz.')
    } finally {
      setGenerating(false)
    }
  }

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

  if (questions.length === 0 && !result) {
    return (
      <div className="detail__status">
        {generating || bgGenerating ? (
          <p>Génération du quiz en cours… cela peut prendre une minute.</p>
        ) : (
          <>
            <p>{error || "Aucun quiz n'a encore été généré pour ce document."}</p>
            <button className="btn btn--primary btn--sm" onClick={handleGenerate}>
              {error ? 'Réessayer' : 'Générer le quiz'}
            </button>
          </>
        )}
      </div>
    )
  }

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
