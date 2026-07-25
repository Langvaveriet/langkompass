import { HealthContextPreview } from "@/components/compass/health-context-preview";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { loadHealthContext } from "@/lib/compass/load-health-context";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function CompassAIPage() {
  const user = await requireUser();
  const context = await loadHealthContext(user.id);

  return (
    <AppLayout>
      <Page>
        <PageTitle>Compass AI</PageTitle>

        <PageSubtitle className="mt-4 max-w-3xl">
          Verstehe deine Gesundheitsdaten mit ruhiger und nachvollziehbarer Einordnung. Im ersten Schritt siehst du exakt, welcher strukturierte Kontext dafür bereitsteht.
        </PageSubtitle>

        <HealthContextPreview context={context} />
      </Page>
    </AppLayout>
  );
}
