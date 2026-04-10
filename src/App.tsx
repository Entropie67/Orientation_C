import { useState } from 'react';
import { AppShell } from './components/layout/AppShell';
import { WelcomePage } from './pages/WelcomePage';
import { LevelPage } from './pages/LevelPage';
import { CurrentSpecialtiesPage } from './pages/CurrentSpecialtiesPage';
import { GradesPage } from './pages/GradesPage';
import { GoalsPage } from './pages/GoalsPage';
import { ResultPage } from './pages/ResultPage';
import type { Level, GradesInput, StudentProfile, RecommendationResult } from './rules/recommendationTypes';
import type { SpecialtyId } from './data/specialties';
import type { GoalId } from './data/goals';
import { computeRecommendation } from './rules/recommendationEngine';

type Screen = 'welcome' | 'level' | 'currentSpecialties' | 'grades' | 'goals' | 'result';

interface AppState {
  level?: Level;
  currentSpecialties?: [SpecialtyId, SpecialtyId, SpecialtyId];
  grades?: GradesInput;
  goal?: GoalId;
  result?: RecommendationResult;
}

function getTotalSteps(level?: Level) { return level === 'terminale' ? 5 : 4; }
function getGradeStep(level?: Level) { return level === 'terminale' ? 3 : 2; }
function getGoalStep(level?: Level) { return level === 'terminale' ? 4 : 3; }

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [state, setState] = useState<AppState>({});

  function reset() { setState({}); setScreen('welcome'); }

  function handleLevelSelect(level: Level) {
    setState((prev) => ({ ...prev, level }));
    setScreen(level === 'terminale' ? 'currentSpecialties' : 'grades');
  }

  function handleSpecialties(specs: [SpecialtyId, SpecialtyId, SpecialtyId]) {
    setState((prev) => ({ ...prev, currentSpecialties: specs }));
    setScreen('grades');
  }

  function handleGrades(grades: GradesInput) {
    setState((prev) => ({ ...prev, grades }));
    setScreen('goals');
  }

  function handleGoal(goal: GoalId) {
    setState((prev) => {
      const updated = { ...prev, goal };
      const profile: StudentProfile = {
        level: updated.level!,
        currentSpecialties: updated.currentSpecialties,
        grades: updated.grades ?? {},
        goal,
      };
      const result = computeRecommendation(profile);
      return { ...updated, result };
    });
    setScreen('result');
  }

  const totalSteps = getTotalSteps(state.level);

  return (
    <AppShell>
      {screen === 'welcome' && <WelcomePage onStart={() => setScreen('level')} />}
      {screen === 'level' && (
        <LevelPage onSelect={handleLevelSelect} onBack={() => setScreen('welcome')} totalSteps={totalSteps} />
      )}
      {screen === 'currentSpecialties' && (
        <CurrentSpecialtiesPage onSubmit={handleSpecialties} onBack={() => setScreen('level')} totalSteps={totalSteps} />
      )}
      {screen === 'grades' && (
        <GradesPage
          level={state.level!}
          currentSpecialties={state.currentSpecialties}
          onSubmit={handleGrades}
          onBack={() => state.level === 'terminale' ? setScreen('currentSpecialties') : setScreen('level')}
          step={getGradeStep(state.level)}
          totalSteps={totalSteps}
        />
      )}
      {screen === 'goals' && (
        <GoalsPage onSubmit={handleGoal} onBack={() => setScreen('grades')}
          step={getGoalStep(state.level)} totalSteps={totalSteps} />
      )}
      {screen === 'result' && state.result && (
        <ResultPage
          result={state.result}
          level={state.level!}
          profile={{ level: state.level!, currentSpecialties: state.currentSpecialties, grades: state.grades ?? {}, goal: state.goal! }}
          onRestart={reset}
        />
      )}
    </AppShell>
  );
}
