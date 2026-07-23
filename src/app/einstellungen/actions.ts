"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
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
