import { getSpecialty } from '../../data/specialties';
import type { SpecialtyId } from '../../data/specialties';
import { Badge } from '../ui/Badge';

const bgMap: Record<string, string> = {
  blue: 'bg-blue-50 border-blue-200', violet: 'bg-violet-50 border-violet-200',
  cyan: 'bg-sky-50 border-sky-200', green: 'bg-emerald-50 border-emerald-200',
  amber: 'bg-amber-50 border-amber-200', orange: 'bg-orange-50 border-orange-200',
  rose: 'bg-rose-50 border-rose-200', pink: 'bg-pink-50 border-pink-200',
  slate: 'bg-slate-50 border-slate-200',
};
const iconBgMap: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700', violet: 'bg-violet-100 text-violet-700',
  cyan: 'bg-sky-100 text-sky-700', green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700', orange: 'bg-orange-100 text-orange-700',
  rose: 'bg-rose-100 text-rose-700', pink: 'bg-pink-100 text-pink-700',
  slate: 'bg-slate-100 text-slate-700',
};
const colorMap: Record<string, 'blue' | 'violet' | 'green' | 'amber' | 'slate'> = {
  blue: 'blue', violet: 'violet', cyan: 'blue', green: 'green',
  amber: 'amber', orange: 'amber', rose: 'violet', pink: 'violet', slate: 'slate',
};

export function SpecialtyCard({ id, rank }: { id: SpecialtyId; rank?: number }) {
  const specialty = getSpecialty(id);
  if (!specialty) return null;
  const { label, description, tags, color, icon } = specialty;
  return (
    <div className={`rounded-2xl border p-4 ${bgMap[color] ?? bgMap.blue}`}>
      <div className="flex items-start gap-3">
        {rank && (
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold shrink-0 mt-0.5">
            {rank}
          </div>
        )}
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl text-lg ${iconBgMap[color] ?? iconBgMap.blue} shrink-0`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm leading-tight">{label}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {tags.map((tag) => <Badge key={tag} variant={colorMap[color] ?? 'blue'}>{tag}</Badge>)}
          </div>
        </div>
      </div>
    </div>
  );
}
