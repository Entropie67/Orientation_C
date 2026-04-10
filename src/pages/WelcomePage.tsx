import { Button } from '../components/ui/Button';

export function WelcomePage({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 rounded-3xl px-6 py-10 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-600/40 pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-blue-900/30 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur rounded-full px-3.5 py-1 mb-5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            <span className="text-xs font-semibold text-white/90">Outil d'aide à l'orientation — Lycée</span>
          </div>
          <h1 className="text-3xl font-bold leading-tight tracking-tight mb-3">
            Horizon<br /><span className="text-blue-200">Orientation</span>
          </h1>
          <p className="text-blue-100 text-base leading-relaxed max-w-xs">
            Trouve les spécialités les plus adaptées à ton profil, tes atouts et ton projet d'avenir.
          </p>
          <div className="mt-7">
            <Button variant="secondary" size="lg" onClick={onStart}
              className="bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-md font-bold">
              Commencer mon orientation
              <svg className="ml-2 w-4 h-4" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h2 className="text-base font-bold text-slate-800 mb-4">Comment ça fonctionne ?</h2>
        <div className="flex flex-col gap-4">
          {[
            { step: '1', title: 'Ton profil', desc: 'Tu indiques ton niveau (Première ou Terminale) et tes résultats.' },
            { step: '2', title: 'Ton projet', desc: "Tu partages tes centres d'intérêt et tes grandes orientations d'avenir." },
            { step: '3', title: 'Ta recommandation', desc: "L'outil te propose les spécialités les plus cohérentes, avec une explication claire." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-start gap-3.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white text-sm font-bold shrink-0">{step}</div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">{title}</p>
                <p className="text-slate-500 text-sm mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-blue-700" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm-.75 3.75h1.5v4h-1.5v-4z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-800">Un outil, pas un verdict</p>
          <p className="text-xs text-blue-600 mt-0.5 leading-relaxed">
            Ces recommandations sont des pistes de réflexion. Elles ne remplacent pas l'avis de ton équipe pédagogique.
          </p>
        </div>
      </div>
    </div>
  );
}
