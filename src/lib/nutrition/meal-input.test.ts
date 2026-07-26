import assert from "node:assert/strict";
import test from "node:test";

import { mealDetailsInputSchema } from "@/lib/nutrition/meal-input";

test("normalizes structured meal details", () => {
  const parsed = mealDetailsInputSchema.parse({
    consumedTime: "12:30",
    type: "LUNCH",
    customQuantity: "175,5",
  });

  assert.equal(parsed.customQuantity, 175.5);
});

test("allows an omitted custom quantity", () => {
  const parsed = mealDetailsInputSchema.parse({
    consumedTime: "08:00",
    type: "BREAKFAST",
    customQuantity: "",
  });

  assert.equal(parsed.customQuantity, null);
});

test("rejects impossible times, meal types and quantities", () => {
  assert.equal(
    mealDetailsInputSchema.safeParse({
      consumedTime: "29:90",
      type: "LUNCH",
      customQuantity: "100",
    }).success,
    false,
  );
  assert.equal(
    mealDetailsInputSchema.safeParse({
      consumedTime: "12:30",
      type: "BRUNCH",
      customQuantity: "100",
    }).success,
    false,
  );
  assert.equal(
    mealDetailsInputSchema.safeParse({
      consumedTime: "12:30",
      type: "LUNCH",
      customQuantity: "5001",
    }).success,
    false,
  );
});
