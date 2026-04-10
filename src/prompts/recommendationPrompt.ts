/**
 * MESSAGE USER — Horizon Orientation
 *
 * Ce fichier construit le message envoyé à l'IA avec le profil complet de l'élève
 * ET la recommandation que l'algorithme local a déjà calculée.
 *
 * L'IA reçoit donc :
 *   1. Le profil : niveau, projet, matières, notes
 *   2. La recommandation déjà faite : quelles spécialités ont été choisies et pourquoi
 *
 * Son rôle est d'EXPLIQUER et d'ENRICHIR cette recommandation, pas d'en faire une nouvelle.
 */
import type { StudentProfile, RecommendationResult } from '../rules/recommendationTypes';
import { getSpecialty } from '../data/specialties';

const GOAL_LABELS: Record<string, string> = {
  sciences: 'Sciences, ingénierie et numérique',
  health: 'Santé et sciences du vivant',
  humanities: 'Sciences humaines, droit et économie',
  letters: 'Lettres, culture et communication',
  arts: 'Arts, cinéma et création',
  undecided: 'Pas encore défini — profil ouvert',
};

const LEVEL_LABELS: Record<string, string> = {
  premiere: 'Première (choix de 3 spécialités parmi 9)',
  terminale: 'Terminale (choix de 2 spécialités à conserver parmi 3)',
};

const GRADE_LABELS: Record<string, string> = {
  maths: 'Mathématiques', french: 'Français', history: 'Histoire-Géographie',
  physics: 'Physique-Chimie', svt: 'SVT', english: 'Anglais',
  digital: 'Logique/Numérique/Informatique',
  spec1: 'Spécialité 1', spec2: 'Spécialité 2', spec3: 'Spécialité 3',
};

export function buildRecommendationPrompt(
  profile: StudentProfile,
  result: RecommendationResult,
): string {
  const level = LEVEL_LABELS[profile.level] ?? profile.level;
  const goal = GOAL_LABELS[profile.goal] ?? profile.goal;

  // Spécialités actuelles (Terminale)
  const currentSpecsLine = profile.currentSpecialties
    ? `Spécialités actuelles en Première : ${profile.currentSpecialties
        .map((id) => getSpecialty(id)?.label ?? id)
        .join(', ')}`
    : '';

  // Notes déclarées
  const gradeLines = Object.entries(profile.grades)
    .filter(([, val]) => val !== undefined)
    .map(([key, val]) => `  - ${GRADE_LABELS[key] ?? key} : ${val}`)
    .join('\n');

  // Recommandation principale
  const primaryLabels = result.primary
    .map((id) => getSpecialty(id)?.label ?? id)
    .join(', ');

  // Alternative (Première uniquement)
  const altLine = result.alternative
    ? `Alternative proposée : ${result.alternative.map((id) => getSpecialty(id)?.label ?? id).join(', ')}`
    : '';

  return `
Un élève utilise l'application Horizon Orientation pour choisir ses spécialités au lycée.

═══ PROFIL DE L'ÉLÈVE ═══════════════════════════════════
Niveau visé : ${level}
Projet / domaine d'intérêt : ${goal}
${currentSpecsLine}

Niveaux déclarés dans les matières :
${gradeLines || '  (aucune note renseignée)'}

═══ RECOMMANDATION DE L'ALGORITHME LOCAL ════════════════
Spécialités recommandées : ${primaryLabels}
${altLine}
Explication locale : ${result.rationale}
${result.nsiHighlight ? `Note NSI : ${result.nsiHighlight}` : ''}
${result.vigilance ? `Point de vigilance : ${result.vigilance}` : ''}

═══ TA MISSION ══════════════════════════════════════════
Explique à cet élève en 4 à 6 phrases claires et bienveillantes :
1. Pourquoi ces spécialités recommandées sont cohérentes avec son profil et son projet
2. Ce que ces spécialités lui apporteront concrètement dans le supérieur
3. Un conseil de vigilance ou d'encouragement si pertinent

Ne propose AUCUNE spécialité différente de celles déjà recommandées ci-dessus.
`.trim();
}
