import type { SpecialtyId } from '../data/specialties';
import type { GoalId } from '../data/goals';
import type { StudentProfile, RecommendationResult, GradeLevel } from './recommendationTypes';

const gradeScore: Record<GradeLevel, number> = {
  faible: 1, moyen: 2, bon: 3, 'très bon': 4,
};

function score(g?: GradeLevel): number { return g ? gradeScore[g] : 2; }
function isStrong(g?: GradeLevel): boolean { return g === 'bon' || g === 'très bon'; }
function isWeak(g?: GradeLevel): boolean { return g === 'faible'; }

function nsiRelevanceScore(profile: StudentProfile): number {
  let s = 0;
  if (profile.grades.digital) s += score(profile.grades.digital) * 2;
  if (isStrong(profile.grades.maths)) s += 3;
  else if (profile.grades.maths) s += score(profile.grades.maths);
  const goal = profile.goal;
  if (goal === 'sciences') s += 4;
  if (goal === 'humanities') s += 2;
  if (goal === 'arts') s += 2;
  if (goal === 'letters') s += 1;
  if (goal === 'undecided') s += 2;
  return s;
}

function recommendForPremiere(profile: StudentProfile): RecommendationResult {
  const { grades, goal } = profile;
  const nsiScore = nsiRelevanceScore(profile);
  const includeNSI = nsiScore >= 6;
  const stronglyIncludeNSI = nsiScore >= 9;

  const scores: Partial<Record<SpecialtyId, number>> = {
    maths: score(grades.maths) * 2,
    'pc': score(grades.physics) * 1.5,
    svt: score(grades.svt) * 1.2,
    ses: 2, hggsp: 2,
    hlp: score(grades.french) * 1.2,
    cav: 2,
    nsi: nsiScore,
    si: 1.5,
  };

  if (goal === 'sciences') {
    // Première Sciences/Ingénierie : Maths + Physique + NSI (recommandé pour MP2i, MPSI, PCSI)
    // Alternative : Maths + Physique + autre spé scientifique selon envie
    scores['maths'] = (scores['maths'] ?? 0) + 8;
    scores['pc'] = (scores['pc'] ?? 0) + 7;
    scores['nsi'] = (scores['nsi'] ?? 0) + 6;
    scores['svt'] = (scores['svt'] ?? 0) + 2;
    scores['si'] = (scores['si'] ?? 0) + 1; // SI uniquement si orientation PTSI spécifiquement
  }
  if (goal === 'health') {
    // Première Santé : Maths + Physique + SVT (principal) ou Maths + Physique + NSI (alternative)
    scores['maths'] = (scores['maths'] ?? 0) + 8;
    scores['pc'] = (scores['pc'] ?? 0) + 7;
    scores['svt'] = (scores['svt'] ?? 0) + 6;
    scores['nsi'] = (scores['nsi'] ?? 0) + 2;
  }
  if (goal === 'humanities') {
    scores['ses'] = (scores['ses'] ?? 0) + 4;
    scores['hggsp'] = (scores['hggsp'] ?? 0) + 4;
    scores['nsi'] = (scores['nsi'] ?? 0) + 2;
    scores['maths'] = (scores['maths'] ?? 0) + 1;
    scores['hlp'] = (scores['hlp'] ?? 0) + 2;
  }
  if (goal === 'letters') {
    scores['hlp'] = (scores['hlp'] ?? 0) + 5;
    scores['hggsp'] = (scores['hggsp'] ?? 0) + 3;
    scores['ses'] = (scores['ses'] ?? 0) + 2;
    scores['nsi'] = (scores['nsi'] ?? 0) + 1;
  }
  if (goal === 'arts') {
    scores['cav'] = (scores['cav'] ?? 0) + 6;
    scores['nsi'] = (scores['nsi'] ?? 0) + 3;
    scores['hlp'] = (scores['hlp'] ?? 0) + 2;
    scores['hggsp'] = (scores['hggsp'] ?? 0) + 2;
    scores['maths'] = (scores['maths'] ?? 0) + 1;
  }
  if (goal === 'undecided') {
    scores['maths'] = (scores['maths'] ?? 0) + 2;
    scores['nsi'] = (scores['nsi'] ?? 0) + 3;
    scores['hggsp'] = (scores['hggsp'] ?? 0) + 2;
    scores['ses'] = (scores['ses'] ?? 0) + 2;
  }

  const ranked = (Object.entries(scores) as [SpecialtyId, number][])
    .sort((a, b) => b[1] - a[1]);

  let primary = ranked.slice(0, 3).map(([id]) => id);
  if (stronglyIncludeNSI && !primary.includes('nsi')) primary[2] = 'nsi';

  const remaining = ranked.filter(([id]) => !primary.includes(id));
  const alt3rd = remaining[0]?.[0];
  const alternative: SpecialtyId[] = alt3rd ? [primary[0], primary[1], alt3rd] : undefined!;

  const nsiHighlight = stronglyIncludeNSI
    ? "NSI est une spécialité transversale très puissante dans ton profil. Elle renforce ta candidature que tu visses l'ingénierie, les sciences humaines numériques ou les filières créatives."
    : includeNSI
    ? "NSI peut être un vrai atout pour ton profil — elle ouvre des portes dans de nombreuses filières bien au-delà de l'informatique."
    : undefined;

  return {
    primary,
    alternative,
    rationale: buildPremiereRationale(primary, profile, includeNSI),
    alternativeRationale: alternative
      ? "Alternative solide : ce trio te permet d'explorer un profil légèrement différent tout en restant cohérent avec tes atouts."
      : undefined,
    nsiHighlight,
    vigilance: buildVigilance(primary, profile),
    isCoherent: true,
  };
}

