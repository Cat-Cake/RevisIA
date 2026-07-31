import { Link } from 'react-router-dom'
import Nav from '../components/Nav.jsx'
import Footer from '../components/Footer.jsx'
import { TickIcon } from '../components/icons.jsx'
import '../styles.css'

const plans = [
  {
    name: 'Gratuit',
    price: '0€',
    period: '/mois',
    features: [
      '3 documents par mois',
      'Résumés & flashcards',
      'Quiz de base',
      'IA locale incluse',
    ],
    cta: 'Commencer gratuitement',
    variant: 'ghost',
  },
  {
    name: 'Premium',
    price: '6,90€',
    period: '/mois',
    featured: true,
    badge: 'Populaire',
    features: [
      'Documents illimités',
      'Résumés & flashcards avancés',
      'Quiz personnalisés',
      'Suivi de progression',
      'Export PDF & Anki',
      'Support prioritaire',
    ],
    cta: 'Passer à Premium',
    variant: 'light',
  },
  {
    name: 'Étudiant',
    price: '3,90€',
    period: '/mois',
    features: [
      'Tout le plan Premium',
      'Tarif réduit sur justificatif',
      'Facturation annuelle',
    ],
    cta: 'Vérifier mon éligibilité',
    variant: 'ghost',
  },
]

export default function Pricing() {
  return (
    <div className="landing">
      <Nav />
      <main className="page">
        <div className="section-head">
          <h2>Un tarif simple, adapté à ton rythme</h2>
          <p>Commence gratuitement, passe à la vitesse supérieure quand tu en as besoin.</p>
        </div>

        <div className="plans">
          {plans.map((p) => (
            <article
              key={p.name}
              className={`plan${p.featured ? ' plan--featured' : ''}`}
            >
              {p.badge && <span className="plan__badge">{p.badge}</span>}
              <h3 className="plan__name">{p.name}</h3>
              <p className="plan__price">
                {p.price}<span className="plan__period">{p.period}</span>
              </p>
              <ul className="plan__list">
                {p.features.map((f) => (
                  <li key={f}><span className="plan__tick"><TickIcon /></span>{f}</li>
                ))}
              </ul>
              <Link
                to="/connexion"
                className={`btn plan__cta ${p.featured ? 'btn--light' : 'btn--ghost'}`}
              >
                {p.cta}
              </Link>
            </article>
          ))}
        </div>

        <p className="plans__foot">Sans engagement · Annulable à tout moment</p>
      </main>
      <Footer />
    </div>
  )
}
