import { useState } from 'react';
import type { GradesInput, Level, GradeLevel } from '../rules/recommendationTypes';
import type { SpecialtyId } from '../data/specialties';
import { getSpecialty } from '../data/specialties';
import { GradePicker } from '../components/forms/GradePicker';
import { StepHeader } from '../components/ui/StepHeader';
import { Button } from '../components/ui/Button';

type FieldKey = keyof GradesInput;

export function GradesPage({ level, currentSpecialties, onSubmit, onBack, step, totalSteps }: {
  level: Level; currentSpecialties?: [SpecialtyId, SpecialtyId, SpecialtyId];
  onSubmit: (g: GradesInput) => void; onBack: () => void;
  step: number; totalSteps: number;
}) {
  const [grades, setGrades] = useState<GradesInput>({});
  function set(key: FieldKey, value: GradeLevel) { setGrades((prev) => ({ ...prev, [key]: value })); }

  const premiereFields: { key: FieldKey; label: string; icon: string }[] = [
    { key: 'maths', label: 'Mathématiques', icon: '∑' },
    { key: 'french', label: 'Français', icon: '✍' },
    { key: 'history', label: 'Histoire-Géographie', icon: '🌍' },
    { key: 'physics', label: 'Physique-Chimie', icon: '⚗' },
    { key: 'svt', label: 'SVT', icon: '🧬' },
    { key: 'english', label: 'Anglais', icon: '🗣' },
    { key: 'digital', label: 'Logique / Numérique / Informatique', icon: '⟨⟩' },
  ];

  const isComplete = level === 'premiere'
    ? premiereFields.every((f) => grades[f.key] !== undefined)
    : (grades.spec1 !== undefined && grades.spec2 !== undefined && grades.spec3 !== undefined);

  return (
    <div>
      <StepHeader step={step} totalSteps={totalSteps} title="Ton niveau dans chaque matière"
        subtitle="Évalue honnêtement ton niveau ressenti. Il n'y a pas de bonne ou mauvaise réponse." />
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-5">
        <div className="flex flex-col gap-5">
          {level === 'premiere' ? (
            premiereFields.map((f) => (
              <GradePicker key={f.key} label={f.label} icon={f.icon} value={grades[f.key]} onChange={(v) => set(f.key, v)} />
            ))
          ) : (
            <>
              {currentSpecialties?.map((sid, i) => {
                const spec = getSpecialty(sid);
                const keys: FieldKey[] = ['spec1', 'spec2', 'spec3'];
                return (
                  <GradePicker key={sid} label={spec?.label ?? sid} icon={spec?.icon}
                    value={grades[keys[i]]} onChange={(v) => set(keys[i], v)} />
                );
              })}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 mb-3 font-medium">Optionnel — si pertinent</p>
                <GradePicker label="Mathématiques" icon="∑" value={grades.maths} onChange={(v) => set('maths', v)} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>← Retour</Button>
        <Button variant="primary" size="md" onClick={() => onSubmit(grades)} disabled={!isComplete} fullWidth>
          Continuer
          <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
