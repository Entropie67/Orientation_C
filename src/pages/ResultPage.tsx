import { useState } from 'react';
import type { RecommendationResult, StudentProfile, Level } from '../rules/recommendationTypes';
import { SpecialtyCard } from '../components/result/SpecialtyCard';
import { Button } from '../components/ui/Button';
import { generateExplanation, isLLMEnabled } from '../services/llm/openrouter';
import type { LLMExplanation } from '../services/llm/openrouter';

type LLMState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; data: LLMExplanation }
  | { status: 'error'; message: string };

export function ResultPage({ result, level, profile, onRestart }: {
  result: RecommendationResult; level: Level;
  profile: StudentProfile; onRestart: () => void;
}) {
  const [llm, setLlm] = useState<LLMState>({ status: 'idle' });
  const isPremiere = level === 'premiere';
  const primaryLabel = isPremiere ? 'Tes 3 spécialités conseillées' : 'Les 2 spécialités à conserver';

  async function handleAskAI() {
    setLlm({ status: 'loading' });
    try {
      // On passe PROFIL + RÉSULTAT : l'IA explique la recommandation, ne la remplace pas
      const data = await generateExplanation(profile, result);
      setLlm({ status: 'done', data });
    } catch (err) {
      setLlm({ status: 'error', message: err instanceof Error ? err.message : 'Erreur inconnue.' });
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-800 to-blue-600 rounded-3xl px-6 py-7 text-white relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-blue-600/30 pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-3 py-1 mb-4">
            <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 14 14" fill="currentColor">
              <path d="M7 1a6 6 0 1 0 0 12A6 6 0 0 0 7 1zm2.78 4.72-3.25 3.25a.75.75 0 0 1-1.06 0L4 7.47a.75.75 0 1 1 1.06-1.06l.97.97 2.72-2.72a.75.75 0 0 1 1.06 1.06z" />
            </svg>
            <span className="text-xs font-semibold text-white/90">Recommandation personnalisée</span>
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-1">{primaryLabel}</h1>
          <p className="text-blue-200 text-sm">
            {isPremiere ? 'Ce trio a été sélectionné selon ton profil et ton projet.'
              : 'Ce duo est le plus cohérent avec ton profil et tes objectifs.'}
          </p>
        </div>
      </div>

      {/* Recommandation principale */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-blue-600 rounded-full" />
          <h2 className="font-bold text-slate-800 text-base">{primaryLabel}</h2>
        </div>
        <div className="flex flex-col gap-3">
          {result.primary.map((id, i) => <SpecialtyCard key={id} id={id} rank={i + 1} />)}
        </div>
      </div>

      {/* Rationale */}
      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-blue-700" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm-.75 3.75h1.5v5h-1.5v-5zm0 6.5h1.5v1.5h-1.5v-1.5z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm mb-1">
              {isPremiere ? 'Pourquoi ce trio ?' : 'Pourquoi ce duo est stratégique'}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">{result.rationale}</p>
          </div>
        </div>
      </div>

      {/* NSI highlight */}
      {result.nsiHighlight && (
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-violet-100 flex items-center justify-center text-base shrink-0">⟨⟩</div>
          <div>
            <p className="font-bold text-violet-800 text-sm mb-1">NSI : un atout puissant dans ton profil</p>
            <p className="text-violet-700 text-xs leading-relaxed">{result.nsiHighlight}</p>
          </div>
        </div>
      )}

      {/* Alternative (Première) */}
      {result.alternative && isPremiere && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-5 bg-slate-300 rounded-full" />
            <h2 className="font-bold text-slate-700 text-base">Alternative solide</h2>
          </div>
          <p className="text-slate-400 text-xs mb-4 ml-4">
            {result.alternativeRationale ?? 'Un autre trio cohérent avec ton profil.'}
          </p>
          <div className="flex flex-col gap-3">
            {result.alternative.map((id, i) => <SpecialtyCard key={id} id={id} rank={i + 1} />)}
          </div>
        </div>
      )}

      {/* Vigilance */}
      {result.vigilance && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-amber-600" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-amber-800 text-sm mb-1">Point de vigilance</p>
            <p className="text-amber-700 text-xs leading-relaxed">{result.vigilance}</p>
          </div>
        </div>
      )}

      {/* ── Avis de l'IA ── visible seulement si VITE_OPENROUTER_API_KEY est définie */}
      {isLLMEnabled() && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-indigo-500 rounded-full" />
            <h2 className="font-bold text-slate-800 text-base">Avis de l'IA</h2>
            <span className="ml-auto inline-flex items-center gap-1 bg-indigo-50 text-indigo-600 text-xs font-semibold px-2 py-0.5 rounded-full ring-1 ring-inset ring-indigo-100">
              ✦ IA
            </span>
          </div>

          {llm.status === 'idle' && (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-slate-500 leading-relaxed">
                Obtiens une explication personnalisée générée par IA, en complément de la recommandation locale.
              </p>
              <Button variant="secondary" size="sm" onClick={handleAskAI}>
                Demander l'avis de l'IA
                <svg className="ml-2 w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </div>
          )}

          {llm.status === 'loading' && (
            <div className="flex items-center gap-3 py-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-sm text-slate-500">L'IA analyse ton profil…</span>
            </div>
          )}

          {llm.status === 'done' && (
            <div className="flex flex-col gap-3">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{llm.data.text}</p>
              <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
                <span className="text-xs text-slate-300">Généré par</span>
                <span className="text-xs font-mono text-slate-400">{llm.data.model}</span>
                <span className="ml-auto text-xs text-slate-300">via OpenRouter</span>
              </div>
            </div>
          )}

          {llm.status === 'error' && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-700 mb-0.5">Erreur</p>
              <p className="text-xs text-red-600">{llm.message}</p>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
        <p className="text-xs text-slate-400 leading-relaxed text-center">
          Ces recommandations constituent une aide à la réflexion et ne remplacent pas
          l'accompagnement de ton équipe pédagogique ou de ton conseiller d'orientation.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 pt-1">
        <Button variant="primary" size="lg" fullWidth onClick={onRestart}>
          Recommencer une simulation
        </Button>
        <p className="text-center text-xs text-slate-400">
          Tes données ne sont pas enregistrées — elles restent sur ton appareil.
        </p>
      </div>
    </div>
  );
}
