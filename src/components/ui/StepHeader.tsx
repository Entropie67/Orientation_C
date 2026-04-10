import { ProgressBar } from './ProgressBar';

export function StepHeader({ step, totalSteps, title, subtitle }: {
  step: number; totalSteps: number; title: string; subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <ProgressBar current={step} total={totalSteps} label="Votre progression" />
      <div className="mt-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold shrink-0">
            {step}
          </span>
          <h2 className="text-xl font-bold text-slate-800 leading-tight">{title}</h2>
        </div>
        {subtitle && <p className="text-slate-500 text-sm leading-relaxed pl-11">{subtitle}</p>}
      </div>
    </div>
  );
}
