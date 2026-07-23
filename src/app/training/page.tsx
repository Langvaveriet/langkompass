import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { requireUser } from "@/lib/session";

export default async function TrainingPage() {
  await requireUser();

  return (
    <AppLayout>
      <Page>
        <PageTitle>Training</PageTitle>

        <PageSubtitle className="mt-4 max-w-3xl">
          Plane Aktivitäten und dokumentiere Bewegung, Belastung und Regeneration.
        </PageSubtitle>
      </Page>
    </AppLayout>
  );
}
