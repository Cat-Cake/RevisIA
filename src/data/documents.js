// Données de démonstration — à remplacer par des appels à l'API Django.
export const documents = [
  {
    id: 'fonctions-derivees',
    name: 'Les fonctions dérivées.pdf',
    subject: 'Mathématiques',
    pages: 18,
    progress: 100,
    status: 'Terminé',
    tone: 'ok',
    color: 'a',
    flashcards: 24,
    quizCount: 12,
    cards: [
      { q: 'Que mesure la dérivée d\u2019une fonction ?', a: 'Le taux de variation instantané de la fonction en un point.' },
      { q: 'Comment interpréter f\u2032(a) géométriquement ?', a: 'C\u2019est la pente de la tangente à la courbe au point d\u2019abscisse a.' },
      { q: 'Quelle est la dérivée de x\u207f ?', a: 'n · x\u207f\u207b\u00b9' },
      { q: 'Que donne le signe de f\u2032 ?', a: 'Les variations de f : f\u2032 > 0 → f croissante, f\u2032 < 0 → f décroissante.' },
    ],
    summary:
      "Ce chapitre introduit la notion de dérivée : définition, interprétation géométrique comme pente de la tangente, et règles de calcul usuelles. Il aborde les dérivées des fonctions de référence, les opérations (somme, produit, quotient, composition) et l'étude des variations d'une fonction à partir du signe de sa dérivée.",
    keyPoints: [
      'La dérivée mesure le taux de variation instantané d\u2019une fonction.',
      'Géométriquement, f\u2032(a) est la pente de la tangente en a.',
      'Règles : (u+v)\u2032, (uv)\u2032, (u/v)\u2032 et dérivée d\u2019une composée.',
      'Le signe de f\u2032 donne les variations de f.',
    ],
  },
  {
    id: 'seconde-guerre-mondiale',
    name: 'La Seconde Guerre mondiale.pdf',
    subject: 'Histoire',
    pages: 32,
    progress: 60,
    status: 'En cours',
    tone: 'progress',
    color: 'b',
    flashcards: 40,
    quizCount: 15,
    cards: [
      { q: 'En quelle année débute la Seconde Guerre mondiale ?', a: '1939, avec l\u2019invasion de la Pologne.' },
      { q: 'Quel événement marque un tournant en 1942-43 ?', a: 'La bataille de Stalingrad.' },
      { q: 'Quand se termine le conflit en Europe ?', a: 'Le 8 mai 1945.' },
    ],
    summary:
      "Un panorama du conflit de 1939 à 1945 : origines, principales phases militaires, tournants majeurs et bilan humain et géopolitique.",
    keyPoints: [
      'Origines : crise des années 1930 et expansionnisme.',
      'Grandes phases : guerre éclair, mondialisation, tournant de 1942-43.',
      'Bilan humain et redéfinition de l\u2019ordre mondial.',
    ],
  },
]

export function getDocument(id) {
  return documents.find((d) => d.id === id) || documents[0]
}

// Historique des quiz — à remplacer par l'API.
export const history = [
  { doc: 'Les fonctions dérivées.pdf', subject: 'Quiz · Mathématiques', date: '18 mars 2026', score: 92 },
  { doc: "L'accord du participe passé.pdf", subject: 'Quiz · Français', date: '15 mars 2026', score: 84 },
  { doc: 'La Seconde Guerre mondiale.pdf', subject: 'Quiz · Histoire', date: '12 mars 2026', score: 68 },
  { doc: 'Phrasal verbs — cours anglais.pdf', subject: 'Quiz · Anglais', date: '9 mars 2026', score: 76 },
]

export const historyStats = {
  completed: 4,
  average: 80,
  best: 92,
}
