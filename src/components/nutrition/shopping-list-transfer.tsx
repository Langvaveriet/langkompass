"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

type TransferStatus = "idle" | "copied" | "shared" | "error";

export function ShoppingListTransfer({
  text,
  weekLabel,
}: {
  text: string;
  weekLabel: string;
}) {
  const [status, setStatus] = useState<TransferStatus>("idle");

  async function copyList() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  async function shareList() {
    if (!navigator.share) {
      await copyList();
      return;
    }

    try {
      await navigator.share({
        title: `LångKompass Einkaufsliste ${weekLabel}`,
        text,
      });
      setStatus("shared");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("error");
    }
  }

  const statusText = status === "copied"
    ? "Liste wurde kopiert."
    : status === "shared"
      ? "Teilen wurde geöffnet."
      : status === "error"
        ? "Die Übergabe war nicht möglich. Bitte versuche es erneut."
        : null;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button type="button" size="lg" onClick={shareList}>
          Liste teilen
        </Button>
        <Button type="button" size="lg" variant="secondary" onClick={copyList}>
          Für Pon kopieren
        </Button>
      </div>
      {statusText ? (
        <p
          role={status === "error" ? "alert" : "status"}
          className={`mt-3 text-sm font-semibold ${status === "error" ? "text-danger" : "text-forest-strong"}`}
        >
          {statusText}
        </p>
      ) : null}
    </div>
  );
}
