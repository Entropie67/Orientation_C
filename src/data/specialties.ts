export type SpecialtyId =
  | 'maths' | 'nsi' | 'pc' | 'svt'
  | 'ses' | 'hggsp' | 'hlp' | 'cav' | 'si' | 'llce';

export interface Specialty {
  id: SpecialtyId;
  label: string;
  shortLabel: string;
  description: string;
  tags: string[];
  color: string;
  icon: string;
  note?: string;
}

export const SPECIALTIES: Specialty[] = [
  { id: 'maths', label: 'Mathématiques', shortLabel: 'Maths',
    description: 'Algèbre, analyse, géométrie, probabilités',
    tags: ['Sciences', 'Prépa', 'Ingénierie'], color: 'blue', icon: '∑' },
  { id: 'nsi', label: 'Numérique et Sciences Informatiques', shortLabel: 'NSI',
    description: 'Algorithmique, programmation, architecture des systèmes',
    tags: ['Numérique', 'Transversal', 'Innovation'], color: 'violet', icon: '⟨⟩' },
  { id: 'pc', label: 'Physique-Chimie', shortLabel: 'Physique-Chimie',
    description: 'Mécanique, thermodynamique, chimie organique',
    tags: ['Sciences', 'Ingénierie', 'Médecine'], color: 'cyan', icon: '⚗' },
  { id: 'svt', label: 'Sciences de la Vie et de la Terre', shortLabel: 'SVT',
    description: 'Biologie, géologie, écologie, génétique',
    tags: ['Vivant', 'Santé', 'Environnement'], color: 'green', icon: '🧬' },
  { id: 'ses', label: 'Sciences Économiques et Sociales', shortLabel: 'SES',
    description: 'Économie, sociologie, science politique',
    tags: ['Économie', 'Sciences Humaines', 'Droit'], color: 'amber', icon: '📊' },
  { id: 'hggsp', label: 'Histoire-Géographie, Géopolitique et Sciences Po', shortLabel: 'HGGSP',
    description: 'Géopolitique, relations internationales, histoire contemporaine',
    tags: ['Sciences Humaines', 'Géopolitique', 'Sciences Po'], color: 'orange', icon: '🌍' },
  { id: 'hlp', label: 'Humanités, Littérature et Philosophie', shortLabel: 'HLP',
    description: 'Littérature, philosophie, histoire des idées',
    tags: ['Lettres', 'Philosophie', 'Culture'], color: 'rose', icon: '✍' },
  { id: 'cav', label: 'Cinéma-Audiovisuel', shortLabel: 'CAV',
    description: 'Pratique cinématographique, esthétique, réalisation',
    tags: ['Arts', 'Cinéma', 'Création'], color: 'pink', icon: '🎬' },
  { id: 'si', label: "Sciences de l'Ingénieur", shortLabel: 'SI',
    description: 'Conception, mécanique, systèmes pluritechniques',
    tags: ['Ingénierie', 'Technique', 'Conception'], color: 'slate', icon: '⚙',
    note: 'Spécialité en voie de disparition au niveau national, spécifique à une orientation vers PTSI' },
  { id: 'llce', label: 'LLCE', shortLabel: 'LLCE',
    description: 'Langues, littératures et cultures étrangères',
    tags: ['Langues', 'International', 'Culture'], color: 'rose', icon: '🌐',
    note: "Pas toujours disponible dans les établissements pour cause d'effectifs." },
];

export const getSpecialty = (id: SpecialtyId): Specialty | undefined =>
  SPECIALTIES.find((s) => s.id === id);
