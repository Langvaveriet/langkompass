"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import {
  isRecentAccountDeletionSession,
  parseAccountDeletionInput,
} from "@/lib/account/account-deletion";
import { deleteUserAccount } from "@/lib/account/account-deletion.server";
import { getSession, requireUser } from "@/lib/session";
import {
  defaultLocale,
  supportedTimeZoneValues,
} from "@/lib/user-settings";

export async function saveUserSettings(formData: FormData) {
  const user = await requireUser();
  const timeZoneValue = formData.get("timeZone");

  if (
    typeof timeZoneValue !== "string" ||
    !supportedTimeZoneValues.has(timeZoneValue)
  ) {
    redirect("/einstellungen?error=timezone");
  }

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: { timeZone: timeZoneValue },
    create: {
      userId: user.id,
      timeZone: timeZoneValue,
      locale: defaultLocale,
    },
  });

  revalidatePath("/");
  revalidatePath("/tageserfassung");
  revalidatePath("/ernaehrung");
  revalidatePath("/einstellungen");
  redirect("/einstellungen?saved=1");
}

export type DeleteAccountState = {
  error: string | null;
};

export async function deleteAccount(
  _previousState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const input = parseAccountDeletionInput(formData);

  if (!input.valid) {
    return {
      error:
        "Bitte bestätige die Folgen und gib das Wort LÖSCHEN vollständig ein.",
    };
  }

  const session = await getSession();
  if (!session) {
    redirect("/anmeldung");
  }

  if (!isRecentAccountDeletionSession(session.session.createdAt)) {
    return {
      error:
        "Die erneute Passkey-Bestätigung ist abgelaufen. Bitte starte die Löschung noch einmal.",
    };
  }

  try {
    await deleteUserAccount(session.user.id);
  } catch (error) {
    console.error("Das Benutzerkonto konnte nicht vollständig gelöscht werden.", error);
    return {
      error:
        "Das Konto konnte nicht vollständig gelöscht werden. Es wurden keine unvollständigen Änderungen übernommen.",
    };
  }

  redirect("/anmeldung?deleted=1");
}
