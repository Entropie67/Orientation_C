import type { SpecialtyId } from '../data/specialties';
import type { GoalId } from '../data/goals';

export type Level = 'premiere' | 'terminale';

export type GradeLevel = 'faible' | 'moyen' | 'bon' | 'très bon';

export interface GradesInput {
  maths?: GradeLevel;
  french?: GradeLevel;
  history?: GradeLevel;
  physics?: GradeLevel;
  svt?: GradeLevel;
  english?: GradeLevel;
  digital?: GradeLevel;
  spec1?: GradeLevel;
  spec2?: GradeLevel;
  spec3?: GradeLevel;
}

export interface StudentProfile {
  level: Level;
  currentSpecialties?: [SpecialtyId, SpecialtyId, SpecialtyId];
  grades: GradesInput;
  goal: GoalId;
}

export interface RecommendationResult {
  primary: SpecialtyId[];
  alternative?: SpecialtyId[];
  rationale: string;
  alternativeRationale?: string;
  vigilance?: string;
  nsiHighlight?: string;
  isCoherent: boolean;
}
