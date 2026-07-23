import Link from "next/link";
import { headers } from "next/headers";

import { PasskeyManager } from "@/components/auth/passkey-manager";
import { auth } from "@/lib/auth";
import { requireUser } from "@/lib/session";

type PageProps = {
  searchParams: Promise<{ setup?: string }>;
};

export default async function SicherheitPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const [query, passkeys] = await Promise.all([
    searchParams,
    auth.api.listPasskeys({ headers: await headers() }),
  ]);

  return (
    <main className="min-h-screen bg-surface px-5 py-10 sm:px-8">
      <section className="mx-auto w-full max-w-2xl">
        <Link
          href="/"
          className="text-sm font-semibold text-forest-strong"
        >
          ← Zurück zur Übersicht
        </Link>

        <div className="mt-6 rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-6 shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-forest-strong">
            Kontosicherheit
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-text-primary">
            Deine Passkeys
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-muted">
            Angemeldet als {user.email}. Verwalte hier die Geräte, die Zugriff
            auf deine Gesundheitsdaten erhalten.
          </p>

          {query.setup === "1" ? (
            <p
              role="status"
              className="mt-5 rounded-[var(--radius-md)] bg-forest-soft px-4 py-3 text-sm font-medium text-forest-strong"
            >
              Dein erster Passkey wurde erfolgreich eingerichtet.
            </p>
          ) : null}

          <div className="mt-7">
            <PasskeyManager initialPasskeys={passkeys} />
          </div>
        </div>
      </section>
    </main>
  );
}
