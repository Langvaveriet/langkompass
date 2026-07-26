import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-10">
      <section className="w-full max-w-md rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-7 shadow-md sm:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-forest-strong">
          LångKompass
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-text-primary">
          Gerade keine Verbindung
        </h1>
        <p className="mt-3 text-base leading-7 text-text-muted">
          Deine Gesundheitsdaten werden aus Sicherheitsgründen nicht in einem
          ungeschützten Offline-Cache gespeichert. Stelle die Verbindung wieder
          her und versuche es anschließend erneut.
        </p>
        <Link
          href="/"
          className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-forest-strong px-5 text-sm font-semibold text-white"
        >
          Erneut verbinden
        </Link>
      </section>
    </main>
  );
}
