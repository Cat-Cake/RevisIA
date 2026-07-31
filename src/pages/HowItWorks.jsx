import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import '../styles.css'

const steps = [
  { n: 1, title: 'Importe ton PDF', body: 'Dépose ton cours depuis ton ordinateur, aucun format compliqué requis.' },
  { n: 2, title: "L'IA analyse le contenu", body: 'RévisIA lit le document en local et repère les notions importantes.' },
  { n: 3, title: 'Résumés, quiz, flashcards', body: 'Tout ton matériel de révision est généré automatiquement en quelques secondes.' },
  { n: 4, title: 'Tu révises autrement', body: 'Entraîne-toi activement et suis ta progression jusqu\u2019au jour J.' },
]

export default function HowItWorks() {
  return (
    <div className="landing">
      <Nav />
      <main className="page">
        <div className="section-head">
          <h2>Comment ça marche</h2>
          <p>Quatre étapes, un seul PDF, pour passer d'un cours passif à des révisions actives.</p>
        </div>

        <ol className="flow">
          {steps.map((s) => (
            <li className="flow__step" key={s.n}>
              <span className="flow__num">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>

        <div className="note">
          <span className="note__icon"><CheckSmall /></span>
          <p>
            <strong>100 % en local.</strong> Tes documents ne quittent jamais ta
            machine : l'IA tourne chez toi, rien n'est envoyé sur un serveur externe.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function CheckSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M5 12.5l4.5 4.5L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
