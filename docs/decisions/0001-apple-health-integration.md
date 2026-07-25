# ADR 0001 – Apple-Health-Integration

- Status: angenommen
- Datum: 2026-07-25
- Betrifft: Architektur, Authentifizierung, Gesundheitsdaten, Mobile Client

## Ausgangslage

LångKompass ist als selbst gehostete Next.js-Anwendung mit App Router,
Server Components, Server Actions, Better Auth, Prisma und PostgreSQL
umgesetzt. Apple Health ist im Projektbriefing als langfristige Erweiterung
genannt. Die bisherige Zielarchitektur beschreibt jedoch keine native
iOS-Schicht.

Eine reine Website oder PWA kann HealthKit nicht aufrufen. Apple verlangt eine
signierte App mit HealthKit-Capability und einer ausdrücklichen Freigabe je
Datentyp. Ein bloßes Laden der produktiven Website über `server.url` ist auch
keine belastbare Capacitor-Produktionsarchitektur: Diese Option ist laut
Capacitor ausschließlich für Live-Reload vorgesehen. Die aktuelle Anwendung
kann wegen ihrer Server Components, direkten serverseitigen Datenzugriffe und
Server Actions nicht als statisches Web-Bundle exportiert werden.

## Entscheidung

Next.js bleibt die selbst gehostete Serveranwendung und der Web-Client.
LångKompass erhält für Apple Health einen zusätzlichen, lokal gebündelten
iOS-Client im selben Repository und Produkt. Der iOS-Client wird als hybride
App mit Capacitor und einem kleinen eigenen Swift-Plugin für HealthKit
umgesetzt.

Der iOS-Client kommuniziert ausschließlich über versionierte Route Handler mit
dem bestehenden Next.js-Server. Server Actions bleiben für die vorhandene
Weboberfläche bestehen, sind aber keine Integrationsschnittstelle für den
Mobile-Client.

Diese Entscheidung erzeugt keine zweite fachliche Anwendung und keinen zweiten
Datenbestand. Web und iOS teilen Server, Benutzer, Datenbank, Fachregeln und
Designsystem. Der lokal gebündelte Mobile-Client benötigt jedoch eigene
Client-Seiten für die mobilen Kernabläufe.

## Warum kein einfacher Website-Wrapper?

- Capacitor kennzeichnet externe `server.url`-Inhalte als nicht für Produktion
  vorgesehen.
- Ohne Netz wäre selbst die App-Shell nicht verfügbar.
- Hintergrundsynchronisierung und ein sicherer Offline-Puffer wären nur schwer
  sauber vom geladenen Webinhalt zu trennen.
- Apple verlangt einen Nutzen, der über eine neu verpackte Website hinausgeht.
- Ein lokal gebündelter Client ermöglicht native HealthKit-Steuerung,
  Synchronisationsstatus, Offline-Warteschlange und eine app-typische
  Bedienung.

Ein Remote-WebView darf ausschließlich als zeitlich begrenzter Geräte-Prototyp
verwendet werden und ist kein Release-Ziel.

## Authentifizierung

Die Passkey-Anmeldung bleibt die einzige Benutzeranmeldung. Für Passkeys in
einer `WKWebView` beziehungsweise einer nativen App wird
`kompass.langvaveriet.se` als Associated Domain mit dem Dienst
`webcredentials` eingerichtet. Auf dem Server wird dazu eine
`apple-app-site-association`-Datei bereitgestellt.

Nach erfolgreicher Passkey-Anmeldung darf der Benutzer das Gerät ausdrücklich
für den HealthKit-Abgleich koppeln. Dabei erhält die App ein zufälliges,
widerrufbares und eng auf die HealthKit-Synchronisation begrenztes
Gerätezugriffstoken. Das Token wird:

- nur nach einer verifizierten Passkey-Sitzung ausgestellt,
- im iOS Keychain gespeichert,
- serverseitig ausschließlich gehasht gespeichert,
- an Benutzer, Gerät und erlaubte Synchronisationsendpunkte gebunden,
- mit Ablauf, Rotation und sofortigem Widerruf versehen.

