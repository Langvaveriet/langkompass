# LångKompass

LångKompass ist eine private, selbst gehostete Gesundheits- und
Lebensstilplattform. Sie verbindet Tageserfassung, Ernährung, Training,
Laborwerte und Supplemente in einer ruhigen, mobilen Oberfläche. Die Anwendung
ist weder Diagnosesystem noch klassischer Kalorienzähler.

## Aktueller Funktionsumfang

- passwortlose Anmeldung mit Passkeys und ohne öffentliche Registrierung
- Dashboard mit Tagesstatus und echten Verlaufsdaten
- Morgen- und Abend-Check mit strukturierten Gesundheitswerten
- Ernährungserfassung, Rezeptbibliothek und Wochenplan
- Trainingspläne, Übungsbibliothek, Trainingseinheiten und Fortschritt
- Laboruntersuchungen, Referenzwerte, Korrekturverlauf und Trends
- Supplementverwaltung, Einnahmen, Wirkung und Verträglichkeit
- lokale Compass-Auswertungen ohne externe Übertragung von Gesundheitsdaten

Die aktuelle Priorisierung steht in [docs/ROADMAP.md](docs/ROADMAP.md). Die
verbindlichen technischen Leitplanken stehen in der Architektur-Charta unter
[docs/LangKompass_Architektur-Charta.docx](docs/LangKompass_Architektur-Charta.docx).

## Technischer Kern

- Next.js 16 mit App Router und React 19
- TypeScript im Strict Mode und Tailwind CSS 4
- PostgreSQL mit Prisma 7
- Better Auth mit WebAuthn/FIDO2-Passkeys
- Server Actions für formularnahe Schreibvorgänge
- selbst gehosteter Betrieb unter Plesk und Node.js

## Lokale Installation

Benötigt werden Node.js 20 oder neuer, Corepack und eine erreichbare
PostgreSQL-Datenbank.

```bash
cd /Users/ken/Projekte/langkompass
cp .env.example .env
corepack enable
pnpm install --frozen-lockfile
pnpm exec prisma generate
pnpm exec prisma migrate deploy
pnpm run user:bootstrap
pnpm run catalog:sync
pnpm dev
```

Vor `pnpm run user:bootstrap` müssen mindestens `DATABASE_URL` und
`LANGKOMPASS_USER_EMAIL` in `.env` gesetzt sein. Für die erste
Passkey-Einrichtung werden außerdem `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` und
ein temporärer `PASSKEY_SETUP_TOKEN` benötigt. Die Einrichtung erfolgt unter
`/anmeldung/einrichten`. Danach wird der Einrichtungsschlüssel aus der
Produktionsumgebung entfernt.

Die Anwendung ist anschließend unter
[http://localhost:3000](http://localhost:3000) erreichbar.

## Qualitätsprüfungen

```bash
cd /Users/ken/Projekte/langkompass
pnpm run typecheck
pnpm run lint
pnpm test
pnpm run build
```

`pnpm run build` synchronisiert vor dem Build den mitgelieferten Rezeptkatalog.

## Datenbankänderungen

Das Prisma-Schema liegt in `prisma/schema.prisma`. Änderungen werden lokal als
versionierte Migration erzeugt und niemals direkt auf dem Produktivsystem
improvisiert.

```bash
cd /Users/ken/Projekte/langkompass
pnpm exec prisma migrate dev --name BESCHREIBENDER_NAME
pnpm exec prisma generate
```

In Produktion werden ausschließlich bereits eingecheckte Migrationen mit
`prisma migrate deploy` angewendet.

## Deployment unter Plesk

Plesk verfolgt den Branch `main`. Nach einem Push werden die Dateien
bereitgestellt und im tatsächlichen Anwendungsverzeichnis folgende Schritte
ausgeführt:

```bash
export PATH=/opt/plesk/node/20/bin:$PATH
cd /var/www/vhosts/langvaveriet.se/kompass.langvaveriet.se
corepack pnpm install --frozen-lockfile
corepack pnpm exec prisma generate
corepack pnpm exec prisma migrate deploy
corepack pnpm run build
mkdir -p tmp
touch tmp/restart.txt
```

Vor produktiven Migrationen muss ein aktuelles PostgreSQL-Backup vorhanden
sein. Der vollständige Betriebsablauf ist in
[docs/OPERATIONS.md](docs/OPERATIONS.md) dokumentiert.

## Datenschutz

- keine öffentlichen Registrierungen
- keine Analytics- oder Werbeskripte
- keine externe KI-Übertragung im aktuellen Betrieb
- Geheimnisse ausschließlich in nicht eingecheckten Umgebungsvariablen
- persönliche Dokumente ausschließlich unter dem ignorierten Verzeichnis
  `private-docs/`

Weitere Projektdokumente sind in [docs/README.md](docs/README.md) beschrieben.
