import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { PdfIcon, CpuIcon, BrainIcon, CardsIcon, CheckIcon, ChartIcon } from '../components/icons.jsx'
import '../styles.css'

const items = [
  { icon: <PdfIcon />, title: 'Import PDF', body: 'Dépose ton cours au format PDF, RévisIA s\u2019occupe du reste sans configuration.' },
  { icon: <CpuIcon />, title: 'Analyse par IA', body: 'Une IA locale lit ton document et en extrait les notions clés, en toute confidentialité.' },
  { icon: <BrainIcon />, title: 'Résumés intelligents', body: 'Chaque chapitre est condensé en points essentiels pour aller droit au but.' },
  { icon: <CardsIcon />, title: 'Flashcards', body: 'Des cartes questions-réponses générées automatiquement à partir de ton cours.' },
  { icon: <CheckIcon />, title: 'Quiz corrigés', body: 'Teste-toi avec des QCM adaptés à ton document, avec correction immédiate.' },
  { icon: <ChartIcon />, title: 'Suivi de progression', body: 'Visualise ce que tu maîtrises et ce qu\u2019il te reste à revoir avant l\u2019examen.' },
]

export default function Features() {
  return (
    <div className="landing">
      <Nav />
      <main className="page">
        <div className="section-head">
          <h2>Tout ce qu'il te faut pour réviser</h2>
          <p>RévisIA transforme un simple PDF en tout un arsenal de révision, généré par une IA locale.</p>
        </div>
        <div className="feature-grid feature-grid--6">
          {items.map((f) => (
            <article className="feature" key={f.title}>
              <span className="feature__icon">{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
