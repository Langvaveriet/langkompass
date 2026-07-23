"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { signInWithVerifiedPasskey } from "@/lib/passkey-authentication";

export function PasskeyLogin() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function signIn() {
    setError(null);
    setIsPending(true);

    try {
      const authenticated = await signInWithVerifiedPasskey();

      if (!authenticated) {
        setError("Die Anmeldung konnte nicht abgeschlossen werden.");
        setIsPending(false);
        return;
      }
    } catch {
      setError("Die Anmeldung konnte nicht abgeschlossen werden.");
      setIsPending(false);
      return;
    }

    window.location.assign("/");
  }

  return (
    <div className="grid gap-4">
      <Button size="lg" onClick={signIn} disabled={isPending}>
        {isPending ? "Passkey wird geprüft …" : "Mit Passkey anmelden"}
      </Button>

      {error ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
