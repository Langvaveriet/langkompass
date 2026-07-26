import assert from "node:assert/strict";
import test from "node:test";

import { createCsvExport, serializeExportValue, type JsonObject } from "./data-export";

test("serialisiert Datum und Dezimalwerte portabel", () => {
  class Decimal {
    constructor(private readonly value: string) {}
    toString() { return this.value; }
  }

  assert.deepEqual(
    serializeExportValue({ at: new Date("2026-07-26T12:30:00.000Z"), value: new Decimal("6.23") }),
    { at: "2026-07-26T12:30:00.000Z", value: "6.23" },
  );
});

test("erstellt einen UTF-8-CSV-Export der Tageswerte", () => {
  const data: JsonObject = {
    dailyEntries: [{
      entryDate: "2026-07-26T00:00:00.000Z",
      status: "COMPLETED",
      steps: 7867,
      notes: "Guter Tag",
      symptomTags: ["Kopfschmerz", "Müde"],
      activityTags: ["Spaziergang"],
      measurements: [{ type: "WEIGHT", value: "82.40" }],
      meals: [],
    }],
  };

  const result = createCsvExport("daily-entries", data);

  assert.ok(result.startsWith("\uFEFF"));
  assert.match(result, /"Schritte"/);
  assert.match(result, /"7867"/);
  assert.match(result, /"82.40"/);
  assert.match(result, /"Kopfschmerz \| Müde"/);
});

test("bildet Ernährung, Training, Labor und Supplemente tabellarisch ab", () => {
  const data: JsonObject = {
    dailyEntries: [{
      entryDate: "2026-07-26T00:00:00.000Z",
      measurements: [],
      meals: [{
        consumedAt: "2026-07-26T08:00:00.000Z",
        type: "BREAKFAST",
        items: [{ name: "Joghurt", energyKcal: "120" }],
      }],
    }],
    training: {
      sessions: [{
        startedAt: "2026-07-26T10:00:00.000Z",
        planName: "Ganzkörper",
        sets: [{ exercise: { name: "Rudern" }, setNumber: 1, repetitions: 10 }],
      }],
    },
    laboratory: {
      referenceRanges: [{
        analyteKey: "hba1c",
        targetLow: "28",
        targetHigh: "36",
      }],
      reports: [{
        collectedAt: "2026-07-22T07:30:00.000Z",
        results: [{ analyteKey: "hba1c", analyteName: "HbA1c", value: "32", unit: "mmol/mol" }],
      }],
    },
    supplements: [{
      name: "Magnesium",
      intakes: [{ takenAt: "2026-07-26T20:00:00.000Z", dose: "1", doseUnit: "CAPSULE" }],
    }],
  };

  assert.match(createCsvExport("nutrition", data), /"Joghurt"/);
  assert.match(createCsvExport("training", data), /"Rudern"/);
  assert.match(createCsvExport("labs", data), /"HbA1c"/);
  assert.match(createCsvExport("labs", data), /"Persönliches Ziel von"/);
  assert.match(createCsvExport("labs", data), /"28"/);
  assert.match(createCsvExport("supplements", data), /"Magnesium"/);
});

test("neutralisiert Formeln in Freitextfeldern des CSV-Exports", () => {
  const data: JsonObject = {
    dailyEntries: [{
      entryDate: "2026-07-26T00:00:00.000Z",
      notes: "=HYPERLINK(\"https://example.test\")",
      measurements: [],
      meals: [],
    }],
  };

  const result = createCsvExport("daily-entries", data);
  assert.match(result, /"'=HYPERLINK\(""https:\/\/example\.test""\)"/);
});
