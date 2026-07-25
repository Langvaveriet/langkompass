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
  sourceLabels?: readonly string[];
};

export const labAnalytes = [
  { key: "esr", name: "Blutsenkungsgeschwindigkeit", shortName: "BSG", unit: "mm", category: "BLOOD_COUNT", sourceLabels: ["B-SR"] },
  { key: "hemoglobin", name: "Hämoglobin", shortName: "Hb", unit: "g/L", category: "BLOOD_COUNT", sourceLabels: ["B-Hb"] },
  { key: "hematocrit", name: "Hämatokrit", shortName: "EVF", unit: "L/L", category: "BLOOD_COUNT", sourceLabels: ["B-EVF"] },
  { key: "erythrocytes", name: "Erythrozyten", shortName: "Erythrozyten", unit: "10¹²/L", category: "BLOOD_COUNT", sourceLabels: ["B-EPK"] },
  { key: "mcv", name: "Mittleres Erythrozytenvolumen", shortName: "MCV", unit: "fL", category: "BLOOD_COUNT", sourceLabels: ["B-MCV"] },
  { key: "mch", name: "Mittleres korpuskuläres Hämoglobin", shortName: "MCH", unit: "pg", category: "BLOOD_COUNT", sourceLabels: ["Erc(B)-MCH"] },
  { key: "leukocytes", name: "Leukozyten", shortName: "Leukozyten", unit: "10⁹/L", category: "BLOOD_COUNT", sourceLabels: ["B-LPK"] },
  { key: "platelets", name: "Thrombozyten", shortName: "Thrombozyten", unit: "10⁹/L", category: "BLOOD_COUNT", sourceLabels: ["B-TPK"] },
  { key: "crp", name: "C-reaktives Protein", shortName: "CRP", unit: "mg/L", category: "BLOOD_COUNT", sourceLabels: ["P-CRP"] },
  { key: "ferritin", name: "Ferritin", shortName: "Ferritin", unit: "µg/L", category: "BLOOD_COUNT", sourceLabels: ["S-Ferritin"] },
  { key: "glucose", name: "Glukose", shortName: "Glukose", unit: "mmol/L", category: "METABOLISM", sourceLabels: ["P-Glukos"] },
  { key: "hba1c", name: "Langzeitblutzucker", shortName: "HbA1c", unit: "mmol/mol", category: "METABOLISM" },
  { key: "sodium", name: "Natrium", shortName: "Natrium", unit: "mmol/L", category: "METABOLISM", sourceLabels: ["P-Natrium"] },
  { key: "potassium", name: "Kalium", shortName: "Kalium", unit: "mmol/L", category: "METABOLISM", sourceLabels: ["P-Kalium"] },
  { key: "calcium", name: "Calcium", shortName: "Calcium", unit: "mmol/L", category: "METABOLISM", sourceLabels: ["P-Calcium"] },
  { key: "magnesium", name: "Magnesium", shortName: "Magnesium", unit: "mmol/L", category: "METABOLISM", sourceLabels: ["P-Magnesium"] },
  { key: "cholesterol", name: "Gesamtcholesterin", shortName: "Cholesterin", unit: "mmol/L", category: "LIPIDS", sourceLabels: ["P-Kolesterol"] },
  { key: "ldl", name: "LDL-Cholesterin", shortName: "LDL", unit: "mmol/L", category: "LIPIDS", sourceLabels: ["P-dLDL-Kolesterol"] },
  { key: "hdl", name: "HDL-Cholesterin", shortName: "HDL", unit: "mmol/L", category: "LIPIDS", sourceLabels: ["P-HDL-Kolesterol"] },
  { key: "triglycerides", name: "Triglyceride", shortName: "Triglyceride", unit: "mmol/L", category: "LIPIDS" },
  { key: "cholesterol-hdl-ratio", name: "Cholesterin-HDL-Quotient", shortName: "Cholesterin/HDL", unit: "Quotient", category: "LIPIDS", sourceLabels: ["Kolesterol/HDL"] },
  { key: "ldl-hdl-ratio", name: "LDL-HDL-Quotient", shortName: "LDL/HDL", unit: "Quotient", category: "LIPIDS", sourceLabels: ["dLDL/HDL"] },
  { key: "creatinine", name: "Kreatinin", shortName: "Kreatinin", unit: "µmol/L", category: "KIDNEY_LIVER", sourceLabels: ["P-Kreatinin enz."] },
  { key: "egfr", name: "Geschätzte Filtrationsrate", shortName: "eGFR", unit: "mL/min/1,73 m²", category: "KIDNEY_LIVER", sourceLabels: ["Pt-eGFR(Krea)/1,73m2(L)"] },
  { key: "urate", name: "Harnsäure", shortName: "Harnsäure", unit: "µmol/L", category: "KIDNEY_LIVER", sourceLabels: ["P-Urat"] },
  { key: "albumin", name: "Albumin", shortName: "Albumin", unit: "g/L", category: "KIDNEY_LIVER", sourceLabels: ["P-Albumin"] },
  { key: "bilirubin", name: "Bilirubin", shortName: "Bilirubin", unit: "µmol/L", category: "KIDNEY_LIVER", sourceLabels: ["P-Bilirubin"] },
  { key: "alkaline-phosphatase", name: "Alkalische Phosphatase", shortName: "AP", unit: "µkat/L", category: "KIDNEY_LIVER", sourceLabels: ["P-Alkaliskt fosfatas"] },
  { key: "alat", name: "Alanin-Aminotransferase", shortName: "ALAT", unit: "µkat/L", category: "KIDNEY_LIVER", sourceLabels: ["P-ALAT"] },
  { key: "asat", name: "Aspartat-Aminotransferase", shortName: "ASAT", unit: "µkat/L", category: "KIDNEY_LIVER" },
  { key: "urine-creatinine", name: "Kreatinin im Urin", shortName: "Urin-Kreatinin", unit: "mmol/L", category: "KIDNEY_LIVER", sourceLabels: ["U-Kreatinin enz."] },
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
