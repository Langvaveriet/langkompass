import { AppShell } from "@/components/layout/app-shell";
import { appVersion } from "@/lib/version";

export default function Home() {
  return (
    <AppShell>
      <section className="max-w-4xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-amber-800">
          Willkommen
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-emerald-950 sm:text-5xl">
          Dein Gesundheitskompass entsteht.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
          LångKompass verbindet künftig Gesundheit, Ernährung, Bewegung und
          persönliche Entwicklung an einem ruhigen, datensouveränen Ort.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <p className="text-sm text-stone-500">Heute</p>
            <h2 className="mt-2 text-xl font-semibold text-stone-900">
              Noch keine Einträge
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Die Tageserfassung wird in einem der nächsten Schritte ergänzt.
            </p>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <p className="text-sm text-stone-500">Compass AI</p>
            <h2 className="mt-2 text-xl font-semibold text-stone-900">
              Vorbereitung läuft
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              Die sichere Kontext- und Provider-Struktur entsteht in Sprint 1.
            </p>
          </article>

          <article className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <p className="text-sm text-stone-500">Version</p>
            <h2 className="mt-2 text-xl font-semibold text-stone-900">
              {appVersion.version}
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-600">
              {appVersion.phase}
            </p>
          </article>
        </div>
      </section>
    </AppShell>
  );
}