Das Gerätetoken ist kein alternativer Login und gewährt keinen Zugriff auf die
übrige Anwendung. Es ermöglicht nur Hintergrund-Uploads, wenn keine interaktive
Passkey-Abfrage stattfinden kann.

## Datenmodell

Importierte HealthKit-Daten werden zunächst nicht in `DailyEntry`,
`BodyMeasurement` oder `TrainingSession` hineingeschrieben. Sie erhalten einen
eigenen Herkunfts- und Synchronisationsbereich. Dadurch bleiben manuelle
Angaben unverändert und Widersprüche sichtbar.

Vorgesehene fachliche Strukturen:

- `HealthIntegration`: Benutzer, Anbieter, Aktivierung und letzter erfolgreicher
  Abgleich.
- `HealthImportDevice`: gekoppeltes Gerät, gehashtes Zugriffstoken, Ablauf und
  Widerruf.
- `HealthSample`: Benutzer, HealthKit-UUID, Typ, Start, Ende, normierter Wert,
  Einheit, Quelle, Import- und Löschzeitpunkt.
- `HealthSyncBatch`: eindeutige Client-Batch-ID und technischer Status ohne
  Gesundheitswerte im Log.

Für `HealthSample` gilt mindestens eine eindeutige Kombination aus Benutzer,
Anbieter und externer HealthKit-UUID. Wiederholte Uploads sind damit
idempotent. HealthKit-Anker bleiben auf dem jeweiligen Gerät, weil sie opaque
und gerätespezifisch sind.

## Erste Datentypen

Die erste Ausbaustufe ist ausschließlich lesend und umfasst:

1. Schritte
2. Schlaf und Schlafphasen
3. aktive Energie
4. Ruhepuls
5. Herzfrequenzvariabilität (SDNN)
6. Körpergewicht
7. Trainingseinheiten als Zusammenfassung

Apple-Workouts werden nicht in manuelle Krafttrainingssätze umgewandelt.
Ernährungsdaten, Laborwerte, klinische Daten und Schreibzugriff auf HealthKit
sind nicht Teil der ersten Ausbaustufe.

## Synchronisationsmodell

- Ein initialer, begrenzter Importzeitraum verhindert unkontrollierte
  Vollimporte.
- `HKAnchoredObjectQuery` liefert anschließend nur neue, geänderte und gelöschte
  Objekte.
- `HKObserverQuery` stößt Hintergrundabgleiche an.
- Beim Öffnen der App wird immer ein nachholender Vordergrundabgleich versucht.
- Ein touchfreundlicher Button „Jetzt synchronisieren“ bleibt verfügbar.
- Nicht übertragene Batches liegen in einer geschützten lokalen Warteschlange.
- Der Server bestätigt einen Batch erst nach vollständiger Validierung und
  Transaktion.
- Die App speichert den neuen HealthKit-Anker erst nach Serverbestätigung.
- Letzter Erfolg, ausstehende Daten und Fehler sind für den Benutzer sichtbar.

Hintergrundzustellung ist nachholend, nicht echtzeitgarantiert. Die Anwendung
darf deshalb niemals behaupten, Apple Health sei aktuell, ohne den letzten
erfolgreichen Abgleich anzuzeigen.

## Datenschutz und Berechtigungen

- Jeder Datentyp wird einzeln und erst bei fachlichem Bedarf angefragt.
- LångKompass behandelt „keine Daten“ und „Lesefreigabe nicht erteilt“ gleich,
  weil HealthKit diese Zustände absichtlich nicht offenlegt.
- Keine HealthKit-Payload erscheint in Logs, Telemetrie oder Fehlermeldungen.
- Originalquelle und Herkunft bleiben nachvollziehbar.
- Importierte Daten können je Integration vollständig gelöscht werden.
- Eine getrennte Einwilligung ist erforderlich, bevor Daten den iPhone-Speicher
  verlassen und auf den selbst gehosteten Server übertragen werden.

