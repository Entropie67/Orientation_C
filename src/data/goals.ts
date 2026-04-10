export type GoalId = 'sciences' | 'health' | 'humanities' | 'letters' | 'arts' | 'undecided';

export interface Goal {
  id: GoalId;
  label: string;
  description: string;
  icon: string;
  examples: string[];
}

export const GOALS: Goal[] = [
  { id: 'sciences', label: 'Sciences, ingénierie & numérique',
    description: "Prépa, école d'ingénieurs, informatique, physique, mathématiques",
    icon: '🔬', examples: ['Ingénieur', 'Chercheur', 'Développeur', 'Prépa MPSI', "École d'ingénieurs"] },
  { id: 'health', label: 'Santé & sciences du vivant',
    description: 'Médecine, pharmacie, biologie, paramédical, vétérinaire',
    icon: '🩺', examples: ['Médecine (PASS)', 'Pharmacie', 'Kiné', 'Biologie', 'Vétérinaire'] },
  { id: 'humanities', label: 'Sciences humaines, droit & économie',
    description: 'Sciences Po, droit, économie, géopolitique, sociologie',
    icon: '⚖️', examples: ['Sciences Po', 'Droit', 'Économie', 'Géopolitique', 'Sociologie'] },
  { id: 'letters', label: 'Lettres, culture & communication',
    description: 'Littérature, philosophie, journalisme, communication, édition',
    icon: '📚', examples: ['Lettres', 'Philosophie', 'Journalisme', 'Communication', 'Édition'] },
  { id: 'arts', label: 'Arts, cinéma & création',
    description: "École d'art, cinéma, design, audiovisuel, musique, architecture",
    icon: '🎨', examples: ["École d'art", 'Cinéma', 'Design', 'Architecture', 'Audiovisuel'] },
  { id: 'undecided', label: 'Je ne sais pas encore',
    description: "Tu explores tes options et tu veux garder toutes les portes ouvertes",
    icon: '🧭', examples: [] },
];
