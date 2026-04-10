# Horizon Orientation

Outil d'aide au choix de spécialités pour les lycéens français (réforme bac 2021).

- **Première** : recommandation d'un trio de spécialités
- **Terminale** : recommandation des 2 spécialités à conserver

Fonctionne entièrement en local — pas de backend.
Un bloc **Avis de l'IA** s'active via une clé OpenRouter (optionnel).

## Lancer

```bash
npm install
npm run dev
```

## Activer l'IA (optionnel)

```bash
cp .env.example .env.local
# Renseigner VITE_OPENROUTER_API_KEY avec ta clé openrouter.ai
npm run dev
```

## Personnaliser l'IA

| Fichier | Rôle |
|---|---|
| `src/prompts/systemPrompt.ts` | Preprompt : rôle, ton, règles de l'IA |
| `src/prompts/recommendationPrompt.ts` | Message user : profil élève + recommandation formatés |

## Architecture

```
src/
├── App.tsx                        # State machine 6 écrans
├── components/
│   ├── ui/                        # Button, Badge, ProgressBar, StepHeader
│   ├── layout/AppShell.tsx
│   ├── forms/GradePicker.tsx
│   └── result/SpecialtyCard.tsx
├── pages/
│   ├── WelcomePage.tsx
│   ├── LevelPage.tsx
│   ├── CurrentSpecialtiesPage.tsx
│   ├── GradesPage.tsx
│   ├── GoalsPage.tsx
│   └── ResultPage.tsx
├── data/
│   ├── specialties.ts             # 9 spécialités
│   └── goals.ts                   # 6 projets d'orientation
├── rules/
│   ├── recommendationTypes.ts
│   └── recommendationEngine.ts    # Moteur local (scoring + NSI)
├── services/llm/
│   └── openrouter.ts              # Client OpenRouter
└── prompts/
    ├── systemPrompt.ts            # ← PREPROMPT éditable
    └── recommendationPrompt.ts    # ← MESSAGE user éditable
```

## Variables d'environnement

| Variable | Obligatoire | Description |
|---|---|---|
| `VITE_OPENROUTER_API_KEY` | Non | Active le bloc IA |
| `VITE_OPENROUTER_MODEL` | Non | Modèle (défaut : `anthropic/claude-3-haiku`) |
| `VITE_APP_URL` | Non | URL app pour headers OpenRouter |

## Stack

React 19 · Vite · TypeScript · Tailwind CSS v4 · Aucun backend
