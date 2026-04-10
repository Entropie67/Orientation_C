/**
 * Client OpenRouter — Horizon Orientation
 *
 * Sans VITE_OPENROUTER_API_KEY : l'app fonctionne en local pur, ce fichier
 * n'est jamais appelé.
 *
 * Avec la clé : le bouton "Demander l'avis de l'IA" apparaît sur ResultPage.
 * L'IA reçoit le profil complet + la recommandation déjà calculée en local,
 * et explique/enrichit cette recommandation (ne la remplace pas).
 *
 * Modifier le rôle de l'IA → src/prompts/systemPrompt.ts
 * Modifier le message envoyé → src/prompts/recommendationPrompt.ts
 */
import type { StudentProfile, RecommendationResult } from '../../rules/recommendationTypes';
import { buildRecommendationPrompt } from '../../prompts/recommendationPrompt';
import { SYSTEM_PROMPT } from '../../prompts/systemPrompt';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface LLMExplanation {
  text: string;
  model: string;
}

/** Retourne true si la clé API est configurée (le bloc IA s'affiche). */
export function isLLMEnabled(): boolean {
  return !!import.meta.env.VITE_OPENROUTER_API_KEY;
}

/**
 * Envoie le profil élève + la recommandation locale à OpenRouter.
 * L'IA explique la recommandation — elle ne la remplace pas.
 *
 * @param profile  Profil complet de l'élève (niveau, notes, projet)
 * @param result   Recommandation calculée par le moteur local
 */
export async function generateExplanation(
  profile: StudentProfile,
  result: RecommendationResult,
): Promise<LLMExplanation> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY as string | undefined;
  if (!apiKey) throw new Error('VITE_OPENROUTER_API_KEY non configurée.');

  const model =
    (import.meta.env.VITE_OPENROUTER_MODEL as string | undefined) ??
    'anthropic/claude-3-haiku';

  const appUrl =
    (import.meta.env.VITE_APP_URL as string | undefined) ??
    'http://localhost:5173';

  // Le message user contient PROFIL + RECOMMANDATION pour que l'IA puisse expliquer
  const userMessage = buildRecommendationPrompt(profile, result);

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': appUrl,
      'X-Title': 'Horizon Orientation',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 600,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenRouter ${response.status} : ${errorText}`);
  }

  const data = await response.json();
  const text: string = data.choices?.[0]?.message?.content ?? '';
  return { text, model: data.model ?? model };
}
