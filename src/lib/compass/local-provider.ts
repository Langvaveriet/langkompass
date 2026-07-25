import type {
  CompassAnalysisRequest,
  CompassAnalysisResponse,
  CompassProvider,
  CompassStatement,
} from "@/lib/compass/provider";

function number(value: number): string {
  return value.toLocaleString("de-DE");
}

function decimal(value: number): string {
  return value.toLocaleString("de-DE", { maximumFractionDigits: 2 });
}

export const localStructuredProvider: CompassProvider = {
  id: "local-structured-v1",
  label: "Lokale strukturierte Zusammenfassung",
  mode: "LOCAL",
  async analyze(request: CompassAnalysisRequest): Promise<CompassAnalysisResponse> {
    const { context } = request;
    const { coverage, observations } = context;
    const statements: CompassStatement[] = [];

    if (coverage.dailyEntryCount > 0) {
      statements.push({
        category: "DAILY_LIFE",
        text: `${number(coverage.dailyEntryCount)} von 30 Tagen enthalten eine Tageserfassung; ${number(coverage.completedDailyEntryCount)} davon sind abgeschlossen.`,
        evidencePaths: ["coverage.dailyEntryCount", "coverage.completedDailyEntryCount"],
      });
    }
    if (observations.dailyCheckIns.averageSleepHours !== null) {
      statements.push({
        category: "DAILY_LIFE",
        text: `An den dokumentierten Tagen wurden durchschnittlich ${decimal(observations.dailyCheckIns.averageSleepHours)} Stunden Schlaf erfasst.`,
        evidencePaths: ["observations.dailyCheckIns.averageSleepHours"],
      });
    }
    if (observations.body.latestWeightKg !== null) {
      const change = observations.body.weightChangeKg;
      statements.push({
        category: "BODY",
        text: change === null
          ? `Das zuletzt dokumentierte Gewicht beträgt ${decimal(observations.body.latestWeightKg)} kg.`
          : `Das zuletzt dokumentierte Gewicht beträgt ${decimal(observations.body.latestWeightKg)} kg; innerhalb des Zeitraums ergibt sich aus erster und letzter Messung eine Veränderung von ${change > 0 ? "+" : ""}${decimal(change)} kg.`,
        evidencePaths: ["observations.body.latestWeightKg", "observations.body.weightChangeKg"],
      });
    }
    if (coverage.recordedMealItemCount > 0) {
      statements.push({
        category: "NUTRITION",
        text: `${number(coverage.recordedMealItemCount)} strukturierte Lebensmitteleinträge stehen für den betrachteten Zeitraum zur Verfügung.`,
        evidencePaths: ["coverage.recordedMealItemCount"],
      });
    }
    if (coverage.completedTrainingSessionCount > 0) {
      statements.push({
        category: "TRAINING",
        text: `${number(coverage.completedTrainingSessionCount)} Trainings mit insgesamt ${number(observations.training.documentedSetCount)} dokumentierten Sätzen wurden abgeschlossen.`,
        evidencePaths: [
          "coverage.completedTrainingSessionCount",
          "observations.training.documentedSetCount",
        ],
      });
    }
    if (coverage.latestLabAnalyteCount > 0) {
      statements.push({
        category: "LABORATORY",
        text: `Für ${number(coverage.latestLabAnalyteCount)} Laborparameter ist jeweils der neueste dokumentierte Messwert im Kontext enthalten.`,
        evidencePaths: ["coverage.latestLabAnalyteCount", "observations.laboratory.latestResults"],
      });
    }
    if (coverage.activeSupplementCount > 0) {
      statements.push({
        category: "SUPPLEMENTS",
        text: `${number(coverage.activeSupplementCount)} aktive Supplemente und ${number(coverage.supplementIntakeCount)} Einnahmen im betrachteten Zeitraum sind dokumentiert.`,
        evidencePaths: ["coverage.activeSupplementCount", "coverage.supplementIntakeCount"],
      });
    }

    return {
      responseVersion: "compass-response.v1",
      provider: {
        id: localStructuredProvider.id,
        label: localStructuredProvider.label,
        mode: localStructuredProvider.mode,
        externalTransferPerformed: false,
      },
      generatedAt: request.requestedAt,
      title: "Strukturierter Überblick",
      summary: statements.length > 0
        ? "Diese Zusammenfassung beschreibt ausschließlich die vorhandene Datengrundlage und nimmt keine medizinische Bewertung vor."
        : "Für eine strukturierte Zusammenfassung liegen noch keine ausreichenden Daten vor.",
      statements,
      limitations: context.dataGaps,
      safetyNotice: "Keine Diagnose, keine medizinische Entscheidung und keine automatische Änderung deiner Gesundheitsdaten.",
    };
  },
};
