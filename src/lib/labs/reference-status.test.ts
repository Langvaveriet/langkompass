import assert from "node:assert/strict";
import test from "node:test";

import { labReferenceStatus } from "./reference-status";

test("classifies values against complete reference ranges", () => {
  assert.equal(labReferenceStatus(3.9, 4, 6), "BELOW");
  assert.equal(labReferenceStatus(5, 4, 6), "WITHIN");
  assert.equal(labReferenceStatus(6.1, 4, 6), "ABOVE");
});

test("supports one-sided reference ranges", () => {
  assert.equal(labReferenceStatus(4, null, 5), "WITHIN");
  assert.equal(labReferenceStatus(6, null, 5), "ABOVE");
  assert.equal(labReferenceStatus(3, 4, null), "BELOW");
  assert.equal(labReferenceStatus(4, 4, null), "WITHIN");
});

test("does not infer a status without a reference range", () => {
  assert.equal(labReferenceStatus(5, null, null), "UNAVAILABLE");
});
