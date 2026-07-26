import Link from "next/link";

import { HealthContextPreview } from "@/components/compass/health-context-preview";
import { ProviderSummary } from "@/components/compass/provider-summary";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { loadHealthContext } from "@/lib/compass/load-health-context";
import { localStructuredProvider } from "@/lib/compass/local-provider";
import {
  analyzeWithCompassProvider,
  createCompassAnalysisRequest,
} from "@/lib/compass/provider";
import {
  compassReportPeriodLabels,
  compassReportPeriods,
  parseCompassReportPeriod,
} from "@/lib/compass/report-periods";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

type CompassAIPageProps = {
  searchParams: Promise<{ period?: string }>;
};

export default async function CompassAIPage({ searchParams }: CompassAIPageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const period = parseCompassReportPeriod(query.period);
  const context = await loadHealthContext(user.id, new Date(), period);
  const response = await analyzeWithCompassProvider(
    localStructuredProvider,
    createCompassAnalysisRequest(context),
    { allowExternalTransfer: false },
  );

  return (
    <AppLayout>
      <Page>
        <PageTitle>Compass AI</PageTitle>

        <PageSubtitle className="mt-4 max-w-3xl">
          Verstehe deine Gesundheitsdaten mit ruhiger und nachvollziehbarer Einordnung. Im ersten Schritt siehst du exakt, welcher strukturierte Kontext dafür bereitsteht.
        </PageSubtitle>

        <nav className="mt-8 flex gap-2 overflow-x-auto pb-2" aria-label="Berichtszeitraum auswählen">
          {compassReportPeriods.map((days) => {
            const selected = days === period;
            return (
              <Link
                key={days}
                href={`/compass-ai?period=${days}`}
                aria-current={selected ? "page" : undefined}
                className={`flex min-h-12 shrink-0 items-center rounded-full border px-5 text-sm font-semibold ${selected ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-strong bg-surface-raised text-text-secondary"}`}
              >
                {compassReportPeriodLabels[days]}
              </Link>
            );
          })}
          <Link
            href="/berichte/arzt"
            className="flex min-h-12 shrink-0 items-center rounded-full border border-border-strong bg-surface-raised px-5 text-sm font-semibold text-text-secondary"
          >
            Arztbericht
          </Link>
        </nav>

        <ProviderSummary response={response} />
        <HealthContextPreview context={context} />
      </Page>
    </AppLayout>
  );
}
