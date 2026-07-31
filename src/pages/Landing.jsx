import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import './Landing.css'

const features = [
  {
    icon: <BrainIcon />,
    title: 'Résumés intelligents',
    body: "L'IA condense chaque chapitre en points clés, sans que tu aies à relire tout ton PDF.",
  },
  {
    icon: <CardsIcon />,
    title: 'Flashcards',
    body: 'Des cartes questions-réponses générées automatiquement à partir de ton cours.',
  },
  {
    icon: <CheckIcon />,
    title: 'Quiz corrigés',
    body: 'Teste-toi avec des QCM adaptés à ton document et suis ta progression.',
  },
]

const steps = [
  { n: 1, title: 'Importe ton PDF', body: 'Dépose ton cours au format PDF, directement depuis ton ordinateur.' },
  { n: 2, title: "L'IA analyse le contenu", body: "RévisIA lit le document et en extrait l'essentiel en local." },
  { n: 3, title: 'Tu révises autrement', body: 'Résumés, flashcards et quiz sont prêts, générés rien que pour toi.' },
]

const stats = [
  { value: '50K+', label: 'Documents traités' },
  { value: '1,2M', label: 'Cartes générées' },
  { value: '4,8/5', label: 'Note moyenne' },
]

export default function Landing() {
  return (
    <div className="landing">
      <Nav />

      <section className="hero">
        <div className="hero__text">
          <span className="eyebrow"><SparkIcon /> Propulsé par IA</span>
          <h1 className="hero__title">
            Transforme tes cours en<br />
            <span className="hero__accent">révisions actives</span>
          </h1>
          <p className="hero__lead">
            Dépose un PDF de cours, RévisIA génère automatiquement un résumé,
            des flashcards et un quiz personnalisés — pour réviser plus vite et
            mieux retenir, grâce à une IA locale.
          </p>
          <div className="hero__actions">
            <Link to="/connexion" className="btn btn--primary">Commencer gratuitement</Link>
            <a href="#etapes" className="btn btn--ghost">Voir la démo</a>
          </div>
          <dl className="stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <dt className="stat__value">{s.value}</dt>
                <dd className="stat__label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="mock">
            <div className="mock__file">
              <span className="mock__fileicon"><PdfIcon /></span>
              <div className="mock__filemeta">
                <span className="mock__filename">Les fonctions dérivées.pdf</span>
                <span className="mock__filesub">2,4 Mo · 18 pages</span>
              </div>
            </div>
            <p className="mock__note">
              RévisIA a analysé ton cours et généré 24 flashcards, un résumé de
              6 points clés et un quiz de 12 questions.
            </p>
            <div className="mock__chips">
              <span className="mock__chip mock__chip--on">Flashcards</span>
              <span className="mock__chip">Quiz</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="fonctionnalites">
        <div className="section-head">
          <h2>Tout ce qu'il te faut pour réviser</h2>
          <p>Un seul PDF, trois façons de retenir ton cours.</p>
        </div>
        <div className="feature-grid">
          {features.map((f) => (
            <article className="feature" key={f.title}>
              <span className="feature__icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="steps" id="etapes">
        <div className="section-head">
          <h2>Comment ça marche</h2>
        </div>
        <div className="step-grid">
          {steps.map((s) => (
            <article className="step" key={s.n}>
              <span className="step__num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="cta__inner">
          <h2>Prêt à réviser autrement ?</h2>
          <p>Rejoins les étudiants qui préparent leurs examens avec RévisIA.</p>
          <Link to="/connexion" className="btn btn--light">Créer un compte gratuit</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

/* ---------- Icônes ---------- */
function LogoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l2.2 4.9L19.5 9l-4 3.7 1 5.3L12 15.6 7.5 18l1-5.3-4-3.7 5.3-1.1L12 3z" fill="currentColor" />
    </svg>
  )
}
function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M12 4l1.6 4.4L18 10l-4.4 1.6L12 16l-1.6-4.4L6 10l4.4-1.6L12 4z" fill="currentColor" />
    </svg>
  )
}
function PdfIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M6 2h8l4 4v16H6V2z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function BrainIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8V15a3 3 0 0 0 4 2.8V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8V15a3 3 0 0 1-4 2.8V4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function CardsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 4h11a2 2 0 0 1 2 2v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8.5 12.5l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
