import { useState } from 'react';
import type { GoalId } from '../data/goals';
import { GOALS } from '../data/goals';
import { StepHeader } from '../components/ui/StepHeader';
import { Button } from '../components/ui/Button';

export function GoalsPage({ onSubmit, onBack, step, totalSteps }: {
  onSubmit: (goal: GoalId) => void; onBack: () => void;
  step: number; totalSteps: number;
}) {
  const [selected, setSelected] = useState<GoalId | null>(null);
  return (
    <div>
      <StepHeader step={step} totalSteps={totalSteps} title="Ton projet d'avenir"
        subtitle="Quel domaine t'attire le plus ? Choisis la catégorie qui correspond le mieux à tes envies." />
      <div className="flex flex-col gap-3 mb-6">
        {GOALS.map((goal) => {
          const isSelected = selected === goal.id;
          return (
            <button key={goal.id} type="button" onClick={() => setSelected(goal.id)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-150 cursor-pointer group active:scale-[0.99]
                ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 bg-white hover:border-blue-300 hover:shadow-sm'}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 transition-colors ${isSelected ? 'bg-blue-100' : 'bg-slate-50 group-hover:bg-slate-100'}`}>
                  {goal.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-bold text-sm ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>{goal.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{goal.description}</p>
                  {goal.examples.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {goal.examples.slice(0, 3).map((ex) => (
                        <span key={ex} className={`text-xs px-2 py-0.5 rounded-full font-medium ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{ex}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 self-center transition-all ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-300'}`}>
                  {isSelected && (
                    <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2.5 2.5 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>← Retour</Button>
        <Button variant="primary" size="md" onClick={() => selected && onSubmit(selected)} disabled={!selected} fullWidth>
          Voir ma recommandation
          <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