function recommendForTerminale(profile: StudentProfile): RecommendationResult {
  const { currentSpecialties, grades, goal } = profile;
  if (!currentSpecialties || currentSpecialties.length !== 3) {
    return { primary: [], rationale: 'Profil incomplet.', isCoherent: false };
  }

  const gradeMap = [grades.spec1, grades.spec2, grades.spec3];
  const specGrades: Partial<Record<SpecialtyId, number>> = {};
  currentSpecialties.forEach((sid, i) => { specGrades[sid] = score(gradeMap[i]); });

  const goalBoost: Partial<Record<SpecialtyId, number>> = {};
  if (goal === 'sciences') {
    // Terminale Prépa : Maths + NSI (MP2i, MPSI) ou Maths + Physique (MPSI, PCSI, PTSI)
    goalBoost['maths'] = 8;
    goalBoost['nsi'] = 5;
    goalBoost['pc'] = 5;
    goalBoost['svt'] = 2;
    goalBoost['si'] = 2;
  }
  if (goal === 'health') { goalBoost['pc'] = 5; goalBoost['svt'] = 5; goalBoost['maths'] = 3; goalBoost['nsi'] = 1; }
  if (goal === 'humanities') { goalBoost['ses'] = 5; goalBoost['hggsp'] = 5; goalBoost['nsi'] = 3; goalBoost['hlp'] = 3; goalBoost['maths'] = 2; }
  if (goal === 'letters') { goalBoost['hlp'] = 6; goalBoost['hggsp'] = 4; goalBoost['ses'] = 3; }
  if (goal === 'arts') { goalBoost['cav'] = 6; goalBoost['nsi'] = 4; goalBoost['hlp'] = 3; goalBoost['hggsp'] = 2; }
  if (goal === 'undecided') { goalBoost['maths'] = 3; goalBoost['nsi'] = 3; goalBoost['hggsp'] = 2; goalBoost['ses'] = 2; }

  const totalScores: [SpecialtyId, number][] = currentSpecialties.map((sid) => [
    sid, (specGrades[sid] ?? 2) + (goalBoost[sid] ?? 0),
  ]);
  totalScores.sort((a, b) => b[1] - a[1]);

  const primary: SpecialtyId[] = [totalScores[0][0], totalScores[1][0]];
  const dropped: SpecialtyId = totalScores[2][0];
  const isCoherent = checkDuoCoherence(primary, goal);

  return {
    primary,
    rationale: buildTerminaleRationale(primary, dropped, goal),
    vigilance: !isCoherent
      ? `Le duo ${primary.map(labelOf).join(' + ')} peut sembler inattendu pour ton projet, mais il reste viable.`
      : buildTerminaleVigilance(primary, dropped, profile),
    nsiHighlight: primary.includes('nsi') && nsiRelevanceScore(profile) >= 5
      ? 'NSI est un atout solide dans ton duo. Elle valorise ta candidature dans de nombreuses filières sélectives.'
      : undefined,
    isCoherent,
  };
}

function buildPremiereRationale(primary: SpecialtyId[], profile: StudentProfile, includeNSI: boolean): string {
  const goalLabels: Record<string, string> = {
    sciences: "un projet scientifique ou d'ingénierie",
    health: 'un projet santé ou sciences du vivant',
    humanities: 'un projet en sciences humaines ou droit',
    letters: 'un projet en lettres ou communication',
    arts: 'un projet artistique ou créatif',
    undecided: 'un profil encore ouvert',
  };
  const specs = primary.map(labelOf).join(', ');
  let base = `Ce trio — ${specs} — a été sélectionné en cohérence avec ${goalLabels[profile.goal] ?? 'ton profil'}.`;
  if (profile.goal === 'sciences' && primary.includes('maths') && primary.includes('pc') && primary.includes('nsi'))
    base += ' Maths + Physique + NSI est le trio recommandé pour les prépas MP2i, MPSI et PCSI. Il offre le maximum de flexibilité en Terminale.';
  else if (profile.goal === 'sciences' && primary.includes('maths') && primary.includes('pc'))
    base += ' Maths + Physique-Chimie forme le socle incontournable pour les filières scientifiques et prépas.';
  if (profile.goal === 'sciences' && !primary.includes('si'))
    base += ' Note : si tu vises spécifiquement la prépa PTSI, tu peux envisager SI en 3e spécialité à la place.';
  if (profile.goal === 'health' && primary.includes('maths') && primary.includes('pc') && primary.includes('svt'))
    base += ' Ce trio est le plus adapté pour PASS, LAS et les filières santé.';
  else if (profile.goal === 'health' && primary.includes('nsi'))
    base += ' NSI en 3e spécialité est une alternative viable qui ouvre aussi vers la bio-informatique et la recherche.';
  if (primary.includes('nsi') && includeNSI && profile.goal !== 'sciences' && profile.goal !== 'health')
    base += " NSI a été incluse pour sa puissance transversale : elle renforce n'importe quel profil académique.";
  if (primary.includes('maths') && primary.includes('pc') && profile.goal !== 'sciences' && profile.goal !== 'health')
    base += ' La combinaison Maths + Physique-Chimie est l\'une des plus solides pour les filières scientifiques.';
  if (primary.includes('ses') && primary.includes('hggsp'))
    base += ' Le duo SES + HGGSP offre une base analytique très prisée en Sciences Po et en droit.';
  if (primary.includes('cav') && primary.includes('nsi'))
    base += ' CAV + NSI est une combinaison originale et puissante pour les profils créatifs-numériques.';
  return base;
}

