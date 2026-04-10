import type { GradeLevel } from '../../rules/recommendationTypes';

const LEVELS: { value: GradeLevel; label: string; color: string }[] = [
  { value: 'faible', label: 'Faible',
    color: 'border-red-200 text-red-700 data-[selected=true]:bg-red-50 data-[selected=true]:border-red-500 data-[selected=true]:ring-1 data-[selected=true]:ring-red-400' },
  { value: 'moyen', label: 'Moyen',
    color: 'border-amber-200 text-amber-700 data-[selected=true]:bg-amber-50 data-[selected=true]:border-amber-500 data-[selected=true]:ring-1 data-[selected=true]:ring-amber-400' },
  { value: 'bon', label: 'Bon',
    color: 'border-blue-200 text-blue-700 data-[selected=true]:bg-blue-50 data-[selected=true]:border-blue-500 data-[selected=true]:ring-1 data-[selected=true]:ring-blue-400' },
  { value: 'très bon', label: 'Très bon',
    color: 'border-emerald-200 text-emerald-700 data-[selected=true]:bg-emerald-50 data-[selected=true]:border-emerald-500 data-[selected=true]:ring-1 data-[selected=true]:ring-emerald-400' },
];

export function GradePicker({ label, value, onChange, icon }: {
  label: string; value?: GradeLevel; onChange: (v: GradeLevel) => void; icon?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <span className="text-sm font-semibold text-slate-700">{label}</span>
      </div>
      <div className="flex gap-2 flex-wrap">
        {LEVELS.map((l) => (
          <button key={l.value} type="button" data-selected={value === l.value}
            onClick={() => onChange(l.value)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer ${l.color} ${value !== l.value ? 'bg-white' : ''}`}>
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
