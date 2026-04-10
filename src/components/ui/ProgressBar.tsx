export function ProgressBar({ current, total, label }: { current: number; total: number; label?: string }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-medium text-slate-500">{label}</span>
          <span className="text-xs font-semibold text-blue-700">Étape {current} / {total}</span>
        </div>
      )}
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
