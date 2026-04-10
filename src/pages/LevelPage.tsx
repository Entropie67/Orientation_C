import type { Level } from '../rules/recommendationTypes';
import { StepHeader } from '../components/ui/StepHeader';
import { Button } from '../components/ui/Button';

export function LevelPage({ onSelect, onBack, totalSteps }: {
  onSelect: (level: Level) => void; onBack: () => void; totalSteps: number;
}) {
  const OPTIONS = [
    { id: 'premiere' as Level, label: 'Je passe en Première', sublabel: 'Actuellement en Seconde',
      description: 'Tu vas choisir tes 3 spécialités pour toute la Première et une partie de la Terminale.',
      icon: '🎯', outcome: "Recommandation d'un trio de spécialités" },
    { id: 'terminale' as Level, label: 'Je passe en Terminale', sublabel: 'Actuellement en Première',
      description: 'Tu vas choisir les 2 spécialités à conserver parmi tes 3 spécialités de Première.',
      icon: '🏁', outcome: 'Recommandation des 2 spécialités à garder' },
  ];
  return (
    <div>
      <StepHeader step={1} totalSteps={totalSteps} title="Ton niveau actuel"
        subtitle="Sélectionne la situation qui correspond à ton parcours." />
      <div className="flex flex-col gap-4">
        {OPTIONS.map((opt) => (
          <button key={opt.id} type="button" onClick={() => onSelect(opt.id)}
            className="w-full text-left bg-white rounded-2xl border-2 border-slate-100 hover:border-blue-400 hover:shadow-md transition-all duration-200 p-5 cursor-pointer group active:scale-[0.99]">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl shrink-0 group-hover:bg-blue-100 transition-colors">
                {opt.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-800 text-base">{opt.label}</p>
                <p className="text-slate-400 text-xs font-medium mt-0.5">{opt.sublabel}</p>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed">{opt.description}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {opt.outcome}
                </div>
              </div>
              <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors self-center" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="ghost" size="sm" onClick={onBack}>← Retour</Button>
      </div>
    </div>
  );
}
