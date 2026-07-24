import assert from "node:assert/strict";
import test from "node:test";

import {
  normalizeRecipeName,
  recipeNameSchema,
  suggestRecipeName,
} from "./recipes";

test("normalisiert Rezeptnamen stabil für benutzerbezogene Eindeutigkeit", () => {
  assert.equal(normalizeRecipeName("  Joghurt & Äpfel  "), "joghurt-apfel");
});

test("akzeptiert kurze Namen, aber keine leeren oder überlangen Namen", () => {
  assert.equal(recipeNameSchema.parse("  Müsli  "), "Müsli");
  assert.equal(recipeNameSchema.safeParse(" ").success, false);
  assert.equal(recipeNameSchema.safeParse("♥♥").success, false);
  assert.equal(recipeNameSchema.safeParse("x".repeat(61)).success, false);
});

test("schlägt aus höchstens drei Lebensmitteln einen kurzen Namen vor", () => {
  assert.equal(
    suggestRecipeName(["Joghurt", "Obst", "Nüsse", "Honig"], "Frühstück"),
    "Joghurt, Obst, Nüsse",
  );
  assert.ok(suggestRecipeName(["x".repeat(80)], "Mahlzeit").length <= 60);
});
