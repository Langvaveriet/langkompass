# LångKompass – Betrieb und Wiederherstellung

Dieses Dokument beschreibt den reproduzierbaren Betrieb der selbst gehosteten
Anwendung. Zugangsdaten, Schlüssel und echte Datenbankadressen gehören niemals
in dieses Repository.

## Vor jedem produktiven Deployment

1. Der lokale Working Tree ist sauber und `main` mit `origin/main` synchron.
2. Typecheck, Lint, Tests und Production-Build sind erfolgreich.
3. Für neue Migrationen liegt ein aktuelles PostgreSQL-Backup vor.
4. Der Zielcommit ist im Changelog nachvollziehbar.

## Automatische Plesk-Bereitstellung

Das Git-Repository verfolgt `main`. Die zusätzlichen Bereitstellungsaktionen
laufen im Anwendungsverzeichnis und verwenden die in Plesk konfigurierte
Node.js-Version:

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

Die produktive `.env` wird von Plesk beziehungsweise direkt auf dem Server
verwaltet und nicht durch Git ersetzt.

## Backup-Umfang

Ein vollständiges Backup umfasst:

- die PostgreSQL-Datenbank
- die produktive `.env` beziehungsweise eine getrennte, verschlüsselte
  Sicherung ihrer erforderlichen Werte
- später gegebenenfalls die geschützte Dokumentenablage
- die Information, welcher Git-Commit zum Backup gehörte

`node_modules`, `.next` und generierte Caches müssen nicht gesichert werden, da
sie aus Git und Lockfile reproduzierbar sind.

## Wiederherstellungsprobe

Eine Wiederherstellung wird zuerst in einer getrennten Testdatenbank und nicht
über der laufenden Produktion geprüft. Danach werden folgende Befehle im
ausgecheckten Zielcommit ausgeführt:

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm exec prisma generate
corepack pnpm exec prisma migrate deploy
corepack pnpm run db:check
corepack pnpm run build
```

Anschließend werden Anmeldung, Dashboard, Tageserfassung, Ernährung, Training,
Laborwerte und Supplemente stichprobenartig geprüft. Erst eine praktisch
erfolgreiche Wiederherstellung gilt als geprüfte Sicherung.

Ohne aktive Browsersitzung lässt sich der serverseitige Routenschutz gegen die
laufende Instanz automatisiert prüfen:

```bash
cd /var/www/vhosts/langvaveriet.se/kompass.langvaveriet.se
SMOKE_BASE_URL="https://kompass.langvaveriet.se" corepack pnpm run test:smoke
```

Der Test überträgt keine Gesundheitsdaten und bestätigt, dass öffentliche
Anmeldung, Datenbankverbindung, PWA-Shell, technische Korrelations-ID und
sämtliche geschützten Kernbereiche korrekt reagieren.

## Progressive Web App und Offline-Verhalten

Manifest und Service Worker machen LångKompass auf unterstützten Geräten
installierbar. Der Service Worker speichert ausschließlich den öffentlichen
Offline-Hinweis und statische App-Symbole. Private Seiten, API-Antworten und
Gesundheitsdaten werden nicht im Cache abgelegt. Ohne Verbindung sind deshalb
keine Gesundheitsdaten sichtbar oder veränderbar.

## Technischer Betriebsstatus

`GET /api/health` prüft die Erreichbarkeit der Anwendung und führt eine minimale
`SELECT 1`-Abfrage gegen PostgreSQL aus. Eine gesunde Instanz antwortet mit HTTP
200 und `{ "status": "ok" }`, eine nicht erreichbare Datenbank mit HTTP 503.
Der Endpunkt gibt weder Versions-, Benutzer- noch Gesundheitsdaten aus und darf
von Plesk oder einem externen Verfügbarkeitsmonitor abgefragt werden.

## Fehlgeschlagenes Deployment

- Keine Migration oder Tabelle wird manuell zurückeditiert.
- Zuerst werden Plesk-Ausgabe und Passenger-/Node-Protokoll geprüft, ohne
  Gesundheitsdaten in Tickets oder öffentliche Kanäle zu kopieren.
- Bei einem reinen Anwendungsfehler wird der letzte funktionierende Git-Commit
  erneut bereitgestellt.
- Bei einer nicht rückwärtskompatiblen Datenänderung wird die zuvor gesicherte
  Datenbank kontrolliert wiederhergestellt.

## Sichere Protokollierung

Protokolle dürfen technische Zeitpunkte, Route und eine technische Kennung
enthalten. Laborwerte, Beschwerden, Notizen, Mahlzeiten, vollständige Prompts,
Passkeys und Secrets dürfen nicht protokolliert werden.

Jede dynamische Anfrage erhält im Antwort-Header `x-request-id` eine neu
erzeugte technische Korrelations-ID. Sie darf zur Zuordnung eines Fehlers
verwendet werden, enthält aber selbst keine Benutzer- oder Gesundheitsdaten.
