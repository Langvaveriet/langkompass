export const dataExportDatasets = [
  "daily-entries",
  "nutrition",
  "training",
  "labs",
  "supplements",
] as const;

export type DataExportDataset = (typeof dataExportDatasets)[number];

type JsonPrimitive = boolean | number | string | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];
export type JsonObject = { [key: string]: JsonValue };

function isDecimalLike(value: object): value is { toString(): string } {
  return value.constructor?.name === "Decimal" && "toString" in value;
}

export function serializeExportValue(value: unknown): JsonValue {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeExportValue);
  }

  if (typeof value === "object") {
    if (isDecimalLike(value)) {
      return value.toString();
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, serializeExportValue(item)]),
    );
  }

  return String(value);
}

export async function loadUserDataExport(userId: string): Promise<JsonObject | null> {
  const { prisma } = await import("@/lib/prisma");
  const [
    user,
    settings,
    healthProfile,
    dailyEntries,
    labReports,
    labReferenceRanges,
    supplements,
    exercises,
    trainingPlans,
    trainingSessions,
    recipes,
    mealPlanEntries,
    shoppingListItemStates,
    accounts,
    passkeys,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        emailVerified: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.userSettings.findUnique({ where: { userId } }),
    prisma.healthProfile.findUnique({ where: { userId } }),
    prisma.dailyEntry.findMany({
      where: { userId },
      include: {
        measurements: { orderBy: { measuredAt: "asc" } },
        meals: {
          include: { items: { orderBy: { createdAt: "asc" } } },
          orderBy: { consumedAt: "asc" },
        },
      },
      orderBy: { entryDate: "asc" },
    }),
    prisma.labReport.findMany({
      where: { userId },
      include: {
        results: {
          include: { revisions: { orderBy: { correctedAt: "asc" } } },
          orderBy: { analyteName: "asc" },
        },
      },
      orderBy: { collectedAt: "asc" },
    }),
    prisma.labReferenceRange.findMany({
      where: { userId },
      orderBy: { analyteKey: "asc" },
    }),
    prisma.supplement.findMany({
      where: { userId },
      include: {
        ingredients: { orderBy: { name: "asc" } },
        intakes: {
          include: { revisions: { orderBy: { correctedAt: "asc" } } },
          orderBy: { takenAt: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.exercise.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.trainingPlan.findMany({
      where: { userId },
      include: {
        exercises: {
          include: { exercise: { select: { id: true, name: true } } },
          orderBy: { position: "asc" },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.trainingSession.findMany({
      where: { userId },
      include: {
        sets: {
          include: { exercise: { select: { id: true, name: true } } },
          orderBy: [{ createdAt: "asc" }, { setNumber: "asc" }],
        },
      },
      orderBy: { startedAt: "asc" },
    }),
    prisma.recipe.findMany({
      where: { userId },
      include: { items: { orderBy: { position: "asc" } } },
      orderBy: { name: "asc" },
    }),
    prisma.mealPlanEntry.findMany({
      where: { userId },
      include: { recipe: { select: { id: true, name: true } } },
      orderBy: [{ plannedDate: "asc" }, { type: "asc" }],
    }),
    prisma.shoppingListItemState.findMany({
      where: { userId },
      orderBy: [{ weekStart: "asc" }, { itemKey: "asc" }],
    }),
    prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        accountId: true,
        providerId: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.passkey.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        deviceType: true,
        backedUp: true,
        transports: true,
        createdAt: true,
        aaguid: true,
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  if (!user) {
    return null;
  }

  return serializeExportValue({
    metadata: {
      format: "LangKompass data export",
      version: 1,
      exportedAt: new Date(),
      securityNote:
        "Sitzungstokens, Passkey-Schlüssel und Zugangstokens sind aus Sicherheitsgründen nicht enthalten.",
    },
    account: user,
    security: { accounts, passkeys },
    settings,
    healthProfile,
    dailyEntries,
    nutrition: { recipes, mealPlanEntries, shoppingListItemStates },
    training: { exercises, plans: trainingPlans, sessions: trainingSessions },
    laboratory: { reports: labReports, referenceRanges: labReferenceRanges },
    supplements,
  }) as JsonObject;
}

function objectValue(value: JsonValue | undefined): JsonObject {
  return value && !Array.isArray(value) && typeof value === "object" ? value : {};
}

function arrayValue(value: JsonValue | undefined): JsonValue[] {
  return Array.isArray(value) ? value : [];
}

function scalarValue(value: JsonValue | undefined): JsonPrimitive {
  if (value === undefined || Array.isArray(value) || (value !== null && typeof value === "object")) {
    return null;
  }

  return value;
}

function csvCell(value: JsonValue | undefined): string {
  let text: string;

  if (Array.isArray(value)) {
    text = value.map((item) => String(scalarValue(item) ?? "")).join(" | ");
  } else {
    text = String(scalarValue(value) ?? "");
  }

  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replaceAll('"', '""')}"`;
}

function csv(rows: JsonObject[], columns: { key: string; label: string }[]): string {
  const header = columns.map((column) => csvCell(column.label)).join(";");
  const body = rows.map((row) =>
    columns.map((column) => csvCell(row[column.key])).join(";"),
  );

  return `\uFEFF${[header, ...body].join("\r\n")}\r\n`;
}

function dailyEntryRows(data: JsonObject): JsonObject[] {
  return arrayValue(data.dailyEntries).map((entryValue) => {
    const entry = objectValue(entryValue);
    const measurements = arrayValue(entry.measurements).map(objectValue);
    const measurement = (type: string) =>
      measurements.find((item) => item.type === type)?.value ?? null;

    return {
      datum: scalarValue(entry.entryDate),
      status: scalarValue(entry.status),
      wohlbefinden: scalarValue(entry.wellbeing),
      stimmung: scalarValue(entry.mood),
      energie: scalarValue(entry.energy),
      schlafStunden: scalarValue(entry.sleepHours),
      schlafqualitaet: scalarValue(entry.sleepQuality),
      hunger: scalarValue(entry.hungerLevel),
      schmerz: scalarValue(entry.painLevel),
      stress: scalarValue(entry.stressLevel),
      wasserLiter: scalarValue(entry.waterLiters),
      schritte: scalarValue(entry.steps),
      distanzKm: scalarValue(entry.distanceKm),
      aktiveMinuten: scalarValue(entry.activeMinutes),
      gewichtKg: scalarValue(measurement("WEIGHT")),
      bauchumfangCm: scalarValue(measurement("WAIST_CIRCUMFERENCE")),
      symptome: scalarValue(entry.symptoms),
      symptomTags: entry.symptomTags ?? [],
      aktivitaeten: entry.activityTags ?? [],
      notizen: scalarValue(entry.notes),
    };
  });
}

function nutritionRows(data: JsonObject): JsonObject[] {
  return arrayValue(data.dailyEntries).flatMap((entryValue) => {
    const entry = objectValue(entryValue);

    return arrayValue(entry.meals).flatMap((mealValue) => {
      const meal = objectValue(mealValue);
      const items = arrayValue(meal.items);
      const itemRows = items.length > 0 ? items : [null];

      return itemRows.map((itemValue) => {
        const item = objectValue(itemValue ?? undefined);
        return {
          datum: scalarValue(entry.entryDate),
          zeitpunkt: scalarValue(meal.consumedAt),
          mahlzeit: scalarValue(meal.type),
          lebensmittel: scalarValue(item.name),
          kategorie: scalarValue(item.category),
          portion: scalarValue(item.portion),
          menge: scalarValue(item.quantity),
          einheit: scalarValue(item.unit),
          energieKcal: scalarValue(item.energyKcal),
          merkmale: item.traits ?? [],
          reaktionen: meal.postMealSymptomTags ?? [],
          reaktionNachMinuten: scalarValue(meal.reactionDelayMinutes),
          notizen: scalarValue(meal.notes),
        };
      });
    });
  });
}

function trainingRows(data: JsonObject): JsonObject[] {
  const training = objectValue(data.training);
  return arrayValue(training.sessions).flatMap((sessionValue) => {
    const session = objectValue(sessionValue);
    const sets = arrayValue(session.sets);
    const setRows = sets.length > 0 ? sets : [null];

    return setRows.map((setValue) => {
      const set = objectValue(setValue ?? undefined);
      const exercise = objectValue(set.exercise);
      return {
        start: scalarValue(session.startedAt),
        ende: scalarValue(session.completedAt),
        trainingsplan: scalarValue(session.planName),
        uebung: scalarValue(exercise.name),
        satz: scalarValue(set.setNumber),
        wiederholungen: scalarValue(set.repetitions),
        gewichtKg: scalarValue(set.weightKg),
        anstrengung: scalarValue(set.effort),
        notizen: scalarValue(session.notes),
      };
    });
  });
}

function labRows(data: JsonObject): JsonObject[] {
  const laboratory = objectValue(data.laboratory);
  return arrayValue(laboratory.reports).flatMap((reportValue) => {
    const report = objectValue(reportValue);
    const results = arrayValue(report.results);
    const resultRows = results.length > 0 ? results : [null];

    return resultRows.map((resultValue) => {
      const result = objectValue(resultValue ?? undefined);
      return {
        entnommenAm: scalarValue(report.collectedAt),
        nuechternstatus: scalarValue(report.fastingStatus),
        labor: scalarValue(report.laboratory),
        parameter: scalarValue(result.analyteName),
        schluessel: scalarValue(result.analyteKey),
        wert: scalarValue(result.value),
        einheit: scalarValue(result.unit),
        referenzVon: scalarValue(result.referenceLow),
        referenzBis: scalarValue(result.referenceHigh),
        wertNotiz: scalarValue(result.note),
        arztkommentar: scalarValue(report.physicianComment),
        untersuchungsnotiz: scalarValue(report.notes),
      };
    });
  });
}

function supplementRows(data: JsonObject): JsonObject[] {
  return arrayValue(data.supplements).flatMap((supplementValue) => {
    const supplement = objectValue(supplementValue);
    const intakes = arrayValue(supplement.intakes);
    const intakeRows = intakes.length > 0 ? intakes : [null];

    return intakeRows.map((intakeValue) => {
      const intake = objectValue(intakeValue ?? undefined);
      return {
        supplement: scalarValue(supplement.name),
        hersteller: scalarValue(supplement.brand),
        form: scalarValue(supplement.form),
        grund: scalarValue(supplement.reason),
        eingenommenAm: scalarValue(intake.takenAt),
        dosis: scalarValue(intake.dose),
        einheit: scalarValue(intake.doseUnit),
        vertraeglichkeit: scalarValue(intake.tolerance),
        wirkung: scalarValue(intake.effect),
        beobachtung: scalarValue(intake.note),
      };
    });
  });
}

const columnsByDataset: Record<DataExportDataset, { key: string; label: string }[]> = {
  "daily-entries": [
    ["datum", "Datum"], ["status", "Status"], ["wohlbefinden", "Wohlbefinden"],
    ["stimmung", "Stimmung"], ["energie", "Energie"], ["schlafStunden", "Schlaf (Stunden)"],
    ["schlafqualitaet", "Schlafqualität"], ["hunger", "Hunger"], ["schmerz", "Schmerz"],
    ["stress", "Stress"], ["wasserLiter", "Wasser (Liter)"], ["schritte", "Schritte"],
    ["distanzKm", "Distanz (km)"], ["aktiveMinuten", "Aktive Minuten"], ["gewichtKg", "Gewicht (kg)"],
    ["bauchumfangCm", "Bauchumfang (cm)"], ["symptome", "Symptome"], ["symptomTags", "Symptom-Tags"],
    ["aktivitaeten", "Aktivitäten"], ["notizen", "Notizen"],
  ].map(([key, label]) => ({ key, label })),
  nutrition: [
    ["datum", "Datum"], ["zeitpunkt", "Zeitpunkt"], ["mahlzeit", "Mahlzeit"],
    ["lebensmittel", "Lebensmittel"], ["kategorie", "Kategorie"], ["portion", "Portion"],
    ["menge", "Menge"], ["einheit", "Einheit"], ["energieKcal", "Energie (kcal)"],
    ["merkmale", "Merkmale"], ["reaktionen", "Reaktionen"], ["reaktionNachMinuten", "Reaktion nach Minuten"],
    ["notizen", "Notizen"],
  ].map(([key, label]) => ({ key, label })),
  training: [
    ["start", "Start"], ["ende", "Ende"], ["trainingsplan", "Trainingsplan"],
    ["uebung", "Übung"], ["satz", "Satz"], ["wiederholungen", "Wiederholungen"],
    ["gewichtKg", "Gewicht (kg)"], ["anstrengung", "Anstrengung"], ["notizen", "Notizen"],
  ].map(([key, label]) => ({ key, label })),
  labs: [
    ["entnommenAm", "Entnommen am"], ["nuechternstatus", "Nüchternstatus"], ["labor", "Labor"],
    ["parameter", "Parameter"], ["schluessel", "Schlüssel"], ["wert", "Wert"],
    ["einheit", "Einheit"], ["referenzVon", "Referenz von"], ["referenzBis", "Referenz bis"],
    ["wertNotiz", "Wertnotiz"], ["arztkommentar", "Arztkommentar"], ["untersuchungsnotiz", "Untersuchungsnotiz"],
  ].map(([key, label]) => ({ key, label })),
  supplements: [
    ["supplement", "Supplement"], ["hersteller", "Hersteller"], ["form", "Form"],
    ["grund", "Grund"], ["eingenommenAm", "Eingenommen am"], ["dosis", "Dosis"],
    ["einheit", "Einheit"], ["vertraeglichkeit", "Verträglichkeit"], ["wirkung", "Wirkung"],
    ["beobachtung", "Beobachtung"],
  ].map(([key, label]) => ({ key, label })),
};

export function createCsvExport(dataset: DataExportDataset, data: JsonObject): string {
  const rowsByDataset: Record<DataExportDataset, (value: JsonObject) => JsonObject[]> = {
    "daily-entries": dailyEntryRows,
    nutrition: nutritionRows,
    training: trainingRows,
    labs: labRows,
    supplements: supplementRows,
  };

  return csv(rowsByDataset[dataset](data), columnsByDataset[dataset]);
}