## Umsetzung in überprüfbaren Stufen

### Stufe 0 – Geräte-Spike

- leeres signiertes iOS-Testziel
- HealthKit-Capability und Zwecktexte
- Berechtigungsdialog auf einem echten iPhone
- Lesen weniger Testtypen ohne Serverübertragung
- Passkey-Test mit Associated Domain

Der Spike enthält keine produktiven Gesundheitsdatenmigrationen und entscheidet
über die endgültige iOS-Mindestversion.

### Stufe 1 – Serverseitige Integrationsgrenze

- Datenmodell und Migrationen
- Gerätekopplung nach Passkey-Bestätigung
- versionierte, authentifizierte und rate-limitierte Route Handler
- idempotenter Batch-Import und Löschereignisse
- Integrations- und Berechtigungstests

### Stufe 2 – Lokal gebündelter iOS-Client

- Capacitor-App-Shell und mobile Kernnavigation
- eigenes Swift-HealthKit-Plugin
- Keychain und geschützte Offline-Warteschlange
- Vordergrund-, Hintergrund- und manueller Abgleich
- sichtbarer Synchronisationsstatus

### Stufe 3 – Darstellung und Compass

- getrennte Darstellung manueller und importierter Werte
- nachvollziehbare tägliche Aggregate
- ausdrückliche Regeln zur bevorzugten Quelle
- Aufnahme in lokale Compass-Berichte mit Herkunftsnachweis

### Stufe 4 – Release-Härtung

- Tests auf echtem iPhone mit Änderungen und Löschungen
- Offline-, Wiederholungs- und Tokenwiderrufstests
- Datenschutzangaben und App-Store-Prüfung
- verschlüsseltes Backup und vollständige Löschung

## Risiken

- Der Mobile-Client ist ein zusätzlicher Client-Build und benötigt Xcode,
  Signierung und Apple-Developer-Betrieb.
- Vorhandene React-Server-Komponenten und Server Actions sind nicht direkt im
  lokalen Mobile-Bundle wiederverwendbar.
- App-Store-Freigabe kann nicht garantiert werden; native HealthKit-Funktionen
  und eine lokal gebündelte, app-typische Oberfläche reduzieren das Risiko.
- HealthKit-Hintergrundzustellung ist nicht zeitgenau garantiert.
- Ein Benutzer kann Berechtigungen jederzeit ändern oder zeitlich begrenzen.

## Folgen für die bestehende Anwendung

- Der aktuelle Web-MVP bleibt vollständig lauffähig.
- Bestehende Server Actions müssen nicht sofort migriert werden.
- Neue fachliche Kernlogik soll unabhängig von React und Server Actions
  implementiert werden, damit Web und Mobile sie verwenden können.
- Neue externe Schnittstellen werden ausschließlich als versionierte Route
  Handler ergänzt.
- Apple Health wird vor allgemeinen Offline- und weiteren externen
  Integrationen umgesetzt, sobald der Geräte-Spike erfolgreich ist.

## Verbindliche Quellen

- [Apple: HealthKit einrichten](https://developer.apple.com/documentation/HealthKit/setting-up-healthkit)
- [Apple: Zugriff auf Gesundheitsdaten autorisieren](https://developer.apple.com/documentation/HealthKit/authorizing-access-to-health-data)
- [Apple: Passkeys unterstützen](https://developer.apple.com/documentation/authenticationservices/supporting-passkeys)
- [Apple: HealthKit-Abfragen mit Swift Concurrency](https://developer.apple.com/documentation/healthkit/running-queries-with-swift-concurrency)
- [Apple: App Review Guidelines, insbesondere 4.2](https://developer.apple.com/app-store/review/guidelines/)
- [Capacitor: Konfiguration](https://capacitorjs.com/docs/config)
