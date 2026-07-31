import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDocument } from '../data/documents.js'
import { TickIcon } from '../components/icons.jsx'
import './Quiz.css'

// Questions de démonstration — à générer côté back-end à partir du PDF.
const QUESTIONS = [
  {
    q: 'Que représente le nombre dérivé en un point ?',
    options: [
      'La pente de la courbe',
      'La pente de la tangente à la courbe en ce point',
      'L\u2019aire sous la courbe',
      'Le maximum global',
    ],
    correct: 1,
  },
  {
    q: 'Quelle est la dérivée de f(x) = x² ?',
    options: ['2x', 'x', 'x³ / 3', '2'],
    correct: 0,
  },
  {
    q: 'Si f\u2032(x) > 0 sur un intervalle, alors f est :',
    options: ['décroissante', 'constante', 'croissante', 'nulle'],
    correct: 2,
  },
]

export default function Quiz() {
  const { id } = useParams()
  const doc = getDocument(id)

  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState({}) // index -> chosen option

  const question = QUESTIONS[current]
  const answered = selected !== null
  const isLast = current === QUESTIONS.length - 1
  const progress = Math.round((current / QUESTIONS.length) * 100)

  function choose(i) {
    if (answered) return
    setSelected(i)
    setAnswers((a) => ({ ...a, [current]: i }))
  }

  function next() {
    if (isLast) return
    setCurrent((c) => c + 1)
    setSelected(answers[current + 1] ?? null)
  }

  function goTo(i) {
    setCurrent(i)
    setSelected(answers[i] ?? null)
  }

  function optionClass(i) {
    if (!answered) return 'option'
    if (i === question.correct) return 'option option--correct'
    if (i === selected) return 'option option--wrong'
    return 'option option--dim'
  }

  return (
    <>
      <header className="topbar">
        <div className="topbar__crumb">
          <Link to={`/app/documents/${doc.id}`} className="crumb">{doc.name}</Link>
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
              <span className="quiz__count">Question {current + 1} sur {QUESTIONS.length}</span>
            </div>

            <div className="panel quiz__card">
              <h2 className="quiz__question">{question.q}</h2>

              <ul className="options">
                {question.options.map((opt, i) => (
                  <li key={i}>
                    <button className={optionClass(i)} onClick={() => choose(i)} disabled={answered}>
                      <span className="option__letter">{String.fromCharCode(65 + i)}</span>
                      <span className="option__text">{opt}</span>
                      {answered && i === question.correct && (
                        <span className="option__check"><TickIcon /></span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="quiz__foot">
                {answered && (
                  <p className={`quiz__feedback ${selected === question.correct ? 'is-ok' : 'is-wrong'}`}>
                    {selected === question.correct ? 'Bonne réponse !' : 'Pas tout à fait.'}
                  </p>
                )}
                <button
                  className="btn btn--primary quiz__next"
                  onClick={next}
                  disabled={!answered || isLast}
                >
                  {isLast ? 'Terminer' : 'Question suivante'}
                </button>
              </div>
            </div>
          </div>

          <aside className="panel quiz__aside">
            <div className="panel__head"><h3>Progression</h3></div>
            <div className="dots">
              {QUESTIONS.map((_, i) => {
                let cls = 'dot'
                if (i === current) cls += ' dot--current'
                else if (answers[i] !== undefined)
                  cls += answers[i] === QUESTIONS[i].correct ? ' dot--ok' : ' dot--wrong'
                return (
                  <button key={i} className={cls} onClick={() => goTo(i)}>{i + 1}</button>
                )
              })}
            </div>
            <div className="quiz__hint">
              <p>Réponds à chaque question puis passe à la suivante. Tu peux revenir en arrière à tout moment via les numéros.</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
