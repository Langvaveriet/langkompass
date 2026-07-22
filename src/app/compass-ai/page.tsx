import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";

export default function CompassAIPage() {
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
