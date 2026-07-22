import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";

export default function ErnaehrungPage() {
  return (
    <AppLayout>
      <Page>
        <PageTitle>Ernährung</PageTitle>

        <PageSubtitle className="mt-4 max-w-3xl">
          Dokumentiere Mahlzeiten und erkenne langfristige Zusammenhänge.
        </PageSubtitle>
      </Page>
    </AppLayout>
  );
}
