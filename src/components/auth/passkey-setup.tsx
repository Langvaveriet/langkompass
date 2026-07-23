"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export function PasskeySetup() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function registerPasskey() {
    if (!token.trim()) {
      setError("Bitte gib den Einrichtungsschlüssel ein.");
      return;
    }

    setError(null);
    setIsPending(true);

    const registration = await authClient.passkey.addPasskey({
      name: "Erster Passkey",
      context: token.trim(),
    });

    if (registration.error) {
      setError("Der Passkey konnte nicht eingerichtet werden.");
      setIsPending(false);
      return;
    }

    const signIn = await authClient.signIn.passkey();

    if (signIn.error) {
      window.location.assign("/anmeldung?setup=1");
      return;
    }

    window.location.assign("/konto/sicherheit?setup=1");
  }

  return (
    <div className="grid gap-5">
      <Input
        id="setup-token"
        label="Einrichtungsschlüssel"
        type="password"
        autoComplete="off"
        value={token}
        onChange={(event) => setToken(event.target.value)}
        hint="Der Schlüssel wird nur für die einmalige Ersteinrichtung verwendet."
      />

      <Button size="lg" onClick={registerPasskey} disabled={isPending}>
        {isPending ? "Passkey wird eingerichtet …" : "Passkey einrichten"}
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
