import assert from "node:assert/strict";
import test from "node:test";

import { buildPersonalTrainingRecords } from "./personal-records";

test("ordnet persönliche Bestwerte alphabetisch den Übungen zu", () => {
  const records = buildPersonalTrainingRecords(
    [
      {
        exerciseId: "row",
        maximumWeightKg: 72.5,
        maximumRepetitions: 12,
        setCount: 8,
      },
      {
        exerciseId: "press",
        maximumWeightKg: 80,
        maximumRepetitions: 10,
        setCount: 6,
      },
    ],
    [
      { id: "row", name: "Rudern", normalizedName: "rudern" },
      {
        id: "press",
        name: "Bankdrücken",
        normalizedName: "bankdruecken",
      },
    ],
  );

  assert.deepEqual(
    records.map((record) => record.exerciseName),
    ["Bankdrücken", "Rudern"],
  );
  assert.equal(records[0]?.maximumWeightKg, 80);
  assert.equal(records[1]?.setCount, 8);
});

test("behält Körpergewichtsübungen und verwirft unvollständige Datensätze", () => {
  const records = buildPersonalTrainingRecords(
    [
      {
        exerciseId: "pull-up",
        maximumWeightKg: null,
        maximumRepetitions: 14,
        setCount: 4,
      },
      {
        exerciseId: "missing",
        maximumWeightKg: 20,
        maximumRepetitions: 10,
        setCount: 2,
      },
      {
        exerciseId: "empty",
        maximumWeightKg: null,
        maximumRepetitions: null,
        setCount: 0,
      },
    ],
    [
      {
        id: "pull-up",
        name: "Klimmzug",
        normalizedName: "klimmzug",
      },
      { id: "empty", name: "Leer", normalizedName: "leer" },
    ],
  );

  assert.deepEqual(records, [
    {
      exerciseId: "pull-up",
      exerciseName: "Klimmzug",
      normalizedName: "klimmzug",
      maximumWeightKg: null,
      maximumRepetitions: 14,
      setCount: 4,
    },
  ]);
});
