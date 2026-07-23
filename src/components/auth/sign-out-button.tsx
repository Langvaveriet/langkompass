"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  async function signOut() {
    setIsPending(true);
    await authClient.signOut();
    window.location.assign("/anmeldung");
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={isPending}
      className="text-sm font-semibold text-forest-strong disabled:text-text-muted"
    >
      {isPending ? "Abmelden …" : "Abmelden"}
    </button>
  );
}
