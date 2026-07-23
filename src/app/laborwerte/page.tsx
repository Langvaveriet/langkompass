import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { requireUser } from "@/lib/session";

export default async function LaborwertePage() {
  await requireUser();

  return (
    <AppLayout>
      <Page>
        <PageTitle>Laborwerte</PageTitle>

        <PageSubtitle className="mt-4 max-w-3xl">
          Erfasse Laborergebnisse strukturiert und vergleiche ihre Entwicklung.
        </PageSubtitle>
      </Page>
    </AppLayout>
  );
}
