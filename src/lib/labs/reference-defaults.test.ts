import assert from "node:assert/strict";
import test from "node:test";

import { buildLabReferenceDefaults } from "./reference-defaults";

test("uses permanently saved reference ranges before historical results", () => {
  const defaults = buildLabReferenceDefaults(
    [{ analyteKey: "ferritin", referenceLow: 30, referenceHigh: 300 }],
    [{ analyteKey: "ferritin", referenceLow: 20, referenceHigh: 250 }],
  );

  assert.deepEqual(defaults.ferritin, {
    referenceLow: "30",
    referenceHigh: "300",
  });
});

test("uses the newest historical result when no saved range exists", () => {
  const defaults = buildLabReferenceDefaults([], [
    { analyteKey: "glucose", referenceLow: 4.1, referenceHigh: 6.0 },
    { analyteKey: "glucose", referenceLow: 4.0, referenceHigh: 5.9 },
  ]);

  assert.deepEqual(defaults.glucose, {
    referenceLow: "4.1",
    referenceHigh: "6",
  });
});

test("preserves an intentionally cleared saved range", () => {
  const defaults = buildLabReferenceDefaults(
    [{ analyteKey: "tsh", referenceLow: null, referenceHigh: null }],
    [{ analyteKey: "tsh", referenceLow: 0.4, referenceHigh: 4 }],
  );

  assert.deepEqual(defaults.tsh, {
    referenceLow: "",
    referenceHigh: "",
  });
});
