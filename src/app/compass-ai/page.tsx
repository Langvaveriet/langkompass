import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { requireUser } from "@/lib/session";

export default async function CompassAIPage() {
  await requireUser();

  return (
    <AppLayout>
      <Page>
        <PageTitle>Compass AI</PageTitle>

        <PageSubtitle className="mt-4 max-w-3xl">
          Verstehe deine Gesundheitsdaten mit ruhiger und nachvollziehbarer Einordnung.
        </PageSubtitle>
      </Page>
    </AppLayout>
  );
}
