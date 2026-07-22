import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <header className="border-b border-stone-200 bg-stone-50">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-emerald-900">
              LångKompass
            </p>
            <p className="text-xs text-stone-500">Dein ruhiger Gesundheitskompass</p>
          </div>

          <div className="text-sm text-stone-500">Sprint 1</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-b border-stone-200 bg-stone-50 p-6 md:min-h-[calc(100vh-65px)] md:border-r md:border-b-0">
          <nav aria-label="Hauptnavigation">
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="block rounded-lg bg-emerald-950 px-4 py-3 font-medium text-stone-50"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <span className="block rounded-lg px-4 py-3 text-stone-500">
                  Tageserfassung
                </span>
              </li>
              <li>
                <span className="block rounded-lg px-4 py-3 text-stone-500">
                  Training
                </span>
              </li>
              <li>
                <span className="block rounded-lg px-4 py-3 text-stone-500">
                  Ernährung
                </span>
              </li>
              <li>
                <span className="block rounded-lg px-4 py-3 text-stone-500">
                  Laborwerte
                </span>
              </li>
              <li>
                <span className="block rounded-lg px-4 py-3 text-stone-500">
                  Compass AI
                </span>
              </li>
            </ul>
          </nav>
        </aside>

        <main className="p-6 sm:p-8 lg:p-12">{children}</main>
      </div>
    </div>
  );
}
