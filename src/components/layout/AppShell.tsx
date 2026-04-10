import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L13 7M13 7L7 13M13 7H1" stroke="white" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="font-bold text-slate-800 text-sm tracking-tight">
              Horizon<span className="text-blue-700 ml-1">Orientation</span>
            </span>
          </div>
          <span className="text-xs text-slate-400 font-medium hidden sm:block">
            Aide au choix de spécialités
          </span>
        </div>
      </header>
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 pb-12">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">© 2025 Horizon Orientation</span>
          <span className="text-xs text-slate-400">Outil d'aide à la décision</span>
        </div>
      </footer>
    </div>
  );
}
