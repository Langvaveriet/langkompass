"use client";

import { useActionState, useRef, useState, useTransition } from "react";

import {
  deleteAccount,
  type DeleteAccountState,
} from "@/app/einstellungen/actions";
import { Input } from "@/components/ui/input";
import { accountDeletionConfirmation } from "@/lib/account/account-deletion";
import { signInWithVerifiedPasskey } from "@/lib/passkey-authentication";

const initialState: DeleteAccountState = { error: null };

export function DeleteAccountForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [confirmation, setConfirmation] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [state, formAction, isActionPending] = useActionState(
    deleteAccount,
    initialState,
  );
  const [isTransitionPending, startTransition] = useTransition();

  const ready =
    confirmation.trim() === accountDeletionConfirmation && acknowledged;
  const pending = isVerifying || isActionPending || isTransitionPending;

  async function verifyAndDelete() {
    if (!ready || !formRef.current || pending) return;

    setVerificationError(null);
    setIsVerifying(true);

    try {
      const verified = await signInWithVerifiedPasskey();
      if (!verified) {
        setVerificationError(
          "Der Passkey konnte nicht bestätigt werden. Das Konto wurde nicht gelöscht.",
        );
        return;
      }

      const data = new FormData(formRef.current);
      startTransition(() => formAction(data));
    } catch {
      setVerificationError(
        "Die Passkey-Prüfung wurde abgebrochen. Das Konto wurde nicht gelöscht.",
      );
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        void verifyAndDelete();
      }}
    >
      <div className="rounded-[var(--radius-md)] border border-red-300 bg-red-50 p-4 text-sm leading-6 text-red-900">
        <p className="font-semibold">Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Alle Gesundheits-, Ernährungs-, Trainings- und Labordaten werden gelöscht.</li>
          <li>Supplementdaten, Pläne, Einstellungen und Passkeys werden gelöscht.</li>
          <li>Eine erneute Nutzung erfordert den Benutzer-Bootstrap und eine neue Passkey-Ersteinrichtung.</li>
        </ul>
      </div>

      <label className="flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-red-300 bg-surface-raised px-4 py-3 text-sm leading-6 text-text-primary">
        <input
          type="checkbox"
          name="acknowledged"
          value="yes"
          checked={acknowledged}
          onChange={(event) => setAcknowledged(event.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-red-700"
        />
        Ich habe meine benötigten Daten exportiert und verstehe, dass die
        Löschung endgültig ist.
      </label>

      <Input
        id="account-deletion-confirmation"
        name="confirmation"
        label={`Zur Bestätigung ${accountDeletionConfirmation} eingeben`}
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        autoComplete="off"
        spellCheck={false}
        error={state.error ?? undefined}
      />

      <button
        type="submit"
        disabled={!ready || pending}
        className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-red-700 px-5 py-3 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-text-muted"
      >
        {pending ? "Passkey wird geprüft …" : "Konto und alle Daten endgültig löschen"}
      </button>

      {verificationError ? (
        <p
          role="alert"
          className="rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
        >
          {verificationError}
        </p>
      ) : null}
    </form>
  );
}