function buildTerminaleRationale(primary: SpecialtyId[], dropped: SpecialtyId, goal?: GoalId): string {
  let base = `Conserver ${primary.map(labelOf).join(' + ')} est le choix le plus stratégique pour ton profil.`;
  base += ` En abandonnant ${labelOf(dropped)}, tu concentres ton énergie sur les deux spécialités les plus alignées avec tes objectifs.`;
  if (goal === 'sciences') {
    if (primary.includes('maths') && primary.includes('nsi'))
      base += ' Ce duo ouvre les prépas MP2i et MPSI — les plus recherchées en ingénierie et informatique.';
    else if (primary.includes('maths') && primary.includes('pc'))
      base += ' Ce duo ouvre les prépas MPSI, PCSI et PTSI — filières classiques d\'ingénierie.';
  }
  if (primary.includes('nsi') && goal !== 'sciences') base += ' NSI dans ton duo est un signal fort apprécié des formations sélectives.';
  return base;
}

function buildVigilance(primary: SpecialtyId[], profile: StudentProfile): string | undefined {
  if (profile.goal === 'health' && !primary.includes('svt') && !primary.includes('pc'))
    return 'Pour un projet santé, vérifier que ton parcours inclut SVT ou Physique-Chimie — souvent requis pour PASS ou LAS.';
  if (profile.goal === 'sciences' && isWeak(profile.grades.maths) && primary.includes('maths'))
    return 'Maths figure dans ta recommandation malgré un niveau fragile. Un soutien est recommandé dès la rentrée.';
  return undefined;
}

function buildTerminaleVigilance(primary: SpecialtyId[], dropped: SpecialtyId, profile: StudentProfile): string | undefined {
  if (profile.goal === 'health' && dropped === 'svt')
    return 'Attention : SVT est souvent essentielle pour PASS, LAS, biologie. Vérifie les attendus de tes formations cibles.';
  if (profile.goal === 'sciences' && dropped === 'maths')
    return "Abandonner les Maths en Terminale ferme certaines portes en prépa ou école d'ingénieurs. Pour les prépas, seuls Maths+NSI ou Maths+Physique sont recommandés.";
  if (profile.goal === 'sciences' && primary.includes('maths') && !primary.includes('nsi') && !primary.includes('pc'))
    return "Pour les prépas scientifiques, les deux seuls duos recommandés sont Maths+NSI (MP2i, MPSI) ou Maths+Physique (MPSI, PCSI, PTSI).";
  return undefined;
}

function checkDuoCoherence(primary: SpecialtyId[], goal: GoalId): boolean {
  const coherentDuos: Partial<Record<GoalId, Array<[SpecialtyId, SpecialtyId]>>> = {
    sciences: [['maths','nsi'],['maths','pc']], // Maths+NSI → MP2i, MPSI | Maths+Physique → MPSI, PCSI, PTSI
    health: [['pc','svt'],['maths','svt'],['maths','pc']],
    humanities: [['ses','hggsp'],['ses','nsi'],['hggsp','nsi'],['hggsp','hlp'],['ses','hlp']],
    letters: [['hlp','hggsp'],['hlp','ses']],
    arts: [['cav','nsi'],['cav','hlp'],['cav','hggsp']],
  };
  const duos = coherentDuos[goal];
  if (!duos) return true;
  const [a, b] = primary;
  return duos.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}

const LABELS: Record<SpecialtyId, string> = {
  maths: 'Mathématiques', nsi: 'NSI', 'pc': 'Physique-Chimie',
  svt: 'SVT', ses: 'SES', hggsp: 'HGGSP', hlp: 'HLP',
  cav: 'Cinéma-Audiovisuel', si: "Sciences de l'Ingénieur", llce: 'LLCE',
};
function labelOf(id: SpecialtyId): string { return LABELS[id] ?? id; }

export function computeRecommendation(profile: StudentProfile): RecommendationResult {
  return profile.level === 'premiere'
    ? recommendForPremiere(profile)
    : recommendForTerminale(profile);
}
