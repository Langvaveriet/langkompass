export const accountDeletionConfirmation = "LÖSCHEN";
export const accountDeletionSessionMaxAgeMs = 5 * 60 * 1000;

export type AccountDeletionInput = {
  confirmed: boolean;
  valid: boolean;
};

export function parseAccountDeletionInput(formData: FormData): AccountDeletionInput {
  const confirmation = formData.get("confirmation");
  const acknowledged = formData.get("acknowledged");

  return {
    confirmed: acknowledged === "yes",
    valid:
      acknowledged === "yes" &&
      typeof confirmation === "string" &&
      confirmation.trim() === accountDeletionConfirmation,
  };
}

export function isRecentAccountDeletionSession(
  createdAt: Date | string,
  now = new Date(),
): boolean {
  const sessionCreatedAt = new Date(createdAt).getTime();
  const age = now.getTime() - sessionCreatedAt;

  return Number.isFinite(sessionCreatedAt) && age >= 0 && age <= accountDeletionSessionMaxAgeMs;
}
