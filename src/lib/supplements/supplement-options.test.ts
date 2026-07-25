import assert from "node:assert/strict";
import test from "node:test";

import {
  supplementDoseUnitLabels,
  supplementDoseUnitLabel,
  supplementDoseUnits,
  supplementEffectLabels,
  supplementEffects,
  supplementFormLabels,
  supplementForms,
  supplementIngredientUnitLabels,
  supplementIngredientUnits,
  supplementReasonLabels,
  supplementReasons,
  supplementToleranceLabels,
  supplementTolerances,
} from "./supplement-options";

function assertCompleteLabels<const Value extends string>(
  values: readonly Value[],
  labels: Record<Value, string>,
) {
  assert.equal(new Set(values).size, values.length);
  for (const value of values) assert.ok(labels[value]);
}

test("defines unique structured supplement choices with labels", () => {
  assertCompleteLabels(supplementForms, supplementFormLabels);
  assertCompleteLabels(supplementDoseUnits, supplementDoseUnitLabels);
  assertCompleteLabels(supplementIngredientUnits, supplementIngredientUnitLabels);
  assertCompleteLabels(supplementReasons, supplementReasonLabels);
  assertCompleteLabels(supplementTolerances, supplementToleranceLabels);
  assertCompleteLabels(supplementEffects, supplementEffectLabels);
  assert.equal(supplementDoseUnitLabel("CAPSULE", 1), "Kapsel");
  assert.equal(supplementDoseUnitLabel("CAPSULE", 2), "Kapseln");
});
