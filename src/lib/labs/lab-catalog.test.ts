import assert from "node:assert/strict";
import test from "node:test";

import { labAnalyteByKey, labAnalytes } from "./lab-catalog";

const reportAnalytes = [
  ["esr", "mm"],
  ["hematocrit", "L/L"],
  ["erythrocytes", "10¹²/L"],
  ["mcv", "fL"],
  ["mch", "pg"],
  ["urate", "µmol/L"],
  ["albumin", "g/L"],
  ["bilirubin", "µmol/L"],
  ["alkaline-phosphatase", "µkat/L"],
  ["cholesterol-hdl-ratio", "Quotient"],
  ["ldl-hdl-ratio", "Quotient"],
  ["magnesium", "mmol/L"],
  ["urine-creatinine", "mmol/L"],
] as const;

const reportSourceLabels = [
  "B-SR",
  "P-CRP",
  "B-Hb",
  "B-EVF",
  "B-EPK",
  "B-MCV",
  "Erc(B)-MCH",
  "B-LPK",
  "B-TPK",
  "S-Ferritin",
  "P-Natrium",
  "P-Kalium",
  "P-Calcium",
  "P-Kreatinin enz.",
  "Pt-eGFR(Krea)/1,73m2(L)",
  "P-Urat",
  "P-Albumin",
  "P-Bilirubin",
  "P-Alkaliskt fosfatas",
  "P-ALAT",
  "P-Kolesterol",
  "P-HDL-Kolesterol",
  "P-dLDL-Kolesterol",
  "Kolesterol/HDL",
  "dLDL/HDL",
  "P-Magnesium",
  "P-Glukos",
  "U-Kreatinin enz.",
] as const;

test("contains every structured analyte added from the reference report", () => {
  for (const [key, unit] of reportAnalytes) {
    assert.equal(labAnalyteByKey.get(key)?.unit, unit);
  }
});

test("uses stable unique keys for the laboratory catalog", () => {
  assert.equal(new Set(labAnalytes.map(({ key }) => key)).size, labAnalytes.length);
});

test("maps every analysis label from the reference report", () => {
  const mappedSourceLabels = new Set(
    labAnalytes.flatMap((analyte) =>
      "sourceLabels" in analyte ? analyte.sourceLabels : [],
    ),
  );

  for (const sourceLabel of reportSourceLabels) {
    assert.ok(mappedSourceLabels.has(sourceLabel), sourceLabel);
  }
});
