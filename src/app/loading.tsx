export default function LoadingPage() {
  return (
    <main
      className="min-h-screen bg-surface px-5 py-10 sm:px-8 lg:px-14"
      aria-busy="true"
      aria-live="polite"
    >
      <section className="mx-auto w-full max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-forest-strong">
          LångKompass
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-[-0.03em] text-text-primary sm:text-4xl">
          Seite wird vorbereitet …
        </h1>
        <p className="mt-3 text-base leading-7 text-text-muted">
          Deine Daten werden sicher geladen.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2" aria-hidden="true">
          <div className="h-36 rounded-[var(--radius-lg)] border border-border bg-surface-raised" />
          <div className="h-36 rounded-[var(--radius-lg)] border border-border bg-surface-raised" />
          <div className="h-52 rounded-[var(--radius-lg)] border border-border bg-surface-raised sm:col-span-2" />
        </div>
      </section>
    </main>
  );
}
