import type { HealthContext } from "@/lib/compass/health-context";
import type { LaboratoryAssessment } from "@/lib/compass/laboratory-assessment";

export type CompassProviderMode = "LOCAL" | "REMOTE";

export type CompassAnalysisRequest = {
  requestVersion: "compass-request.v1";
  purpose: HealthContext["purpose"];
  requestedAt: string;
  language: "de";
  context: HealthContext;
  responseRules: {
    distinguishFactsAndLimitations: true;
    diagnose: false;
    writeBackAutomatically: false;
  };
};

export type CompassStatement = {
  category: "DAILY_LIFE" | "BODY" | "NUTRITION" | "TRAINING" | "LABORATORY" | "SUPPLEMENTS";
  text: string;
  evidencePaths: string[];
};

export type CompassAnalysisResponse = {
  responseVersion: "compass-response.v2";
  provider: {
    id: string;
    label: string;
    mode: CompassProviderMode;
    externalTransferPerformed: boolean;
  };
  generatedAt: string;
  title: string;
  summary: string;
  statements: CompassStatement[];
  laboratoryAssessment: LaboratoryAssessment;
  limitations: string[];
  safetyNotice: string;
};

export interface CompassProvider {
  readonly id: string;
  readonly label: string;
  readonly mode: CompassProviderMode;
  analyze(request: CompassAnalysisRequest): Promise<CompassAnalysisResponse>;
}

export function createCompassAnalysisRequest(
  context: HealthContext,
  requestedAt = new Date(),
): CompassAnalysisRequest {
  if (
    context.privacy.directIdentifiersIncluded ||
    context.privacy.freeTextIncluded ||
    context.privacy.externalTransmissionPerformed
  ) {
    throw new Error("Der Health Context erfüllt die Datenschutzvorgaben nicht.");
  }

  return {
    requestVersion: "compass-request.v1",
    purpose: context.purpose,
    requestedAt: requestedAt.toISOString(),
    language: "de",
    context,
    responseRules: {
      distinguishFactsAndLimitations: true,
      diagnose: false,
      writeBackAutomatically: false,
    },
  };
}

export async function analyzeWithCompassProvider(
  provider: CompassProvider,
  request: CompassAnalysisRequest,
  options: { allowExternalTransfer: boolean },
): Promise<CompassAnalysisResponse> {
  if (provider.mode === "REMOTE" && !options.allowExternalTransfer) {
    throw new Error("Externe Datenübertragung wurde nicht freigegeben.");
  }

  const response = await provider.analyze(request);
  if (response.provider.id !== provider.id || response.provider.mode !== provider.mode) {
    throw new Error("Die Provider-Antwort entspricht nicht dem Adaptervertrag.");
  }
  if (provider.mode === "LOCAL" && response.provider.externalTransferPerformed) {
    throw new Error("Ein lokaler Provider meldet unerwartet eine externe Übertragung.");
  }
  return response;
}
