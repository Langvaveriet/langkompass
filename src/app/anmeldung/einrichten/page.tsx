import { redirect } from "next/navigation";

import { PasskeySetup } from "@/components/auth/passkey-setup";
import { getSession } from "@/lib/session";

export default async function PasskeySetupPage() {
  const session = await getSession();

  if (session) {
    redirect("/konto/sicherheit");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-10">
      <section className="w-full max-w-md rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-7 shadow-md sm:p-9">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-forest-strong">
          LångKompass
        </p>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-text-primary">
          Passkey einrichten
        </h1>
        <p className="mt-3 text-base leading-7 text-text-muted">
          Diese geschützte Ersteinrichtung verbindet deinen vorhandenen
          LångKompass-Benutzer mit diesem Gerät.
        </p>

        <div className="mt-7">
          <PasskeySetup />
        </div>
      </section>
    </main>
  );
}
