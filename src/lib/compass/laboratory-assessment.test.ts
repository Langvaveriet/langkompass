import assert from "node:assert/strict";
import test from "node:test";

import { buildLaboratoryAssessment } from "./laboratory-assessment";

test("ordnet nur Laborabweichungen ein und wiederholt keine Messzahlen", () => {
  const assessment = buildLaboratoryAssessment([
    {
      analyteKey: "esr",
      analyteName: "Blutsenkungsgeschwindigkeit",
      value: 20,
      referenceLow: 0,
      referenceHigh: 13,
    },
    {
      analyteKey: "ferritin",
      analyteName: "Ferritin",
      value: 90,
      referenceLow: 30,
      referenceHigh: 300,
    },
  ]);

  assert.equal(assessment.assessedCount, 2);
  assert.equal(assessment.outsideReferenceCount, 1);
  assert.equal(assessment.withinReferenceCount, 1);
  assert.equal(assessment.insights[0]?.analyteKey, "esr");
  assert.equal(assessment.insights[0]?.status, "ABOVE");
  assert.doesNotMatch(JSON.stringify(assessment.insights), /20|13/);
});

test("trennt mögliche Einflussfaktoren, nächste Schritte und natürliche Optionen", () => {
  const insight = buildLaboratoryAssessment([
    {
      analyteKey: "ldl",
      analyteName: "LDL-Cholesterin",
      value: 4.2,
      referenceLow: null,
      referenceHigh: 3,
    },
  ]).insights[0];

  assert.ok(insight);
  assert.ok(insight.possibleFactors.length > 0);
  assert.ok(insight.nextSteps.some((step) => /ärztlich|bewerten/.test(step)));
  assert.ok(insight.naturalOptions.some((option) => /Olivenöl/.test(option)));
});

test("bewertet Werte ohne Laborreferenz nicht medizinisch", () => {
  const assessment = buildLaboratoryAssessment([
    {
      analyteKey: "glucose",
      analyteName: "Glukose",
      value: 5.1,
      referenceLow: null,
      referenceHigh: null,
    },
  ]);

  assert.equal(assessment.assessedCount, 0);
  assert.equal(assessment.withoutReferenceCount, 1);
  assert.deepEqual(assessment.insights, []);
});
