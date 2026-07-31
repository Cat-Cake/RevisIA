import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const features = [
  { icon: <PdfIcon />, label: 'Import PDF en un clic' },
  { icon: <SparkIcon />, label: 'Résumés, quiz, flashcards générés par IA' },
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit() {
    // TODO: brancher sur l'API d'authentification, puis rediriger
    console.log({ email, password })
    navigate('/app')
  }

  return (
    <div className="login">
      {/* Panneau de gauche : proposition de valeur */}
      <aside className="panel" aria-hidden="true">
        <div className="panel__blob panel__blob--tr" />
        <div className="panel__blob panel__blob--bl" />

        <div className="brand">
          <span className="brand__mark"><LogoIcon /></span>
          <span className="brand__name">RévisIA</span>
        </div>

        <div className="panel__copy">
          <h1 className="headline">
            Importe ton cours,<br />l'IA fait le reste.
          </h1>
          <p className="subhead">
            Dépose un PDF de cours : RévisIA en extrait un résumé, des
            flashcards et un quiz personnalisés, générés par une IA locale.
          </p>

          <ul className="chips">
            {features.map((f) => (
              <li className="chip" key={f.label}>
                <span className="chip__icon">{f.icon}</span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <p className="panel__foot">© 2026 RévisIA</p>
      </aside>

      {/* Panneau de droite : formulaire */}
      <main className="form-panel">
        <div className="form">
          <header className="form__head">
            <h2>Bon retour !</h2>
            <p>Connecte-toi pour continuer ta préparation.</p>
          </header>

          <div className="field">
            <label htmlFor="email">Adresse e-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="toi@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <a className="field__aux" href="#">Mot de passe oublié ?</a>
          </div>

          <button className="submit" onClick={handleSubmit}>
            Se connecter
          </button>

          <p className="switch">
            Pas encore de compte ? <a href="#">Créer un compte</a>
          </p>
        </div>
      </main>
    </div>
  )
}

function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l2.2 4.9L19.5 9l-4 3.7 1 5.3L12 15.6 7.5 18l1-5.3-4-3.7 5.3-1.1L12 3z"
        fill="currentColor" />
    </svg>
  )
}

function PdfIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h8l4 4v16H6V2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function SparkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z"
        stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
