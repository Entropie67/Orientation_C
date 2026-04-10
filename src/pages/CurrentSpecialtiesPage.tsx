import { useState } from 'react';
import type { SpecialtyId } from '../data/specialties';
import { SPECIALTIES } from '../data/specialties';
import { StepHeader } from '../components/ui/StepHeader';
import { Button } from '../components/ui/Button';

export function CurrentSpecialtiesPage({ onSubmit, onBack, totalSteps }: {
  onSubmit: (s: [SpecialtyId, SpecialtyId, SpecialtyId]) => void;
  onBack: () => void; totalSteps: number;
}) {
  const [selected, setSelected] = useState<SpecialtyId[]>([]);

  function toggle(id: SpecialtyId) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  }

  return (
    <div>
      <StepHeader step={2} totalSteps={totalSteps} title="Tes spécialités actuelles"
        subtitle="Sélectionne exactement les 3 spécialités que tu suis en Première." />
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-slate-500">
          {selected.length === 0 ? 'Aucune sélection' : `${selected.length} sélectionnée${selected.length > 1 ? 's' : ''}`}
        </span>
        <span className="text-sm font-semibold text-blue-700">{selected.length} / 3</span>
      </div>
      <div className="flex flex-col gap-2.5 mb-6">
        {SPECIALTIES.map((spec) => {
          const isSelected = selected.includes(spec.id);
          const isDisabled = !isSelected && selected.length >= 3;
          return (
            <button key={spec.id} type="button" disabled={isDisabled} onClick={() => toggle(spec.id)}
              className={`w-full text-left rounded-xl border-2 p-3.5 transition-all duration-150 cursor-pointer
                ${isSelected ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : isDisabled ? 'border-slate-100 bg-slate-50 opacity-40 cursor-not-allowed'
                  : 'border-slate-100 bg-white hover:border-blue-300 hover:shadow-sm'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${isSelected ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  {spec.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>{spec.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{spec.description}</p>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {selected.length > 0 && (
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3.5 mb-5">
          <p className="text-xs font-semibold text-blue-700 mb-2">Tes sélections :</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((id) => {
              const spec = SPECIALTIES.find((s) => s.id === id);
              return (
                <span key={id} className="inline-flex items-center gap-1.5 bg-white text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full border border-blue-200">
                  {spec?.shortLabel ?? id}
                  <button type="button" onClick={() => toggle(id)} className="text-blue-400 hover:text-blue-700 cursor-pointer">×</button>
                </span>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>← Retour</Button>
        <Button variant="primary" size="md" onClick={() => selected.length === 3 && onSubmit(selected as [SpecialtyId, SpecialtyId, SpecialtyId])}
          disabled={selected.length !== 3} fullWidth>
          Continuer
          <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
