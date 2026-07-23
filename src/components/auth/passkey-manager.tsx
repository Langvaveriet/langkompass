"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type StoredPasskey = {
  id: string;
  name?: string | null;
  deviceType: string;
  backedUp: boolean;
  createdAt?: Date | string | null;
};

type PasskeyManagerProps = {
  initialPasskeys: StoredPasskey[];
};

export function PasskeyManager({ initialPasskeys }: PasskeyManagerProps) {
  const [passkeys, setPasskeys] = useState<StoredPasskey[]>(initialPasskeys);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function loadPasskeys() {
    const result = await authClient.passkey.listUserPasskeys();

    if (result.error) {
      setError(result.error.message || "Passkeys konnten nicht geladen werden.");
      return;
    }

    setPasskeys(result.data ?? []);
  }

  async function addPasskey() {
    setError(null);
    setIsPending(true);

    const result = await authClient.passkey.addPasskey({
      name: name.trim() || "Weiterer Passkey",
    });

    if (result.error) {
      setError(result.error.message || "Passkey konnte nicht hinzugefügt werden.");
      setIsPending(false);
      return;
    }

    setName("");
    await loadPasskeys();
    setIsPending(false);
  }

  async function deletePasskey(id: string) {
    if (passkeys.length <= 1) {
      setError("Der letzte Passkey kann nicht entfernt werden.");
      return;
    }

    setError(null);
    setIsPending(true);

    const result = await authClient.passkey.deletePasskey({ id });

    if (result.error) {
      setError(result.error.message || "Passkey konnte nicht entfernt werden.");
    } else {
      await loadPasskeys();
    }

    setIsPending(false);
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-3">
        {passkeys.length === 0 ? (
          <p className="text-sm text-text-muted">Passkeys werden geladen …</p>
        ) : (
          <ul className="grid gap-3">
            {passkeys.map((passkey) => (
              <li
                key={passkey.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border-subtle bg-surface-muted p-4"
              >
                <div>
                  <p className="font-semibold text-text-primary">
                    {passkey.name || "Passkey"}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-text-muted">
                    {passkey.deviceType === "multiDevice"
                      ? "Synchronisierter Passkey"
                      : "Gerätegebundener Passkey"}
                    {passkey.backedUp ? " · gesichert" : ""}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isPending || passkeys.length <= 1}
                  onClick={() => deletePasskey(passkey.id)}
                  className="text-sm font-semibold text-copper disabled:text-text-muted"
                >
                  Entfernen
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 border-t border-border-subtle pt-6">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Weiteren Passkey hinzufügen
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            Hinterlege mindestens einen zweiten Zugang für ein weiteres Gerät
            oder einen Hardware-Sicherheitsschlüssel.
          </p>
        </div>

        <Input
          id="passkey-name"
          label="Bezeichnung"
          placeholder="z. B. iPhone oder Sicherheitsschlüssel"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Button onClick={addPasskey} disabled={isPending}>
          {isPending ? "Bitte warten …" : "Passkey hinzufügen"}
        </Button>
      </div>

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
