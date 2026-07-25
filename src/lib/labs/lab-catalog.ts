export const labCategories = [
  "BLOOD_COUNT",
  "METABOLISM",
  "LIPIDS",
  "KIDNEY_LIVER",
  "VITAMINS_HORMONES",
] as const;

export type LabCategory = (typeof labCategories)[number];

export const labCategoryLabels: Record<LabCategory, string> = {
  BLOOD_COUNT: "Blutbild & Entzündung",
  METABOLISM: "Stoffwechsel",
  LIPIDS: "Blutfette",
  KIDNEY_LIVER: "Niere & Leber",
  VITAMINS_HORMONES: "Vitamine & Hormone",
};

export type LabAnalyte = {
  key: string;
  name: string;
  shortName: string;
  unit: string;
  category: LabCategory;
};

export const labAnalytes = [
  { key: "hemoglobin", name: "Hämoglobin", shortName: "Hb", unit: "g/L", category: "BLOOD_COUNT" },
  { key: "leukocytes", name: "Leukozyten", shortName: "Leukozyten", unit: "10⁹/L", category: "BLOOD_COUNT" },
  { key: "platelets", name: "Thrombozyten", shortName: "Thrombozyten", unit: "10⁹/L", category: "BLOOD_COUNT" },
  { key: "crp", name: "C-reaktives Protein", shortName: "CRP", unit: "mg/L", category: "BLOOD_COUNT" },
  { key: "ferritin", name: "Ferritin", shortName: "Ferritin", unit: "µg/L", category: "BLOOD_COUNT" },
  { key: "glucose", name: "Glukose", shortName: "Glukose", unit: "mmol/L", category: "METABOLISM" },
  { key: "hba1c", name: "Langzeitblutzucker", shortName: "HbA1c", unit: "mmol/mol", category: "METABOLISM" },
  { key: "sodium", name: "Natrium", shortName: "Natrium", unit: "mmol/L", category: "METABOLISM" },
  { key: "potassium", name: "Kalium", shortName: "Kalium", unit: "mmol/L", category: "METABOLISM" },
  { key: "calcium", name: "Calcium", shortName: "Calcium", unit: "mmol/L", category: "METABOLISM" },
  { key: "cholesterol", name: "Gesamtcholesterin", shortName: "Cholesterin", unit: "mmol/L", category: "LIPIDS" },
  { key: "ldl", name: "LDL-Cholesterin", shortName: "LDL", unit: "mmol/L", category: "LIPIDS" },
  { key: "hdl", name: "HDL-Cholesterin", shortName: "HDL", unit: "mmol/L", category: "LIPIDS" },
  { key: "triglycerides", name: "Triglyceride", shortName: "Triglyceride", unit: "mmol/L", category: "LIPIDS" },
  { key: "creatinine", name: "Kreatinin", shortName: "Kreatinin", unit: "µmol/L", category: "KIDNEY_LIVER" },
  { key: "egfr", name: "Geschätzte Filtrationsrate", shortName: "eGFR", unit: "mL/min/1,73 m²", category: "KIDNEY_LIVER" },
  { key: "alat", name: "Alanin-Aminotransferase", shortName: "ALAT", unit: "µkat/L", category: "KIDNEY_LIVER" },
  { key: "asat", name: "Aspartat-Aminotransferase", shortName: "ASAT", unit: "µkat/L", category: "KIDNEY_LIVER" },
  { key: "tsh", name: "Thyreoidea-stimulierendes Hormon", shortName: "TSH", unit: "mIU/L", category: "VITAMINS_HORMONES" },
  { key: "vitamin-d", name: "25-OH-Vitamin D", shortName: "Vitamin D", unit: "nmol/L", category: "VITAMINS_HORMONES" },
  { key: "vitamin-b12", name: "Vitamin B12", shortName: "Vitamin B12", unit: "pmol/L", category: "VITAMINS_HORMONES" },
  { key: "folate", name: "Folat", shortName: "Folat", unit: "nmol/L", category: "VITAMINS_HORMONES" },
] as const satisfies readonly LabAnalyte[];

export const labAnalyteByKey = new Map<string, LabAnalyte>(
  labAnalytes.map((analyte) => [analyte.key, analyte]),
);

export const fastingStatusLabels = {
  UNKNOWN: "Nicht angegeben",
  FASTING: "Nüchtern",
  NOT_FASTING: "Nicht nüchtern",
} as const;
