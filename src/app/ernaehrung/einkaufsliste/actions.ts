"use server";

import { revalidatePath } from "next/cache";

import { buildShoppingList } from "@/lib/nutrition/shopping-list";
import { isIsoDate, isoWeekDates } from "@/lib/nutrition/weekly-plan";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

function formText(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function toggleShoppingListItem(formData: FormData) {
  const user = await requireUser();
  const date = formText(formData, "date");
  const requestedKey = formText(formData, "itemKey");
  const checked = formText(formData, "checked") === "1";

  if (!date || !isIsoDate(date) || !requestedKey) return;

  const weekDates = isoWeekDates(date);
  const weekStart = new Date(`${weekDates[0]}T00:00:00.000Z`);
  const weekEnd = new Date(`${weekDates[6]}T00:00:00.000Z`);
  const entries = await prisma.mealPlanEntry.findMany({
    where: {
      userId: user.id,
      plannedDate: { gte: weekStart, lte: weekEnd },
    },
    select: {
      recipe: {
        select: {
          items: {
            select: {
              foodKey: true,
              name: true,
              category: true,
              quantity: true,
              unit: true,
            },
          },
        },
      },
    },
  });
  const availableKeys = new Set(
    buildShoppingList(entries.flatMap((entry) => entry.recipe.items)).map(
      (item) => item.key,
    ),
  );
  if (!availableKeys.has(requestedKey)) return;

  await prisma.shoppingListItemState.upsert({
    where: {
      userId_weekStart_itemKey: {
        userId: user.id,
        weekStart,
        itemKey: requestedKey,
      },
    },
    update: { checkedAt: checked ? new Date() : null },
    create: {
      userId: user.id,
      weekStart,
      itemKey: requestedKey,
      checkedAt: checked ? new Date() : null,
    },
  });

  revalidatePath("/ernaehrung/einkaufsliste");
}
