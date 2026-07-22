import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";

export default function TageserfassungPage() {
  return (
    <AppLayout>
      <Page>
        <PageTitle>Tageserfassung</PageTitle>

        <PageSubtitle className="mt-4 max-w-3xl">
          Erfasse Wohlbefinden, Symptome, Schlaf und persönliche Beobachtungen.
        </PageSubtitle>
      </Page>
    </AppLayout>
  );
}
