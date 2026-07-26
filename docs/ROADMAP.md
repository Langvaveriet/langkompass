# LångKompass – Roadmap

Die verbindliche Reihenfolge richtet sich nach Projektbriefing und
Architektur-Charta. Neue Funktionen werden in kleinen, stabilen Schritten
umgesetzt.

## Aktueller Schwerpunkt

- Web-App funktional vervollständigen und bestehende Kernabläufe prüfen
- Tageserfassung um die noch fehlenden strukturierten Alltagswerte ergänzen
- mobile Bedienung, Datenkonsistenz und verständliche Übersichten absichern

Die Tageserfassung enthält nun zusätzlich Bauchumfang, Stimmung, Hunger,
Trinkmenge, Schritte, Distanz und aktive Minuten. Diese Werte fließen auch in
Dashboard und lokale Compass-Berichte ein.

Die Finalisierung ergänzt zentrale Lade-, Fehler- und
Nicht-gefunden-Zustände sowie einen reproduzierbaren Benutzer-Bootstrap und ein
Betriebs-Runbook. Ein automatisierter Smoke-Test prüft inzwischen sämtliche
geschützten Kernrouten, den Anwendungsstatus und die Datenbankverbindung; die
wichtigsten Eingabeverträge sind durch Grenzfälle abgesichert. Der vollständige
Datenexport steht als versioniertes JSON-Archiv und zusätzlich als fünf
auswertbare CSV-Dateien bereit. Auch die vollständige, erneut per Passkey
bestätigte Kontolöschung ist umgesetzt. Der mobile Einstieg wurde bei 390 Pixel
Breite ohne horizontales Überlaufen geprüft und die zentralen Navigationsziele
sind mindestens 44 Pixel hoch.

Lokale Berichte decken nun 7, 30 und 365 Tage ab. Ein gesonderter, druckbarer
Arztbericht fasst die vorhandenen strukturierten Daten ohne externe Übertragung
und ohne diagnostische Aussagen zusammen.

Laborparameter unterstützen zusätzlich dauerhaft gespeicherte persönliche
Zielbereiche. Sie bleiben getrennt von den aus dem Laborbericht übernommenen
Referenzbereichen und werden in Verlauf, Arztbericht und Datenexport
nachvollziehbar ausgewiesen.

Rezeptdetails ergänzen mögliche Mikronährstoffquellen aus den vorhandenen
Zutaten und passende Rezeptalternativen. Mangels verifizierter vollständiger
Nährstoffdatenbank werden bewusst keine scheinpräzisen Mikronährstoffmengen
erfunden.

Damit befindet sich die Web-App funktional auf einem vorläufig finalen Stand.
Vor größeren neuen Modulen folgen nur noch Fehlerkorrekturen, echte
Geräte-Abnahmen und betriebliche Wartung. Eine angemeldete Safari-Abnahme auf
dem Zielgerät sowie eine isolierte Wiederherstellungsprobe des produktiven
Backups bleiben bewusste manuelle Betriebsprüfungen.

## Später: Apple Health

Die technische Entscheidung und die überprüfbaren Ausbaustufen sind in
[`decisions/0001-apple-health-integration.md`](decisions/0001-apple-health-integration.md)
dokumentiert. Next.js bleibt Web-Client und Server; die produktive iOS-App
erhält einen lokal gebündelten Mobile-Client und eine kleine native
HealthKit-Brücke. Die Umsetzung erfolgt bewusst erst nach der Finalisierung der
Web-App und gehört zu den letzten geplanten größeren Erweiterungen.

## Zuletzt abgeschlossen: Einkaufsliste aus dem Wochenplan

Aus den geplanten Rezepten einer Woche entsteht eine zusammengefasste
Einkaufsliste. Gleiche Zutaten werden bei kompatiblen Einheiten gebündelt und
Positionen bleiben pro Woche dauerhaft abhakbar. Offene Positionen lassen sich
mobil teilen oder für Pon kopieren. Eine direkte Pon-Synchronisierung bleibt
von einer zukünftig veröffentlichten, autorisierten Pon-Schnittstelle abhängig.

## Optionale Features

### Generative KI-Anbindung

Eine kostenpflichtige Remote-KI wird nicht vorausgesetzt. Der vorhandene
Providervertrag bleibt als technische Erweiterungsgrenze erhalten; eine
Aktivierung erfolgt nur nach bewusster Entscheidung. Ein lokales Modell kann
später über eine gesicherte private Verbindung ergänzt werden.

### Einnahmepläne und Erinnerungen

Supplemente können später um frei aktivierbare Einnahmepläne und ruhige
Erinnerungen ergänzt werden. Die bestehende manuelle Dokumentation bleibt davon
unabhängig vollständig nutzbar.

### Geschützte Dokumentenablage

Laborberichte, Arztbriefe, Befunde, Bilder und PDFs können später außerhalb
öffentlich erreichbarer Verzeichnisse gespeichert und ausschließlich über
autorisierte Server-Endpunkte abgerufen werden. OCR oder KI-Verarbeitung erfolgt
nur nach bewusster Benutzeraktion.

## Zukünftige Features

Weitere spätere Module gemäß Architektur-Charta sind eine allgemeine
Offline-Erfassung und weitere externe Integrationen. Lokale Wochen- und
Monatsberichte sowie Datenexporte sind bereits umgesetzt.
