import { HealthProfileForm } from "@/components/health-profile/health-profile-form";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { Section } from "@/components/layout/section";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

type GesundheitsprofilPageProps = {
  searchParams: Promise<{
    saved?: string;
    error?: string;
  }>;
};

export default async function GesundheitsprofilPage({
  searchParams,
}: GesundheitsprofilPageProps) {
  const query = await searchParams;
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: {
      id: sessionUser.id,
    },
    include: {
      healthProfile: true,
    },
  });

  const profile = user?.healthProfile;

  const values = {
    firstName: profile?.firstName ?? "",
    lastName: profile?.lastName ?? "",
    dateOfBirth: profile?.dateOfBirth
      ? profile.dateOfBirth.toISOString().slice(0, 10)
      : "",
    height: profile?.heightCm?.toString() ?? "",
    weight: profile?.weightKg?.toString() ?? "",
    calorieFormulaSex: profile?.calorieFormulaSex ?? "",
    activityLevel: profile?.activityLevel ?? "",
    weightGoal: profile?.weightGoal ?? "",
    manualDailyCalorieTarget: profile?.manualDailyCalorieTarget?.toString() ?? "",
    primaryGoal: profile?.primaryGoal ?? "",
    activityGoal: profile?.activityGoal ?? "",
  };

  const hasProfile = Boolean(profile);

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Gesundheitsprofil</PageTitle>

          <PageSubtitle className="mt-4">
            Persönliche Basisdaten, Gesundheitsziele und medizinisch relevante
            Rahmenbedingungen an einem Ort.
          </PageSubtitle>
        </header>

        {query.saved === "1" ? (
          <div
            role="status"
            className="mt-8 rounded-[var(--radius-md)] border border-forest-strong bg-forest-soft px-5 py-4 text-sm font-medium text-forest-strong"
          >
            Gesundheitsprofil wurde gespeichert.
          </div>
        ) : null}

        {query.error ? (
          <div
            role="alert"
            className="mt-8 rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-5 py-4 text-sm font-medium text-red-800"
          >
            Bitte prüfe die eingegebenen Körperdaten.
          </div>
        ) : null}

        <Section
          aria-label="Gesundheitsprofil"
          className="grid grid-cols-12 gap-5"
        >
          <Card className="col-span-12 xl:col-span-8">
            <CardHeader>
              <CardTitle>Persönliche Basisdaten</CardTitle>
            </CardHeader>

            <CardContent>
              <HealthProfileForm values={values} />
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-4">
            <CardHeader>
              <CardTitle>Profilstatus</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4">
              <div>
                <p className="text-sm text-text-muted">
                  Status
                </p>

                <p className="mt-1 text-base font-semibold text-text-primary">
                  {hasProfile
                    ? "Profil gespeichert"
                    : "Noch nicht eingerichtet"}
                </p>
              </div>

              <div>
                <p className="text-sm text-text-muted">
                  Datenspeicherung
                </p>

                <p className="mt-1 text-sm leading-6 text-text-primary">
                  Die Angaben werden in der lokalen PostgreSQL-Datenbank deiner
                  LångKompass-Installation gespeichert.
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                <p className="text-sm leading-6 text-text-muted">
                  Der Zugriff ist durch deine Passkey-Anmeldung geschützt.
                  Kontosicherheit und Passkeys findest du in den Einstellungen.
                </p>
              </div>
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
