import Link from "next/link";
import { redirect } from "next/navigation";

import { PasskeyLogin } from "@/components/auth/passkey-login";
import { getSession } from "@/lib/session";

type PageProps = {
  searchParams: Promise<{ setup?: string }>;
};

export default async function AnmeldungPage({ searchParams }: PageProps) {
  const [session, query] = await Promise.all([getSession(), searchParams]);

  if (session) {
    redirect("/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-10">
      <section className="w-full max-w-md rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-7 shadow-md sm:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-forest-strong">
          LångKompass
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-text-primary">
          Willkommen zurück
        </h1>
        <p className="mt-3 text-base leading-7 text-text-muted">
          Melde dich sicher mit Touch ID, Face ID oder deinem
          Sicherheitsschlüssel an.
        </p>

        {query.setup === "1" ? (
          <p
            role="status"
            className="mt-5 rounded-[var(--radius-md)] bg-forest-soft px-4 py-3 text-sm font-medium text-forest-strong"
          >
            Der Passkey ist eingerichtet. Melde dich jetzt damit an.
          </p>
        ) : null}

        <div className="mt-7">
          <PasskeyLogin />
        </div>

        <p className="mt-7 text-center text-xs leading-5 text-text-muted">
          Noch kein Passkey?{" "}
          <Link
            href="/anmeldung/einrichten"
            className="font-semibold text-forest-strong underline underline-offset-4"
          >
            Ersteinrichtung öffnen
          </Link>
        </p>
      </section>
    </main>
  );
}
